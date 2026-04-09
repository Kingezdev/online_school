const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getAllBooks,
  getBookById,
  searchBooks,
  getBooksByGenre,
  getAvailableBooks,
  createBook,
  updateBook,
  deleteBook,
  downloadBook
} = require('../controllers/bookController');

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/books
// @desc    Get all books
// @access  Private
router.get('/', getAllBooks);

// @route   GET /api/books/available
// @desc    Get available books
// @access  Private
router.get('/available', getAvailableBooks);

// @route   GET /api/books/search/:term
// @desc    Search books
// @access  Private
router.get('/search/:term', searchBooks);

// @route   GET /api/books/genre/:genre
// @desc    Get books by genre
// @access  Private
router.get('/genre/:genre', getBooksByGenre);

// @route   GET /api/books/:id
// @desc    Get book by ID
// @access  Private
router.get('/:id', getBookById);

// @route   POST /api/books
// @desc    Create new book
// @access  Private (Admin/Librarian only)
router.post('/', authorize('admin', 'lecturer'), createBook);

// @route   PUT /api/books/:id
// @desc    Update book
// @access  Private (Admin/Librarian only)
router.put('/:id', authorize('admin', 'lecturer'), updateBook);

// @route   DELETE /api/books/:id
// @desc    Delete book
// @access  Private (Admin only)
router.delete('/:id', authorize('admin'), deleteBook);

// @route   GET /api/books/:id/download
// @desc    Download book as text file
// @access  Private
router.get('/:id/download', downloadBook);

module.exports = router;
