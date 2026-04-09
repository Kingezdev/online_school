const { runQuery, getQuery } = require('./config/database');

async function createSampleExtrasData() {
  try {
    console.log('Creating sample extras data...');
    
    // Sample student resources
    const studentResources = [
      {
        title: "Career Services",
        description: "Career guidance, job opportunities, and professional development",
        icon: "??",
        category: "Career",
        access: "All Students",
        url: "https://careers.example.com"
      },
      {
        title: "Counseling Services",
        description: "Mental health support and academic counseling",
        icon: "??",
        category: "Wellness",
        access: "All Students",
        url: "https://counseling.example.com"
      },
      {
        title: "Student Clubs",
        description: "Join and participate in various student organizations",
        icon: "??",
        category: "Activities",
        access: "All Students",
        url: "https://clubs.example.com"
      },
      {
        title: "Academic Calendar",
        description: "Important dates, holidays, and academic schedule",
        icon: "??",
        category: "Academic",
        access: "All Students",
        url: "https://calendar.example.com"
      },
      {
        title: "Campus Map",
        description: "Interactive map of campus buildings and facilities",
        icon: "??",
        category: "Navigation",
        access: "All Students",
        url: "https://map.example.com"
      },
      {
        title: "Transportation",
        description: "Campus shuttle schedules and transportation options",
        icon: "??",
        category: "Services",
        access: "All Students",
        url: "https://transport.example.com"
      }
    ];
    
    // Insert student resources
    for (const resource of studentResources) {
      await runQuery(
        'INSERT INTO student_resources (title, description, icon, category, access, url, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, 1, datetime("now"), datetime("now"))',
        [resource.title, resource.description, resource.icon, resource.category, resource.access, resource.url]
      );
    }
    
    console.log('Created student resources');
    
    // Sample student announcements
    const studentAnnouncements = [
      {
        title: "Spring Semester Registration Open",
        description: "Registration for spring 2026 courses is now open",
        date: "2026-03-25",
        priority: "high"
      },
      {
        title: "Career Fair Next Week",
        description: "Annual career fair will be held on March 30th",
        date: "2026-03-24",
        priority: "medium"
      },
      {
        title: "Library Hours Extended",
        description: "Library will remain open until 10 PM during exam period",
        date: "2026-03-23",
        priority: "low"
      }
    ];
    
    // Insert student announcements
    for (const announcement of studentAnnouncements) {
      await runQuery(
        'INSERT INTO student_announcements (title, description, date, priority, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, 1, datetime("now"), datetime("now"))',
        [announcement.title, announcement.description, announcement.date, announcement.priority]
      );
    }
    
    console.log('Created student announcements');
    
    // Sample lecturer resources
    const lecturerResources = [
      {
        title: "Teaching Resources",
        description: "Access teaching materials, templates, and guides",
        icon: "??",
        category: "Teaching",
        items: 45,
        url: "https://teaching.example.com"
      },
      {
        title: "Professional Development",
        description: "Training programs and certification opportunities",
        icon: "??",
        category: "Development",
        items: 12,
        url: "https://pd.example.com"
      },
      {
        title: "Research Tools",
        description: "Access to research databases and tools",
        icon: "??",
        category: "Research",
        items: 28,
        url: "https://research.example.com"
      },
      {
        title: "Administrative Forms",
        description: "Download and submit administrative forms",
        icon: "??",
        category: "Admin",
        items: 15,
        url: "https://forms.example.com"
      }
    ];
    
    // Insert lecturer resources
    for (const resource of lecturerResources) {
      await runQuery(
        'INSERT INTO lecturer_resources (title, description, icon, category, items, url, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, 1, datetime("now"), datetime("now"))',
        [resource.title, resource.description, resource.icon, resource.category, resource.items, resource.url]
      );
    }
    
    console.log('Created lecturer resources');
    
    // Sample lecturer announcements
    const lecturerAnnouncements = [
      {
        title: "Faculty Meeting - March 30",
        description: "Monthly faculty meeting to discuss curriculum updates",
        date: "2026-03-25",
        priority: "high"
      },
      {
        title: "Professional Development Workshop",
        description: "Workshop on innovative teaching methods",
        date: "2026-03-24",
        priority: "medium"
      },
      {
        title: "Research Grant Applications Open",
        description: "Apply for research funding for next semester",
        date: "2026-03-23",
        priority: "medium"
      }
    ];
    
    // Insert lecturer announcements
    for (const announcement of lecturerAnnouncements) {
      await runQuery(
        'INSERT INTO lecturer_announcements (title, description, date, priority, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, 1, datetime("now"), datetime("now"))',
        [announcement.title, announcement.description, announcement.date, announcement.priority]
      );
    }
    
    console.log('Created lecturer announcements');
    
    // Verify data was created
    const studentResourcesCount = await getQuery('SELECT COUNT(*) as count FROM student_resources');
    const studentAnnouncementsCount = await getQuery('SELECT COUNT(*) as count FROM student_announcements');
    const lecturerResourcesCount = await getQuery('SELECT COUNT(*) as count FROM lecturer_resources');
    const lecturerAnnouncementsCount = await getQuery('SELECT COUNT(*) as count FROM lecturer_announcements');
    
    console.log('Data verification:');
    console.log('- Student resources:', studentResourcesCount[0].count);
    console.log('- Student announcements:', studentAnnouncementsCount[0].count);
    console.log('- Lecturer resources:', lecturerResourcesCount[0].count);
    console.log('- Lecturer announcements:', lecturerAnnouncementsCount[0].count);
    
    console.log('Extras data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createSampleExtrasData();
