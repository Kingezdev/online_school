const { getQuery, getSingle, runQuery } = require('../config/database');

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Private
const getQuizzes = async (req, res) => {
  try {
    let quizzes;
    
    if (req.user.role === 'student') {
      // Students get quizzes from their enrolled courses
      const query = `
        SELECT q.id, q.title, q.timeLimit, q.isActive, q.createdAt, q.courseId,
               c.code as courseCode, c.name as courseName
        FROM quizzes q
        INNER JOIN courses c ON q.courseId = c.id
        INNER JOIN course_enrollments ce ON c.id = ce.courseId
        WHERE ce.studentId = ? AND q.isActive = 1 AND c.isActive = 1
        ORDER BY q.createdAt DESC
      `;
      quizzes = await getQuery(query, [req.user.id]);
    } else if (req.user.role === 'lecturer') {
      // Lecturers get quizzes from their courses
      const query = `
        SELECT q.id, q.title, q.timeLimit, q.isActive, q.createdAt, q.courseId,
               c.code as courseCode, c.name as courseName
        FROM quizzes q
        INNER JOIN courses c ON q.courseId = c.id
        WHERE c.lecturer = ? AND q.isActive = 1 AND c.isActive = 1
        ORDER BY q.createdAt DESC
      `;
      quizzes = await getQuery(query, [req.user.id]);
    } else {
      // Admins get all quizzes
      const query = `
        SELECT q.id, q.title, q.timeLimit, q.isActive, q.createdAt, q.courseId,
               c.code as courseCode, c.name as courseName
        FROM quizzes q
        INNER JOIN courses c ON q.courseId = c.id
        WHERE q.isActive = 1 AND c.isActive = 1
        ORDER BY q.createdAt DESC
      `;
      quizzes = await getQuery(query);
    }

    res.json({
      success: true,
      count: quizzes.length,
      quizzes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Private
const getQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    
    // Get quiz with course info
    const query = `
      SELECT q.id, q.title, q.timeLimit, q.isActive, q.createdAt, q.courseId,
             c.code as courseCode, c.name as courseName, c.lecturer
      FROM quizzes q
      INNER JOIN courses c ON q.courseId = c.id
      WHERE q.id = ? AND q.isActive = 1
    `;
    
    const quiz = await getSingle(query, [quizId]);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check permissions
    if (req.user.role === 'student') {
      // Check if student is enrolled in course
      const enrollmentQuery = `
        SELECT COUNT(*) as count
        FROM course_enrollments ce
        WHERE ce.courseId = ? AND ce.studentId = ?
      `;
      const enrollment = await getSingle(enrollmentQuery, [quiz.courseId, req.user.id]);
      
      if (!enrollment || enrollment.count === 0) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      // Check if student has already attempted
      const attemptQuery = `
        SELECT score, attemptedAt
        FROM quiz_attempts qa
        WHERE qa.quizId = ? AND qa.studentId = ?
      `;
      const studentAttempt = await getSingle(attemptQuery, [quizId, req.user.id]);
      
      if (studentAttempt) {
        quiz.hasAttempted = true;
        quiz.studentScore = studentAttempt.score;
        quiz.attemptedAt = studentAttempt.attemptedAt;
      }
      
      return res.json({
        success: true,
        quiz
      });
    } else if (req.user.role === 'lecturer') {
      // Check if lecturer owns quiz
      if (quiz.lecturer !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json({
      success: true,
      quiz
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create quiz
// @route   POST /api/quizzes
// @access  Private/Lecturer
const createQuiz = async (req, res) => {
  try {
    const { title, course, questions, timeLimit } = req.body;

    // Verify course exists and lecturer owns it
    const courseQuery = 'SELECT id, lecturer FROM courses WHERE id = ? AND isActive = 1';
    const courseDoc = await getSingle(courseQuery, [course]);
    if (!courseDoc) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (courseDoc.lecturer !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Validate questions
    if (!questions || questions.length === 0) {
      return res.status(400).json({ message: 'At least one question is required' });
    }

    for (const question of questions) {
      if (!question.question || !question.options || question.options.length < 2) {
        return res.status(400).json({ message: 'Each question must have at least 2 options' });
      }
      
      if (question.correctAnswer === undefined || question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
        return res.status(400).json({ message: 'Invalid correct answer index' });
      }
    }

    const insertQuery = `
      INSERT INTO quizzes (title, courseId, questions, timeLimit, isActive, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, 1, datetime('now'), datetime('now'))
    `;
    
    const result = await runQuery(insertQuery, [title, course, JSON.stringify(questions), timeLimit]);
    
    // Get the created quiz with course info
    const selectQuery = `
      SELECT q.id, q.title, q.timeLimit, q.isActive, q.createdAt, q.courseId,
             c.code as courseCode, c.name as courseName
      FROM quizzes q
      INNER JOIN courses c ON q.courseId = c.id
      WHERE q.id = ?
    `;
    
    const populatedQuiz = await getSingle(selectQuery, [result.lastID]);

    res.status(201).json({
      success: true,
      quiz: populatedQuiz
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private/Lecturer
const updateQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    const { title, questions, timeLimit } = req.body;

    // Get quiz to check if it exists
    const quizQuery = 'SELECT id, courseId FROM quizzes WHERE id = ? AND isActive = 1';
    const quiz = await getSingle(quizQuery, [quizId]);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if lecturer owns quiz
    const courseQuery = 'SELECT id, lecturer FROM courses WHERE id = ?';
    const course = await getSingle(courseQuery, [quiz.courseId]);
    if (!course || course.lecturer !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Don't allow updates if students have already attempted
    const attemptQuery = 'SELECT COUNT(*) as count FROM quiz_attempts WHERE quizId = ?';
    const attempts = await getSingle(attemptQuery, [quizId]);
    if (attempts && attempts.count > 0) {
      return res.status(400).json({ message: 'Cannot update quiz after students have attempted it' });
    }

    // Update quiz
    const updateQuery = `
      UPDATE quizzes 
      SET title = COALESCE(?, title), 
          questions = COALESCE(?, questions), 
          timeLimit = COALESCE(?, timeLimit),
          updatedAt = datetime('now')
      WHERE id = ?
    `;
    
    await runQuery(updateQuery, [title, questions ? JSON.stringify(questions) : null, timeLimit, quizId]);
    
    // Get updated quiz with course info
    const selectQuery = `
      SELECT q.id, q.title, q.timeLimit, q.isActive, q.createdAt, q.courseId,
             c.code as courseCode, c.name as courseName
      FROM quizzes q
      INNER JOIN courses c ON q.courseId = c.id
      WHERE q.id = ?
    `;
    
    const updatedQuiz = await getSingle(selectQuery, [quizId]);

    res.json({
      success: true,
      quiz: updatedQuiz
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private/Lecturer
const deleteQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;

    // Get quiz to check if it exists
    const quizQuery = 'SELECT id, courseId FROM quizzes WHERE id = ? AND isActive = 1';
    const quiz = await getSingle(quizQuery, [quizId]);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if lecturer owns quiz
    const courseQuery = 'SELECT id, lecturer FROM courses WHERE id = ?';
    const course = await getSingle(courseQuery, [quiz.courseId]);
    if (!course || course.lecturer !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Soft delete by setting isActive to false
    const deleteQuery = 'UPDATE quizzes SET isActive = 0, updatedAt = datetime("now") WHERE id = ?';
    await runQuery(deleteQuery, [quizId]);

    res.json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Attempt quiz
// @route   POST /api/quizzes/:id/attempt
// @access  Private/Student
const attemptQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    const quizId = req.params.id;

    // Get quiz with questions
    const quizQuery = 'SELECT id, courseId, questions FROM quizzes WHERE id = ? AND isActive = 1';
    const quiz = await getSingle(quizQuery, [quizId]);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if student is enrolled in course
    const enrollmentQuery = `
      SELECT COUNT(*) as count
      FROM course_enrollments ce
      WHERE ce.courseId = ? AND ce.studentId = ?
    `;
    const enrollment = await getSingle(enrollmentQuery, [quiz.courseId, req.user.id]);
    
    if (!enrollment || enrollment.count === 0) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if already attempted
    const existingAttemptQuery = 'SELECT COUNT(*) as count FROM quiz_attempts WHERE quizId = ? AND studentId = ?';
    const existingAttempt = await getSingle(existingAttemptQuery, [quizId, req.user.id]);

    if (existingAttempt && existingAttempt.count > 0) {
      return res.status(400).json({ message: 'Quiz already attempted' });
    }

    // Parse questions and validate answers
    const questions = JSON.parse(quiz.questions);
    if (!answers || answers.length !== questions.length) {
      return res.status(400).json({ message: 'Invalid answers format' });
    }

    // Calculate score
    let score = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score += (question.points || 1);
      }
    });

    // Add attempt
    const insertAttemptQuery = `
      INSERT INTO quiz_attempts (quizId, studentId, answers, score, attemptedAt)
      VALUES (?, ?, ?, ?, datetime('now'))
    `;
    
    await runQuery(insertAttemptQuery, [quizId, req.user.id, JSON.stringify(answers), score]);

    const totalPoints = questions.reduce((total, q) => total + (q.points || 1), 0);
    
    res.status(201).json({
      success: true,
      message: 'Quiz submitted successfully',
      result: {
        score,
        totalPoints,
        percentage: Math.round((score / totalPoints) * 100)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  attemptQuiz
};
