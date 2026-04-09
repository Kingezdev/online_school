const { runQuery, getQuery } = require('./config/database');

async function createSampleStudioResources() {
  try {
    console.log('Creating sample studio resources...');
    
    // Get courses
    const courses = await getQuery('SELECT id, code, name FROM courses WHERE isActive = 1');
    console.log('Found courses:', courses.length);
    
    // Sample studio resources
    const sampleResources = [
      {
        title: 'Programming Lab - Virtual Environment',
        description: 'Access virtual programming environment with all required tools',
        type: 'Virtual Lab',
        access: 'Available',
        launchUrl: 'https://code.example.com/lab',
        guideUrl: 'https://docs.example.com/programming-lab',
        supportUrl: 'https://support.example.com/programming'
      },
      {
        title: 'Statistics Software - SPSS',
        description: 'Statistical analysis software for data processing',
        type: 'Software',
        access: 'Available',
        launchUrl: 'https://stats.example.com/spss',
        guideUrl: 'https://docs.example.com/spss-guide',
        supportUrl: 'https://support.example.com/spss'
      },
      {
        title: 'Mathematical Computing - MATLAB',
        description: 'Mathematical computation and visualization tool',
        type: 'Software',
        access: 'Available',
        launchUrl: 'https://math.example.com/matlab',
        guideUrl: 'https://docs.example.com/matlab-tutorial',
        supportUrl: 'https://support.example.com/matlab'
      },
      {
        title: 'Circuit Simulator - Logisim',
        description: 'Digital circuit design and simulation tool',
        type: 'Simulation',
        access: 'Available',
        launchUrl: 'https://circuits.example.com/logisim',
        guideUrl: 'https://docs.example.com/logisim-manual',
        supportUrl: 'https://support.example.com/circuits'
      },
      {
        title: 'Development Environment - VS Code',
        description: 'Integrated development environment for programming',
        type: 'IDE',
        access: 'Available',
        launchUrl: 'https://dev.example.com/vscode',
        guideUrl: 'https://docs.example.com/vscode-guide',
        supportUrl: 'https://support.example.com/vscode'
      },
      {
        title: 'Database Management - MySQL Workbench',
        description: 'Visual database design and administration tool',
        type: 'Software',
        access: 'Available',
        launchUrl: 'https://db.example.com/mysql-workbench',
        guideUrl: 'https://docs.example.com/mysql-tutorial',
        supportUrl: 'https://support.example.com/mysql'
      },
      {
        title: 'Physics Simulation - PhET',
        description: 'Interactive physics simulations and experiments',
        type: 'Simulation',
        access: 'Available',
        launchUrl: 'https://physics.example.com/phet',
        guideUrl: 'https://docs.example.com/phet-guide',
        supportUrl: 'https://support.example.com/physics'
      },
      {
        title: 'Chemistry Lab - Virtual ChemLab',
        description: 'Virtual chemistry laboratory experiments',
        type: 'Virtual Lab',
        access: 'Available',
        launchUrl: 'https://chem.example.com/virtuallab',
        guideUrl: 'https://docs.example.com/chem-lab-manual',
        supportUrl: 'https://support.example.com/chemistry'
      }
    ];
    
    // Create resources for each course
    for (const course of courses) {
      // Assign 2-3 resources per course based on course type
      const courseResources = sampleResources.slice(0, 3);
      
      for (const resource of courseResources) {
        await runQuery(
          'INSERT INTO studio_resources (title, description, type, courseId, access, launchUrl, guideUrl, supportUrl, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, datetime("now"), datetime("now"))',
          [
            resource.title,
            resource.description,
            resource.type,
            course.id,
            resource.access,
            resource.launchUrl,
            resource.guideUrl,
            resource.supportUrl
          ]
        );
      }
      
      console.log(`Created 3 studio resources for course: ${course.code} - ${course.name}`);
    }
    
    // Verify resources were created
    const createdResources = await getQuery('SELECT sr.id, sr.title, c.code as courseCode FROM studio_resources sr INNER JOIN courses c ON sr.courseId = c.id LIMIT 10');
    console.log('Sample created resources:', createdResources);
    
    console.log('Studio resources created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createSampleStudioResources();
