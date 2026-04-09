const { getQuery, getSingle, runQuery, getAll } = require('../config/database');
const crypto = require('crypto');

// @desc    Get attendance records
// @route   GET /api/attendance/:courseId
// @access  Private/Lecturer/Admin
const getAttendance = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Verify course exists and user has access
    const courseQuery = 'SELECT id, lecturer FROM courses WHERE id = ? AND isActive = 1';
    const course = await getSingle(courseQuery, [courseId]);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check permissions
    if (req.user.role === 'lecturer') {
      if (course.lecturer !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get attendance records for this course
    const attendanceQuery = `
      SELECT a.id, a.date, a.createdAt, a.markedBy,
             u.username as markedByUsername, u.profile_firstName as markedByFirstName, u.profile_lastName as markedByLastName,
             COUNT(ae.studentId) as presentCount
      FROM attendance a
      LEFT JOIN users u ON a.markedBy = u.id
      LEFT JOIN attendance_entries ae ON a.id = ae.attendanceId AND ae.isPresent = 1
      WHERE a.courseId = ?
      GROUP BY a.id
      ORDER BY a.date DESC
    `;
    
    const attendanceRecords = await getQuery(attendanceQuery, [courseId]);

    // Get course info with student count
    const courseInfoQuery = `
      SELECT c.id, c.code, c.name, c.lecturer,
             COUNT(ce.studentId) as totalStudents
      FROM courses c
      LEFT JOIN course_enrollments ce ON c.id = ce.courseId
      WHERE c.id = ? AND c.isActive = 1
      GROUP BY c.id
    `;
    
    const courseInfo = await getSingle(courseInfoQuery, [courseId]);

    res.json({
      success: true,
      course: {
        id: courseInfo.id,
        code: courseInfo.code,
        name: courseInfo.name,
        totalStudents: courseInfo.totalStudents
      },
      attendanceRecords
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark attendance
// @route   POST /api/attendance/:courseId
// @access  Private/Lecturer
const markAttendance = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { date, presentStudents } = req.body;

    // Verify course exists and lecturer owns it
    const courseQuery = 'SELECT id, lecturer FROM courses WHERE id = ? AND isActive = 1';
    const course = await getSingle(courseQuery, [courseId]);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.lecturer !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if attendance already marked for this date
    const existingQuery = 'SELECT id FROM attendance WHERE courseId = ? AND date = ? AND isActive = 1';
    const existingAttendance = await getSingle(existingQuery, [courseId, date]);

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for this date' });
    }

    // Validate present students are enrolled in course
    const enrollmentQuery = `
      SELECT studentId FROM course_enrollments 
      WHERE courseId = ? AND studentId IN (${presentStudents.map(() => '?').join(',')})
    `;
    const enrolledStudents = await getQuery(enrollmentQuery, [courseId, ...presentStudents]);

    if (enrolledStudents.length !== presentStudents.length) {
      return res.status(400).json({ message: 'Some students are not enrolled in this course' });
    }

    // Create attendance record
    const insertQuery = `
      INSERT INTO attendance (courseId, date, markedBy, isActive, createdAt, updatedAt)
      VALUES (?, ?, ?, 1, datetime('now'), datetime('now'))
    `;
    
    const result = await runQuery(insertQuery, [courseId, date, req.user.id]);

    // Create attendance entries for present students
    for (const studentId of presentStudents) {
      const entryQuery = `
        INSERT INTO attendance_entries (attendanceId, studentId, isPresent)
        VALUES (?, ?, 1)
      `;
      await runQuery(entryQuery, [result.lastID, studentId]);
    }

    // Get the created attendance record with details
    const selectQuery = `
      SELECT a.id, a.date, a.markedBy, a.createdAt,
             u.username as markedByUsername, u.profile_firstName as markedByFirstName, u.profile_lastName as markedByLastName,
             COUNT(ae.studentId) as presentCount
      FROM attendance a
      LEFT JOIN users u ON a.markedBy = u.id
      LEFT JOIN attendance_entries ae ON a.id = ae.attendanceId AND ae.isPresent = 1
      WHERE a.id = ?
      GROUP BY a.id
    `;
    
    const populatedAttendance = await getSingle(selectQuery, [result.lastID]);

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      attendance: populatedAttendance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private/Lecturer
const updateAttendance = async (req, res) => {
  try {
    const { presentStudents } = req.body;
    const attendanceId = req.params.id;

    // Get attendance record
    const attendanceQuery = 'SELECT id, courseId FROM attendance WHERE id = ? AND isActive = 1';
    const attendance = await getSingle(attendanceQuery, [attendanceId]);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    // Check if lecturer owns the course
    const courseQuery = 'SELECT id, lecturer FROM courses WHERE id = ?';
    const course = await getSingle(courseQuery, [attendance.courseId]);
    if (!course || course.lecturer !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Validate present students are enrolled in course
    const enrollmentQuery = `
      SELECT studentId FROM course_enrollments 
      WHERE courseId = ? AND studentId IN (${presentStudents.map(() => '?').join(',')})
    `;
    const enrolledStudents = await getQuery(enrollmentQuery, [attendance.courseId, ...presentStudents]);

    if (enrolledStudents.length !== presentStudents.length) {
      return res.status(400).json({ message: 'Some students are not enrolled in this course' });
    }

    // Delete existing attendance entries
    const deleteEntriesQuery = 'DELETE FROM attendance_entries WHERE attendanceId = ?';
    await runQuery(deleteEntriesQuery, [attendanceId]);

    // Create new attendance entries for present students
    for (const studentId of presentStudents) {
      const entryQuery = `
        INSERT INTO attendance_entries (attendanceId, studentId, isPresent)
        VALUES (?, ?, 1)
      `;
      await runQuery(entryQuery, [attendanceId, studentId]);
    }

    // Get updated attendance record with details
    const selectQuery = `
      SELECT a.id, a.date, a.markedBy, a.createdAt,
             u.username as markedByUsername, u.profile_firstName as markedByFirstName, u.profile_lastName as markedByLastName,
             COUNT(ae.studentId) as presentCount
      FROM attendance a
      LEFT JOIN users u ON a.markedBy = u.id
      LEFT JOIN attendance_entries ae ON a.id = ae.attendanceId AND ae.isPresent = 1
      WHERE a.id = ?
      GROUP BY a.id
    `;
    
    const updatedAttendance = await getSingle(selectQuery, [attendanceId]);

    res.json({
      success: true,
      message: 'Attendance updated successfully',
      attendance: updatedAttendance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Private/Lecturer/Admin
const deleteAttendance = async (req, res) => {
  try {
    const attendanceId = req.params.id;

    // Get attendance record
    const attendanceQuery = 'SELECT id, courseId FROM attendance WHERE id = ? AND isActive = 1';
    const attendance = await getSingle(attendanceQuery, [attendanceId]);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    // Check permissions
    const courseQuery = 'SELECT id, lecturer FROM courses WHERE id = ?';
    const course = await getSingle(courseQuery, [attendance.courseId]);
    if (req.user.role === 'lecturer') {
      if (!course || course.lecturer !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Soft delete attendance record
    const deleteQuery = 'UPDATE attendance SET isActive = 0, updatedAt = datetime("now") WHERE id = ?';
    await runQuery(deleteQuery, [attendanceId]);

    res.json({
      success: true,
      message: 'Attendance record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student attendance
// @route   GET /api/attendance/student/:courseId
// @access  Private/Student
const getStudentAttendance = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;
    
    // Verify course exists and student is enrolled
    const courseQuery = 'SELECT id, code, name FROM courses WHERE id = ? AND isActive = 1';
    const course = await getSingle(courseQuery, [courseId]);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if student is enrolled
    const enrollmentQuery = 'SELECT COUNT(*) as count FROM course_enrollments WHERE courseId = ? AND studentId = ?';
    const enrollment = await getSingle(enrollmentQuery, [courseId, studentId]);
    
    if (!enrollment || enrollment.count === 0) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get attendance records for this course
    const attendanceQuery = `
      SELECT a.id, a.date, a.markedBy,
             u.username as markedByUsername, u.profile_firstName as markedByFirstName, u.profile_lastName as markedByLastName,
             CASE WHEN ae.studentId IS NOT NULL THEN 1 ELSE 0 END as present
      FROM attendance a
      LEFT JOIN users u ON a.markedBy = u.id
      LEFT JOIN attendance_entries ae ON a.id = ae.attendanceId AND ae.studentId = ? AND ae.isPresent = 1
      WHERE a.courseId = ?
      ORDER BY a.date DESC
    `;
    
    const attendanceRecords = await getQuery(attendanceQuery, [studentId, courseId]);

    // Calculate student's attendance statistics
    const totalSessions = attendanceRecords.length;
    const presentSessions = attendanceRecords.filter(record => record.present === 1).length;
    const attendanceRate = totalSessions > 0 
      ? Math.round((presentSessions / totalSessions) * 100)
      : 0;

    res.json({
      success: true,
      course: {
        id: course.id,
        code: course.code,
        name: course.name
      },
      attendanceRecords: attendanceRecords.map(record => ({
        date: record.date,
        present: record.present === 1,
        markedBy: {
          username: record.markedByUsername,
          firstName: record.markedByFirstName,
          lastName: record.markedByLastName
        }
      })),
      statistics: {
        totalSessions,
        presentSessions,
        absentSessions: totalSessions - presentSessions,
        attendanceRate
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Activate QR code for attendance
// @route   POST /api/attendance/activate-qr
// @access  Private (Lecturer)
const activateQRCode = async (req, res) => {
  try {
    const { courseId, date, sessionLabel } = req.body;
    const lecturerId = req.user.id;
    
    // Verify lecturer owns the course
    const course = await getSingle('SELECT id, code FROM courses WHERE id = ? AND lecturer = ? AND isActive = 1', [courseId, lecturerId]);
    
    if (!course) {
      return res.status(403).json({ message: 'Access denied. You do not teach this course.' });
    }
    
    // Generate unique QR code data
    const qrData = {
      courseId,
      courseCode: course.code,
      date,
      sessionLabel: sessionLabel || 'Lecture',
      timestamp: new Date().toISOString(),
      type: 'attendance',
      id: crypto.randomUUID()
    };
    
    // Store QR code activation in database (create or update)
    const existingQR = await getSingle('SELECT id FROM qr_attendance WHERE courseId = ? AND date = ?', [courseId, date]);
    
    if (existingQR) {
      // Update existing QR code
      await runQuery(`
        UPDATE qr_attendance 
        SET qrData = ?, isActive = 1, expiresAt = datetime('now', '+10 minutes'), updatedAt = datetime('now')
        WHERE id = ?
      `, [JSON.stringify(qrData), existingQR.id]);
    } else {
      // Create new QR code
      await runQuery(`
        INSERT INTO qr_attendance (courseId, date, qrData, isActive, expiresAt, createdAt, updatedAt)
        VALUES (?, ?, ?, 1, datetime('now', '+10 minutes'), datetime('now'), datetime('now'))
      `, [courseId, date, JSON.stringify(qrData)]);
    }
    
    res.json({
      success: true,
      message: 'QR code activated successfully',
      qrData,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes from now
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active QR codes for a student
// @route   GET /api/attendance/active-qr
// @access  Private (Student)
const getActiveQRCodes = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    // Get courses student is enrolled in
    const enrolledCourses = await getAll(`
      SELECT c.id, c.code, c.name
      FROM courses c
      INNER JOIN course_enrollments ce ON c.id = ce.courseId
      WHERE ce.studentId = ?
    `, [studentId]);
    
    // Get active QR codes for these courses
    const activeQRCodes = [];
    
    for (const course of enrolledCourses) {
      const qrCode = await getSingle(`
        SELECT qrData, expiresAt
        FROM qr_attendance 
        WHERE courseId = ? AND isActive = 1 AND expiresAt > datetime('now')
        ORDER BY createdAt DESC
        LIMIT 1
      `, [course.id]);
      
      if (qrCode) {
        const qrData = JSON.parse(qrCode.qrData);
        
        // Check if student has already marked attendance for this QR code
        const existingAttendance = await getSingle(`
          SELECT a.id FROM attendance a
          INNER JOIN attendance_entries ae ON a.id = ae.attendanceId
          WHERE a.courseId = ? AND a.date = ? AND ae.studentId = ?
        `, [course.id, qrData.date, studentId]);
        
        activeQRCodes.push({
          ...course,
          qrData: qrData,
          expiresAt: qrCode.expiresAt,
          alreadyMarked: !!existingAttendance
        });
      }
    }
    
    res.json({
      success: true,
      activeQRCodes
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark attendance via QR code scan
// @route   POST /api/attendance/mark-qr
// @access  Private (Student)
const markAttendanceViaQR = async (req, res) => {
  try {
    const { qrData } = req.body;
    const studentId = req.user.id;
    
    // Parse and validate QR data
    let parsedQRData;
    try {
      parsedQRData = JSON.parse(qrData);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid QR code format' });
    }
    
    const { courseId, date, type, id } = parsedQRData;
    
    if (type !== 'attendance') {
      return res.status(400).json({ message: 'Invalid QR code type' });
    }
    
    // Check if QR code is still active
    const qrRecord = await getSingle(`
      SELECT expiresAt FROM qr_attendance 
      WHERE courseId = ? AND date = ? AND isActive = 1
      ORDER BY createdAt DESC
      LIMIT 1
    `, [courseId, date]);
    
    if (!qrRecord || new Date(qrRecord.expiresAt) < new Date()) {
      return res.status(400).json({ message: 'QR code has expired or is not active' });
    }
    
    // Verify student is enrolled in the course
    const enrollment = await getSingle(`
      SELECT ce.id FROM course_enrollments ce
      INNER JOIN courses c ON ce.courseId = c.id
      WHERE ce.studentId = ? AND ce.courseId = ?
    `, [studentId, courseId]);
    
    if (!enrollment) {
      return res.status(403).json({ message: 'You are not enrolled in this course' });
    }
    
    // Check if attendance already marked for this session
    const existingAttendance = await getSingle(`
      SELECT a.id FROM attendance a
      INNER JOIN attendance_entries ae ON a.id = ae.attendanceId
      WHERE a.courseId = ? AND a.date = ? AND ae.studentId = ?
    `, [courseId, date, studentId]);
    
    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for this session' });
    }
    
    // Create or get attendance session
    let attendanceSession = await getSingle(`
      SELECT id FROM attendance 
      WHERE courseId = ? AND date = ? AND isActive = 1
    `, [courseId, date]);
    
    if (!attendanceSession) {
      // Create new attendance session
      const result = await runQuery(`
        INSERT INTO attendance (courseId, date, isActive, markedBy, createdAt, updatedAt)
        VALUES (?, ?, 1, ?, datetime('now'), datetime('now'))
      `, [courseId, date, null]); // No lecturer marked it yet
      
      attendanceSession = { id: result.id };
    }
    
    // Mark attendance as present
    await runQuery(`
      INSERT INTO attendance_entries (attendanceId, studentId, isPresent, markedAt, markedBy)
      VALUES (?, ?, 1, datetime('now'), ?)
    `, [attendanceSession.id, studentId, 'student']);
    
    res.json({
      success: true,
      message: 'Attendance marked successfully'
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Deactivate QR code
// @route   POST /api/attendance/deactivate-qr
// @access  Private (Lecturer)
const deactivateQRCode = async (req, res) => {
  try {
    const { courseId, date } = req.body;
    const lecturerId = req.user.id;
    
    // Verify lecturer owns the course
    const course = await getSingle('SELECT id FROM courses WHERE id = ? AND lecturer = ? AND isActive = 1', [courseId, lecturerId]);
    
    if (!course) {
      return res.status(403).json({ message: 'Access denied. You do not teach this course.' });
    }
    
    // Deactivate QR code
    await runQuery(`
      UPDATE qr_attendance 
      SET isActive = 0, updatedAt = datetime('now')
      WHERE courseId = ? AND date = ?
    `, [courseId, date]);
    
    res.json({
      success: true,
      message: 'QR code deactivated successfully'
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAttendance,
  markAttendance,
  updateAttendance,
  deleteAttendance,
  getStudentAttendance,
  activateQRCode,
  getActiveQRCodes,
  markAttendanceViaQR,
  deactivateQRCode
};
