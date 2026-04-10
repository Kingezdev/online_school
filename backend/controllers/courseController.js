const { getQuery, getSingle, runQuery } = require('../config/database');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
const getCourses = async (req, res) => {
  try {
    let courses;
    
    if (req.user.role === 'student') {
      // Students can only see enrolled courses
      const query = `
        SELECT c.id, c.code, c.name, c.lecturer, c.isActive, c.createdAt, c.updatedAt,
               u.username as lecturerUsername, u.profile_firstName as lecturerFirstName, u.profile_lastName as lecturerLastName
        FROM courses c
        INNER JOIN users u ON c.lecturer = u.id
        INNER JOIN course_enrollments ce ON c.id = ce.courseId
        WHERE ce.studentId = ? AND c.isActive = 1
        ORDER BY c.code ASC
      `;
      courses = await getQuery(query, [req.user.id]);
    } else if (req.user.role === 'lecturer') {
      // Lecturers can only see their courses
      const query = `
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
      courses = await getQuery(query, [req.user.id]);
    } else {
      // Admins can see all courses
      const query = `
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
      courses = await getQuery(query);
    }

    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Private
const getCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    
    // Get course with details
    const query = `
      SELECT c.id, c.code, c.name, c.lecturer, c.isActive, c.createdAt, c.updatedAt,
             u.username as lecturerUsername, u.profile_firstName as lecturerFirstName, u.profile_lastName as lecturerLastName,
             COUNT(ce.studentId) as studentCount
      FROM courses c
      INNER JOIN users u ON c.lecturer = u.id
      LEFT JOIN course_enrollments ce ON c.id = ce.courseId
      WHERE c.id = ? AND c.isActive = 1
      GROUP BY c.id
    `;
    
    const course = await getSingle(query, [courseId]);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check permissions
    if (req.user.role === 'student') {
      const enrollmentQuery = `
        SELECT COUNT(*) as count
        FROM course_enrollments ce
        WHERE ce.courseId = ? AND ce.studentId = ?
      `;
      const enrollment = await getSingle(enrollmentQuery, [courseId, req.user.id]);
      
      if (!enrollment || enrollment.count === 0) {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else if (req.user.role === 'lecturer') {
      if (course.lecturer !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Lecturer/Admin
const createCourse = async (req, res) => {
  try {
    const { code, name, lecturer } = req.body;

    // Check if course code already exists
    const existingQuery = 'SELECT id FROM courses WHERE code = ?';
    const existingCourse = await getSingle(existingQuery, [code]);
    if (existingCourse) {
      return res.status(400).json({ message: 'Course code already exists' });
    }

    // Set lecturer based on role
    let lecturerId = lecturer;
    if (req.user.role === 'lecturer') {
      lecturerId = req.user.id;
    } else if (req.user.role === 'admin' && lecturer) {
      // Verify lecturer exists and has correct role
      const lecturerQuery = 'SELECT id, role FROM users WHERE id = ? AND role = "lecturer"';
      const lecturerUser = await getSingle(lecturerQuery, [lecturer]);
      if (!lecturerUser) {
        return res.status(400).json({ message: 'Invalid lecturer' });
      }
    }

    const insertQuery = `
      INSERT INTO courses (code, name, lecturer, isActive, createdAt, updatedAt)
      VALUES (?, ?, ?, 1, datetime('now'), datetime('now'))
    `;
    
    const result = await runQuery(insertQuery, [code, name, lecturerId]);
    
    // Get the created course with lecturer info
    const selectQuery = `
      SELECT c.id, c.code, c.name, c.lecturer, c.isActive, c.createdAt, c.updatedAt,
             u.username as lecturerUsername, u.profile_firstName as lecturerFirstName, u.profile_lastName as lecturerLastName
      FROM courses c
      INNER JOIN users u ON c.lecturer = u.id
      WHERE c.id = ?
    `;
    
    const course = await getSingle(selectQuery, [result.lastID]);

    res.status(201).json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Lecturer/Admin
const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { code, name } = req.body;

    // Get course to check permissions
    const courseQuery = 'SELECT id, lecturer FROM courses WHERE id = ?';
    const course = await getSingle(courseQuery, [courseId]);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check permissions
    if (req.user.role === 'lecturer') {
      if (course.lecturer !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    // Update course
    let updateQuery, updateParams;
    
    if (req.user.role === 'admin' && req.body.lecturerId) {
      // Admin can update lecturer
      updateQuery = `
        UPDATE courses 
        SET code = COALESCE(?, code), 
            name = COALESCE(?, name),
            lecturer = COALESCE(?, lecturer),
            updatedAt = datetime('now')
        WHERE id = ?
      `;
      updateParams = [code, name, req.body.lecturerId, courseId];
    } else {
      // Regular update (no lecturer change)
      updateQuery = `
        UPDATE courses 
        SET code = COALESCE(?, code), 
            name = COALESCE(?, name), 
            updatedAt = datetime('now')
        WHERE id = ?
      `;
      updateParams = [code, name, courseId];
    }
    
    await runQuery(updateQuery, updateParams);
    
    // Get updated course with lecturer info
    const selectQuery = `
      SELECT c.id, c.code, c.name, c.lecturer, c.isActive, c.createdAt, c.updatedAt,
             u.username as lecturerUsername, u.profile_firstName as lecturerFirstName, u.profile_lastName as lecturerLastName
      FROM courses c
      INNER JOIN users u ON c.lecturer = u.id
      WHERE c.id = ?
    `;
    
    const updatedCourse = await getSingle(selectQuery, [courseId]);

    res.json({
      success: true,
      course: updatedCourse
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    // Check if course exists
    const courseQuery = 'SELECT id FROM courses WHERE id = ?';
    const course = await getSingle(courseQuery, [courseId]);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Delete course (set isActive to 0 instead of deleting)
    const deleteQuery = 'UPDATE courses SET isActive = 0, updatedAt = datetime("now") WHERE id = ?';
    await runQuery(deleteQuery, [courseId]);

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private/Student
const enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const studentId = req.user.id;

    // Get course to check if it exists and is active
    const courseQuery = 'SELECT id, isActive FROM courses WHERE id = ?';
    const course = await getSingle(courseQuery, [courseId]);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!course.isActive) {
      return res.status(400).json({ message: 'Course is not active' });
    }

    // Check if already enrolled
    const enrollmentQuery = 'SELECT COUNT(*) as count FROM course_enrollments WHERE courseId = ? AND studentId = ?';
    const enrollment = await getSingle(enrollmentQuery, [courseId, studentId]);

    if (enrollment && enrollment.count > 0) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Enroll student
    const enrollQuery = 'INSERT INTO course_enrollments (courseId, studentId, createdAt) VALUES (?, ?, datetime("now"))';
    await runQuery(enrollQuery, [courseId, studentId]);

    // Get updated course with details
    const updatedCourseQuery = `
      SELECT c.id, c.code, c.name, c.lecturer, c.isActive, c.createdAt, c.updatedAt,
             u.username as lecturerUsername, u.profile_firstName as lecturerFirstName, u.profile_lastName as lecturerLastName,
             COUNT(ce.studentId) as studentCount
      FROM courses c
      INNER JOIN users u ON c.lecturer = u.id
      LEFT JOIN course_enrollments ce ON c.id = ce.courseId
      WHERE c.id = ?
      GROUP BY c.id
    `;
    
    const updatedCourse = await getSingle(updatedCourseQuery, [courseId]);

    res.status(201).json({
      success: true,
      message: 'Enrolled successfully',
      course: updatedCourse
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unenroll from course
// @route   POST /api/courses/:id/unenroll
// @access  Private/Student
const unenrollCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const studentId = req.user.id;

    // Check if course exists
    const courseQuery = 'SELECT id FROM courses WHERE id = ?';
    const course = await getSingle(courseQuery, [courseId]);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if enrolled
    const enrollmentQuery = 'SELECT COUNT(*) as count FROM course_enrollments WHERE courseId = ? AND studentId = ?';
    const enrollment = await getSingle(enrollmentQuery, [courseId, studentId]);

    if (!enrollment || enrollment.count === 0) {
      return res.status(400).json({ message: 'Not enrolled in this course' });
    }

    // Unenroll student
    const unenrollQuery = 'DELETE FROM course_enrollments WHERE courseId = ? AND studentId = ?';
    await runQuery(unenrollQuery, [courseId, studentId]);

    res.json({
      success: true,
      message: 'Unenrolled successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign lecturer to course
// @route   POST /api/courses/:id/assign
// @access  Private/Admin
const assignLecturerToCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { lecturerId } = req.body;

    if (!lecturerId) {
      return res.status(400).json({ message: 'Lecturer ID is required' });
    }

    // Check if course exists
    const course = await getSingle('SELECT * FROM courses WHERE id = ?', [courseId]);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if lecturer exists and is actually a lecturer
    const lecturer = await getSingle('SELECT * FROM users WHERE id = ? AND role = "lecturer"', [lecturerId]);
    if (!lecturer) {
      return res.status(404).json({ message: 'Lecturer not found' });
    }

    // Update course with new lecturer
    await runQuery('UPDATE courses SET lecturer = ?, updatedAt = datetime("now") WHERE id = ?', [lecturerId, courseId]);

    // Get updated course with lecturer info
    const updatedCourse = await getSingle(`
      SELECT c.id, c.code, c.name, c.lecturer, c.isActive, c.createdAt, c.updatedAt,
             u.username as lecturerUsername, u.profile_firstName as lecturerFirstName, u.profile_lastName as lecturerLastName
      FROM courses c
      INNER JOIN users u ON c.lecturer = u.id
      WHERE c.id = ?
    `, [courseId]);

    res.json({
      success: true,
      course: updatedCourse,
      message: 'Lecturer assigned to course successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  unenrollCourse,
  assignLecturerToCourse
};
