const { getQuery, getSingle, runQuery } = require('../config/database');

// @desc    Get all forums
// @route   GET /api/forums
// @access  Private
const getForums = async (req, res) => {
  try {
    let forums;
    
    if (req.user.role === 'student') {
      // Students get forums from their enrolled courses
      forums = await getQuery(`
        SELECT f.*, c.code as courseCode, c.name as courseName
        FROM forums f
        INNER JOIN courses c ON f.courseId = c.id
        INNER JOIN course_enrollments ce ON c.id = ce.courseId
        WHERE ce.studentId = ? AND f.isActive = 1 AND c.isActive = 1
        ORDER BY f.createdAt DESC
      `, [req.user.id]);
    } else if (req.user.role === 'lecturer') {
      // Lecturers get forums from their courses
      forums = await getQuery(`
        SELECT f.*, c.code as courseCode, c.name as courseName
        FROM forums f
        INNER JOIN courses c ON f.courseId = c.id
        WHERE c.lecturer = ? AND f.isActive = 1 AND c.isActive = 1
        ORDER BY f.createdAt DESC
      `, [req.user.id]);
    } else {
      // Admins get all forums
      forums = await getQuery('SELECT * FROM forums WHERE isActive = 1 ORDER BY createdAt DESC');
    }

    res.json({
      success: true,
      count: forums.length,
      forums
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single forum
// @route   GET /api/forums/:id
// @access  Private
const getForum = async (req, res) => {
  try {
    const forum = await getSingle(`
      SELECT f.*, COUNT(fp.id) as postCount
      FROM forums f
      LEFT JOIN forum_posts fp ON f.id = fp.forumId AND fp.isActive = 1
      WHERE f.id = ? AND f.isActive = 1
      GROUP BY f.id
    `, [req.params.id]);
    
    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    res.json({
      success: true,
      forum
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create forum
// @route   POST /api/forums
// @access  Private/Lecturer/Student
const createForum = async (req, res) => {
  try {
    const { courseId, title, description } = req.body;

    if (!courseId || !title) {
      return res.status(400).json({ 
        message: 'Course ID and title are required' 
      });
    }

    const insertForumQuery = `
      INSERT INTO forums (courseId, title, description, isActive, createdAt, updatedAt)
      VALUES (?, ?, ?, 1, datetime('now'), datetime('now'))
    `;
    const result = await runQuery(insertForumQuery, [courseId, title, description]);
    const forum = await getSingle('SELECT * FROM forums WHERE id = ?', [result.lastID]);

    const populatedForum = await Forum.getWithDetails(forum.id);

    res.status(201).json({
      success: true,
      forum: populatedForum
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create post in forum
// @route   POST /api/forums/:id/posts
// @access  Private/Lecturer/Student
const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const forumId = req.params.id;

    if (!content) {
      return res.status(400).json({ 
        message: 'Content is required' 
      });
    }

    const forumQuery = 'SELECT * FROM forums WHERE id = ? AND isActive = 1';
    const forum = await getSingle(forumQuery, [forumId]);
    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    // Create post
    const insertPostQuery = `
      INSERT INTO forum_posts (forumId, authorId, content, isActive, createdAt, updatedAt)
      VALUES (?, ?, ?, 1, datetime('now'), datetime('now'))
    `;
    await runQuery(insertPostQuery, [forumId, req.user.id, content]);

    const updatedForum = await getSingle(`
      SELECT f.*, COUNT(fp.id) as postCount
      FROM forums f
      LEFT JOIN forum_posts fp ON f.id = fp.forumId AND fp.isActive = 1
      WHERE f.id = ? AND f.isActive = 1
      GROUP BY f.id
    `, [forumId]);

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      forum: updatedForum
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reply to post
// @route   POST /api/forums/:id/posts/:postId/reply
// @access  Private/Lecturer/Student
const replyToPost = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;

    if (!content) {
      return res.status(400).json({ 
        message: 'Content is required' 
      });
    }

    // Create reply
    const insertReplyQuery = `
      INSERT INTO forum_posts (forumId, authorId, content, isActive, createdAt, updatedAt)
      VALUES (?, ?, ?, 1, datetime('now'), datetime('now'))
    `;
    await runQuery(insertReplyQuery, [forumId, req.user.id, content]);

    const updatedForum = await Forum.getWithDetails(req.params.id);

    res.status(201).json({
      success: true,
      message: 'Reply added successfully',
      forum: updatedForum
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete forum
// @route   DELETE /api/forums/:id
// @access  Private/Lecturer/Admin
const deleteForum = async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.id);

    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    // Only admins can delete forums for now
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await runQuery('UPDATE forums SET isActive = 0, updatedAt = datetime(\'now\') WHERE id = ?', [req.params.id]);

    res.json({
      success: true,
      message: 'Forum deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getForums,
  getForum,
  createForum,
  createPost,
  replyToPost,
  deleteForum
};
