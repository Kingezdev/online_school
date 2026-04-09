const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getStudentExtras,
  getLecturerExtras,
  getStudentResources,
  createStudentResource,
  updateStudentResource,
  deleteStudentResource,
  getLecturerResources,
  createLecturerResource,
  updateLecturerResource,
  deleteLecturerResource
} = require('../controllers/extrasController');

// Apply auth middleware to all routes
router.use(auth);

// Student routes
router.get('/student', authorize('student'), getStudentExtras);

// Lecturer routes
router.get('/lecturer', authorize('lecturer'), getLecturerExtras);

// Admin management routes
router.get('/student-resources', authorize('admin'), getStudentResources);
router.post('/student-resources', authorize('admin'), createStudentResource);
router.put('/student-resources/:id', authorize('admin'), updateStudentResource);
router.delete('/student-resources/:id', authorize('admin'), deleteStudentResource);

router.get('/lecturer-resources', authorize('admin'), getLecturerResources);
router.post('/lecturer-resources', authorize('admin'), createLecturerResource);
router.put('/lecturer-resources/:id', authorize('admin'), updateLecturerResource);
router.delete('/lecturer-resources/:id', authorize('admin'), deleteLecturerResource);

module.exports = router;
