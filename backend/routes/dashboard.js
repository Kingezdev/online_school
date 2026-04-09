const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getStudentDashboard,
  getLecturerDashboard,
  getAdminDashboard
} = require('../controllers/dashboardController');

// All routes require authentication
router.use(auth);

// Role-specific dashboard routes
router.get('/student', authorize('student'), getStudentDashboard);
router.get('/lecturer', authorize('lecturer'), getLecturerDashboard);
router.get('/admin', authorize('admin'), getAdminDashboard);

module.exports = router;
