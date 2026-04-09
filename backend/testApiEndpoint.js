const express = require('express');
const { getQuery } = require('./config/database');

// Simulate the API endpoint without authentication
async function testApiEndpoint() {
  try {
    console.log('Testing API endpoint logic...');
    
    const studentId = 6; // Simulate logged-in student
    
    // Get assignments from student's enrolled courses
    const assignmentsQuery = `
      SELECT a.id, a.title, a.description, a.dueDate, a.maxScore, a.createdAt,
             c.code as courseCode, c.name as courseName,
             asub.score, asub.feedback, asub.submittedAt, asub.file,
             CASE 
               WHEN asub.submittedAt IS NOT NULL THEN 
                 CASE 
                   WHEN asub.score IS NOT NULL THEN 'graded'
                   ELSE 'submitted'
                 END
               WHEN a.dueDate < datetime('now') THEN 'overdue'
               ELSE 'pending'
             END as status
      FROM assignments a
      INNER JOIN courses c ON a.courseId = c.id
      INNER JOIN course_enrollments ce ON c.id = ce.courseId
      LEFT JOIN assignment_submissions asub ON a.id = asub.assignmentId AND asub.studentId = ?
      WHERE ce.studentId = ? AND c.isActive = 1 AND a.isActive = 1
      ORDER BY a.dueDate ASC
    `;
    
    const assignments = await getQuery(assignmentsQuery, [studentId, studentId]);
    
    // Calculate statistics
    const stats = {
      total: assignments.length,
      submitted: assignments.filter(a => a.status === 'submitted' || a.status === 'graded').length,
      pending: assignments.filter(a => a.status === 'pending').length,
      overdue: assignments.filter(a => a.status === 'overdue').length,
      graded: assignments.filter(a => a.status === 'graded').length
    };
    
    // Format assignments for frontend
    const formattedAssignments = assignments.map(assignment => ({
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      course: assignment.courseCode,
      courseName: assignment.courseName,
      type: 'Assignment',
      dueDate: assignment.dueDate,
      status: assignment.status,
      submittedDate: assignment.submittedAt || '--',
      score: assignment.score !== null ? assignment.score : '--',
      maxScore: assignment.maxScore,
      feedback: assignment.feedback,
      file: assignment.file,
      daysRemaining: Math.ceil((new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
    }));
    
    const response = {
      success: true,
      assignments: formattedAssignments,
      stats
    };
    
    console.log('API Response Summary:');
    console.log('- Success:', response.success);
    console.log('- Total assignments:', response.assignments.length);
    console.log('- Stats:', response.stats);
    console.log('- First assignment:', response.assignments[0] ? {
      id: response.assignments[0].id,
      title: response.assignments[0].title,
      course: response.assignments[0].course,
      status: response.assignments[0].status
    } : 'None');
    
    // Test if the response matches what frontend expects
    console.log('\nFrontend compatibility check:');
    console.log('- Has success field:', 'success' in response);
    console.log('- Has assignments array:', Array.isArray(response.assignments));
    console.log('- Has stats object:', typeof response.stats === 'object');
    console.log('- Assignment has required fields:', response.assignments.length > 0 ? {
      id: 'id' in response.assignments[0],
      title: 'title' in response.assignments[0],
      course: 'course' in response.assignments[0],
      status: 'status' in response.assignments[0]
    } : 'No assignments');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testApiEndpoint();
