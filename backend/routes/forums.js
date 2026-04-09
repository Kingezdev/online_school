const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getForums,
  getForum,
  createForum,
  createPost,
  replyToPost,
  deleteForum
} = require('../controllers/forumController');

// All routes require authentication
router.use(auth);

// Public authenticated routes
router.get('/', getForums);
router.get('/:id', getForum);

// Lecturer and Student routes
router.post('/', authorize('lecturer', 'student'), createForum);
router.post('/:id/posts', authorize('lecturer', 'student'), createPost);
router.post('/:id/posts/:postId/reply', authorize('lecturer', 'student'), replyToPost);

// Lecturer and Admin routes
router.delete('/:id', authorize('lecturer', 'admin'), deleteForum);

module.exports = router;
