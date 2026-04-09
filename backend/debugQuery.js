const { getQuery } = require('./config/database');

async function debugQuery() {
  try {
    console.log('Debugging query step by step...');
    
    // Step 1: Test basic assignments query
    console.log('\n1. Testing basic assignments...');
    const basicAssignments = await getQuery('SELECT a.id, a.title FROM assignments a LIMIT 5');
    console.log('Basic assignments:', basicAssignments.length);
    
    // Step 2: Test assignments with courses
    console.log('\n2. Testing assignments with courses...');
    const assignmentsWithCourses = await getQuery(`
      SELECT a.id, a.title, c.code as courseCode 
      FROM assignments a 
      INNER JOIN courses c ON a.courseId = c.id 
      LIMIT 5
    `);
    console.log('Assignments with courses:', assignmentsWithCourses.length);
    if (assignmentsWithCourses.length > 0) {
      console.log('Sample:', assignmentsWithCourses[0]);
    }
    
    // Step 3: Test assignments with courses and enrollments
    console.log('\n3. Testing assignments with courses and enrollments...');
    const assignmentsWithEnrollments = await getQuery(`
      SELECT a.id, a.title, c.code as courseCode, ce.studentId
      FROM assignments a 
      INNER JOIN courses c ON a.courseId = c.id
      INNER JOIN course_enrollments ce ON c.id = ce.courseId
      WHERE ce.studentId = 6
      LIMIT 5
    `);
    console.log('Assignments with enrollments:', assignmentsWithEnrollments.length);
    if (assignmentsWithEnrollments.length > 0) {
      console.log('Sample:', assignmentsWithEnrollments[0]);
    }
    
    // Step 4: Test assignments with courses, enrollments, and users
    console.log('\n4. Testing assignments with courses, enrollments, and users...');
    const assignmentsWithUsers = await getQuery(`
      SELECT a.id, a.title, c.code as courseCode, ce.studentId, u.username
      FROM assignments a 
      INNER JOIN courses c ON a.courseId = c.id
      INNER JOIN course_enrollments ce ON c.id = ce.courseId
      INNER JOIN users u ON a.lecturer = u.id
      WHERE ce.studentId = 6
      LIMIT 5
    `);
    console.log('Assignments with users:', assignmentsWithUsers.length);
    if (assignmentsWithUsers.length > 0) {
      console.log('Sample:', assignmentsWithUsers[0]);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

debugQuery();
