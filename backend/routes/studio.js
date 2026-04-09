const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getStudentStudioResources,
  getStudentStudioResource,
  getStudioResources,
  createStudioResource,
  updateStudioResource,
  deleteStudioResource
} = require('../controllers/studioController');

// Apply auth middleware to all routes
router.use(auth);

// Student routes
router.get('/student', authorize('student'), getStudentStudioResources);
router.get('/student/:id', authorize('student'), getStudentStudioResource);

// Lecturer/Admin routes
router.get('/resources', authorize('lecturer', 'admin'), getStudioResources);
router.post('/resources', authorize('lecturer', 'admin'), createStudioResource);
router.put('/resources/:id', authorize('lecturer', 'admin'), updateStudioResource);
router.delete('/resources/:id', authorize('lecturer', 'admin'), deleteStudioResource);

module.exports = router;
