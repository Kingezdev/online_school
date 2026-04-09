const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

class Message {
  // Send a new message
  static async create(messageData) {
    return new Promise((resolve, reject) => {
      const {
        senderId,
        receiverId,
        subject,
        content,
        priority = 'normal'
      } = messageData;

      const query = `
        INSERT INTO messages (
          sender_id, receiver_id, subject, content, priority, 
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `;

      db.run(query, [senderId, receiverId, subject, content, priority], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...messageData });
        }
      });
    });
  }

  // Get messages for a user (both sent and received)
  static async getUserMessages(userId, type = 'all') {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT m.*, 
               u1.username as sender_name,
               u1.profile_firstName as sender_firstName,
               u1.profile_lastName as sender_lastName,
               u2.username as receiver_name,
               u2.profile_firstName as receiver_firstName,
               u2.profile_lastName as receiver_lastName
        FROM messages m
        LEFT JOIN users u1 ON m.sender_id = u1.id
        LEFT JOIN users u2 ON m.receiver_id = u2.id
        WHERE (m.sender_id = ? OR m.receiver_id = ?)
      `;

      const params = [userId, userId];

      if (type === 'sent') {
        query += ' AND m.sender_id = ?';
        params.push(userId);
      } else if (type === 'received') {
        query += ' AND m.receiver_id = ?';
        params.push(userId);
      } else if (type === 'unread') {
        query += ' AND m.receiver_id = ? AND m.is_read = 0';
        params.push(userId);
      } else if (type === 'read') {
        query += ' AND m.receiver_id = ? AND m.is_read = 1';
        params.push(userId);
      }

      query += ' ORDER BY m.created_at DESC';

      db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const messages = rows.map(row => ({
            id: row.id,
            senderId: row.sender_id,
            receiverId: row.receiver_id,
            subject: row.subject,
            content: row.content,
            priority: row.priority,
            isRead: row.is_read,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            sender: {
              id: row.sender_id,
              username: row.sender_name,
              firstName: row.sender_firstName,
              lastName: row.sender_lastName
            },
            receiver: {
              id: row.receiver_id,
              username: row.receiver_name,
              firstName: row.receiver_firstName,
              lastName: row.receiver_lastName
            }
          }));
          resolve(messages);
        }
      });
    });
  }

  // Get a single message by ID
  static async findById(messageId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT m.*, 
               u1.username as sender_name,
               u1.profile_firstName as sender_firstName,
               u1.profile_lastName as sender_lastName,
               u2.username as receiver_name,
               u2.profile_firstName as receiver_firstName,
               u2.profile_lastName as receiver_lastName
        FROM messages m
        LEFT JOIN users u1 ON m.sender_id = u1.id
        LEFT JOIN users u2 ON m.receiver_id = u2.id
        WHERE m.id = ?
      `;

      db.get(query, [messageId], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          const message = {
            id: row.id,
            senderId: row.sender_id,
            receiverId: row.receiver_id,
            subject: row.subject,
            content: row.content,
            priority: row.priority,
            isRead: row.is_read,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            sender: {
              id: row.sender_id,
              username: row.sender_name,
              firstName: row.sender_firstName,
              lastName: row.sender_lastName
            },
            receiver: {
              id: row.receiver_id,
              username: row.receiver_name,
              firstName: row.receiver_firstName,
              lastName: row.receiver_lastName
            }
          };
          resolve(message);
        } else {
          resolve(null);
        }
      });
    });
  }

  // Mark message as read
  static async markAsRead(messageId) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE messages 
        SET is_read = 1, updated_at = datetime('now')
        WHERE id = ?
      `;

      db.run(query, [messageId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: messageId, changes: this.changes });
        }
      });
    });
  }

  // Mark message as unread
  static async markAsUnread(messageId) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE messages 
        SET is_read = 0, updated_at = datetime('now')
        WHERE id = ?
      `;

      db.run(query, [messageId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: messageId, changes: this.changes });
        }
      });
    });
  }

  // Delete message
  static async delete(messageId) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM messages WHERE id = ?';

      db.run(query, [messageId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: messageId, changes: this.changes });
        }
      });
    });
  }

  // Get unread message count for a user
  static async getUnreadCount(userId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND is_read = 0';

      db.get(query, [userId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.count);
        }
      });
    });
  }

  // Send system message (from admin)
  static async sendSystemMessage(receiverId, subject, content, priority = 'normal') {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO messages (
          sender_id, receiver_id, subject, content, priority, 
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `;

      // Use admin user (id: 1) as sender for system messages
      db.run(query, [1, receiverId, subject, content, priority], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      });
    });
  }
}

module.exports = Message;
