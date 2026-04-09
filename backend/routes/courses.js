const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  unenrollCourse
} = require('../controllers/courseController');

// All routes require authentication
router.use(auth);

// Public authenticated routes
router.get('/', getCourses);
router.get('/:id', getCourse);

// Lecturer and Admin routes
router.post('/', authorize('lecturer', 'admin'), createCourse);
router.put('/:id', authorize('lecturer', 'admin'), updateCourse);

// Student routes
router.post('/:id/enroll', authorize('student'), enrollCourse);
router.post('/:id/unenroll', authorize('student'), unenrollCourse);

// Admin only routes
router.delete('/:id', authorize('admin'), deleteCourse);

module.exports = router;
