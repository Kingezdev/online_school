const { getQuery } = require('./config/database');

async function testSimplifiedQuery() {
  try {
    console.log('Testing simplified student assignments query...');
    
    const studentId = 6;
    
    // Test without users table first
    console.log('\n1. Testing without users table...');
    const queryWithoutUsers = `
      SELECT a.id, a.title, a.description, a.dueDate, a.maxScore, a.isActive, a.createdAt, a.updatedAt,
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
    
    const assignmentsWithoutUsers = await getQuery(queryWithoutUsers, [studentId, studentId]);
    console.log('Found assignments without users:', assignmentsWithoutUsers.length);
    
    if (assignmentsWithoutUsers.length > 0) {
      console.log('Sample assignment:', {
        id: assignmentsWithoutUsers[0].id,
        title: assignmentsWithoutUsers[0].title,
        courseCode: assignmentsWithoutUsers[0].courseCode,
        status: assignmentsWithoutUsers[0].status
      });
    }
    
    // Test with users table separately
    console.log('\n2. Testing users table separately...');
    const usersQuery = `
      SELECT id, username, profile_firstName, profile_lastName 
      FROM users 
      WHERE role = 'lecturer' 
      LIMIT 3
    `;
    const users = await getQuery(usersQuery);
    console.log('Found lecturers:', users.length);
    if (users.length > 0) {
      console.log('Sample lecturer:', users[0]);
    }
    
    // Test the join with users table
    console.log('\n3. Testing join with users table...');
    const queryWithUsers = `
      SELECT a.id, a.title, c.code as courseCode, u.username
      FROM assignments a
      INNER JOIN courses c ON a.courseId = c.id
      INNER JOIN users u ON a.lecturer = u.id
      LIMIT 3
    `;
    
    const assignmentsWithUsers = await getQuery(queryWithUsers);
    console.log('Found assignments with users:', assignmentsWithUsers.length);
    
    if (assignmentsWithUsers.length > 0) {
      console.log('Sample with users:', assignmentsWithUsers[0]);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testSimplifiedQuery();
