const { getQuery } = require('./config/database');

async function testStudentDashboard() {
  try {
    console.log('Testing student dashboard API functionality...');
    
    const studentId = 10; // This should be a student ID from the enrollments
    
    // Test the same query used in the dashboard controller
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
    
    console.log('Found enrolled courses for student:', studentCourses.length);
    
    if (studentCourses.length > 0) {
      console.log('First course:', studentCourses[0]);
    }
    
    // Test upcoming assignments query
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
    
    console.log('Found upcoming assignments:', upcomingAssignments.length);
    
    if (upcomingAssignments.length > 0) {
      console.log('First assignment:', upcomingAssignments[0]);
    }
    
    // Test available quizzes query
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
    
    console.log('Found available quizzes:', availableQuizzes.length);
    
    if (availableQuizzes.length > 0) {
      console.log('First quiz:', availableQuizzes[0]);
    }
    
    // Calculate overview statistics
    const overview = {
      totalCourses: studentCourses.length,
      totalAssignments: upcomingAssignments.length,
      totalQuizzes: availableQuizzes.length
    };
    
    console.log('Dashboard Overview:', overview);
    
    // Format response similar to the API
    const apiResponse = {
      success: true,
      data: {
        overview,
        courseStats: studentCourses.map(course => ({
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
            totalAssignments: 0, // Would be calculated per course
            submittedAssignments: 0,
            pendingAssignments: 0,
            totalQuizzes: 0,
            attemptedQuizzes: 0
          }
        })),
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
    };
    
    console.log('API Response Summary:');
    console.log('- Success:', apiResponse.success);
    console.log('- Total courses:', apiResponse.data.overview.totalCourses);
    console.log('- Upcoming assignments:', apiResponse.data.overview.totalAssignments);
    console.log('- Available quizzes:', apiResponse.data.overview.totalQuizzes);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testStudentDashboard();
