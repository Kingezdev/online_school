// Debug authentication issues
const { getSingle } = require('./config/database');

async function testAuth() {
  console.log('=== Testing Authentication ===');
  
  try {
    // Test 1: Check if lecturer users exist
    console.log('Test 1: Checking lecturer users...');
    const lecturers = await getSingle('SELECT * FROM users WHERE role = ? AND isActive = 1', ['lecturer']);
    console.log('Lecturer found:', lecturers ? {
      id: lecturers.id,
      username: lecturers.username,
      role: lecturers.role,
      profile_firstName: lecturers.profile_firstName,
      profile_lastName: lecturers.profile_lastName
    } : 'None');
    
    // Test 2: Test login endpoint with lecturer credentials
    console.log('Test 2: Testing lecturer login...');
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'lecturer1',
        password: 'lecturer1'
      })
    });
    
    const data = await response.json();
    console.log('Login response:', {
      status: response.status,
      success: data.success,
      hasToken: !!data.token,
      user: data.user ? {
        id: data.user.id,
        username: data.user.username,
        role: data.user.role,
        profile: data.user.profile
      } : null
    });
    
    // Test 3: Test API call with token
    if (data.success && data.token) {
      console.log('Test 3: Testing API call with token...');
      const apiResponse = await fetch('http://localhost:5000/api/extras/lecturer', {
        headers: {
          'Authorization': `Bearer ${data.token}`,
          'Content-Type': 'application/json',
        }
      });
      
      const apiData = await apiResponse.json();
      console.log('API response:', {
        status: apiResponse.status,
        data: apiData
      });
    }
    
    return { success: true, data };
    
  } catch (error) {
    console.error('Error in auth test:', error);
    return { success: false, error: error.message };
  }
}

// Run the test
testAuth().catch(console.error);
