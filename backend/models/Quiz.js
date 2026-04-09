const { getQuery, getSingle, runQuery } = require('../config/database');
const User = require('./User');
const Course = require('./Course');

class Quiz {
  static async create(quizData) {
    const { title, courseId, questions, timeLimit } = quizData;
    
    const result = await runQuery(`
      INSERT INTO quizzes (title, courseId, timeLimit)
      VALUES (?, ?, ?)
    `, [title, courseId, timeLimit]);
    
    // Insert questions
    for (const question of questions) {
      await runQuery(`
        INSERT INTO quiz_questions (quizId, question, options, correctAnswer, points)
        VALUES (?, ?, ?, ?, ?)
      `, [result.id, question.question, JSON.stringify(question.options), question.correctAnswer, question.points]);
    }
    
    return this.findById(result.id);
  }

  static async findById(id) {
    const row = await getSingle('SELECT * FROM quizzes WHERE id = ? AND isActive = 1', [id]);
    return row ? this.formatQuiz(row) : null;
  }

  static async findAll(lecturerId = null, studentId = null) {
    let query = 'SELECT q.*, c.code as courseCode, c.name as courseName FROM quizzes q INNER JOIN courses c ON q.courseId = c.id WHERE q.isActive = 1';
    let params = [];
    
    if (lecturerId) {
      query += ' AND c.lecturer = ?';
      params.push(lecturerId);
    }
    
    if (studentId) {
      query += ' AND c.id IN (SELECT courseId FROM course_enrollments WHERE studentId = ?)';
      params.push(studentId);
    }
    
    query += ' ORDER BY q.createdAt DESC';
    
    const rows = await getQuery(query, params);
    return rows.map(row => this.formatQuiz(row));
  }

  static async update(id, updateData) {
    const { title, timeLimit } = updateData;
    await runQuery(`
      UPDATE quizzes 
      SET title = ?, timeLimit = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [title, timeLimit, id]);
    
    return this.findById(id);
  }

  static async delete(id) {
    await runQuery('UPDATE quizzes SET isActive = 0 WHERE id = ?', [id]);
  }

  static async attempt(quizId, studentId, answers) {
    // Calculate score
    const questions = await this.getQuestions(quizId);
    let score = 0;
    
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score += question.points;
      }
    });

    const result = await runQuery(`
      INSERT INTO quiz_attempts (quizId, studentId, answers, score)
      VALUES (?, ?, ?, ?)
    `, [quizId, studentId, JSON.stringify(answers), score]);
    
    const totalPoints = questions.reduce((total, q) => total + q.points, 0);
    
    return {
      success: true,
      score,
      totalPoints,
      percentage: Math.round((score / totalPoints) * 100)
    };
  }

  static async getQuestions(quizId) {
    const rows = await getQuery(`
      SELECT * FROM quiz_questions WHERE quizId = ?
      ORDER BY id
    `, [quizId]);
    
    return rows.map(row => ({
      id: row.id,
      question: row.question,
      options: JSON.parse(row.options),
      correctAnswer: row.correctAnswer,
      points: row.points
    }));
  }

  static async getAttempts(quizId) {
    const rows = await getQuery(`
      SELECT qa.*, u.username, u.profile_firstName, u.profile_lastName
      FROM quiz_attempts qa
      INNER JOIN users u ON qa.studentId = u.id
      WHERE qa.quizId = ?
      ORDER BY qa.attemptedAt DESC
    `, [quizId]);
    
    return rows.map(row => ({
      id: row.id,
      student: {
        id: row.studentId,
        username: row.username,
        profile: {
          firstName: row.profile_firstName,
          lastName: row.profile_lastName
        }
      },
      answers: JSON.parse(row.answers),
      score: row.score,
      attemptedAt: row.attemptedAt
    }));
  }

  static async getWithDetails(id, studentId = null) {
    const quizRow = await getSingle(`
      SELECT q.*, 
             c.code as courseCode,
             c.name as courseName,
             u.username as lecturer_username,
             u.profile_firstName as lecturer_firstName,
             u.profile_lastName as lecturer_lastName
      FROM quizzes q
      INNER JOIN courses c ON q.courseId = c.id
      INNER JOIN users u ON c.lecturer = u.id
      WHERE q.id = ? AND q.isActive = 1
    `, [id]);
    
    if (!quizRow) return null;
    
    const quiz = this.formatQuiz(quizRow);
    quiz.lecturer = {
      id: quizRow.lecturer,
      username: quizRow.lecturer_username,
      profile: {
        firstName: quizRow.lecturer_firstName,
        lastName: quizRow.lecturer_lastName
      }
    };
    
    quiz.course = {
      id: quizRow.courseId,
      code: quizRow.courseCode,
      name: quizRow.courseName
    };
    
    // Get questions
    quiz.questions = await this.getQuestions(id);
    
    // Get attempts
    quiz.attempts = await this.getAttempts(id);
    
    // Check if student has attempted
    if (studentId) {
      const attempts = await this.getAttempts(id);
      const studentAttempt = attempts.find(attempt => attempt.studentId === studentId);
      quiz.hasAttempted = !!studentAttempt;
      quiz.studentScore = studentAttempt?.score;
    }
    
    return quiz;
  }

  static formatQuiz(row) {
    if (!row) return null;
    
    return {
      id: row.id,
      title: row.title,
      courseId: row.courseId,
      timeLimit: row.timeLimit,
      isActive: Boolean(row.isActive),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }
}

module.exports = Quiz;
