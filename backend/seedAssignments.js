// Seed file to create sample assignments for testing gradebook functionality
const { getQuery, getSingle, runQuery } = require('./config/database');

async function seedAssignments() {
  console.log('=== Seeding Assignments for Testing ===');
  
  try {
    // Get all courses
    const courses = await getQuery('SELECT id, code, name, lecturer FROM courses WHERE isActive = 1');
    console.log(`Found ${courses.length} active courses`);
    
    if (courses.length === 0) {
      console.log('No courses found. Please run the main seed file first.');
      return;
    }
    
    // Sample assignment data
    const assignmentTemplates = [
      { title: 'Midterm Exam', maxScore: 100, description: 'Comprehensive midterm examination' },
      { title: 'Final Project', maxScore: 150, description: 'End of semester project' },
      { title: 'Homework 1', maxScore: 50, description: 'First homework assignment' },
      { title: 'Lab Assignment', maxScore: 75, description: 'Practical lab work' },
      { title: 'Quiz 1', maxScore: 25, description: 'First quiz of the semester' }
    ];
    
    let totalAssignmentsCreated = 0;
    
    for (const course of courses) {
      console.log(`\nCreating assignments for course: ${course.code} - ${course.name}`);
      
      for (const template of assignmentTemplates) {
        // Check if assignment already exists for this course
        const existingAssignment = await getSingle(
          'SELECT id FROM assignments WHERE courseId = ? AND title = ?', 
          [course.id, template.title]
        );
        
        if (!existingAssignment) {
          // Create new assignment
          const insertQuery = `
            INSERT INTO assignments (title, description, maxScore, courseId, lecturer, dueDate, isActive, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, datetime('now', '+7 days'), 1, datetime('now'), datetime('now'))
          `;
          
          await runQuery(insertQuery, [
            template.title,
            template.description,
            template.maxScore,
            course.id,
            course.lecturer
          ]);
          
          totalAssignmentsCreated++;
          console.log(`  Created: ${template.title} (${template.maxScore} points)`);
        } else {
          console.log(`  Skipped: ${template.title} (already exists)`);
        }
      }
    }
    
    console.log(`\n=== Seeding Complete ===`);
    console.log(`Total assignments created: ${totalAssignmentsCreated}`);
    
    // Verify the assignments
    const verification = await getQuery(`
      SELECT 
        c.code as course_code,
        c.name as course_name,
        COUNT(a.id) as assignment_count
      FROM courses c
      LEFT JOIN assignments a ON c.id = a.courseId AND a.isActive = 1
      WHERE c.isActive = 1
      GROUP BY c.id, c.code, c.name
      ORDER BY c.code
    `);
    
    console.log('\n=== Verification ===');
    verification.forEach(row => {
      console.log(`Course ${row.course_code}: ${row.assignment_count} assignments`);
    });
    
    return { success: true, totalAssignmentsCreated };
    
  } catch (error) {
    console.error('Error seeding assignments:', error);
    return { success: false, error: error.message };
  }
}

// Run the seeding
if (require.main === module) {
  seedAssignments().catch(console.error);
}

module.exports = { seedAssignments };
