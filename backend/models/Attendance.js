const { getQuery, getSingle, runQuery } = require('../config/database');
const User = require('./User');
const Course = require('./Course');

class Attendance {
  static async create(attendanceData) {
    const { courseId, date, markedBy, presentStudents } = attendanceData;
    
    const result = await runQuery(`
      INSERT INTO attendance (courseId, date, markedBy)
      VALUES (?, ?, ?)
    `, [courseId, date, markedBy]);
    
    // Add present students
    for (const studentId of presentStudents) {
      await runQuery(`
        INSERT OR IGNORE INTO attendance_records (attendanceId, studentId)
        VALUES (?, ?)
      `, [result.id, studentId]);
    }
    
    return this.findById(result.id);
  }

  static async findById(id) {
    const row = await getSingle('SELECT * FROM attendance WHERE id = ?', [id]);
    return row ? this.formatAttendance(row) : null;
  }

  static async findByCourse(courseId) {
    const rows = await getQuery(`
      SELECT a.*, 
             u.username as markedBy_username,
             u.profile_firstName as markedBy_firstName,
             u.profile_lastName as markedBy_lastName
      FROM attendance a
      INNER JOIN users u ON a.markedBy = u.id
      WHERE a.courseId = ?
      ORDER BY a.date DESC
    `, [courseId]);
    
    return rows.map(row => this.formatAttendance(row));
  }

  static async findByStudent(courseId, studentId) {
    const rows = await getQuery(`
      SELECT a.*, ar.studentId as present
      FROM attendance a
      LEFT JOIN attendance_records ar ON a.id = ar.attendanceId AND ar.studentId = ?
      WHERE a.courseId = ?
      ORDER BY a.date DESC
    `, [studentId, courseId]);
    
    return rows.map(row => ({
      id: row.id,
      date: row.date,
      present: Boolean(row.present),
      markedBy: {
        id: row.markedBy,
        username: row.markedBy_username,
        profile: {
          firstName: row.markedBy_firstName,
          lastName: row.markedBy_lastName
        }
      },
      createdAt: row.createdAt
    }));
  }

  static async update(id, updateData) {
    const { presentStudents } = updateData;
    
    // Clear existing records
    await runQuery('DELETE FROM attendance_records WHERE attendanceId = ?', [id]);
    
    // Add new present students
    for (const studentId of presentStudents) {
      await runQuery(`
        INSERT OR IGNORE INTO attendance_records (attendanceId, studentId)
        VALUES (?, ?)
      `, [id, studentId]);
    }
    
    return this.findById(id);
  }

  static async delete(id) {
    await runQuery('DELETE FROM attendance WHERE id = ?', [id]);
  }

  static async getStats(courseId) {
    const { getSingle, getQuery } = require('../config/database');
    
    // Get course info
    const courseQuery = 'SELECT id, code, name FROM courses WHERE id = ? AND isActive = 1';
    const course = await getSingle(courseQuery, [courseId]);
    if (!course) return null;
    
    // Get enrolled students
    const studentsQuery = `
      SELECT u.id, u.username, u.profile_firstName, u.profile_lastName
      FROM users u
      INNER JOIN course_enrollments ce ON u.id = ce.studentId
      WHERE ce.courseId = ?
    `;
    const students = await getQuery(studentsQuery, [courseId]);
    
    // Get attendance records
    const attendanceRecords = await this.findByCourse(courseId);
    
    const attendanceStats = students.map(student => {
      const studentAttendance = attendanceRecords.filter(record => 
        record.presentStudents?.includes(student.id) || false
      );
      
      return {
        student,
        totalSessions: attendanceRecords.length,
        presentSessions: studentAttendance.length,
        attendanceRate: attendanceRecords.length > 0 
          ? Math.round((studentAttendance.length / attendanceRecords.length) * 100)
          : 0
      };
    });
    
    return {
      course: {
        id: course.id,
        code: course.code,
        name: course.name
      },
      attendanceStats
    };
  }

  static async getStudentStats(courseId, studentId) {
    const attendanceRecords = await this.findByStudent(courseId, studentId);
    const totalSessions = attendanceRecords.length;
    const presentSessions = attendanceRecords.filter(record => record.present).length;
    const attendanceRate = totalSessions > 0 
      ? Math.round((presentSessions / totalSessions) * 100)
      : 0;
    
    return {
      totalSessions,
      presentSessions,
      absentSessions: totalSessions - presentSessions,
      attendanceRate
    };
  }

  static formatAttendance(row) {
    if (!row) return null;
    
    return {
      id: row.id,
      courseId: row.courseId,
      date: row.date,
      markedBy: row.markedBy,
      presentStudents: row.presentStudents || [],
      createdAt: row.createdAt
    };
  }
}

module.exports = Attendance;
