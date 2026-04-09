// Test the register endpoint
const { getQuery, getSingle, runQuery } = require('./config/database');

async function testRegister() {
  console.log('=== Testing User Registration ===');
  
  try {
    // Test the register endpoint logic
    const username = 'testuser123';
    const email = 'test@example.com';
    const password = 'password123';
    const role = 'student';
    const profile = {
      firstName: 'Test',
      lastName: 'User',
      department: 'Computer Science'
    };

    // Check if user exists
    console.log('Step 1: Checking if user exists...');
    const existingUser = await getSingle('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existingUser) {
      console.log('User already exists, deleting...');
      await runQuery('DELETE FROM users WHERE username = ? OR email = ?', [username, email]);
    }

    // Create user
    console.log('Step 2: Creating user...');
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const insertQuery = `
      INSERT INTO users (username, email, password, role, profile_firstName, profile_lastName, profile_department, isActive, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
    `;
    const result = await runQuery(insertQuery, [username, email, hashedPassword, role, profile.firstName, profile.lastName, profile.department]);
    console.log('Insert result:', result);
    const user = await getSingle('SELECT * FROM users WHERE id = ?', [result.id]);

    console.log('User created successfully:', {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profile: {
        firstName: user.profile_firstName,
        lastName: user.profile_lastName,
        department: user.profile_department
      }
    });

    return { success: true, user };
    
  } catch (error) {
    console.error('Error in registration test:', error);
    console.error('Error details:', error.message);
    return { success: false, error: error.message };
  }
}

// Run the test
testRegister().catch(console.error);
