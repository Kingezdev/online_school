const { getQuery, getSingle, runQuery } = require('../config/database');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/assignments/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept common document types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'image/jpeg',
      'image/png'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, Word, Excel, text files and images are allowed.'), false);
    }
  }
});

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private
const getAssignments = async (req, res) => {
  try {
    let assignments;
    
    if (req.user.role === 'student') {
      // Students get assignments from their enrolled courses
      const assignmentsQuery = `
        SELECT a.id, a.title, a.description, a.dueDate, a.maxScore, a.isActive, a.createdAt, a.updatedAt,
               c.code as courseCode, c.name as courseName,
               u.username as lecturerUsername, u.profile_firstName as lecturerFirstName, u.profile_lastName as lecturerLastName
        FROM assignments a
        INNER JOIN courses c ON a.courseId = c.id
        INNER JOIN users u ON a.lecturer = u.id
        INNER JOIN course_enrollments ce ON c.id = ce.courseId
        WHERE ce.studentId = ? AND c.isActive = 1 AND a.isActive = 1
        ORDER BY a.dueDate ASC
      `;
      
      assignments = await getQuery(assignmentsQuery, [req.user.id]);
    } else if (req.user.role === 'lecturer') {
      // Lecturers get assignments from their courses
      const assignmentsQuery = `
        SELECT a.id, a.title, a.description, a.dueDate, a.maxScore, a.isActive, a.createdAt, a.updatedAt,
               c.code as courseCode, c.name as courseName,
               COUNT(asub.id) as submissionCount
        FROM assignments a
        INNER JOIN courses c ON a.courseId = c.id
        LEFT JOIN assignment_submissions asub ON a.id = asub.assignmentId
        WHERE a.lecturer = ? AND c.isActive = 1 AND a.isActive = 1
        GROUP BY a.id
        ORDER BY a.dueDate ASC
      `;
      
      assignments = await getQuery(assignmentsQuery, [req.user.id]);
    } else {
      // Admins get all assignments
      const assignmentsQuery = `
        SELECT a.id, a.title, a.description, a.dueDate, a.maxScore, a.isActive, a.createdAt, a.updatedAt,
               c.code as courseCode, c.name as courseName,
               u.username as lecturerUsername, u.profile_firstName as lecturerFirstName, u.profile_lastName as lecturerLastName,
               COUNT(asub.id) as submissionCount
        FROM assignments a
        INNER JOIN courses c ON a.courseId = c.id
        INNER JOIN users u ON a.lecturer = u.id
        LEFT JOIN assignment_submissions asub ON a.id = asub.assignmentId
        WHERE c.isActive = 1 AND a.isActive = 1
        GROUP BY a.id
        ORDER BY a.dueDate ASC
      `;
      
      assignments = await getQuery(assignmentsQuery);
    }

    // Format assignments for response
    const formattedAssignments = assignments.map(assignment => ({
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      maxScore: assignment.maxScore,
      isActive: assignment.isActive,
      createdAt: assignment.createdAt,
      updatedAt: assignment.updatedAt,
      course: {
        code: assignment.courseCode,
        name: assignment.courseName
      },
      lecturer: {
        username: assignment.lecturerUsername,
        firstName: assignment.lecturerFirstName,
        lastName: assignment.lecturerLastName
      },
      submissionCount: assignment.submissionCount || 0
    }));

    res.json({
      success: true,
      count: formattedAssignments.length,
      assignments: formattedAssignments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single assignment
// @route   GET /api/assignments/:id
// @access  Private
const getAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    
    // Get assignment with course and lecturer details
    const assignmentQuery = `
      SELECT a.id, a.title, a.description, a.dueDate, a.maxScore, a.isActive, a.createdAt, a.updatedAt,
             c.code as courseCode, c.name as courseName, c.id as courseId,
             u.username as lecturerUsername, u.profile_firstName as lecturerFirstName, u.profile_lastName as lecturerLastName, u.id as lecturerId
      FROM assignments a
      INNER JOIN courses c ON a.courseId = c.id
      INNER JOIN users u ON a.lecturer = u.id
      WHERE a.id = ? AND c.isActive = 1 AND a.isActive = 1
    `;
    
    const assignment = await getSingle(assignmentQuery, [assignmentId]);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if user has access to this assignment
    if (req.user.role === 'student') {
      // Students can only view assignments from their enrolled courses
      const enrollmentQuery = `
        SELECT id FROM course_enrollments
        WHERE studentId = ? AND courseId = ?
      `;
      
      const enrollment = await getSingle(enrollmentQuery, [req.user.id, assignment.courseId]);
      if (!enrollment) {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else if (req.user.role === 'lecturer') {
      // Lecturers can only view assignments from their courses
      if (assignment.lecturerId !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    // Get submissions if lecturer or admin
    let submissions = [];
    if (req.user.role === 'lecturer' || req.user.role === 'admin') {
      const submissionsQuery = `
        SELECT asub.id, asub.score, asub.feedback, asub.submittedAt, asub.file,
               u.username as studentUsername, u.profile_firstName as studentFirstName, u.profile_lastName as studentLastName
        FROM assignment_submissions asub
        INNER JOIN users u ON asub.studentId = u.id
        WHERE asub.assignmentId = ?
        ORDER BY asub.submittedAt DESC
      `;
      
      submissions = await getQuery(submissionsQuery, [assignmentId]);
    }

    // Format assignment for response
    const formattedAssignment = {
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      maxScore: assignment.maxScore,
      isActive: assignment.isActive,
      createdAt: assignment.createdAt,
      updatedAt: assignment.updatedAt,
      course: {
        id: assignment.courseId,
        code: assignment.courseCode,
        name: assignment.courseName
      },
      lecturer: {
        id: assignment.lecturerId,
        username: assignment.lecturerUsername,
        firstName: assignment.lecturerFirstName,
        lastName: assignment.lecturerLastName
      },
      submissions: submissions.map(sub => ({
        id: sub.id,
        score: sub.score,
        feedback: sub.feedback,
        submittedAt: sub.submittedAt,
        file: sub.file,
        student: {
          username: sub.studentUsername,
          firstName: sub.studentFirstName,
          lastName: sub.studentLastName
        }
      }))
    };

    res.json({
      success: true,
      assignment: formattedAssignment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create assignment
// @route   POST /api/assignments
// @access  Private/Lecturer
const createAssignment = async (req, res) => {
  try {
    const { title, description, courseId, dueDate, maxScore } = req.body;

    // Verify course exists and lecturer owns it
    const courseQuery = `
      SELECT id, code, name, lecturer FROM courses
      WHERE id = ? AND isActive = 1
    `;
    
    const course = await getSingle(courseQuery, [courseId]);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.lecturer !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Create assignment
    const assignmentQuery = `
      INSERT INTO assignments (title, description, courseId, lecturer, dueDate, maxScore, isActive, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
    `;
    
    await runQuery(assignmentQuery, [title, description, courseId, req.user.id, dueDate, maxScore]);

    // Get the created assignment
    const newAssignmentQuery = `
      SELECT a.id, a.title, a.description, a.dueDate, a.maxScore, a.isActive, a.createdAt, a.updatedAt,
             c.code as courseCode, c.name as courseName,
             u.username as lecturerUsername, u.profile_firstName as lecturerFirstName, u.profile_lastName as lecturerLastName
      FROM assignments a
      INNER JOIN courses c ON a.courseId = c.id
      INNER JOIN users u ON a.lecturer = u.id
      WHERE a.id = last_insert_rowid()
    `;
    
    const newAssignment = await getSingle(newAssignmentQuery);

    res.status(201).json({
      success: true,
      assignment: {
        id: newAssignment.id,
        title: newAssignment.title,
        description: newAssignment.description,
        dueDate: newAssignment.dueDate,
        maxScore: newAssignment.maxScore,
        isActive: newAssignment.isActive,
        createdAt: newAssignment.createdAt,
        updatedAt: newAssignment.updatedAt,
        course: {
          code: newAssignment.courseCode,
          name: newAssignment.courseName
        },
        lecturer: {
          username: newAssignment.lecturerUsername,
          firstName: newAssignment.lecturerFirstName,
          lastName: newAssignment.lecturerLastName
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private/Lecturer
const updateAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const { title, description, dueDate, maxScore } = req.body;

    // Check if assignment exists and lecturer owns it
    const assignmentQuery = `
      SELECT id, lecturer FROM assignments
      WHERE id = ? AND isActive = 1
    `;
    
    const assignment = await getSingle(assignmentQuery, [assignmentId]);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if lecturer owns the assignment
    if (assignment.lecturer !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update assignment
    const updateQuery = `
      UPDATE assignments
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          dueDate = COALESCE(?, dueDate),
          maxScore = COALESCE(?, maxScore),
          updatedAt = datetime('now')
      WHERE id = ?
    `;
    
    await runQuery(updateQuery, [title, description, dueDate, maxScore, assignmentId]);

    // Get updated assignment
    const updatedAssignmentQuery = `
      SELECT a.id, a.title, a.description, a.dueDate, a.maxScore, a.isActive, a.createdAt, a.updatedAt,
             c.code as courseCode, c.name as courseName,
             u.username as lecturerUsername, u.profile_firstName as lecturerFirstName, u.profile_lastName as lecturerLastName
      FROM assignments a
      INNER JOIN courses c ON a.courseId = c.id
      INNER JOIN users u ON a.lecturer = u.id
      WHERE a.id = ?
    `;
    
    const updatedAssignment = await getSingle(updatedAssignmentQuery, [assignmentId]);

    res.json({
      success: true,
      assignment: {
        id: updatedAssignment.id,
        title: updatedAssignment.title,
        description: updatedAssignment.description,
        dueDate: updatedAssignment.dueDate,
        maxScore: updatedAssignment.maxScore,
        isActive: updatedAssignment.isActive,
        createdAt: updatedAssignment.createdAt,
        updatedAt: updatedAssignment.updatedAt,
        course: {
          code: updatedAssignment.courseCode,
          name: updatedAssignment.courseName
        },
        lecturer: {
          username: updatedAssignment.lecturerUsername,
          firstName: updatedAssignment.lecturerFirstName,
          lastName: updatedAssignment.lecturerLastName
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private/Lecturer
const deleteAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;

    // Check if assignment exists and lecturer owns it
    const assignmentQuery = `
      SELECT id, lecturer FROM assignments
      WHERE id = ? AND isActive = 1
    `;
    
    const assignment = await getSingle(assignmentQuery, [assignmentId]);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if lecturer owns the assignment
    if (assignment.lecturer !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Soft delete by setting isActive to false
    const deleteQuery = `
      UPDATE assignments
      SET isActive = 0, updatedAt = datetime('now')
      WHERE id = ?
    `;
    
    await runQuery(deleteQuery, [assignmentId]);

    res.json({
      success: true,
      message: 'Assignment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit assignment
// @route   POST /api/assignments/:id/submit
// @access  Private/Student
const submitAssignment = upload.single('file', async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const { text } = req.body;

    // Check if assignment exists
    const assignmentQuery = `
      SELECT a.id, a.courseId, a.dueDate
      FROM assignments a
      INNER JOIN courses c ON a.courseId = c.id
      WHERE a.id = ? AND c.isActive = 1 AND a.isActive = 1
    `;
    
    const assignment = await getSingle(assignmentQuery, [assignmentId]);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if student is enrolled in the course
    const enrollmentQuery = `
      SELECT id FROM course_enrollments
      WHERE studentId = ? AND courseId = ?
    `;
    
    const enrollment = await getSingle(enrollmentQuery, [req.user.id, assignment.courseId]);
    if (!enrollment) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if already submitted
    const existingSubmissionQuery = `
      SELECT id FROM assignment_submissions
      WHERE assignmentId = ? AND studentId = ?
    `;
    
    const existingSubmission = await getSingle(existingSubmissionQuery, [assignmentId, req.user.id]);

    if (existingSubmission) {
      return res.status(400).json({ message: 'Assignment already submitted' });
    }

    // Create submission
    const submissionQuery = `
      INSERT INTO assignment_submissions (assignmentId, studentId, file, text, submittedAt)
      VALUES (?, ?, ?, ?, datetime('now'))
    `;
    
    await runQuery(submissionQuery, [
      assignmentId,
      req.user.id,
      req.file ? req.file.path : null,
      text || null
    ]);

    // Get the created submission
    const newSubmissionQuery = `
      SELECT asub.id, asub.file, asub.text, asub.submittedAt,
             u.username as studentUsername, u.profile_firstName as studentFirstName, u.profile_lastName as studentLastName
      FROM assignment_submissions asub
      INNER JOIN users u ON asub.studentId = u.id
      WHERE asub.assignmentId = ? AND asub.studentId = ?
    `;
    
    const newSubmission = await getSingle(newSubmissionQuery, [assignmentId, req.user.id]);

    res.status(201).json({
      success: true,
      submission: {
        id: newSubmission.id,
        file: newSubmission.file,
        text: newSubmission.text,
        submittedAt: newSubmission.submittedAt,
        student: {
          username: newSubmission.studentUsername,
          firstName: newSubmission.studentFirstName,
          lastName: newSubmission.studentLastName
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Grade assignment
// @route   PUT /api/assignments/:id/grade
// @access  Private/Lecturer
const gradeAssignment = async (req, res) => {
  try {
    const { studentId, score, feedback } = req.body;
    const assignmentQuery = 'SELECT * FROM assignments WHERE id = ? AND isActive = 1';
    const assignment = await getSingle(assignmentQuery, [req.params.id]);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if lecturer owns the assignment
    if (assignment.lecturer !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Find student submission
    const submissionQuery = 'SELECT * FROM assignment_submissions WHERE assignmentId = ? AND studentId = ?';
    const submission = await getSingle(submissionQuery, [req.params.id, studentId]);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Update submission with grade
    const updateSubmissionQuery = `
      UPDATE assignment_submissions 
      SET score = ?, feedback = ?, updatedAt = datetime('now')
      WHERE assignmentId = ? AND studentId = ?
    `;
    await runQuery(updateSubmissionQuery, [Math.min(score, assignment.maxScore), feedback, req.params.id, studentId]);

    const updatedAssignmentQuery = `
      SELECT a.id, a.title, a.description, a.dueDate, a.courseId, a.isActive, a.createdAt,
             c.code as courseCode, c.name as courseName
      FROM assignments a
      INNER JOIN courses c ON a.courseId = c.id
      WHERE a.id = ? AND a.isActive = 1
    `;
    const updatedAssignment = await getSingle(updatedAssignmentQuery, [req.params.id]);

    res.json({
      success: true,
      message: 'Assignment graded successfully',
      assignment: updatedAssignment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeAssignment
};
