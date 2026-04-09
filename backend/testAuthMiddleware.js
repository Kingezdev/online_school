const { getQuery } = require('./config/database');

async function testAuthMiddleware() {
  try {
    console.log('Testing authentication middleware...');
    
    // Check if the auth middleware exists and can be imported
    const { auth, authorize } = require('./middleware/auth');
    console.log('Auth middleware imported successfully');
    
    // Test the student assignments controller directly with auth
    const { getStudentAssignments } = require('./controllers/studentAssignmentsController');
    
    // Create mock request with user
    const mockReq = {
      user: { id: 10, role: 'student' }
    };
    
    // Create mock response
    let responseData = null;
    const mockRes = {
      json: (data) => {
        responseData = data;
        console.log('Response:', data);
      },
      status: (code) => ({
        json: (data) => {
          console.log('Status:', code, 'Response:', data);
          responseData = data;
        }
      })
    };
    
    // Test the controller function
    await getStudentAssignments(mockReq, mockRes);
    
    console.log('Controller test completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error testing auth middleware:', error);
    process.exit(1);
  }
}

testAuthMiddleware();
