// Fixed seed file to create multiple course entries for each lecturer
const { getQuery, getSingle, runQuery } = require('./config/database');

async function seedLecturerCourses() {
  console.log('=== Creating Multiple Course Entries for Each Lecturer ===');
  
  try {
    // Get all lecturers
    const lecturers = await getQuery('SELECT id, username FROM users WHERE role = ? AND isActive = 1', ['lecturer']);
    console.log(`Found ${lecturers.length} active lecturers`);
    
    if (lecturers.length === 0) {
      console.log('No lecturers found. Please run the main seed file first.');
      return;
    }
    
    // Get all existing courses to use as templates
    const templateCourses = await getQuery('SELECT * FROM courses WHERE isActive = 1');
    console.log(`Found ${templateCourses.length} template courses`);
    
    if (templateCourses.length === 0) {
      console.log('No template courses found. Please run the main seed file first.');
      return;
    }
    
    // Create course entries for each lecturer
    let totalCoursesCreated = 0;
    
    for (const lecturer of lecturers) {
      console.log(`\nCreating courses for lecturer: ${lecturer.username} (ID: ${lecturer.id})`);
      
      for (const template of templateCourses) {
        // Create a unique course code for this lecturer
        const uniqueCode = `${template.code}_${lecturer.username}`;
        const uniqueName = `${template.name} - ${lecturer.username}`;
        
        // Check if this course already exists for this lecturer
        const existingCourse = await getSingle(
          'SELECT id FROM courses WHERE code = ? AND lecturer = ?', 
          [uniqueCode, lecturer.id]
        );
        
        if (!existingCourse) {
          // Create new course entry for this lecturer
          const insertQuery = `
            INSERT INTO courses (code, name, description, credits, lecturer, isActive, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
          `;
          
          await runQuery(insertQuery, [
            uniqueCode,
            uniqueName,
            template.description,
            template.credits,
            lecturer.id
          ]);
          
          totalCoursesCreated++;
          console.log(`  Created: ${uniqueCode} - ${uniqueName}`);
        } else {
          console.log(`  Skipped: ${uniqueCode} (already exists)`);
        }
      }
    }
    
    console.log(`\n=== Seeding Complete ===`);
    console.log(`Total courses created: ${totalCoursesCreated}`);
    
    // Verify the assignments
    const verification = await getQuery(`
      SELECT 
        u.id as lecturer_id,
        u.username as lecturer_username,
        COUNT(c.id) as course_count
      FROM users u
      LEFT JOIN courses c ON u.id = c.lecturer AND c.isActive = 1
      WHERE u.role = 'lecturer' AND u.isActive = 1
      GROUP BY u.id, u.username
    `);
    
    console.log('\n=== Verification ===');
    verification.forEach(row => {
      console.log(`Lecturer ${row.lecturer_username} (ID: ${row.lecturer_id}) teaches ${row.course_count} courses`);
    });
    
    return { success: true, totalCoursesCreated };
    
  } catch (error) {
    console.error('Error seeding lecturer courses:', error);
    return { success: false, error: error.message };
  }
}

// Alternative: Create sample courses for each lecturer
async function seedSampleCoursesForLecturers() {
  console.log('=== Creating Sample Courses for Each Lecturer ===');
  
  try {
    // Get all lecturers
    const lecturers = await getQuery('SELECT id, username FROM users WHERE role = ? AND isActive = 1', ['lecturer']);
    console.log(`Found ${lecturers.length} active lecturers`);
    
    if (lecturers.length === 0) {
      console.log('No lecturers found. Please run the main seed file first.');
      return;
    }
    
    // Sample course data (simplified to match actual schema)
    const sampleCourses = [
      { code: 'MATH101', name: 'Calculus I' },
      { code: 'CS101', name: 'Computer Science Fundamentals' },
      { code: 'PHYS101', name: 'Physics I' },
      { code: 'CHEM101', name: 'General Chemistry' },
      { code: 'ENG101', name: 'English Composition' },
      { code: 'BIO101', name: 'Biology I' }
    ];
    
    let totalCoursesCreated = 0;
    
    for (const lecturer of lecturers) {
      console.log(`\nCreating courses for lecturer: ${lecturer.username} (ID: ${lecturer.id})`);
      
      for (const course of sampleCourses) {
        // Create a unique course code for this lecturer
        const uniqueCode = `${course.code}_${lecturer.username}`;
        const uniqueName = `${course.name} - ${lecturer.username}`;
        
        // Check if this course already exists for this lecturer
        const existingCourse = await getSingle(
          'SELECT id FROM courses WHERE code = ? AND lecturer = ?', 
          [uniqueCode, lecturer.id]
        );
        
        if (!existingCourse) {
          // Create new course entry for this lecturer
          const insertQuery = `
            INSERT INTO courses (code, name, lecturer, isActive, createdAt, updatedAt)
            VALUES (?, ?, ?, 1, datetime('now'), datetime('now'))
          `;
          
          await runQuery(insertQuery, [
            uniqueCode,
            uniqueName,
            lecturer.id
          ]);
          
          totalCoursesCreated++;
          console.log(`  Created: ${uniqueCode} - ${uniqueName}`);
        } else {
          console.log(`  Skipped: ${uniqueCode} (already exists)`);
        }
      }
    }
    
    console.log(`\n=== Seeding Complete ===`);
    console.log(`Total courses created: ${totalCoursesCreated}`);
    
    // Verify the assignments
    const verification = await getQuery(`
      SELECT 
        u.id as lecturer_id,
        u.username as lecturer_username,
        COUNT(c.id) as course_count
      FROM users u
      LEFT JOIN courses c ON u.id = c.lecturer AND c.isActive = 1
      WHERE u.role = 'lecturer' AND u.isActive = 1
      GROUP BY u.id, u.username
    `);
    
    console.log('\n=== Verification ===');
    verification.forEach(row => {
      console.log(`Lecturer ${row.lecturer_username} (ID: ${row.lecturer_id}) teaches ${row.course_count} courses`);
    });
    
    return { success: true, totalCoursesCreated };
    
  } catch (error) {
    console.error('Error seeding lecturer courses:', error);
    return { success: false, error: error.message };
  }
}

// Run the seeding
if (require.main === module) {
  const method = process.argv[2]; // 'sample' or 'template'
  
  if (method === 'sample') {
    seedSampleCoursesForLecturers().catch(console.error);
  } else {
    // Default: use template courses
    seedLecturerCourses().catch(console.error);
  }
}

module.exports = { seedLecturerCourses, seedSampleCoursesForLecturers };
