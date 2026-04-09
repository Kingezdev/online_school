const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Sample messages data
const messages = [
  {
    senderId: 1, // Admin
    receiverId: 2, // Student
    subject: 'Welcome to the Online School System',
    content: 'Dear Student,\n\nWelcome to our online learning management system! We are excited to have you join our platform.\n\nHere are a few things to get you started:\n1. Explore your dashboard to see your courses\n2. Check the library for available resources\n3. Join forums to connect with other students\n\nIf you have any questions, please don\'t hesitate to reach out to our support team.\n\nBest regards,\nAdministration Team',
    priority: 'normal'
  },
  {
    senderId: 3, // Lecturer
    receiverId: 2, // Student
    subject: 'Assignment Due Tomorrow',
    content: 'Hi there,\n\nJust a friendly reminder that your first assignment is due tomorrow at 11:59 PM.\n\nAssignment Details:\n- Course: Introduction to Computer Science\n- Topic: Basic Algorithms and Data Structures\n- Format: PDF submission\n- Weight: 15% of final grade\n\nMake sure to submit your work on time. Late submissions will incur a penalty of 10% per day.\n\nGood luck!\n\nDr. Smith',
    priority: 'high'
  },
  {
    senderId: 2, // Student
    receiverId: 3, // Lecturer
    subject: 'Question about Assignment 1',
    content: 'Dear Dr. Smith,\n\nI have a question about the first assignment. Could you please clarify if we need to include pseudocode for our algorithms, or just the implementation?\n\nAlso, is there a specific format you prefer for the documentation?\n\nThank you for your time.\n\nBest regards,\nJohn Student',
    priority: 'normal'
  },
  {
    senderId: 1, // Admin
    receiverId: 4, // Another Student
    subject: 'System Maintenance Notice',
    content: 'Dear User,\n\nPlease be informed that our system will undergo scheduled maintenance this weekend.\n\nMaintenance Schedule:\n- Date: Saturday, April 12, 2026\n- Time: 2:00 AM - 6:00 AM EST\n- Impact: System will be unavailable during this period\n\nPlease save your work and log out before the maintenance begins.\n\nWe apologize for any inconvenience.\n\nTechnical Support Team',
    priority: 'urgent'
  },
  {
    senderId: 1, // Admin
    receiverId: 2, // Student
    subject: 'New Course Available: Web Development',
    content: 'Hello!\n\nWe\'re excited to announce a new course that\'s now available for enrollment:\n\nCourse: Modern Web Development\nInstructor: Prof. Johnson\nDuration: 12 weeks\nStart Date: May 1, 2026\n\nThis course covers:\n- HTML5 and CSS3 fundamentals\n- JavaScript and ES6+\n- React.js and modern frameworks\n- Backend development with Node.js\n- Database design and management\n\nSeats are limited, so enroll soon to secure your spot!\n\nVisit the courses section to register.\n\nBest regards,\nAcademic Department',
    priority: 'normal'
  },
  {
    senderId: 3, // Lecturer
    receiverId: 5, // Another Student
    subject: 'Great Work on Quiz 1!',
    content: 'Hi,\n\nI wanted to congratulate you on your excellent performance in Quiz 1!\n\nYour results:\n- Score: 92/100\n- Rank: Top 5% of the class\n- Strengths: Problem-solving and algorithm design\n\nKeep up the great work! Your dedication to the course is evident in your performance.\n\nIf you\'d like to discuss the quiz questions or areas for improvement, feel free to stop by during office hours.\n\nBest wishes,\nDr. Smith',
    priority: 'normal'
  },
  {
    senderId: 2, // Student
    receiverId: 4, // Another Student
    subject: 'Study Group for Final Exam',
    content: 'Hey everyone,\n\nI\'m organizing a study group for the upcoming final exam in Computer Science.\n\nDetails:\n- When: This Friday, 3:00 PM - 5:00 PM\n- Where: Library Study Room 3\n- Topics: All chapters covered this semester\n\nWe\'ll be reviewing key concepts, solving practice problems, and sharing study tips.\n\nPlease bring your notes and any questions you might have.\n\nLet me know if you can make it!\n\nJohn',
    priority: 'normal'
  },
  {
    senderId: 1, // Admin
    receiverId: 3, // Lecturer
    subject: 'Grade Submission Reminder',
    content: 'Dear Faculty Member,\n\nThis is a reminder that grades for the mid-term examinations are due by the end of this week.\n\nPlease ensure you have:\n1. Submitted all grades for your courses\n2. Added appropriate comments for student feedback\n3. Reviewed any grade appeals if applicable\n\nThe deadline is Friday, April 11, 2026 at 5:00 PM.\n\nIf you need any assistance with the grading system, please contact the IT support team.\n\nThank you for your timely attention to this matter.\n\nAcademic Affairs Office',
    priority: 'high'
  },
  {
    senderId: 3, // Lecturer
    receiverId: 2, // Student
    subject: 'Office Hours Changed This Week',
    content: 'Dear Students,\n\nPlease note that my office hours have been changed for this week only:\n\nRegular Schedule:\n- Monday: 2:00 PM - 4:00 PM\n- Wednesday: 10:00 AM - 12:00 PM\n\nThis Week Only:\n- Monday: CANCELLED (Department meeting)\n- Wednesday: 2:00 PM - 4:00 PM (Rescheduled)\n- Thursday: 10:00 AM - 12:00 PM (Additional session)\n\nI apologize for any inconvenience this may cause. Please plan accordingly.\n\nBest regards,\nDr. Smith',
    priority: 'normal'
  },
  {
    senderId: 2, // Student
    receiverId: 1, // Admin
    subject: 'Issue with Course Registration',
    content: 'Dear Administrator,\n\nI\'m having trouble registering for the "Advanced Mathematics" course for next semester.\n\nThe system shows an error message: "Prerequisites not met" even though I have completed all the required courses.\n\nMy student ID: STU002\nRequired courses completed: Calculus I, Calculus II, Linear Algebra\n\nCould you please look into this issue? I need this course for my graduation requirements.\n\nThank you for your help.\n\nSincerely,\nJohn Student',
    priority: 'high'
  }
];

// Clear existing messages and insert new ones
async function seedMessages() {
  try {
    // Clear existing messages
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM messages', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('Cleared existing messages');

    // Insert new messages
    for (const message of messages) {
      await new Promise((resolve, reject) => {
        const query = `
          INSERT INTO messages (
            sender_id, receiver_id, subject, content, priority, 
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, datetime('now', '-${Math.floor(Math.random() * 30)} days'), datetime('now'))
        `;

        db.run(query, [
          message.senderId,
          message.receiverId,
          message.subject,
          message.content,
          message.priority
        ], function(err) {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    console.log(`Successfully seeded ${messages.length} messages`);
  } catch (error) {
    console.error('Error seeding messages:', error);
  } finally {
    db.close();
  }
}

// Run the seeding
seedMessages();
