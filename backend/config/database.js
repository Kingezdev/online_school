const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
const initializeDatabase = () => {
  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');
  
  // Check database schema version
  db.get('PRAGMA user_version', (err, row) => {
    const currentVersion = row ? row.user_version : 0;
    const targetVersion = 1; // Increment this when schema changes
    
    if (currentVersion < targetVersion) {
      console.log('Database schema outdated, recreating tables...');
      // Drop existing tables to recreate with new schema
      db.serialize(() => {
        db.run('DROP TABLE IF EXISTS forum_replies');
        db.run('DROP TABLE IF EXISTS forum_posts');
        db.run('DROP TABLE IF EXISTS forums');
        db.run('DROP TABLE IF EXISTS attendance_records');
        db.run('DROP TABLE IF EXISTS attendance');
        db.run('DROP TABLE IF EXISTS quiz_attempts');
        db.run('DROP TABLE IF EXISTS quiz_questions');
        db.run('DROP TABLE IF EXISTS quizzes');
        db.run('DROP TABLE IF EXISTS assignment_submissions');
        db.run('DROP TABLE IF EXISTS assignments');
        db.run('DROP TABLE IF EXISTS course_enrollments');
        db.run('DROP TABLE IF EXISTS courses');
        db.run('DROP TABLE IF EXISTS users');
        
        // Update schema version
        db.run(`PRAGMA user_version = ${targetVersion}`);
        
        // Recreate tables
        createTables();
      });
    } else {
      createTables();
    }
  });
};

const createTables = () => {

  // Create tables
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'student',
        profile_firstName TEXT,
        profile_lastName TEXT,
        profile_avatar TEXT,
        profile_department TEXT,
        isActive BOOLEAN DEFAULT 1,
        lastLogin DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Courses table
    db.run(`
      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        lecturer INTEGER NOT NULL,
        isActive BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lecturer) REFERENCES users (id)
      )
    `);

    // Course enrollments (many-to-many relationship)
    db.run(`
      CREATE TABLE IF NOT EXISTS course_enrollments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        courseId INTEGER NOT NULL,
        studentId INTEGER NOT NULL,
        isActive BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (courseId) REFERENCES courses (id),
        FOREIGN KEY (studentId) REFERENCES users (id),
        UNIQUE(courseId, studentId)
      )
    `);

    // Assignments table
    db.run(`
      CREATE TABLE IF NOT EXISTS assignments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        courseId INTEGER NOT NULL,
        lecturer INTEGER NOT NULL,
        dueDate DATETIME NOT NULL,
        maxScore INTEGER NOT NULL,
        isActive BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (courseId) REFERENCES courses (id),
        FOREIGN KEY (lecturer) REFERENCES users (id)
      )
    `);

    // Assignment submissions
    db.run(`
      CREATE TABLE IF NOT EXISTS assignment_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        assignmentId INTEGER NOT NULL,
        studentId INTEGER NOT NULL,
        file TEXT,
        submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        score INTEGER,
        feedback TEXT,
        FOREIGN KEY (assignmentId) REFERENCES assignments (id),
        FOREIGN KEY (studentId) REFERENCES users (id),
        UNIQUE(assignmentId, studentId)
      )
    `);

    // Quizzes table
    db.run(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        courseId INTEGER NOT NULL,
        timeLimit INTEGER NOT NULL,
        isActive BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (courseId) REFERENCES courses (id)
      )
    `);

    // Quiz questions
    db.run(`
      CREATE TABLE IF NOT EXISTS quiz_questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quizId INTEGER NOT NULL,
        question TEXT NOT NULL,
        options TEXT NOT NULL, -- JSON array
        correctAnswer INTEGER NOT NULL,
        points INTEGER NOT NULL,
        FOREIGN KEY (quizId) REFERENCES quizzes (id)
      )
    `);

    // Quiz attempts
    db.run(`
      CREATE TABLE IF NOT EXISTS quiz_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quizId INTEGER NOT NULL,
        studentId INTEGER NOT NULL,
        answers TEXT NOT NULL, -- JSON array
        score INTEGER,
        attemptedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (quizId) REFERENCES quizzes (id),
        FOREIGN KEY (studentId) REFERENCES users (id)
      )
    `);

    // QR Attendance table
    db.run(`
      CREATE TABLE IF NOT EXISTS qr_attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        courseId INTEGER NOT NULL,
        date TEXT NOT NULL,
        qrData TEXT NOT NULL,
        isActive BOOLEAN DEFAULT 1,
        expiresAt DATETIME NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (courseId) REFERENCES courses (id)
      )
    `);

    // Forums table
    db.run(`
      CREATE TABLE IF NOT EXISTS forums (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        courseId INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        isActive BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (courseId) REFERENCES courses (id)
      )
    `);

    // Forum posts
    db.run(`
      CREATE TABLE IF NOT EXISTS forum_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        forumId INTEGER NOT NULL,
        author INTEGER NOT NULL,
        content TEXT NOT NULL,
        isActive BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (forumId) REFERENCES forums (id),
        FOREIGN KEY (author) REFERENCES users (id)
      )
    `);

    // Forum replies
    db.run(`
      CREATE TABLE IF NOT EXISTS forum_replies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        postId INTEGER NOT NULL,
        author INTEGER NOT NULL,
        content TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (postId) REFERENCES forum_posts (id),
        FOREIGN KEY (author) REFERENCES users (id)
      )
    `);

    // Attendance table
    db.run(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        courseId INTEGER NOT NULL,
        date DATE NOT NULL,
        markedBy INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (courseId) REFERENCES courses (id),
        FOREIGN KEY (markedBy) REFERENCES users (id),
        UNIQUE(courseId, date)
      )
    `);

    // Attendance entries (many-to-many) - renamed to match controller
    db.run(`
      CREATE TABLE IF NOT EXISTS attendance_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        attendanceId INTEGER NOT NULL,
        studentId INTEGER NOT NULL,
        isPresent BOOLEAN DEFAULT 1,
        markedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        markedBy TEXT DEFAULT 'lecturer',
        FOREIGN KEY (attendanceId) REFERENCES attendance (id),
        FOREIGN KEY (studentId) REFERENCES users (id),
        UNIQUE(attendanceId, studentId)
      )
    `);

    // Attendance students table (for tracking student attendance)
    db.run(`
      CREATE TABLE IF NOT EXISTS attendance_students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        attendanceId INTEGER NOT NULL,
        studentId INTEGER NOT NULL,
        FOREIGN KEY (attendanceId) REFERENCES attendance (id),
        FOREIGN KEY (studentId) REFERENCES users (id),
        UNIQUE(attendanceId, studentId)
      )
    `);

    // Books table
    db.run(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        isbn TEXT UNIQUE NOT NULL,
        publisher TEXT,
        publication_year INTEGER,
        genre TEXT,
        description TEXT,
        total_copies INTEGER DEFAULT 1,
        available_copies INTEGER DEFAULT 1,
        location TEXT,
        added_by INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (added_by) REFERENCES users (id)
      )
    `);

    // Messages table
    db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        subject TEXT NOT NULL,
        content TEXT NOT NULL,
        priority TEXT DEFAULT 'normal',
        is_read BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users (id),
        FOREIGN KEY (receiver_id) REFERENCES users (id)
      )
    `);

    // Studio resources
    db.run(`
      CREATE TABLE IF NOT EXISTS studio_resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        courseId INTEGER NOT NULL,
        access TEXT DEFAULT 'Available',
        launchUrl TEXT,
        guideUrl TEXT,
        supportUrl TEXT,
        isActive BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (courseId) REFERENCES courses (id)
      )
    `);

    // Studio resource usage tracking
    db.run(`
      CREATE TABLE IF NOT EXISTS studio_resource_usage (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        resourceId INTEGER NOT NULL,
        studentId INTEGER NOT NULL,
        lastUsed DATETIME DEFAULT CURRENT_TIMESTAMP,
        accessCount INTEGER DEFAULT 1,
        UNIQUE(resourceId, studentId),
        FOREIGN KEY (resourceId) REFERENCES studio_resources (id),
        FOREIGN KEY (studentId) REFERENCES users (id)
      )
    `);

    // Student resources
    db.run(`
      CREATE TABLE IF NOT EXISTS student_resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        category TEXT,
        access TEXT DEFAULT 'All Students',
        url TEXT,
        isActive BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Student announcements
    db.run(`
      CREATE TABLE IF NOT EXISTS student_announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        date TEXT,
        priority TEXT DEFAULT 'medium',
        isActive BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Lecturer resources
    db.run(`
      CREATE TABLE IF NOT EXISTS lecturer_resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        category TEXT,
        items INTEGER DEFAULT 0,
        url TEXT,
        isActive BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Lecturer announcements
    db.run(`
      CREATE TABLE IF NOT EXISTS lecturer_announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        date TEXT,
        priority TEXT DEFAULT 'medium',
        isActive BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables initialized');
  });
};

// Helper function to run queries with promises
const runQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

// Helper function to get query results
const getQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Helper function to get single result
const getSingle = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Alias for getQuery to maintain consistency
const getAll = getQuery;

module.exports = {
  db,
  runQuery,
  getQuery,
  getSingle,
  getAll
};
