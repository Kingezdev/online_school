const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getUserMessages,
  getMessageById,
  sendMessage,
  markAsRead,
  markAsUnread,
  deleteMessage,
  getUnreadCount,
  sendSystemMessage
} = require('../controllers/messageController');

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/messages
// @desc    Get all messages for a user
// @access  Private
router.get('/', getUserMessages);

// @route   GET /api/messages/unread/count
// @desc    Get unread message count
// @access  Private
router.get('/unread/count', getUnreadCount);

// @route   POST /api/messages
// @desc    Send a new message
// @access  Private
router.post('/', sendMessage);

// @route   POST /api/messages/system
// @desc    Send system message (admin only)
// @access  Private (Admin only)
router.post('/system', authorize('admin'), sendSystemMessage);

// @route   GET /api/messages/:id
// @desc    Get a single message
// @access  Private
router.get('/:id', getMessageById);

// @route   PUT /api/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/:id/read', markAsRead);

// @route   PUT /api/messages/:id/unread
// @desc    Mark message as unread
// @access  Private
router.put('/:id/unread', markAsUnread);

// @route   DELETE /api/messages/:id
// @desc    Delete message
// @access  Private
router.delete('/:id', deleteMessage);

module.exports = router;
