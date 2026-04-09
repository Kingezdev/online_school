const { getQuery } = require('./config/database');
const bcrypt = require('bcryptjs');

async function testLoginUser() {
  try {
    console.log('Testing login for user: israel');
    
    // Find the user
    const userQuery = 'SELECT * FROM users WHERE username = ?';
    const user = await getQuery(userQuery, ['israel']);
    
    if (user.length === 0) {
      console.log('User "israel" not found');
      return;
    }
    
    const userData = user[0];
    console.log('User found:', {
      id: userData.id,
      username: userData.username,
      role: userData.role,
      firstName: userData.profile_firstName,
      lastName: userData.profile_lastName
    });
    
    // Check password
    const isPasswordValid = await bcrypt.compare('Rayman47.', userData.password);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Invalid password');
      return;
    }
    
    // Check enrollments for this user
    const enrollmentQuery = 'SELECT ce.courseId, c.code, c.name FROM course_enrollments ce INNER JOIN courses c ON ce.courseId = c.id WHERE ce.studentId = ?';
    const enrollments = await getQuery(enrollmentQuery, [userData.id]);
    
    console.log('User enrollments:', enrollments.length);
    enrollments.forEach(enrollment => {
      console.log(`- ${enrollment.code}: ${enrollment.name}`);
    });
    
    // Test assignments for this user
    const assignmentsQuery = `
      SELECT a.id, a.title, a.description, a.dueDate, a.maxScore,
             c.code as courseCode, c.name as courseName,
             asub.score, asub.feedback, asub.submittedAt,
             CASE 
               WHEN asub.submittedAt IS NOT NULL THEN 
                 CASE 
                   WHEN asub.score IS NOT NULL THEN 'graded'
                   ELSE 'submitted'
                 END
               WHEN a.dueDate < datetime('now') THEN 'overdue'
               ELSE 'pending'
             END as status
      FROM assignments a
      INNER JOIN courses c ON a.courseId = c.id
      INNER JOIN course_enrollments ce ON c.id = ce.courseId
      LEFT JOIN assignment_submissions asub ON a.id = asub.assignmentId AND asub.studentId = ?
      WHERE ce.studentId = ? AND c.isActive = 1 AND a.isActive = 1
      ORDER BY a.dueDate ASC
    `;
    
    const assignments = await getQuery(assignmentsQuery, [userData.id, userData.id]);
    
    console.log('\\nAssignments for user:', assignments.length);
    assignments.forEach((assignment, index) => {
      console.log(`${index + 1}. ${assignment.title} (${assignment.courseCode}) - Status: ${assignment.status}`);
    });
    
    // Calculate statistics
    const stats = {
      total: assignments.length,
      submitted: assignments.filter(a => a.status === 'submitted' || a.status === 'graded').length,
      pending: assignments.filter(a => a.status === 'pending').length,
      overdue: assignments.filter(a => a.status === 'overdue').length,
      graded: assignments.filter(a => a.status === 'graded').length
    };
    
    console.log('\\nStatistics:', stats);
    
    // Test API response format
    const formattedAssignments = assignments.map(assignment => ({
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      course: assignment.courseCode,
      courseName: assignment.courseName,
      type: 'Assignment',
      dueDate: assignment.dueDate,
      status: assignment.status,
      submittedDate: assignment.submittedAt || '--',
      score: assignment.score !== null ? assignment.score : '--',
      maxScore: assignment.maxScore,
      feedback: assignment.feedback,
      daysRemaining: Math.ceil((new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
    }));
    
    const apiResponse = {
      success: true,
      assignments: formattedAssignments,
      stats
    };
    
    console.log('\\nAPI Response Summary:');
    console.log('- Success:', apiResponse.success);
    console.log('- Total assignments:', apiResponse.assignments.length);
    console.log('- First assignment:', apiResponse.assignments[0] ? {
      id: apiResponse.assignments[0].id,
      title: apiResponse.assignments[0].title,
      course: apiResponse.assignments[0].course,
      status: apiResponse.assignments[0].status
    } : 'None');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testLoginUser();
