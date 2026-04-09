const { getQuery } = require('./config/database');

async function testCourseAPI() {
  try {
    console.log('Testing course API functionality...');
    
    // Test the same query used in the course controller for students
    const studentId = 10; // This should be a student ID from the enrollments
    
    const studentCoursesQuery = `
      SELECT c.id, c.code, c.name, c.lecturer, c.isActive, c.createdAt, c.updatedAt,
             u.username as lecturerUsername, u.profile_firstName as lecturerFirstName, u.profile_lastName as lecturerLastName
      FROM courses c
      INNER JOIN users u ON c.lecturer = u.id
      INNER JOIN course_enrollments ce ON c.id = ce.courseId
      WHERE ce.studentId = ? AND c.isActive = 1
      ORDER BY c.code ASC
    `;
    
    const studentCourses = await getQuery(studentCoursesQuery, [studentId]);
    
    console.log('Found courses for student:', studentCourses.length);
    
    if (studentCourses.length > 0) {
      console.log('First course:', studentCourses[0]);
    }
    
    // Test the query for lecturers
    const lecturerId = 5; // This should be a lecturer ID
    
    const lecturerCoursesQuery = `
      SELECT c.id, c.code, c.name, c.lecturer, c.isActive, c.createdAt, c.updatedAt,
             u.username as lecturerUsername, u.profile_firstName as lecturerFirstName, u.profile_lastName as lecturerLastName,
             COUNT(ce.studentId) as studentCount
      FROM courses c
      INNER JOIN users u ON c.lecturer = u.id
      LEFT JOIN course_enrollments ce ON c.id = ce.courseId
      WHERE c.lecturer = ? AND c.isActive = 1
      GROUP BY c.id
      ORDER BY c.code ASC
    `;
    
    const lecturerCourses = await getQuery(lecturerCoursesQuery, [lecturerId]);
    
    console.log('Found courses for lecturer:', lecturerCourses.length);
    
    if (lecturerCourses.length > 0) {
      console.log('First course:', lecturerCourses[0]);
    }
    
    // Test the query for admins (all courses)
    const allCoursesQuery = `
      SELECT c.id, c.code, c.name, c.lecturer, c.isActive, c.createdAt, c.updatedAt,
             u.username as lecturerUsername, u.profile_firstName as lecturerFirstName, u.profile_lastName as lecturerLastName,
             COUNT(ce.studentId) as studentCount
      FROM courses c
      INNER JOIN users u ON c.lecturer = u.id
      LEFT JOIN course_enrollments ce ON c.id = ce.courseId
      WHERE c.isActive = 1
      GROUP BY c.id
      ORDER BY c.code ASC
    `;
    
    const allCourses = await getQuery(allCoursesQuery);
    
    console.log('Found all courses:', allCourses.length);
    
    if (allCourses.length > 0) {
      console.log('First course:', allCourses[0]);
    }
    
    // Format response similar to the API
    const apiResponse = {
      success: true,
      count: studentCourses.length,
      courses: studentCourses
    };
    
    console.log('API Response Summary:');
    console.log('- Success:', apiResponse.success);
    console.log('- Count:', apiResponse.count);
    console.log('- First course code:', apiResponse.courses[0]?.code || 'N/A');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testCourseAPI();
