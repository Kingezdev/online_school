const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Course = require('./models/Course');
require('dotenv').config();

const seedData = async () => {
  try {
    console.log('Seeding database...');

    // Clear existing data
    await require('./config/database').runQuery('DELETE FROM attendance_records');
    await require('./config/database').runQuery('DELETE FROM attendance');
    await require('./config/database').runQuery('DELETE FROM forum_replies');
    await require('./config/database').runQuery('DELETE FROM forum_posts');
    await require('./config/database').runQuery('DELETE FROM forums');
    await require('./config/database').runQuery('DELETE FROM quiz_attempts');
    await require('./config/database').runQuery('DELETE FROM quiz_questions');
    await require('./config/database').runQuery('DELETE FROM quizzes');
    await require('./config/database').runQuery('DELETE FROM assignment_submissions');
    await require('./config/database').runQuery('DELETE FROM assignments');
    await require('./config/database').runQuery('DELETE FROM course_enrollments');
    await require('./config/database').runQuery('DELETE FROM courses');
    await require('./config/database').runQuery('DELETE FROM users');

    // Create admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@vigilearn.com',
      password: 'admin123',
      role: 'admin',
      profile: {
        firstName: 'System',
        lastName: 'Administrator',
        department: 'IT'
      }
    });

    console.log('Created admin user:', adminUser.username);

    // Create lecturers
    const lecturers = [
      {
        username: 'lecturer1',
        email: 'lecturer1@vigilearn.com',
        password: 'lecturer123',
        role: 'lecturer',
        profile: {
          firstName: 'John',
          lastName: 'Smith',
          department: 'Computer Science'
        }
      },
      {
        username: 'lecturer2',
        email: 'lecturer2@vigilearn.com',
        password: 'lecturer123',
        role: 'lecturer',
        profile: {
          firstName: 'Jane',
          lastName: 'Johnson',
          department: 'Mathematics'
        }
      },
      {
        username: 'lecturer3',
        email: 'lecturer3@vigilearn.com',
        password: 'lecturer123',
        role: 'lecturer',
        profile: {
          firstName: 'Robert',
          lastName: 'Brown',
          department: 'Physics'
        }
      },
      {
        username: 'lecturer4',
        email: 'lecturer4@vigilearn.com',
        password: 'lecturer123',
        role: 'lecturer',
        profile: {
          firstName: 'Sarah',
          lastName: 'Davis',
          department: 'Chemistry'
        }
      }
    ];

    const createdLecturers = [];
    for (const lecturerData of lecturers) {
      const lecturer = await User.create(lecturerData);
      createdLecturers.push(lecturer);
      console.log('Created lecturer:', lecturer.username);
    }

    // Create students
    const students = [
      {
        username: 'student1',
        email: 'student1@vigilearn.com',
        password: 'student123',
        role: 'student',
        profile: {
          firstName: 'Alice',
          lastName: 'Wilson',
          department: 'Computer Science'
        }
      },
      {
        username: 'student2',
        email: 'student2@vigilearn.com',
        password: 'student123',
        role: 'student',
        profile: {
          firstName: 'Bob',
          lastName: 'Miller',
          department: 'Mathematics'
        }
      },
      {
        username: 'student3',
        email: 'student3@vigilearn.com',
        password: 'student123',
        role: 'student',
        profile: {
          firstName: 'Charlie',
          lastName: 'Taylor',
          department: 'Physics'
        }
      }
    ];

    const createdStudents = [];
    for (const studentData of students) {
      const student = await User.create(studentData);
      createdStudents.push(student);
      console.log('Created student:', student.username);
    }

    // Create courses
    const courses = [
      {
        code: 'CS101',
        name: 'Introduction to Computer Science',
        lecturer: createdLecturers[0].id
      },
      {
        code: 'CS201',
        name: 'Data Structures and Algorithms',
        lecturer: createdLecturers[0].id
      },
      {
        code: 'MATH101',
        name: 'Calculus I',
        lecturer: createdLecturers[1].id
      },
      {
        code: 'MATH201',
        name: 'Calculus II',
        lecturer: createdLecturers[1].id
      },
      {
        code: 'PHY101',
        name: 'Introduction to Physics',
        lecturer: createdLecturers[2].id
      },
      {
        code: 'PHY201',
        name: 'Classical Mechanics',
        lecturer: createdLecturers[2].id
      },
      {
        code: 'CHEM101',
        name: 'General Chemistry',
        lecturer: createdLecturers[3].id
      },
      {
        code: 'CHEM201',
        name: 'Organic Chemistry',
        lecturer: createdLecturers[3].id
      }
    ];

    const createdCourses = [];
    for (const courseData of courses) {
      const course = await Course.create(courseData);
      createdCourses.push(course);
      console.log('Created course:', course.code);
    }

    // Enroll students in courses
    for (const student of createdStudents) {
      // Enroll each student in 3-4 courses
      const coursesToEnroll = createdCourses.slice(0, 4);
      for (const course of coursesToEnroll) {
        await Course.enrollStudent(course.id, student.id);
        console.log(`Enrolled ${student.username} in ${course.code}`);
      }
    }

    console.log('Database seeded successfully!');
    console.log('\nLogin Credentials:');
    console.log('Admin: admin / admin123');
    console.log('Lecturers: lecturer1-4 / lecturer123');
    console.log('Students: student1-3 / student123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData();
