const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  attemptQuiz
} = require('../controllers/quizController');

// All routes require authentication
router.use(auth);

// Public authenticated routes
router.get('/', getQuizzes);
router.get('/:id', getQuiz);

// Lecturer routes
router.post('/', authorize('lecturer'), createQuiz);
router.put('/:id', authorize('lecturer'), updateQuiz);
router.delete('/:id', authorize('lecturer'), deleteQuiz);

// Student routes
router.post('/:id/attempt', authorize('student'), attemptQuiz);

module.exports = router;
