// Seed file to assign all courses to all lecturers for testing
const { getQuery, runQuery } = require('./config/database');

async function seedLecturerCourses() {
  console.log('=== Seeding Lecturer Course Assignments ===');
  
  try {
    // Get all courses
    const courses = await getQuery('SELECT id FROM courses WHERE isActive = 1');
    console.log(`Found ${courses.length} active courses`);
    
    // Get all lecturers
    const lecturers = await getQuery('SELECT id FROM users WHERE role = ? AND isActive = 1', ['lecturer']);
    console.log(`Found ${lecturers.length} active lecturers`);
    
    if (courses.length === 0) {
      console.log('No courses found. Please run the main seed file first.');
      return;
    }
    
    if (lecturers.length === 0) {
      console.log('No lecturers found. Please run the main seed file first.');
      return;
    }
    
    // Don't clear existing assignments due to NOT NULL constraint
    console.log('Keeping existing lecturer assignments...');
    
    // Assign each course to each lecturer
    let totalAssignments = 0;
    for (const course of courses) {
      for (const lecturer of lecturers) {
        await runQuery('UPDATE courses SET lecturer = ? WHERE id = ?', [lecturer.id, course.id]);
        totalAssignments++;
        console.log(`Assigned course ${course.id} to lecturer ${lecturer.id}`);
      }
    }
    
    console.log(`\n=== Seeding Complete ===`);
    console.log(`Total assignments created: ${totalAssignments}`);
    console.log(`Each lecturer now teaches all ${courses.length} courses`);
    
    // Verify the assignments
    const verification = await getQuery(`
      SELECT 
        u.id as lecturer_id,
        u.username as lecturer_username,
        COUNT(c.id) as course_count
      FROM users u
      LEFT JOIN courses c ON u.id = c.lecturer
      WHERE u.role = 'lecturer' AND u.isActive = 1
      GROUP BY u.id, u.username
    `);
    
    console.log('\n=== Verification ===');
    verification.forEach(row => {
      console.log(`Lecturer ${row.lecturer_username} (ID: ${row.lecturer_id}) teaches ${row.course_count} courses`);
    });
    
    return { success: true, totalAssignments };
    
  } catch (error) {
    console.error('Error seeding lecturer courses:', error);
    return { success: false, error: error.message };
  }
}

// Alternative approach: Assign courses in a round-robin fashion
async function seedLecturerCoursesRoundRobin() {
  console.log('=== Seeding Lecturer Course Assignments (Round Robin) ===');
  
  try {
    // Get all courses
    const courses = await getQuery('SELECT id FROM courses WHERE isActive = 1 ORDER BY id');
    console.log(`Found ${courses.length} active courses`);
    
    // Get all lecturers
    const lecturers = await getQuery('SELECT id, username FROM users WHERE role = ? AND isActive = 1 ORDER BY id', ['lecturer']);
    console.log(`Found ${lecturers.length} active lecturers`);
    
    if (courses.length === 0) {
      console.log('No courses found. Please run the main seed file first.');
      return;
    }
    
    if (lecturers.length === 0) {
      console.log('No lecturers found. Please run the main seed file first.');
      return;
    }
    
    // Don't clear existing assignments due to NOT NULL constraint
    console.log('Keeping existing lecturer assignments...');
    
    // Assign courses in round-robin fashion
    let totalAssignments = 0;
    courses.forEach((course, index) => {
      const lecturerIndex = index % lecturers.length;
      const lecturer = lecturers[lecturerIndex];
      
      runQuery('UPDATE courses SET lecturer = ? WHERE id = ?', [lecturer.id, course.id]);
      totalAssignments++;
      console.log(`Assigned course ${course.id} to lecturer ${lecturer.username} (ID: ${lecturer.id})`);
    });
    
    console.log(`\n=== Seeding Complete ===`);
    console.log(`Total assignments created: ${totalAssignments}`);
    console.log(`Courses distributed evenly among ${lecturers.length} lecturers`);
    
    return { success: true, totalAssignments };
    
  } catch (error) {
    console.error('Error seeding lecturer courses:', error);
    return { success: false, error: error.message };
  }
}

// Run the seeding
if (require.main === module) {
  const method = process.argv[2]; // 'all' or 'roundrobin'
  
  if (method === 'roundrobin') {
    seedLecturerCoursesRoundRobin().catch(console.error);
  } else {
    // Default: assign all courses to all lecturers
    seedLecturerCourses().catch(console.error);
  }
}

module.exports = { seedLecturerCourses, seedLecturerCoursesRoundRobin };
