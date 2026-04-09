const { getQuery } = require('./config/database');

async function checkEnrollments() {
  try {
    console.log('Checking user enrollment...');
    
    // Check if student ID 6 is enrolled in any courses
    const enrollmentQuery = 'SELECT * FROM course_enrollments WHERE studentId = 6';
    const enrollments = await getQuery(enrollmentQuery);
    
    console.log('Student 6 enrollments:', enrollments.length);
    if (enrollments.length > 0) {
      console.log('Enrollments:', enrollments);
    }
    
    // Check all students and their enrollments
    console.log('\nAll student enrollments:');
    const allEnrollments = await getQuery('SELECT ce.studentId, u.username, c.code FROM course_enrollments ce INNER JOIN users u ON ce.studentId = u.id INNER JOIN courses c ON ce.courseId = c.id WHERE u.role = "student"');
    console.log('All student enrollments:', allEnrollments);
    
    // Check if there are any students at all
    console.log('\nAll users by role:');
    const usersByRole = await getQuery('SELECT role, COUNT(*) as count FROM users GROUP BY role');
    console.log('Users by role:', usersByRole);
    
    // Check which users are students
    console.log('\nAll students:');
    const students = await getQuery('SELECT id, username, role FROM users WHERE role = "student"');
    console.log('Students:', students);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkEnrollments();
