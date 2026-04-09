const express = require('express');

async function testRouteRegistration() {
  try {
    console.log('Testing route registration...');
    
    // Create a test app similar to the main server
    const app = express();
    
    // Add the student assignments route
    app.use('/api/assignments/student', require('./routes/studentAssignments'));
    
    // Test the route
    const request = {
      method: 'GET',
      url: '/api/assignments/student',
      headers: {
        'authorization': 'Bearer test-token'
      }
    };
    
    // Mock the route handling
    console.log('Route registered successfully');
    console.log('Available routes:', app._router.stack.map(layer => {
      if (layer.route) {
        return {
          path: layer.route.path,
          methods: Object.keys(layer.route.methods)
        };
      }
    }).filter(route => route));
    
    process.exit(0);
  } catch (error) {
    console.error('Error testing route registration:', error);
    process.exit(1);
  }
}

testRouteRegistration();
