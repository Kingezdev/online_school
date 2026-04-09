const { getQuery, getSingle } = require('../config/database');

// @desc    Get student dashboard data
// @route   GET /api/dashboard/student
// @access  Private/Student
const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    // Get student's enrolled courses with lecturer info
    const coursesQuery = `
      SELECT c.id, c.code, c.name, c.isActive, c.createdAt, c.updatedAt,
             u.id as lecturerId, u.username as lecturerUsername, u.profile_firstName as lecturerFirstName, u.profile_lastName as lecturerLastName
      FROM courses c
      INNER JOIN users u ON c.lecturer = u.id
      INNER JOIN course_enrollments ce ON c.id = ce.courseId
      WHERE ce.studentId = ? AND c.isActive = 1
      ORDER BY c.code ASC
    `;
    
    const studentCourses = await getQuery(coursesQuery, [studentId]);
    
    // Calculate course statistics for each course
    const courseStats = [];
    for (const course of studentCourses) {
      // Get assignments for this course
      const assignmentsQuery = `
        SELECT a.id, a.title, a.description, a.dueDate, a.maxScore, a.isActive, a.createdAt,
               COUNT(asub.id) as submissionCount,
               COUNT(CASE WHEN asub.studentId = ? THEN 1 END) as studentSubmissionCount
        FROM assignments a
        LEFT JOIN assignment_submissions asub ON a.id = asub.assignmentId
        WHERE a.courseId = ? AND a.isActive = 1
        GROUP BY a.id
      `;
      
      const assignments = await getQuery(assignmentsQuery, [studentId, course.id]);
      
      // Get quizzes for this course
      const quizzesQuery = `
        SELECT q.id, q.title, q.timeLimit, q.isActive, q.createdAt,
               COUNT(qa.id) as attemptCount,
               COUNT(CASE WHEN qa.studentId = ? THEN 1 END) as studentAttemptCount
        FROM quizzes q
        LEFT JOIN quiz_attempts qa ON q.id = qa.quizId
        WHERE q.courseId = ? AND q.isActive = 1
        GROUP BY q.id
      `;
      
      const quizzes = await getQuery(quizzesQuery, [studentId, course.id]);
      
      // Calculate statistics
      const totalAssignments = assignments.length;
      const submittedAssignments = assignments.reduce((sum, a) => sum + (a.studentSubmissionCount > 0 ? 1 : 0), 0);
      const pendingAssignments = assignments.filter(a => 
        new Date(a.dueDate) > new Date() && a.studentSubmissionCount === 0
      ).length;
      const totalQuizzes = quizzes.length;
      const attemptedQuizzes = quizzes.reduce((sum, q) => sum + (q.studentAttemptCount > 0 ? 1 : 0), 0);
      
      courseStats.push({
        course: {
          id: course.id,
          code: course.code,
          name: course.name,
          lecturer: {
            id: course.lecturerId,
            username: course.lecturerUsername,
            firstName: course.lecturerFirstName,
            lastName: course.lecturerLastName
          }
        },
        stats: {
          totalAssignments,
          submittedAssignments,
          pendingAssignments,
          totalQuizzes,
          attemptedQuizzes
        }
      });
    }
    
    // Get upcoming assignments
    const upcomingAssignmentsQuery = `
      SELECT a.id, a.title, a.dueDate, a.isActive, a.createdAt,
             c.code as courseCode, c.name as courseName
      FROM assignments a
      INNER JOIN courses c ON a.courseId = c.id
      INNER JOIN course_enrollments ce ON c.id = ce.courseId
      WHERE ce.studentId = ? AND a.dueDate > datetime('now') AND a.isActive = 1 AND c.isActive = 1
      ORDER BY a.dueDate ASC
      LIMIT 5
    `;
    
    const upcomingAssignments = await getQuery(upcomingAssignmentsQuery, [studentId]);
    
    // Get available quizzes (not attempted by student)
    const availableQuizzesQuery = `
      SELECT q.id, q.title, q.timeLimit, q.isActive, q.createdAt,
             c.code as courseCode, c.name as courseName
      FROM quizzes q
      INNER JOIN courses c ON q.courseId = c.id
      INNER JOIN course_enrollments ce ON c.id = ce.courseId
      LEFT JOIN quiz_attempts qa ON q.id = qa.quizId AND qa.studentId = ?
      WHERE ce.studentId = ? AND q.isActive = 1 AND c.isActive = 1 AND qa.id IS NULL
      ORDER BY q.createdAt DESC
      LIMIT 5
    `;
    
    const availableQuizzes = await getQuery(availableQuizzesQuery, [studentId, studentId]);

    res.json({
      success: true,
      data: {
        overview: {
          totalCourses: studentCourses.length,
          totalAssignments: upcomingAssignments.length,
          totalQuizzes: availableQuizzes.length
        },
        courseStats,
        upcomingAssignments: upcomingAssignments.map(assignment => ({
          id: assignment.id,
          title: assignment.title,
          course: {
            code: assignment.courseCode,
            name: assignment.courseName
          },
          dueDate: assignment.dueDate,
          daysLeft: Math.ceil((new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
        })),
        availableQuizzes: availableQuizzes.map(quiz => ({
          id: quiz.id,
          title: quiz.title,
          course: {
            code: quiz.courseCode,
            name: quiz.courseName
          },
          timeLimit: quiz.timeLimit
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get lecturer dashboard data
// @route   GET /api/dashboard/lecturer
// @access  Private/Lecturer
const getLecturerDashboard = async (req, res) => {
  try {
    const lecturerId = req.user.id;
    
    // Get lecturer's courses with student counts
    const coursesQuery = `
      SELECT c.id, c.code, c.name, c.isActive, c.createdAt, c.updatedAt,
             COUNT(ce.studentId) as studentCount
      FROM courses c
      LEFT JOIN course_enrollments ce ON c.id = ce.courseId AND ce.isActive = 1
      WHERE c.lecturer = ? AND c.isActive = 1
      GROUP BY c.id
      ORDER BY c.code ASC
    `;
    
    const lecturerCourses = await getQuery(coursesQuery, [lecturerId]);
    
    // Calculate course statistics for each course
    const courseStats = [];
    let totalStudents = 0;
    let totalAssignments = 0;
    
    for (const course of lecturerCourses) {
      totalStudents += course.studentCount;
      
      // Get assignments for this course
      const assignmentsQuery = `
        SELECT a.id, a.title, a.maxScore, a.isActive, a.createdAt,
               COUNT(asub.id) as submissionCount,
               COUNT(CASE WHEN asub.score IS NOT NULL THEN 1 END) as gradedCount
        FROM assignments a
        LEFT JOIN assignment_submissions asub ON a.id = asub.assignmentId
        WHERE a.courseId = ? AND a.isActive = 1
        GROUP BY a.id
      `;
      
      const assignments = await getQuery(assignmentsQuery, [course.id]);
      totalAssignments += assignments.length;
      
      // Get quizzes for this course
      const quizzesQuery = `
        SELECT q.id, q.title, q.timeLimit, q.isActive, q.createdAt,
               COUNT(qa.id) as attemptCount,
               AVG(qa.score) as avgScore
        FROM quizzes q
        LEFT JOIN quiz_attempts qa ON q.id = qa.quizId
        WHERE q.courseId = ? AND q.isActive = 1
        GROUP BY q.id
      `;
      
      const quizzes = await getQuery(quizzesQuery, [course.id]);
      
      // Calculate statistics
      const totalSubmissions = assignments.reduce((sum, a) => sum + a.submissionCount, 0);
      const gradedSubmissions = assignments.reduce((sum, a) => sum + a.gradedCount, 0);
      const totalAttempts = quizzes.reduce((sum, q) => sum + q.attemptCount, 0);
      
      const avgQuizScore = quizzes
        .filter(q => q.attemptCount > 0 && q.avgScore !== null)
        .reduce((sum, q) => sum + q.avgScore, 0) / 
        (quizzes.filter(q => q.attemptCount > 0).length || 1);
      
      courseStats.push({
        course: {
          id: course.id,
          code: course.code,
          name: course.name,
          studentCount: course.studentCount
        },
        stats: {
          totalStudents: course.studentCount,
          totalAssignments: assignments.length,
          totalSubmissions,
          gradedSubmissions,
          totalQuizzes: quizzes.length,
          totalAttempts,
          avgQuizScore: Math.round(avgQuizScore)
        }
      });
    }
    
    // Get pending grading count
    const pendingGradingQuery = `
      SELECT COUNT(CASE WHEN asub.score IS NULL THEN 1 END) as ungradedCount
      FROM assignments a
      INNER JOIN assignment_submissions asub ON a.id = asub.assignmentId
      WHERE a.courseId IN (SELECT id FROM courses WHERE lecturer = ? AND isActive = 1) 
        AND a.isActive = 1
    `;
    
    const pendingGradingResult = await getSingle(pendingGradingQuery, [lecturerId]);
    const pendingGrading = pendingGradingResult ? pendingGradingResult.ungradedCount : 0;
    
    // Get recent attendance
    const recentAttendanceQuery = `
      SELECT a.id, a.date, a.isActive, a.createdAt,
             c.code as courseCode, c.name as courseName,
             COUNT(ae.studentId) as presentCount,
             (SELECT COUNT(*) FROM course_enrollments ce2 WHERE ce2.courseId = c.id AND ce2.isActive = 1) as totalStudents
      FROM attendance a
      INNER JOIN courses c ON a.courseId = c.id
      LEFT JOIN attendance_entries ae ON a.id = ae.attendanceId AND ae.isPresent = 1
      WHERE c.lecturer = ? AND c.isActive = 1 AND a.isActive = 1
      GROUP BY a.id
      ORDER BY a.date DESC
      LIMIT 10
    `;
    
    const recentAttendance = await getQuery(recentAttendanceQuery, [lecturerId]);

    res.json({
      success: true,
      data: {
        overview: {
          totalCourses: lecturerCourses.length,
          totalStudents,
          totalAssignments,
          pendingGrading
        },
        courseStats,
        recentAttendance: recentAttendance.map(record => ({
          id: record.id,
          course: {
            code: record.courseCode,
            name: record.courseName
          },
          date: record.date,
          presentCount: record.presentCount,
          totalCount: record.totalStudents
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin dashboard data
// @route   GET /api/dashboard/admin
// @access  Private/Admin
const getAdminDashboard = async (req, res) => {
  try {
    // Get system overview statistics (only lecturers and admins)
    const totalUsersQuery = 'SELECT COUNT(*) as count FROM users WHERE role IN ("lecturer", "admin") AND isActive = 1';
    const totalLecturersQuery = 'SELECT COUNT(*) as count FROM users WHERE role = "lecturer" AND isActive = 1';
    const totalAdminsQuery = 'SELECT COUNT(*) as count FROM users WHERE role = "admin" AND isActive = 1';
    const totalCoursesQuery = 'SELECT COUNT(*) as count FROM courses WHERE isActive = 1';
    const totalAssignmentsQuery = 'SELECT COUNT(*) as count FROM assignments WHERE isActive = 1';
    const totalQuizzesQuery = 'SELECT COUNT(*) as count FROM quizzes WHERE isActive = 1';
    const totalForumsQuery = 'SELECT COUNT(*) as count FROM forums';

    const [totalUsers, totalLecturers, totalAdmins, totalCourses, totalAssignments, totalQuizzes, totalForums] = await Promise.all([
      getSingle(totalUsersQuery),
      getSingle(totalLecturersQuery),
      getSingle(totalAdminsQuery),
      getSingle(totalCoursesQuery),
      getSingle(totalAssignmentsQuery),
      getSingle(totalQuizzesQuery),
      getSingle(totalForumsQuery)
    ]);

    // Get recent activity (only lecturers and admins)
    const recentUsersQuery = `
      SELECT id, username, email, role, lastLogin, profile_firstName as firstName, profile_lastName as lastName
      FROM users 
      WHERE isActive = 1 AND role IN ("lecturer", "admin")
      ORDER BY lastLogin DESC
      LIMIT 10
    `;
    
    const recentUsers = await getQuery(recentUsersQuery);

    const recentCoursesQuery = `
      SELECT c.id, c.code, c.name, c.createdAt, c.updatedAt,
             u.id as lecturerId, u.username as lecturerUsername, u.profile_firstName as lecturerFirstName, u.profile_lastName as lecturerLastName,
             COUNT(ce.studentId) as studentCount
      FROM courses c
      INNER JOIN users u ON c.lecturer = u.id
      LEFT JOIN course_enrollments ce ON c.id = ce.courseId AND ce.isActive = 1
      WHERE c.isActive = 1
      GROUP BY c.id
      ORDER BY c.createdAt DESC
      LIMIT 10
    `;
    
    const recentCourses = await getQuery(recentCoursesQuery);

    // Get user type distribution (only lecturers and admins)
    const userDistribution = [
      { type: 'Lecturers', count: totalLecturers.count, active: totalLecturers.count },
      { type: 'Administrators', count: totalAdmins.count, active: totalAdmins.count }
    ];

    // Get course statistics
    const coursesWithStatsQuery = `
      SELECT c.id, c.code, c.name,
             COUNT(ce.studentId) as studentCount,
             COUNT(a.id) as assignmentCount,
             COUNT(q.id) as quizCount
      FROM courses c
      LEFT JOIN course_enrollments ce ON c.id = ce.courseId AND ce.isActive = 1
      LEFT JOIN assignments a ON c.id = a.courseId AND a.isActive = 1
      LEFT JOIN quizzes q ON c.id = q.courseId AND q.isActive = 1
      WHERE c.isActive = 1
      GROUP BY c.id
    `;
    
    const coursesWithStats = await getQuery(coursesWithStatsQuery);
    
    const totalEnrollments = coursesWithStats.reduce((total, course) => total + course.studentCount, 0);
    const avgStudentsPerCourse = coursesWithStats.length > 0 
      ? Math.round(totalEnrollments / coursesWithStats.length)
      : 0;

    const courseStats = {
      totalCourses: totalCourses.count,
      avgStudentsPerCourse,
      totalEnrollments
    };

    // Get system health (mock data for now)
    const systemHealth = {
      uptime: '99.8%',
      databaseStatus: 'Optimal',
      serverLoad: 'Normal',
      storageUsage: '67%'
    };

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers: totalUsers.count,
          totalCourses: totalCourses.count,
          totalAssignments: totalAssignments.count,
          totalQuizzes: totalQuizzes.count,
          totalForums: totalForums.count
        },
        userDistribution,
        courseStats,
        systemHealth,
        recentActivity: {
          users: recentUsers.map(user => ({
            id: user.id,
            username: user.username,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
            lastLogin: user.lastLogin
          })),
          courses: recentCourses.map(course => ({
            id: course.id,
            code: course.code,
            name: course.name,
            lecturer: {
              id: course.lecturerId,
              username: course.lecturerUsername,
              firstName: course.lecturerFirstName,
              lastName: course.lecturerLastName
            },
            students: course.studentCount,
            createdAt: course.createdAt
          }))
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStudentDashboard,
  getLecturerDashboard,
  getAdminDashboard
};
