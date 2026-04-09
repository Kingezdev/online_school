const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getStudentAssignments,
  getStudentAssignment,
  submitAssignment,
  updateAssignmentSubmission,
  getAssignmentSubmission
} = require('../controllers/studentAssignmentsController');

// Apply auth middleware to all routes
router.use(auth);

// Apply student role middleware to all routes
router.use(authorize('student'));

// Get all student assignments
router.get('/', getStudentAssignments);

// Get single assignment details
router.get('/:id', getStudentAssignment);

// Submit assignment
router.post('/:id/submit', submitAssignment);

// Update assignment submission
router.put('/:id/update', updateAssignmentSubmission);

// Get assignment submission details
router.get('/:id/submission', getAssignmentSubmission);

module.exports = router;
