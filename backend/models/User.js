const bcrypt = require('bcryptjs');
const { getQuery, getSingle, runQuery } = require('../config/database');

class User {
  static async create(userData) {
    const { username, email, password, role = 'student', profile } = userData;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const result = await runQuery(`
      INSERT INTO users (username, email, password, role, profile_firstName, profile_lastName, profile_avatar, profile_department)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [username, email, hashedPassword, role, profile?.firstName, profile?.lastName, profile?.avatar, profile?.department]);
    
    return this.findById(result.id);
  }

  static async findById(id) {
    const row = await getSingle('SELECT * FROM users WHERE id = ? AND isActive = 1', [id]);
    return row ? this.formatUser(row) : null;
  }

  static async findByUsername(username) {
    const row = await getSingle('SELECT * FROM users WHERE username = ? AND isActive = 1', [username]);
    return row ? this.formatUser(row) : null;
  }

  static async findByEmail(email) {
    const row = await getSingle('SELECT * FROM users WHERE email = ? AND isActive = 1', [email]);
    return row ? this.formatUser(row) : null;
  }

  static async findAll(role = null) {
    let query = 'SELECT * FROM users WHERE isActive = 1';
    let params = [];
    
    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }
    
    const rows = await getQuery(query, params);
    return rows.map(row => this.formatUser(row));
  }

  static async update(id, updateData) {
    const { profile } = updateData;
    const result = await runQuery(`
      UPDATE users 
      SET profile_firstName = ?, profile_lastName = ?, profile_avatar = ?, profile_department = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [profile?.firstName, profile?.lastName, profile?.avatar, profile?.department, id]);
    
    return this.findById(id);
  }

  static async updateLastLogin(id) {
    await runQuery('UPDATE users SET lastLogin = CURRENT_TIMESTAMP WHERE id = ?', [id]);
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  static async getStudentsInCourse(courseId) {
    const rows = await getQuery(`
      SELECT u.* FROM users u
      INNER JOIN course_enrollments ce ON u.id = ce.studentId
      WHERE ce.courseId = ? AND u.isActive = 1
    `, [courseId]);
    
    return rows.map(row => this.formatUser(row));
  }

  static formatUser(row) {
    if (!row) return null;
    
    return {
      id: row.id,
      username: row.username,
      email: row.email,
      password: row.password,
      role: row.role,
      profile: {
        firstName: row.profile_firstName,
        lastName: row.profile_lastName,
        avatar: row.profile_avatar,
        department: row.profile_department
      },
      isActive: Boolean(row.isActive),
      lastLogin: row.lastLogin,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }
}

module.exports = User;
