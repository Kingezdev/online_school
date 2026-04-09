const { getQuery, getSingle, runQuery } = require('../config/database');

// @desc    Get all available courses for enrollment
// @route   GET /api/enrollments/available
// @access  Private (Student)
const getAvailableCourses = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    // Get all courses that are active and the student is not enrolled in
    const query = `
      SELECT c.*, u.username as lecturer_username, u.profile_firstName as lecturer_firstName, u.profile_lastName as lecturer_lastName
      FROM courses c
      LEFT JOIN users u ON c.lecturer = u.id
      WHERE c.isActive = 1 
      AND c.id NOT IN (
        SELECT courseId FROM course_enrollments WHERE studentId = ?
      )
      ORDER BY c.name ASC
    `;

    const rows = await getQuery(query, [studentId]);
    
    const courses = rows.map(row => ({
      id: row.id,
      code: row.code,
      name: row.name,
      description: row.description,
      credits: row.credits,
      isActive: row.is_active,
      lecturer: {
        id: row.lecturer,
        username: row.lecturer_username,
        profile: {
          firstName: row.lecturer_firstName,
          lastName: row.lecturer_lastName
        }
      },
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student's enrolled courses
// @route   GET /api/enrollments/my-courses
// @access  Private (Student)
const getEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    // Get courses the student is enrolled in
    const query = `
      SELECT c.*, u.username as lecturer_username, u.profile_firstName as lecturer_firstName, u.profile_lastName as lecturer_lastName,
             ce.createdAt as enrolledAt
      FROM courses c
      LEFT JOIN users u ON c.lecturer = u.id
      INNER JOIN course_enrollments ce ON c.id = ce.courseId
      WHERE ce.studentId = ? AND c.isActive = 1
      ORDER BY ce.createdAt DESC
    `;

    const rows = await getQuery(query, [studentId]);
    
    const courses = rows.map(row => ({
      id: row.id,
      code: row.code,
      name: row.name,
      description: row.description,
      credits: row.credits,
      isActive: row.is_active,
      lecturer: {
        id: row.lecturer,
        username: row.lecturer_username,
        profile: {
          firstName: row.lecturer_firstName,
          lastName: row.lecturer_lastName
        }
      },
      enrolledAt: row.enrolledAt,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enroll in a course
// @route   POST /api/enrollments
// @access  Private (Student)
const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user.id;

    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    // Check if course exists and is active
    const courseQuery = 'SELECT * FROM courses WHERE id = ? AND isActive = 1';
    const course = await getSingle(courseQuery, [courseId]);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found or not available for enrollment' });
    }

    // Check if student is already enrolled
    const enrollmentQuery = 'SELECT * FROM course_enrollments WHERE studentId = ? AND courseId = ?';
    const existingEnrollment = await getSingle(enrollmentQuery, [studentId, courseId]);
    
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Enroll the student
    const enrollQuery = `
      INSERT INTO course_enrollments (studentId, courseId, createdAt)
      VALUES (?, ?, datetime('now'))
    `;
    
    await runQuery(enrollQuery, [studentId, courseId]);

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unenroll from a course
// @route   DELETE /api/enrollments/:courseId
// @access  Private (Student)
const unenrollFromCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    // Check if enrollment exists
    const enrollmentQuery = 'SELECT * FROM course_enrollments WHERE studentId = ? AND courseId = ?';
    const existingEnrollment = await getSingle(enrollmentQuery, [studentId, courseId]);
    
    if (!existingEnrollment) {
      return res.status(404).json({ message: 'Not enrolled in this course' });
    }

    // Delete the enrollment
    const deleteQuery = 'DELETE FROM course_enrollments WHERE studentId = ? AND courseId = ?';
    await runQuery(deleteQuery, [studentId, courseId]);

    res.json({
      success: true,
      message: 'Successfully unenrolled from course'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get enrollment statistics
// @route   GET /api/enrollments/stats
// @access  Private (Student)
const getEnrollmentStats = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    // Get enrollment statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as enrolledCourses,
        (SELECT COUNT(*) FROM courses WHERE isActive = 1) as totalAvailableCourses
      FROM course_enrollments ce
      INNER JOIN courses c ON ce.courseId = c.id
      WHERE ce.studentId = ? AND c.isActive = 1
    `;

    const stats = await getSingle(statsQuery, [studentId]);

    res.json({
      success: true,
      stats: {
        enrolledCourses: stats.enrolledCourses,
        availableCourses: stats.totalAvailableCourses,
        completionRate: stats.totalAvailableCourses > 0 
          ? Math.round((stats.enrolledCourses / stats.totalAvailableCourses) * 100) 
          : 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get lecturer's teaching courses with stats
// @route   GET /api/enrollments/teaching-courses
// @access  Private (Lecturer)
const getTeachingCourses = async (req, res) => {
  try {
    const lecturerId = req.user.id;
    
    // Get courses the lecturer teaches with stats
    const query = `
      SELECT c.*, u.username as lecturer_username, u.profile_firstName as lecturer_firstName, u.profile_lastName as lecturer_lastName,
             COUNT(DISTINCT ce.studentId) as enrolledStudents,
             COUNT(DISTINCT a.id) as totalAssignments,
             COUNT(DISTINCT q.id) as totalQuizzes,
             COUNT(DISTINCT fp.id) as totalForumPosts,
             COUNT(DISTINCT att.id) as totalAttendanceRecords
      FROM courses c
      LEFT JOIN users u ON c.lecturer = u.id
      LEFT JOIN course_enrollments ce ON c.id = ce.courseId AND ce.isActive = 1
      LEFT JOIN assignments a ON c.id = a.courseId AND a.isActive = 1
      LEFT JOIN quizzes q ON c.id = q.courseId AND q.isActive = 1
      LEFT JOIN forum_posts fp ON c.id = fp.forumId AND fp.isActive = 1
      LEFT JOIN attendance att ON c.id = att.courseId
      WHERE c.lecturer = ? AND c.isActive = 1
      GROUP BY c.id
      ORDER BY c.createdAt DESC
    `;

    const rows = await getQuery(query, [lecturerId]);
    
    const courses = rows.map(row => ({
      id: row.id,
      code: row.code,
      name: row.name,
      description: row.description,
      credits: row.credits,
      isActive: row.is_active,
      lecturer: {
        id: row.lecturer,
        username: row.lecturer_username,
        profile: {
          firstName: row.lecturer_firstName,
          lastName: row.lecturer_lastName
        }
      },
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      stats: {
        enrolledStudents: row.enrolledStudents || 0,
        totalAssignments: row.totalAssignments || 0,
        totalQuizzes: row.totalQuizzes || 0,
        totalForumPosts: row.totalForumPosts || 0,
        totalAttendanceRecords: row.totalAttendanceRecords || 0
      }
    }));

    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get students enrolled in a specific course
// @route   GET /api/enrollments/course/:courseId/students
// @access  Private (Lecturer)
const getCourseStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const lecturerId = req.user.id;
    
    // Verify that the lecturer teaches this course
    const course = await getSingle('SELECT * FROM courses WHERE id = ? AND lecturer = ? AND isActive = 1', [courseId, lecturerId]);
    
    if (!course) {
      return res.status(403).json({ message: 'Access denied. You do not teach this course.' });
    }
    
    // Get enrolled students with their details
    const query = `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.profile_firstName,
        u.profile_lastName,
        u.profile_department,
        ce.createdAt as enrolledAt,
        ce.isActive as enrollmentStatus
      FROM users u
      INNER JOIN course_enrollments ce ON u.id = ce.studentId
      WHERE ce.courseId = ? AND u.isActive = 1
      ORDER BY ce.createdAt DESC
    `;
    
    const students = await getQuery(query, [courseId]);
    
    const formattedStudents = students.map(student => ({
      id: student.id,
      username: student.username,
      email: student.email,
      profile: {
        firstName: student.profile_firstName,
        lastName: student.profile_lastName,
        department: student.profile_department
      },
      enrolledAt: student.enrolledAt,
      enrollmentStatus: student.enrollmentStatus
    }));
    
    res.json({
      success: true,
      course: {
        id: course.id,
        code: course.code,
        name: course.name
      },
      count: formattedStudents.length,
      students: formattedStudents
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAvailableCourses,
  getEnrolledCourses,
  getTeachingCourses,
  getCourseStudents,
  enrollInCourse,
  unenrollFromCourse,
  getEnrollmentStats
};
