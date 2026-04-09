const { getQuery } = require('./config/database');

async function testStudentAssignments() {
  try {
    console.log('Testing student assignments query...');
    
    // Test the same query used in the student assignments controller
    const studentId = 6; // This should be a student ID from the enrollments
    const assignmentsQuery = `
      SELECT a.id, a.title, a.description, a.dueDate, a.maxScore, a.isActive, a.createdAt, a.updatedAt,
             c.code as courseCode, c.name as courseName,
             u.username as lecturerUsername, u.profile_firstName as lecturerFirstName, u.profile_lastName as lecturerLastName,
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
    console.log('Found assignments for student:', assignments.length);
    if (assignments.length > 0) {
      console.log('First assignment:', assignments[0]);
    }
    
    // Also test basic assignments query
    console.log('\nTesting basic assignments query...');
    const basicQuery = 'SELECT a.id, a.title, c.code as courseCode FROM assignments a INNER JOIN courses c ON a.courseId = c.id LIMIT 5';
    const basicAssignments = await getQuery(basicQuery);
    console.log('Basic assignments query result:', basicAssignments);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testStudentAssignments();
