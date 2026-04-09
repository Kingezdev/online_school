const { getQuery } = require('./config/database');

async function testAssignmentLookup() {
  try {
    console.log('Testing individual assignment lookup...');
    
    // Test getting a specific assignment by ID
    const assignmentId = 1;
    const assignmentQuery = `
      SELECT a.id, a.title, a.description, a.dueDate, a.maxScore, a.isActive, a.createdAt, a.updatedAt,
             c.code as courseCode, c.name as courseName, c.id as courseId
      FROM assignments a
      INNER JOIN courses c ON a.courseId = c.id
      WHERE a.id = ? AND c.isActive = 1 AND a.isActive = 1
    `;
    
    const assignment = await getQuery(assignmentQuery, [assignmentId]);
    console.log('Found assignment by ID:', assignment.length);
    if (assignment.length > 0) {
      console.log('Assignment details:', assignment[0]);
    }
    
    // Test the exact query used in getAssignment function
    console.log('\nTesting getAssignment query...');
    const getAssignmentQuery = `
      SELECT a.id, a.title, a.description, a.dueDate, a.maxScore, a.isActive, a.createdAt, a.updatedAt,
             c.code as courseCode, c.name as courseName, c.id as courseId,
             u.username as lecturerUsername, u.profile_firstName as lecturerFirstName, u.profile_lastName as lecturerLastName, u.id as lecturerId
      FROM assignments a
      INNER JOIN courses c ON a.courseId = c.id
      INNER JOIN users u ON a.lecturer = u.id
      WHERE a.id = ? AND c.isActive = 1 AND a.isActive = 1
    `;
    
    const detailedAssignment = await getQuery(getAssignmentQuery, [assignmentId]);
    console.log('Found detailed assignment:', detailedAssignment.length);
    if (detailedAssignment.length > 0) {
      console.log('Detailed assignment:', detailedAssignment[0]);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testAssignmentLookup();
