const { getQuery, getSingle, runQuery } = require('../config/database');

// @desc    Get all messages for a user
// @route   GET /api/messages
// @access  Private
const getUserMessages = async (req, res) => {
  try {
    const { type = 'all' } = req.query;
    const userId = req.user.id;
    
    let messages;
    if (type === 'all') {
      messages = await getQuery('SELECT * FROM messages WHERE (receiverId = ? OR senderId = ?) AND isActive = 1 ORDER BY createdAt DESC', [userId, userId]);
    } else if (type === 'sent') {
      messages = await getQuery('SELECT * FROM messages WHERE senderId = ? AND isActive = 1 ORDER BY createdAt DESC', [userId]);
    } else if (type === 'received') {
      messages = await getQuery('SELECT * FROM messages WHERE receiverId = ? AND isActive = 1 ORDER BY createdAt DESC', [userId]);
    } else {
      messages = await getQuery('SELECT * FROM messages WHERE receiverId = ? AND isRead = 0 AND isActive = 1 ORDER BY createdAt DESC', [userId]);
    }
    
    res.json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single message
// @route   GET /api/messages/:id
// @access  Private
const getMessageById = async (req, res) => {
  try {
    const messageQuery = 'SELECT * FROM messages WHERE id = ? AND isActive = 1';
    const message = await getSingle(messageQuery, [req.params.id]);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is authorized to view this message
    if (message.senderId !== req.user.id && message.receiverId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this message' });
    }

    res.json({
      success: true,
      message
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { receiverId, subject, content, priority = 'normal' } = req.body;
    const senderId = req.user.id;

    // Validate required fields
    if (!receiverId || !subject || !content) {
      return res.status(400).json({ 
        message: 'Receiver ID, subject, and content are required' 
      });
    }

    // Don't allow sending messages to yourself
    if (receiverId === senderId) {
      return res.status(400).json({ 
        message: 'Cannot send messages to yourself' 
      });
    }

    const messageData = {
      senderId,
      receiverId,
      subject,
      content,
      priority
    };

    const insertQuery = `
      INSERT INTO messages (senderId, receiverId, subject, content, priority, isRead, isActive, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
    `;
    const result = await runQuery(insertQuery, [messageData.senderId, messageData.receiverId, messageData.subject, messageData.content, messageData.priority]);
    const message = await getSingle('SELECT * FROM messages WHERE id = ?', [result.lastID]);

    res.status(201).json({
      success: true,
      message
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const messageQuery = 'SELECT * FROM messages WHERE id = ? AND isActive = 1';
    const message = await getSingle(messageQuery, [req.params.id]);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only receiver can mark as read
    if (message.receiverId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to mark this message as read' });
    }

    const result = await runQuery('UPDATE messages SET isRead = 1, updatedAt = datetime(\'now\') WHERE id = ? AND receiverId = ?', [req.params.id, req.user.id]);

    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark message as unread
// @route   PUT /api/messages/:id/unread
// @access  Private
const markAsUnread = async (req, res) => {
  try {
    const messageQuery = 'SELECT * FROM messages WHERE id = ? AND isActive = 1';
    const message = await getSingle(messageQuery, [req.params.id]);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only receiver can mark as unread
    if (message.receiverId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to mark this message as unread' });
    }

    const result = await runQuery('UPDATE messages SET isRead = 0, updatedAt = datetime(\'now\') WHERE id = ? AND receiverId = ?', [req.params.id, req.user.id]);

    res.json({
      success: true,
      message: 'Message marked as unread'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
const deleteMessage = async (req, res) => {
  try {
    const messageQuery = 'SELECT * FROM messages WHERE id = ? AND isActive = 1';
    const message = await getSingle(messageQuery, [req.params.id]);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only sender or receiver can delete message
    if (message.senderId !== req.user.id && message.receiverId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    const result = await runQuery('UPDATE messages SET isActive = 0, updatedAt = datetime(\'now\') WHERE id = ? AND (senderId = ? OR receiverId = ?)', [req.params.id, req.user.id, req.user.id]);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread/count
// @access  Private
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await getSingle('SELECT COUNT(*) as count FROM messages WHERE receiverId = ? AND isRead = 0 AND isActive = 1', [userId]);
    
    res.json({
      success: true,
      unreadCount: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send system message (admin only)
// @route   POST /api/messages/system
// @access  Private (Admin only)
const sendSystemMessage = async (req, res) => {
  try {
    const { receiverId, subject, content, priority = 'normal' } = req.body;

    // Validate required fields
    if (!receiverId || !subject || !content) {
      return res.status(400).json({ 
        message: 'Receiver ID, subject, and content are required' 
      });
    }

    const insertQuery = `
      INSERT INTO messages (senderId, receiverId, subject, content, priority, isSystemMessage, isRead, isActive, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, 1, 1, datetime('now'), datetime('now'))
    `;
    const result = await runQuery(insertQuery, [null, receiverId, subject, content, priority]);

    res.status(201).json({
      success: true,
      message: 'System message sent successfully',
      messageId: result.id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserMessages,
  getMessageById,
  sendMessage,
  markAsRead,
  markAsUnread,
  deleteMessage,
  getUnreadCount,
  sendSystemMessage
};
