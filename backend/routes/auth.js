const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  register,
  login,
  getProfile,
  updateProfile
} = require('../controllers/authController');

// Public routes
router.post('/login', login);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

// Public registration route
router.post('/register', register);

module.exports = router;
