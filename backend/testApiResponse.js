const { getQuery } = require('./config/database');

async function testApiResponse() {
  try {
    console.log('Testing the exact API response format...');
    
    const studentId = 6;
    const assignmentsQuery = `
      SELECT a.id, a.title, a.description, a.dueDate, a.maxScore, a.createdAt,
             c.code as courseCode, c.name as courseName,
             asub.score, asub.feedback, asub.submittedAt, asub.file,
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
    
    const assignments = await getQuery(assignmentsQuery, [studentId, studentId]);
    
    // Calculate statistics
    const stats = {
      total: assignments.length,
      submitted: assignments.filter(a => a.status === 'submitted' || a.status === 'graded').length,
      pending: assignments.filter(a => a.status === 'pending').length,
      overdue: assignments.filter(a => a.status === 'overdue').length,
      graded: assignments.filter(a => a.status === 'graded').length
    };
    
    // Format assignments for frontend
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
      file: assignment.file,
      daysRemaining: Math.ceil((new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
    }));
    
    const apiResponse = {
      success: true,
      assignments: formattedAssignments,
      stats
    };
    
    console.log('API Response:', JSON.stringify(apiResponse, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testApiResponse();
