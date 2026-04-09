// Simple debug test to isolate the Course.find error
const { getQuery, getSingle } = require('./config/database');

async function testBasicQueries() {
  console.log('=== Testing Basic Database Queries ===');
  
  try {
    // Test 1: Simple courses query
    console.log('Test 1: Getting all courses...');
    const allCourses = await getQuery('SELECT * FROM courses WHERE isActive = 1');
    console.log('All courses:', allCourses.length);
    
    // Test 2: Course enrollments query
    console.log('Test 2: Getting course enrollments...');
    const enrollments = await getQuery('SELECT * FROM course_enrollments');
    console.log('Course enrollments:', enrollments.length);
    
    // Test 3: Test the exact query that's failing
    console.log('Test 3: Testing the problematic query...');
    const studentCourses = await getQuery(`
      SELECT c.*, u.username as lecturer_name, u.profile_firstName as lecturer_firstName, u.profile_lastName as lecturer_lastName
      FROM courses c
      INNER JOIN course_enrollments ce ON c.id = ce.courseId
      INNER JOIN users u ON c.lecturer = u.id
      WHERE ce.studentId = ? AND c.isActive = 1 AND ce.isActive = 1
      ORDER BY c.createdAt DESC
    `, [1]);
    
    console.log('Student courses:', studentCourses.length);
    
    // Test 4: Test dashboard stats query
    console.log('Test 4: Testing dashboard stats...');
    const stats = await getSingle(`
      SELECT 
        COUNT(DISTINCT c.id) as totalCourses,
        COUNT(DISTINCT a.id) as totalAssignments,
        COUNT(DISTINCT q.id) as totalQuizzes,
        COUNT(DISTINCT fp.id) as totalForums,
        COUNT(DISTINCT att.id) as totalAttendance
      FROM courses c
      LEFT JOIN course_enrollments ce ON c.id = ce.courseId AND ce.studentId = ?
      LEFT JOIN assignments a ON c.id = a.courseId AND a.isActive = 1
      LEFT JOIN quizzes q ON c.id = q.courseId AND q.isActive = 1
      LEFT JOIN forum_posts fp ON c.id = fp.forumId AND fp.isActive = 1
      LEFT JOIN attendance att ON c.id = att.courseId AND att.isActive = 1
      WHERE c.isActive = 1
    `, [1]);
    
    console.log('Dashboard stats:', stats);
    
    return { success: true, allCourses, enrollments, studentCourses, stats };
    
  } catch (error) {
    console.error('Error in basic queries:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    return { success: false, error: error.message };
  }
}

// Run the test
testBasicQueries().catch(console.error);
