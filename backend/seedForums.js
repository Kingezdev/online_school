const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Sample forums data
const forums = [
  {
    courseId: 1, // Introduction to Computer Science
    title: 'General Discussion',
    description: 'A place for general questions and discussions about the course'
  },
  {
    courseId: 1, // Introduction to Computer Science
    title: 'Assignment Help',
    description: 'Get help with assignments and discuss solutions'
  },
  {
    courseId: 2, // Advanced Mathematics
    title: 'Study Groups',
    description: 'Organize and join study groups for this course'
  },
  {
    courseId: 2, // Advanced Mathematics
    title: 'Problem Solving',
    description: 'Share and discuss challenging problems and solutions'
  },
  {
    courseId: 3, // Web Development
    title: 'Project Showcase',
    description: 'Share your web development projects and get feedback'
  }
];

// Sample forum posts data
const forumPosts = [
  {
    forumId: 1,
    authorId: 2, // Student
    content: 'Hello everyone! I\'m excited to be part of this course. Does anyone have tips for getting started with programming?'
  },
  {
    forumId: 1,
    authorId: 3, // Lecturer
    content: 'Welcome to the course! My advice is to start with the basics and practice consistently. Don\'t hesitate to ask questions in this forum.'
  },
  {
    forumId: 2,
    authorId: 2, // Student
    content: 'I\'m having trouble with the first assignment. Can someone explain how to approach the recursion problem?'
  },
  {
    forumId: 2,
    authorId: 4, // Another Student
    content: 'For the recursion problem, try to think about the base case first. What\'s the simplest scenario where you don\'t need to call the function again?'
  },
  {
    forumId: 3,
    authorId: 4, // Student
    content: 'Is anyone interested in forming a study group for the upcoming midterm? I\'m available on weekends.'
  },
  {
    forumId: 3,
    authorId: 5, // Another Student
    content: 'Count me in! I think a study group would be really helpful. How about meeting on Saturday afternoons?'
  },
  {
    forumId: 4,
    authorId: 3, // Lecturer
    content: 'Here\'s a challenging problem for you all: Prove that the square root of 2 is irrational. This is a classic proof that demonstrates important mathematical concepts.'
  },
  {
    forumId: 5,
    authorId: 2, // Student
    content: 'I just finished my first web project! It\'s a simple portfolio website using HTML, CSS, and JavaScript. Would love to get some feedback from the class.'
  },
  {
    forumId: 5,
    authorId: 4, // Student
    content: 'Great work on the portfolio! I\'d suggest adding more interactive elements and maybe a contact form. The design looks clean and professional.'
  }
];

// Sample forum replies data
const forumReplies = [
  {
    postId: 1,
    authorId: 4, // Student
    content: 'Great question! I\'d recommend starting with Python as it\'s beginner-friendly. Also, try to code a little every day rather than cramming.'
  },
  {
    postId: 1,
    authorId: 5, // Student
    content: 'I agree with the Python suggestion. There are lots of great tutorials online. Don\'t be afraid to make mistakes - that\'s how you learn!'
  },
  {
    postId: 3,
    authorId: 3, // Lecturer
    content: 'Good question! The key to recursion is identifying the pattern. For this problem, think about how you can break down a larger problem into smaller, similar problems.'
  },
  {
    postId: 3,
    authorId: 5, // Student
    content: 'I struggled with recursion too. What helped me was drawing out the call stack and tracing through a few examples manually.'
  },
  {
    postId: 5,
    authorId: 4, // Student
    content: 'Saturday afternoons work perfectly for me! Should we meet in the library or online?'
  },
  {
    postId: 5,
    authorId: 2, // Student
    content: 'Library would be great! We can book one of the study rooms. What time works best for everyone?'
  },
  {
    postId: 7,
    authorId: 2, // Student
    content: 'I remember this proof from high school! It uses contradiction, right? You assume the opposite and show it leads to a contradiction.'
  },
  {
    postId: 7,
    authorId: 4, // Student
    content: 'Yes, it\'s a proof by contradiction. The key insight is that if sqrt(2) were rational, it could be written as a fraction in lowest terms, but that leads to both numbers being even, which contradicts the "lowest terms" assumption.'
  },
  {
    postId: 8,
    authorId: 5, // Student
    content: 'Nice work! I\'d suggest adding some animations to make it more engaging. Also, consider making it responsive for mobile devices.'
  },
  {
    postId: 8,
    authorId: 3, // Lecturer
    content: 'Excellent work! This is a great foundation. I\'d encourage you to explore modern CSS frameworks like Tailwind or Bootstrap, and perhaps try a JavaScript framework like React or Vue for your next project.'
  }
];

// Clear existing data and insert new data
async function seedForums() {
  try {
    // Clear existing forums, posts, and replies
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM forum_replies', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    await new Promise((resolve, reject) => {
      db.run('DELETE FROM forum_posts', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    await new Promise((resolve, reject) => {
      db.run('DELETE FROM forums', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('Cleared existing forum data');

    // Insert forums
    for (const forum of forums) {
      await new Promise((resolve, reject) => {
        const query = `
          INSERT INTO forums (courseId, title, description, createdAt, updatedAt)
          VALUES (?, ?, ?, datetime('now'), datetime('now'))
        `;

        db.run(query, [forum.courseId, forum.title, forum.description], function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        });
      });
    }

    console.log('Inserted forums');

    // Insert forum posts
    for (const post of forumPosts) {
      await new Promise((resolve, reject) => {
        const query = `
          INSERT INTO forum_posts (forumId, author, content, createdAt)
          VALUES (?, ?, ?, datetime('now', '-${Math.floor(Math.random() * 7)} days'))
        `;

        db.run(query, [post.forumId, post.authorId, post.content], function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        });
      });
    }

    console.log('Inserted forum posts');

    // Insert forum replies
    for (const reply of forumReplies) {
      await new Promise((resolve, reject) => {
        const query = `
          INSERT INTO forum_replies (postId, author, content, createdAt)
          VALUES (?, ?, ?, datetime('now', '-${Math.floor(Math.random() * 5)} days'))
        `;

        db.run(query, [reply.postId, reply.authorId, reply.content], function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        });
      });
    }

    console.log('Inserted forum replies');
    console.log('Successfully seeded forum data');
  } catch (error) {
    console.error('Error seeding forums:', error);
  } finally {
    db.close();
  }
}

// Run the seeding
seedForums();
