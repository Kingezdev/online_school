const { getQuery, getSingle, runQuery } = require('../config/database');
const User = require('./User');

class Course {
  static async create(courseData) {
    const { code, name, lecturer } = courseData;
    
    const result = await runQuery(`
      INSERT INTO courses (code, name, lecturer)
      VALUES (?, ?, ?)
    `, [code, name, lecturer]);
    
    return this.findById(result.id);
  }

  static async findById(id) {
    const row = await getSingle('SELECT * FROM courses WHERE id = ? AND isActive = 1', [id]);
    return row ? this.formatCourse(row) : null;
  }

  static async findAll(lecturerId = null) {
    let query = 'SELECT * FROM courses WHERE isActive = 1';
    let params = [];
    
    if (lecturerId) {
      query += ' AND lecturer = ?';
      params.push(lecturerId);
    }
    
    const rows = await getQuery(query, params);
    return rows.map(row => this.formatCourse(row));
  }

  static async findByStudent(studentId) {
    const rows = await getQuery(`
      SELECT c.* FROM courses c
      INNER JOIN course_enrollments ce ON c.id = ce.courseId
      WHERE ce.studentId = ? AND c.isActive = 1
    `, [studentId]);
    
    return rows.map(row => this.formatCourse(row));
  }

  static async update(id, updateData) {
    const { code, name } = updateData;
    await runQuery(`
      UPDATE courses 
      SET code = ?, name = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [code, name, id]);
    
    return this.findById(id);
  }

  static async delete(id) {
    await runQuery('UPDATE courses SET isActive = 0 WHERE id = ?', [id]);
  }

  static async enrollStudent(courseId, studentId) {
    await runQuery(`
      INSERT OR IGNORE INTO course_enrollments (courseId, studentId)
      VALUES (?, ?)
    `, [courseId, studentId]);
    
    return this.findById(courseId);
  }

  static async unenrollStudent(courseId, studentId) {
    await runQuery(`
      DELETE FROM course_enrollments WHERE courseId = ? AND studentId = ?
    `, [courseId, studentId]);
  }

  static async getStudents(courseId) {
    return await User.getStudentsInCourse(courseId);
  }

  static async getWithDetails(id) {
    const courseRow = await getSingle(`
      SELECT c.*, 
             u.username as lecturer_username,
             u.profile_firstName as lecturer_firstName,
             u.profile_lastName as lecturer_lastName
      FROM courses c
      INNER JOIN users u ON c.lecturer = u.id
      WHERE c.id = ? AND c.isActive = 1
    `, [id]);
    
    if (!courseRow) return null;
    
    const course = this.formatCourse(courseRow);
    course.lecturer = {
      id: courseRow.lecturer,
      username: courseRow.lecturer_username,
      profile: {
        firstName: courseRow.lecturer_firstName,
        lastName: courseRow.lecturer_lastName
      }
    };
    
    // Get students
    course.students = await this.getStudents(id);
    
    return course;
  }

  static formatCourse(row) {
    if (!row) return null;
    
    return {
      id: row.id,
      code: row.code,
      name: row.name,
      lecturer: row.lecturer,
      isActive: Boolean(row.isActive),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }
}

module.exports = Course;
