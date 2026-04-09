const jwt = require('jsonwebtoken');
const { getQuery, getSingle, runQuery } = require('../config/database');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register user (public)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { username, email, password, role, profile } = req.body;

    // Check if user exists
    const existingUser = await getSingle('SELECT * FROM users WHERE username = ? AND isActive = 1', [username]);
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this username already exists' 
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
    const result = await runQuery(insertQuery, [username, email, hashedPassword, role || 'student', profile?.firstName, profile?.lastName]);
    
    if (!result || !result.id) {
      throw new Error('Failed to create user');
    }
    
    const user = await getSingle('SELECT * FROM users WHERE id = ?', [result.id]);
    
    if (!user) {
      throw new Error('Failed to retrieve created user');
    }

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: {
          firstName: user.profile_firstName,
          lastName: user.profile_lastName,
          department: user.profile_department
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Please provide username and password' 
      });
    }

    // Check for user
    const user = await getSingle('SELECT * FROM users WHERE username = ? AND isActive = 1', [username]);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    await runQuery('UPDATE users SET lastLogin = datetime(\'now\') WHERE id = ?', [user.id]);

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: {
          firstName: user.profile_firstName,
          lastName: user.profile_lastName,
          department: user.profile_department
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await getSingle('SELECT id, username, email, role, profile_firstName, profile_lastName FROM users WHERE id = ? AND isActive = 1', [req.user.id]);
    
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { profile } = req.body;
    
    const { profile_firstName, profile_lastName, profile_department } = profile;
    await runQuery('UPDATE users SET profile_firstName = ?, profile_lastName = ?, profile_department = ?, updatedAt = datetime(\'now\') WHERE id = ?', [profile_firstName, profile_lastName, profile_department, req.user.id]);
    const user = await getSingle('SELECT * FROM users WHERE id = ?', [req.user.id]);

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
