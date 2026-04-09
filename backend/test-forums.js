// Test the forums endpoint
const { getQuery, getSingle, runQuery } = require('./config/database');

async function testForums() {
  console.log('=== Testing Forums API ===');
  
  try {
    // Test 1: Check if forums table has isActive column
    console.log('Test 1: Checking forums table schema...');
    const forumsSchema = await getQuery("PRAGMA table_info(forums)");
    console.log('Forums table columns:', forumsSchema.map(col => col.name));
    
    // Test 2: Check if forum_posts table has isActive column
    console.log('Test 2: Checking forum_posts table schema...');
    const postsSchema = await getQuery("PRAGMA table_info(forum_posts)");
    console.log('Forum posts table columns:', postsSchema.map(col => col.name));
    
    // Test 3: Test the exact query that was failing
    console.log('Test 3: Testing the forums query...');
    const forums = await getQuery(`
      SELECT f.*, c.code as courseCode, c.name as courseName
      FROM forums f
      INNER JOIN courses c ON f.courseId = c.id
      WHERE f.isActive = 1
      ORDER BY f.createdAt DESC
    `);
    
    console.log('Forums found:', forums.length);
    
    // Test 4: Test with student-specific query
    console.log('Test 4: Testing student forums query...');
    const studentForums = await getQuery(`
      SELECT f.*, c.code as courseCode, c.name as courseName
      FROM forums f
      INNER JOIN courses c ON f.courseId = c.id
      INNER JOIN course_enrollments ce ON c.id = ce.courseId
      WHERE ce.studentId = ? AND f.isActive = 1 AND c.isActive = 1
      ORDER BY f.createdAt DESC
    `, [1]);
    
    console.log('Student forums found:', studentForums.length);
    
    return { success: true, forums, studentForums };
    
  } catch (error) {
    console.error('Error in forums test:', error);
    console.error('Error details:', error.message);
    return { success: false, error: error.message };
  }
}

// Run the test
testForums().catch(console.error);
