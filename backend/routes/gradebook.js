const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getStudentGradebook,
  getStudentCourseGrades,
  getLecturerGradebook,
  updateStudentGrade
} = require('../controllers/gradebookController');

// Apply auth middleware to all routes
router.use(auth);

// Student routes
router.get('/student', authorize('student'), getStudentGradebook);
router.get('/student/:courseId', authorize('student'), getStudentCourseGrades);

// Lecturer routes
router.get('/lecturer', authorize('lecturer'), getLecturerGradebook);
router.put('/update', authorize('lecturer'), updateStudentGrade);

module.exports = router;
