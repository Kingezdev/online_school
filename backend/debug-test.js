// Debug test to simulate frontend API calls
const { getQuery, getSingle } = require('./config/database');

// Test the specific API endpoint that's failing
async function testStudentDashboard() {
  console.log('=== Testing Student Dashboard API ===');
  
  try {
    // This should work - get enrolled courses for student
    console.log('Testing courses API...');
    const courses = await getQuery(`
      SELECT c.*, u.username as lecturer_name, u.profile_firstName as lecturer_firstName, u.profile_lastName as lecturer_lastName
      FROM courses c
      INNER JOIN course_enrollments ce ON c.id = ce.courseId
      INNER JOIN users u ON c.lecturer = u.id
      WHERE ce.studentId = ? AND c.isActive = 1 AND ce.isActive = 1
      ORDER BY c.createdAt DESC
    `, [1]); // Assuming student ID 1 for testing
    
    console.log('Courses found:', courses.length);
    
    // This should work - get dashboard stats
    console.log('Testing dashboard stats...');
    const stats = await getSingle(`
      SELECT 
        COUNT(DISTINCT c.id) as totalCourses,
        COUNT(DISTINCT a.id) as totalAssignments,
        COUNT(DISTINCT q.id) as totalQuizzes,
        COUNT(DISTINCT fp.id) as totalForums
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
    
    return {
      success: true,
      courses,
      stats
    };
    
  } catch (error) {
    console.error('Error in student dashboard API:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Test the problematic endpoint directly
async function testDirectAPI() {
  console.log('=== Testing Direct API Call ===');
  
  try {
    // Simulate what the frontend is calling
    const response = await fetch('http://localhost:5000/api/dashboard/student', {
      headers: {
        'Authorization': 'Bearer test-token', // You'll need a real token
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('API Response:', data);
    
    return data;
    
  } catch (error) {
    console.error('Direct API call error:', error);
    return { error: error.message };
  }
}

// Run tests
async function runTests() {
  console.log('Starting debugging tests...\n');
  
  await testStudentDashboard();
  console.log('\n');
  await testDirectAPI();
}

runTests().catch(console.error);
