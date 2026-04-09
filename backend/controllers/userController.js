const { getQuery, getSingle, runQuery } = require('../config/database');

// @desc    Get all users (lecturers and admins only for admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    
    let query = `
      SELECT id, username, email, role, isActive, createdAt, lastLogin,
             profile_firstName as firstName, profile_lastName as lastName
      FROM users 
      WHERE role IN ('lecturer', 'admin')
    `;
    
    const params = [];
    
    if (role && role !== 'all') {
      query += ' AND role = ?';
      params.push(role);
    }
    
    if (search) {
      query += ' AND (username LIKE ? OR email LIKE ? OR profile_firstName LIKE ? OR profile_lastName LIKE ?)';
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam);
    }
    
    query += ' ORDER BY createdAt DESC';
    
    const users = await getQuery(query, params);
    
    res.json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await getSingle(`
      SELECT id, username, email, role, isActive, createdAt, lastLogin,
             profile_firstName as firstName, profile_lastName as lastName
      FROM users 
      WHERE id = ? AND role IN ('lecturer', 'admin')
    `, [id]);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new user (lecturer or admin only)
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res) => {
  try {
    const { username, email, password, role, profile } = req.body;
    
    // Validate role
    if (!role || !['lecturer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Only lecturer or admin roles allowed' });
    }
    
    // Check if user exists
    const existingUser = await getSingle('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this username or email already exists' 
      });
    }

    // Create user
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const insertQuery = `
      INSERT INTO users (username, email, password, role, profile_firstName, profile_lastName, isActive, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
    `;
    const result = await runQuery(insertQuery, [username, email, hashedPassword, role, profile?.firstName, profile?.lastName]);
    
    if (!result || !result.id) {
      throw new Error('Failed to create user');
    }
    
    const user = await getSingle(`
      SELECT id, username, email, role, isActive, createdAt,
             profile_firstName as firstName, profile_lastName as lastName
      FROM users WHERE id = ?
    `, [result.id]);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, isActive, profile } = req.body;
    
    // Check if user exists and is lecturer/admin
    const existingUser = await getSingle(`
      SELECT * FROM users 
      WHERE id = ? AND role IN ('lecturer', 'admin')
    `, [id]);
    
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Validate role if provided
    if (role && !['lecturer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Only lecturer or admin roles allowed' });
    }
    
    // Check for duplicate username/email
    if (username || email) {
      const duplicateCheck = await getSingle(`
        SELECT id FROM users 
        WHERE (username = ? OR email = ?) AND id != ?
      `, [username || existingUser.username, email || existingUser.email, id]);
      
      if (duplicateCheck) {
        return res.status(400).json({ 
          message: 'Username or email already exists' 
        });
      }
    }
    
    // Update user
    const updateFields = [];
    const updateParams = [];
    
    if (username) {
      updateFields.push('username = ?');
      updateParams.push(username);
    }
    if (email) {
      updateFields.push('email = ?');
      updateParams.push(email);
    }
    if (role) {
      updateFields.push('role = ?');
      updateParams.push(role);
    }
    if (isActive !== undefined) {
      updateFields.push('isActive = ?');
      updateParams.push(isActive);
    }
    if (profile?.firstName) {
      updateFields.push('profile_firstName = ?');
      updateParams.push(profile.firstName);
    }
    if (profile?.lastName) {
      updateFields.push('profile_lastName = ?');
      updateParams.push(profile.lastName);
    }
    
    updateFields.push('updatedAt = datetime("now")');
    updateParams.push(id);
    
    if (updateFields.length > 1) {
      await runQuery(`
        UPDATE users 
        SET ${updateFields.join(', ')}
        WHERE id = ?
      `, updateParams);
    }
    
    const updatedUser = await getSingle(`
      SELECT id, username, email, role, isActive, createdAt, lastLogin,
             profile_firstName as firstName, profile_lastName as lastName
      FROM users WHERE id = ?
    `, [id]);
    
    res.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user (soft delete)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists and is lecturer/admin
    const existingUser = await getSingle(`
      SELECT * FROM users 
      WHERE id = ? AND role IN ('lecturer', 'admin')
    `, [id]);
    
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Soft delete by setting isActive to false
    await runQuery(`
      UPDATE users 
      SET isActive = 0, updatedAt = datetime('now')
      WHERE id = ?
    `, [id]);
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
