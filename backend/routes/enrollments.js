const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getAvailableCourses,
  getEnrolledCourses,
  getTeachingCourses,
  getCourseStudents,
  enrollInCourse,
  unenrollFromCourse,
  getEnrollmentStats
} = require('../controllers/enrollmentController');

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/enrollments/available
// @desc    Get all available courses for enrollment
// @access  Private (Student)
router.get('/available', authorize('student'), getAvailableCourses);

// @route   GET /api/enrollments/my-courses
// @desc    Get student's enrolled courses
// @access  Private (Student)
router.get('/my-courses', authorize('student'), getEnrolledCourses);

// @route   GET /api/enrollments/teaching-courses
// @desc    Get lecturer's teaching courses with stats
// @access  Private (Lecturer)
router.get('/teaching-courses', authorize('lecturer'), getTeachingCourses);

// @route   GET /api/enrollments/stats
// @desc    Get enrollment statistics
// @access  Private (Student)
router.get('/stats', authorize('student'), getEnrollmentStats);

// @route   POST /api/enrollments
// @desc    Enroll in a course
// @access  Private (Student)
router.post('/', authorize('student'), enrollInCourse);

// @route   DELETE /api/enrollments/:courseId
// @desc    Unenroll from a course
// @access  Private (Student)
router.delete('/:courseId', authorize('student'), unenrollFromCourse);

// @route   GET /api/enrollments/course/:courseId/students
// @desc    Get students enrolled in a specific course
// @access  Private (Lecturer)
router.get('/course/:courseId/students', authorize('lecturer'), getCourseStudents);

module.exports = router;
