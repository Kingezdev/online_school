const { runQuery, getQuery } = require('./config/database');

async function createSampleAssignments() {
  try {
    console.log('Creating sample assignments...');
    
    // Get courses and lecturers
    const courses = await getQuery('SELECT id, code, name, lecturer FROM courses WHERE isActive = 1');
    console.log('Found courses:', courses);
    
    // Create assignments for each course
    for (const course of courses) {
      const assignments = [
        {
          title: 'Introduction to Programming Concepts',
          description: 'Write a comprehensive essay on fundamental programming concepts including variables, data types, and control structures.',
          dueDate: '2026-04-15',
          maxScore: 100
        },
        {
          title: 'Algorithm Analysis Project',
          description: 'Analyze the time and space complexity of three different sorting algorithms and provide comparative analysis.',
          dueDate: '2026-04-20',
          maxScore: 150
        },
        {
          title: 'Database Design Assignment',
          description: 'Design a relational database schema for a small business application with proper normalization.',
          dueDate: '2026-04-25',
          maxScore: 120
        }
      ];
      
      for (const assignment of assignments) {
        await runQuery(
          `INSERT INTO assignments (title, description, courseId, lecturer, dueDate, maxScore, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))`,
          [assignment.title, assignment.description, course.id, course.lecturer, assignment.dueDate, assignment.maxScore]
        );
      }
      
      console.log(`Created 3 assignments for course: ${course.code} - ${course.name}`);
    }
    
    console.log('Assignments created successfully!');
    
    // Verify assignments were created
    const createdAssignments = await getQuery('SELECT a.id, a.title, c.code as courseCode FROM assignments a INNER JOIN courses c ON a.courseId = c.id LIMIT 10');
    console.log('Created assignments:', createdAssignments);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createSampleAssignments();
