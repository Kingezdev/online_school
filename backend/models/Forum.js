const { getQuery, getSingle, runQuery } = require('../config/database');
const User = require('./User');
const Course = require('./Course');

class Forum {
  static async create(forumData) {
    const { courseId, title, description } = forumData;
    
    const result = await runQuery(`
      INSERT INTO forums (courseId, title, description)
      VALUES (?, ?, ?)
    `, [courseId, title, description]);
    
    return this.findById(result.id);
  }

  static async findById(id) {
    const row = await getSingle('SELECT * FROM forums WHERE id = ?', [id]);
    return row ? this.formatForum(row) : null;
  }

  static async findAll(lecturerId = null, studentId = null) {
    let query = 'SELECT f.*, c.code as courseCode, c.name as courseName FROM forums f INNER JOIN courses c ON f.courseId = c.id';
    let params = [];
    
    if (lecturerId) {
      query += ' WHERE c.lecturer = ?';
      params.push(lecturerId);
    }
    
    if (studentId) {
      const whereClause = lecturerId ? ' AND' : ' WHERE';
      query += ` ${whereClause} c.id IN (SELECT courseId FROM course_enrollments WHERE studentId = ?)`;
      params.push(studentId);
    }
    
    query += ' ORDER BY f.createdAt DESC';
    
    const rows = await getQuery(query, params);
    return rows.map(row => this.formatForum(row));
  }

  static async delete(id) {
    await runQuery('DELETE FROM forums WHERE id = ?', [id]);
  }

  static async createPost(forumId, authorId, content) {
    await runQuery(`
      INSERT INTO forum_posts (forumId, author, content)
      VALUES (?, ?, ?)
    `, [forumId, authorId, content]);
    
    return this.findById(forumId);
  }

  static async createReply(postId, authorId, content) {
    await runQuery(`
      INSERT INTO forum_replies (postId, author, content)
      VALUES (?, ?, ?)
    `, [postId, authorId, content]);
    
    return this.findById(postId);
  }

  static async getWithDetails(id) {
    const forumRow = await getSingle(`
      SELECT f.*, 
             c.code as courseCode,
             c.name as courseName
      FROM forums f
      INNER JOIN courses c ON f.courseId = c.id
      WHERE f.id = ?
    `, [id]);
    
    if (!forumRow) return null;
    
    const forum = this.formatForum(forumRow);
    forum.course = {
      id: forumRow.courseId,
      code: forumRow.courseCode,
      name: forumRow.courseName
    };
    
    // Get posts with replies
    forum.posts = await this.getPosts(id);
    
    return forum;
  }

  static async getPosts(forumId) {
    const rows = await getQuery(`
      SELECT fp.*, 
             u.username, 
             u.profile_firstName, 
             u.profile_lastName
      FROM forum_posts fp
      INNER JOIN users u ON fp.author = u.id
      WHERE fp.forumId = ?
      ORDER BY fp.createdAt DESC
    `, [forumId]);
    
    const posts = [];
    for (const row of rows) {
      const post = {
        id: row.id,
        author: {
          id: row.author,
          username: row.username,
          profile: {
            firstName: row.profile_firstName,
            lastName: row.profile_lastName
          }
        },
        content: row.content,
        createdAt: row.createdAt,
        replies: []
      };
      
      // Get replies for this post
      const replyRows = await getQuery(`
        SELECT fr.*, 
               u.username, 
               u.profile_firstName, 
               u.profile_lastName
        FROM forum_replies fr
        INNER JOIN users u ON fr.author = u.id
        WHERE fr.postId = ?
        ORDER BY fr.createdAt ASC
      `, [row.id]);
      
      post.replies = replyRows.map(replyRow => ({
        id: replyRow.id,
        author: {
          id: replyRow.author,
          username: replyRow.username,
          profile: {
            firstName: replyRow.profile_firstName,
            lastName: replyRow.profile_lastName
          }
        },
        content: replyRow.content,
        createdAt: replyRow.createdAt
      }));
      
      posts.push(post);
    }
    
    return posts;
  }

  static formatForum(row) {
    if (!row) return null;
    
    return {
      id: row.id,
      courseId: row.courseId,
      title: row.title,
      description: row.description,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }
}

module.exports = Forum;
