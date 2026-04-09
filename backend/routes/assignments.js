const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeAssignment
} = require('../controllers/assignmentController');

// All routes require authentication
router.use(auth);

// Public authenticated routes
router.get('/', getAssignments);
router.get('/:id', getAssignment);

// Lecturer routes
router.post('/', authorize('lecturer'), createAssignment);
router.put('/:id', authorize('lecturer'), updateAssignment);
router.delete('/:id', authorize('lecturer'), deleteAssignment);
router.put('/:id/grade', authorize('lecturer'), gradeAssignment);

// Student routes
router.post('/:id/submit', authorize('student'), submitAssignment);

module.exports = router;
