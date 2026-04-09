const { getQuery, getSingle, runQuery } = require('../config/database');
const User = require('./User');
const Course = require('./Course');

class Assignment {
  static async create(assignmentData) {
    const { title, description, courseId, lecturer, dueDate, maxScore } = assignmentData;
    
    const result = await runQuery(`
      INSERT INTO assignments (title, description, courseId, lecturer, dueDate, maxScore)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [title, description, courseId, lecturer, dueDate, maxScore]);
    
    return this.findById(result.id);
  }

  static async findById(id) {
    const row = await getSingle('SELECT * FROM assignments WHERE id = ? AND isActive = 1', [id]);
    return row ? this.formatAssignment(row) : null;
  }

  static async findAll(lecturerId = null, studentId = null) {
    let query = 'SELECT a.*, c.code as courseCode, c.name as courseName FROM assignments a INNER JOIN courses c ON a.courseId = c.id WHERE a.isActive = 1';
    let params = [];
    
    if (lecturerId) {
      query += ' AND a.lecturer = ?';
      params.push(lecturerId);
    }
    
    if (studentId) {
      query += ' AND c.id IN (SELECT courseId FROM course_enrollments WHERE studentId = ?)';
      params.push(studentId);
    }
    
    query += ' ORDER BY a.dueDate ASC';
    
    const rows = await getQuery(query, params);
    return rows.map(row => this.formatAssignment(row));
  }

  static async update(id, updateData) {
    const { title, description, dueDate, maxScore } = updateData;
    await runQuery(`
      UPDATE assignments 
      SET title = ?, description = ?, dueDate = ?, maxScore = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [title, description, dueDate, maxScore, id]);
    
    return this.findById(id);
  }

  static async delete(id) {
    await runQuery('UPDATE assignments SET isActive = 0 WHERE id = ?', [id]);
  }

  static async submit(assignmentId, studentId, filename) {
    await runQuery(`
      INSERT OR IGNORE INTO assignment_submissions (assignmentId, studentId, file)
      VALUES (?, ?, ?)
    `, [assignmentId, studentId, filename]);
    
    return this.findById(assignmentId);
  }

  static async grade(assignmentId, studentId, score, feedback) {
    await runQuery(`
      UPDATE assignment_submissions 
      SET score = ?, feedback = ?
      WHERE assignmentId = ? AND studentId = ?
    `, [score, feedback, assignmentId, studentId]);
    
    return this.findById(assignmentId);
  }

  static async getSubmissions(assignmentId) {
    const rows = await getQuery(`
      SELECT as.*, u.username, u.profile_firstName, u.profile_lastName
      FROM assignment_submissions as
      INNER JOIN users u ON as.studentId = u.id
      WHERE as.assignmentId = ?
      ORDER BY as.submittedAt DESC
    `, [assignmentId]);
    
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
      file: row.file,
      submittedAt: row.submittedAt,
      score: row.score,
      feedback: row.feedback
    }));
  }

  static async getWithDetails(id) {
    const assignmentRow = await getSingle(`
      SELECT a.*, 
             c.code as courseCode,
             c.name as courseName,
             u.username as lecturer_username,
             u.profile_firstName as lecturer_firstName,
             u.profile_lastName as lecturer_lastName
      FROM assignments a
      INNER JOIN courses c ON a.courseId = c.id
      INNER JOIN users u ON a.lecturer = u.id
      WHERE a.id = ? AND a.isActive = 1
    `, [id]);
    
    if (!assignmentRow) return null;
    
    const assignment = this.formatAssignment(assignmentRow);
    assignment.lecturer = {
      id: assignmentRow.lecturer,
      username: assignmentRow.lecturer_username,
      profile: {
        firstName: assignmentRow.lecturer_firstName,
        lastName: assignmentRow.lecturer_lastName
      }
    };
    
    assignment.course = {
      id: assignmentRow.courseId,
      code: assignmentRow.courseCode,
      name: assignmentRow.courseName
    };
    
    // Get submissions
    assignment.submissions = await this.getSubmissions(id);
    
    return assignment;
  }

  static formatAssignment(row) {
    if (!row) return null;
    
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      courseId: row.courseId,
      lecturer: row.lecturer,
      dueDate: row.dueDate,
      maxScore: row.maxScore,
      isActive: Boolean(row.isActive),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }
}

module.exports = Assignment;
