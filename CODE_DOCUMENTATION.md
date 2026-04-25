# Online School Management System - Code Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Backend Implementation (Server-Side Logic)](#backend-implementation-server-side-logic)
3. [Frontend Implementation (Client-Side Logic)](#frontend-implementation-client-side-logic)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Authentication & Authorization](#authentication--authorization)
7. [Key Features Implementation](#key-features-implementation)

---

## System Overview

The Online School Management System is a comprehensive web application built with:
- **Backend**: Node.js, Express.js, SQLite
- **Frontend**: React.js, CSS-in-JS
- **Database**: SQLite for simplicity and portability
- **Architecture**: RESTful API with JWT authentication

---

## Backend Implementation (Server-Side Logic)

### 4.2.1 Database Connection (Node.js)

```javascript
// backend/config/database.js
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

let db;

const connectDB = async () => {
  try {
    db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });
    console.log("Connected to SQLite database.");
    return db;
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

module.exports = { connectDB, getDB: () => db };
```

### 4.2.2 Authentication System

#### User Registration Logic
```javascript
// backend/controllers/authController.js
const register = async (req, res) => {
  try {
    const { username, email, password, role, profile } = req.body;

    // Validate input
    if (!username || !email || !password || !role) {
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    // Check if user exists
    const existingUser = await getSingle(
      'SELECT * FROM users WHERE username = ? OR email = ?', 
      [username, email]
    );
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const result = await runQuery(
      `INSERT INTO users (username, email, password, role, profile_firstName, profile_lastName, profile_department) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [username, email, hashedPassword, role, profile.firstName, profile.lastName, profile.department]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: result.id, username, role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: result.id,
        username,
        email,
        role,
        profile: {
          firstName: profile.firstName,
          lastName: profile.lastName,
          department: profile.department
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

#### User Login Logic
```javascript
// backend/controllers/authController.js
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Please provide username and password' 
      });
    }

    // Find user
    const user = await getSingle(
      'SELECT * FROM users WHERE username = ?', 
      [username]
    );

    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: {
          firstName: user.profile_firstName,
          lastName: user.profile_lastName,
          department: user.profile_department
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### 4.2.3 Course Management System

#### Course Creation Logic
```javascript
// backend/controllers/courseController.js
const createCourse = async (req, res) => {
  try {
    const { code, name, credits, description } = req.body;

    // Validate input
    if (!code || !name) {
      return res.status(400).json({ 
        message: 'Course code and name are required' 
      });
    }

    // Check if course exists
    const existingCourse = await getSingle(
      'SELECT * FROM courses WHERE code = ?', 
      [code]
    );
    
    if (existingCourse) {
      return res.status(400).json({ 
        message: 'Course with this code already exists' 
      });
    }

    // Create course
    const result = await runQuery(
      `INSERT INTO courses (code, name, credits, description, isActive, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, 1, datetime('now'), datetime('now'))`,
      [code, name, credits || 3, description || '']
    );

    // Get created course with lecturer info
    const course = await getSingle(`
      SELECT c.id, c.code, c.name, c.lecturer, c.isActive, c.createdAt, c.updatedAt,
             u.username as lecturerUsername, u.profile_firstName as lecturerFirstName, u.profile_lastName as lecturerLastName
      FROM courses c
      LEFT JOIN users u ON c.lecturer = u.id
      WHERE c.id = ?
    `, [result.id]);

    res.status(201).json({
      success: true,
      course,
      message: 'Course created successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

#### Course Assignment Logic
```javascript
// backend/controllers/courseController.js
const assignLecturerToCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { lecturerId } = req.body;

    if (!lecturerId) {
      return res.status(400).json({ message: 'Lecturer ID is required' });
    }

    // Check if course exists
    const course = await getSingle('SELECT * FROM courses WHERE id = ?', [courseId]);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if lecturer exists and is actually a lecturer
    const lecturer = await getSingle('SELECT * FROM users WHERE id = ? AND role = "lecturer"', [lecturerId]);
    if (!lecturer) {
      return res.status(404).json({ message: 'Lecturer not found' });
    }

    // Update course with new lecturer
    await runQuery('UPDATE courses SET lecturer = ?, updatedAt = datetime("now") WHERE id = ?', [lecturerId, courseId]);

    // Get updated course with lecturer info
    const updatedCourse = await getSingle(`
      SELECT c.id, c.code, c.name, c.lecturer, c.isActive, c.createdAt, c.updatedAt,
             u.username as lecturerUsername, u.profile_firstName as lecturerFirstName, u.profile_lastName as lecturerLastName
      FROM courses c
      INNER JOIN users u ON c.lecturer = u.id
      WHERE c.id = ?
    `, [courseId]);

    res.json({
      success: true,
      course: updatedCourse,
      message: 'Lecturer assigned to course successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### 4.2.4 Attendance System

#### QR Code Generation and Validation
```javascript
// backend/controllers/attendanceController.js
const generateQRCode = async (req, res) => {
  try {
    const { courseId, date } = req.body;
    const lecturerId = req.user.id;

    // Generate unique QR code
    const qrCode = `QR_${courseId}_${date}_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store QR code in database
    await runQuery(
      `INSERT INTO qr_codes (code, courseId, lecturerId, date, expiresAt, isActive, createdAt) 
       VALUES (?, ?, ?, ?, ?, 1, datetime('now'))`,
      [qrCode, courseId, lecturerId, date, expiresAt.toISOString()]
    );

    res.json({
      success: true,
      qrCode,
      expiresAt,
      message: 'QR code generated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAttendanceViaQR = async (req, res) => {
  try {
    const { qrData } = req.body;
    const studentId = req.user.id;
    
    // Parse and validate QR data
    let parsedQRData;
    try {
      parsedQRData = JSON.parse(qrData);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid QR code format' });
    }
    
    const { courseId, date, type, id } = parsedQRData;
    
    if (type !== 'attendance') {
      return res.status(400).json({ message: 'Invalid QR code type' });
    }
    
    // Check if QR code is still active
    const qrRecord = await getSingle(`
      SELECT expiresAt FROM qr_attendance 
      WHERE courseId = ? AND date = ? AND isActive = 1
      ORDER BY createdAt DESC
      LIMIT 1
    `, [courseId, date]);
    
    if (!qrRecord || new Date(qrRecord.expiresAt) < new Date()) {
      return res.status(400).json({ message: 'QR code has expired or is not active' });
    }
    
    // Verify student is enrolled in the course
    const enrollment = await getSingle(`
      SELECT ce.id FROM course_enrollments ce
      INNER JOIN courses c ON ce.courseId = c.id
      WHERE ce.studentId = ? AND ce.courseId = ?
    `, [studentId, courseId]);

    if (!enrollment) {
      return res.status(403).json({ 
        message: 'You are not enrolled in this course' 
      });
    }

    // Check if attendance already marked for this session
    const existingAttendance = await getSingle(`
      SELECT a.id FROM attendance a
      INNER JOIN attendance_entries ae ON a.id = ae.attendanceId
      WHERE a.courseId = ? AND a.date = ? AND ae.studentId = ?
    `, [courseId, date, studentId]);
    
    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for this session' });
    }
    
    // Create or get attendance session
    let attendanceSession = await getSingle(`
      SELECT id FROM attendance 
      WHERE courseId = ? AND date = ? AND isActive = 1
    `, [courseId, date]);
    
    if (!attendanceSession) {
      // Create new attendance session
      const result = await runQuery(`
        INSERT INTO attendance (courseId, date, isActive, markedBy, createdAt, updatedAt)
        VALUES (?, ?, 1, ?, datetime('now'), datetime('now'))
      `, [courseId, date, null]); // No lecturer marked it yet
      
      attendanceSession = { id: result.id };
    }
    
    // Mark attendance as present
    await runQuery(`
      INSERT INTO attendance_entries (attendanceId, studentId, isPresent, markedAt, markedBy)
      VALUES (?, ?, 1, datetime('now'), ?)
    `, [attendanceSession.id, studentId, 'student']);
    
    res.json({
      success: true,
      message: 'Attendance marked successfully'
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

#### Attendance Recording Logic
```javascript
// backend/controllers/attendanceController.js
const markAttendance = async (req, res) => {
  try {
    const { student_id, session_id } = req.body;

    const query = `INSERT INTO attendance_entries (studentId, qrCodeId, markedAt, status)
                   VALUES (?, ?, datetime('now'), 'present')`;

    await runQuery(query, [student_id, session_id]);

    res.send("Attendance recorded successfully");
  } catch (error) {
    res.status(500).send("Error recording attendance");
  }
};
```

### 4.2.5 Assignment Management System

#### Assignment Creation
```javascript
// backend/controllers/assignmentController.js
const createAssignment = async (req, res) => {
  try {
    const { title, description, courseId, dueDate, maxScore } = req.body;
    const lecturerId = req.user.id;

    // Validate input
    if (!title || !courseId) {
      return res.status(400).json({ 
        message: 'Title and course ID are required' 
      });
    }

    // Create assignment
    const result = await runQuery(
      `INSERT INTO assignments (title, description, courseId, lecturerId, dueDate, maxScore, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [title, description, courseId, lecturerId, dueDate, maxScore || 100]
    );

    // Get created assignment
    const assignment = await getSingle(`
      SELECT a.*, c.name as courseName, u.username as lecturerUsername
      FROM assignments a
      INNER JOIN courses c ON a.courseId = c.id
      INNER JOIN users u ON a.lecturerId = u.id
      WHERE a.id = ?
    `, [result.id]);

    res.status(201).json({
      success: true,
      assignment,
      message: 'Assignment created successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

#### Assignment Submission
```javascript
// backend/controllers/assignmentController.js
const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, content } = req.body;
    const studentId = req.user.id;

    // Check if assignment exists and is not overdue
    const assignment = await getSingle(
      'SELECT * FROM assignments WHERE id = ? AND dueDate > datetime("now")',
      [assignmentId]
    );

    if (!assignment) {
      return res.status(404).json({ 
        message: 'Assignment not found or submission deadline passed' 
      });
    }

    // Check if already submitted
    const existingSubmission = await getSingle(
      'SELECT * FROM assignment_submissions WHERE assignmentId = ? AND studentId = ?',
      [assignmentId, studentId]
    );

    if (existingSubmission) {
      return res.status(400).json({ 
        message: 'Assignment already submitted' 
      });
    }

    // Submit assignment
    const result = await runQuery(
      `INSERT INTO assignment_submissions (assignmentId, studentId, content, submittedAt) 
       VALUES (?, ?, ?, datetime('now'))`,
      [assignmentId, studentId, content]
    );

    res.status(201).json({
      success: true,
      submissionId: result.id,
      message: 'Assignment submitted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

---

## Frontend Implementation (Client-Side Logic)

### 4.3.1 API Service Layer

```javascript
// src/utils/api.js
const API_BASE_URL = 'http://localhost:5000/api';

// Token management
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

// User data management
const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication APIs
export const authAPI = {
  login: async (username, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (data.success && data.token) {
      setToken(data.token);
      setUser(data.user);
    }
    
    return data;
  },

  register: async (userData) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (data.success && data.token) {
      setToken(data.token);
      setUser(data.user);
    }
    
    return data;
  },

  logout: () => {
    removeToken();
    removeUser();
  },

  getCurrentUser: () => getUser(),
  isAuthenticated: () => !!getToken(),
};
```

### 4.3.2 React Components

#### Authentication Component
```javascript
// src/components/Register.jsx
export function Register({ onRegister, onBack }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    profile: {
      firstName: '',
      lastName: '',
      department: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await authAPI.register(formData);
      if (response.success) {
        setStep(3);
        setTimeout(() => {
          onRegister(formData.role, response.user);
        }, 2000);
      }
    } catch (error) {
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Component rendering logic...
}
```

#### Course Management Component
```javascript
// src/pages/AdminCoursesPage.jsx
export function AdminCoursesPage({ setPage }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [lecturers, setLecturers] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLecturer, setSelectedLecturer] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseAPI.getCourses();
        if (response.success) {
          setCourses(response.courses || []);
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    const fetchLecturers = async () => {
      try {
        const response = await usersAPI.getUsers('lecturer');
        if (response.success) {
          setLecturers(response.users || []);
        }
      } catch (error) {
        console.error('Failed to fetch lecturers:', error);
      }
    };

    fetchCourses();
    fetchLecturers();
  }, []);

  const handleAssignCourse = (course) => {
    setSelectedCourse(course);
    setSelectedLecturer(course.lecturer || '');
    setShowAssignModal(true);
  };

  const handleSaveAssignment = async () => {
    if (!selectedCourse || !selectedLecturer) {
      alert('Please select a lecturer');
      return;
    }

    try {
      const response = await courseAPI.assignLecturer(selectedCourse.id, selectedLecturer);
      if (response.success) {
        // Update the course in state directly
        setCourses(prevCourses => 
          prevCourses.map(course => 
            course.id === selectedCourse.id 
              ? { 
                  ...course, 
                  lecturer: selectedLecturer,
                  lecturerFirstName: response.course.lecturerFirstName,
                  lecturerLastName: response.course.lecturerLastName,
                  lecturerUsername: response.course.lecturerUsername
                }
              : course
          )
        );
        
        setShowAssignModal(false);
        setSelectedCourse(null);
        setSelectedLecturer('');
        alert('Lecturer assigned successfully!');
      } else {
        alert('Failed to assign lecturer: ' + response.message);
      }
    } catch (error) {
      alert('Error assigning lecturer: ' + error.message);
    }
  };

  // Component rendering logic...
}
```

---

## Database Schema

### 4.4.1 Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'lecturer', 'admin')),
  profile_firstName TEXT,
  profile_lastName TEXT,
  profile_department TEXT,
  createdAt DATETIME DEFAULT datetime('now'),
  updatedAt DATETIME DEFAULT datetime('now')
);
```

### 4.4.2 Courses Table
```sql
CREATE TABLE courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  credits INTEGER DEFAULT 3,
  description TEXT,
  lecturer INTEGER,
  isActive INTEGER DEFAULT 1,
  createdAt DATETIME DEFAULT datetime('now'),
  updatedAt DATETIME DEFAULT datetime('now'),
  FOREIGN KEY (lecturer) REFERENCES users(id)
);
```

### 4.4.3 Course Enrollments Table
```sql
CREATE TABLE course_enrollments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  courseId INTEGER NOT NULL,
  studentId INTEGER NOT NULL,
  enrolledAt DATETIME DEFAULT datetime('now'),
  FOREIGN KEY (courseId) REFERENCES courses(id),
  FOREIGN KEY (studentId) REFERENCES users(id),
  UNIQUE(courseId, studentId)
);
```

### 4.4.4 Attendance Tables
```sql
CREATE TABLE qr_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  courseId INTEGER NOT NULL,
  lecturerId INTEGER NOT NULL,
  date TEXT NOT NULL,
  expiresAt DATETIME NOT NULL,
  isActive INTEGER DEFAULT 1,
  createdAt DATETIME DEFAULT datetime('now'),
  FOREIGN KEY (courseId) REFERENCES courses(id),
  FOREIGN KEY (lecturerId) REFERENCES users(id)
);

CREATE TABLE attendance_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  studentId INTEGER NOT NULL,
  qrCodeId INTEGER NOT NULL,
  markedAt DATETIME DEFAULT datetime('now'),
  status TEXT DEFAULT 'present',
  FOREIGN KEY (studentId) REFERENCES users(id),
  FOREIGN KEY (qrCodeId) REFERENCES qr_codes(id),
  UNIQUE(studentId, qrCodeId)
);
```

### 4.4.5 Assignments Table
```sql
CREATE TABLE assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  courseId INTEGER NOT NULL,
  lecturerId INTEGER NOT NULL,
  dueDate DATETIME NOT NULL,
  maxScore INTEGER DEFAULT 100,
  createdAt DATETIME DEFAULT datetime('now'),
  updatedAt DATETIME DEFAULT datetime('now'),
  FOREIGN KEY (courseId) REFERENCES courses(id),
  FOREIGN KEY (lecturerId) REFERENCES users(id)
);

CREATE TABLE assignment_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  assignmentId INTEGER NOT NULL,
  studentId INTEGER NOT NULL,
  content TEXT,
  submittedAt DATETIME DEFAULT datetime('now'),
  score INTEGER,
  gradedAt DATETIME,
  feedback TEXT,
  FOREIGN KEY (assignmentId) REFERENCES assignments(id),
  FOREIGN KEY (studentId) REFERENCES users(id),
  UNIQUE(assignmentId, studentId)
);
```

---

## API Endpoints

### 4.5.1 Authentication Endpoints
```
POST /api/auth/register     - User registration
POST /api/auth/login        - User login
GET  /api/auth/profile      - Get user profile
PUT  /api/auth/profile      - Update user profile
```

### 4.5.2 Course Management Endpoints
```
GET    /api/courses           - Get all courses
GET    /api/courses/:id       - Get single course
POST   /api/courses           - Create course (admin)
PUT    /api/courses/:id       - Update course
DELETE /api/courses/:id       - Delete course (admin)
POST   /api/courses/:id/assign - Assign lecturer to course (admin)
POST   /api/courses/:id/enroll - Enroll in course
POST   /api/courses/:id/unenroll - Unenroll from course
```

### 4.5.3 Attendance Endpoints
```
POST /api/attendance/generate-qr    - Generate QR code (lecturer)
POST /api/attendance/validate-qr    - Validate QR code and mark attendance (student)
GET  /api/attendance/course/:id     - Get attendance records for course (lecturer)
GET  /api/attendance/student/:id    - Get student attendance records
```

### 4.5.4 Assignment Endpoints
```
GET    /api/assignments              - Get assignments
GET    /api/assignments/:id          - Get single assignment
POST   /api/assignments              - Create assignment (lecturer)
PUT    /api/assignments/:id          - Update assignment (lecturer)
DELETE /api/assignments/:id          - Delete assignment (lecturer)
POST   /api/assignments/:id/submit   - Submit assignment (student)
PUT    /api/assignments/:id/grade    - Grade assignment (lecturer)
```

---

## Authentication & Authorization

### 4.6.1 JWT Middleware
```javascript
// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const authorize = (roles = []) => {
  return (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  };
};

module.exports = authorize;
```

### 4.6.2 Protected Routes
```javascript
// backend/routes/courses.js
const router = express.Router();
const authorize = require('../middleware/auth');

// Public routes
router.get('/', authorize(['student', 'lecturer', 'admin']), getCourses);

// Lecturer only routes
router.post('/', authorize(['lecturer', 'admin']), createCourse);
router.put('/:id', authorize(['lecturer', 'admin']), updateCourse);

// Admin only routes
router.delete('/:id', authorize('admin'), deleteCourse);
router.post('/:id/assign', authorize('admin'), assignLecturerToCourse);
```

---

## Key Features Implementation

### 4.7.1 QR Code Attendance System
- **Lecturer**: Generate QR codes for specific courses and time periods
- **Student**: Scan QR codes to automatically mark attendance
- **Validation**: QR codes expire after 5 minutes for security
- **Tracking**: Complete attendance history with timestamps

### 4.7.2 Course Assignment System
- **Admin**: Assign lecturers to courses through intuitive interface
- **Real-time Updates**: Course assignments update immediately in UI
- **Validation**: Only users with 'lecturer' role can be assigned
- **Course Management**: Full CRUD operations for course administration

### 4.7.3 Assignment Management
- **Lecturer**: Create, update, and grade assignments
- **Student**: Submit assignments before deadlines
- **File Handling**: Support for text and file submissions
- **Grading**: Automated grade calculation and feedback system

### 4.7.4 User Management
- **Role-Based Access**: Different interfaces for students, lecturers, and admins
- **Profile Management**: Users can update their personal information
- **Authentication**: Secure JWT-based authentication system
- **Registration**: Multi-step registration with role selection

---

## Error Handling & Security

### 4.8.1 Rate Limiting
```javascript
// Frontend rate limiting with exponential backoff
const handleRateLimit = (retryCount) => {
  if (retryCount < 3) {
    const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
    setTimeout(() => {
      fetchCourses();
    }, delay);
  } else {
    setError('Rate limit exceeded. Please refresh the page manually.');
  }
};
```

### 4.8.2 Input Validation
- Server-side validation for all API endpoints
- SQL injection prevention through parameterized queries
- Password hashing with bcrypt
- JWT token expiration and refresh

### 4.8.3 Error Responses
```javascript
// Standardized error response format
{
  success: false,
  message: "Error description",
  error: "Detailed error information (development only)"
}
```

---

## Performance Optimizations

### 4.9.1 Database Optimization
- Indexed foreign key relationships
- Efficient SQL queries with JOIN operations
- Connection pooling for database access

### 4.9.2 Frontend Optimization
- React state management for efficient re-rendering
- API response caching where appropriate
- Lazy loading of large datasets

### 4.9.3 Security Measures
- CORS configuration for API endpoints
- Input sanitization and validation
- Secure password storage and JWT handling

---

This documentation provides a comprehensive overview of the Online School Management System's implementation, covering all major components and their integration patterns.
