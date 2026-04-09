const { getQuery, getSingle, runQuery } = require('../config/database');

// @desc    Get student's assignments with submission status
// @route   GET /api/assignments/student
// @access  Private (Student)
const getStudentAssignments = async (req, res) => {
  try {
    const studentId = req.user.id;
    
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
      type: 'Assignment', // Default type, could be enhanced based on assignment properties
      dueDate: assignment.dueDate,
      status: assignment.status,
      submittedDate: assignment.submittedAt || '--',
      score: assignment.score !== null ? assignment.score : '--',
      maxScore: assignment.maxScore,
      feedback: assignment.feedback,
      file: assignment.file,
      daysRemaining: getDaysRemaining(assignment.dueDate)
    }));
    
    res.json({
      success: true,
      assignments: formattedAssignments,
      stats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single assignment details for student
// @route   GET /api/assignments/student/:id
// @access  Private (Student)
const getStudentAssignment = async (req, res) => {
  try {
    const studentId = req.user.id;
    const assignmentId = req.params.id;
    
    // Check if student is enrolled in the course
    const enrollmentQuery = `
      SELECT a.id, a.title, a.description, a.dueDate, a.maxScore, a.createdAt,
             c.code as courseCode, c.name as courseName, c.lecturer,
             asub.score, asub.feedback, asub.submittedAt, asub.file,
             u.username as lecturerUsername, u.profile_firstName as lecturerFirstName, u.profile_lastName as lecturerLastName
      FROM assignments a
      INNER JOIN courses c ON a.courseId = c.id
      INNER JOIN course_enrollments ce ON c.id = ce.courseId
      LEFT JOIN assignment_submissions asub ON a.id = asub.assignmentId AND asub.studentId = ?
      LEFT JOIN users u ON c.lecturer = u.id
      WHERE a.id = ? AND ce.studentId = ? AND c.isActive = 1 AND a.isActive = 1
    `;
    
    const assignment = await getSingle(enrollmentQuery, [studentId, assignmentId, studentId]);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found or access denied' });
    }
    
    // Determine status
    let status = 'pending';
    if (assignment.submittedAt) {
      status = assignment.score !== null ? 'graded' : 'submitted';
    } else if (new Date(assignment.dueDate) < new Date()) {
      status = 'overdue';
    }
    
    const formattedAssignment = {
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      course: assignment.courseCode,
      courseName: assignment.courseName,
      lecturer: {
        username: assignment.lecturerUsername,
        firstName: assignment.lecturerFirstName,
        lastName: assignment.lecturerLastName
      },
      type: 'Assignment',
      dueDate: assignment.dueDate,
      maxScore: assignment.maxScore,
      status: status,
      submittedDate: assignment.submittedAt || '--',
      score: assignment.score !== null ? assignment.score : '--',
      feedback: assignment.feedback,
      file: assignment.file,
      daysRemaining: getDaysRemaining(assignment.dueDate),
      createdAt: assignment.createdAt
    };
    
    res.json({
      success: true,
      assignment: formattedAssignment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit assignment
// @route   POST /api/assignments/student/:id/submit
// @access  Private (Student)
const submitAssignment = async (req, res) => {
  try {
    const studentId = req.user.id;
    const assignmentId = req.params.id;
    const { text } = req.body;
    
    // Check if student is enrolled in the course
    const enrollmentQuery = `
      SELECT a.id, a.dueDate
      FROM assignments a
      INNER JOIN courses c ON a.courseId = c.id
      INNER JOIN course_enrollments ce ON c.id = ce.courseId
      WHERE a.id = ? AND ce.studentId = ? AND c.isActive = 1 AND a.isActive = 1
    `;
    
    const assignment = await getSingle(enrollmentQuery, [assignmentId, studentId]);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found or access denied' });
    }
    
    // Check if assignment is overdue
    if (new Date(assignment.dueDate) < new Date()) {
      return res.status(400).json({ message: 'Assignment submission deadline has passed' });
    }
    
    // Check if already submitted
    const existingSubmissionQuery = `
      SELECT id FROM assignment_submissions
      WHERE assignmentId = ? AND studentId = ?
    `;
    
    const existingSubmission = await getSingle(existingSubmissionQuery, [assignmentId, studentId]);
    
    if (existingSubmission) {
      return res.status(400).json({ message: 'Assignment already submitted' });
    }
    
    // Insert submission
    const submissionQuery = `
      INSERT INTO assignment_submissions (assignmentId, studentId, text, submittedAt)
      VALUES (?, ?, ?, datetime('now'))
    `;
    
    await runQuery(submissionQuery, [assignmentId, studentId, text]);
    
    res.status(201).json({
      success: true,
      message: 'Assignment submitted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update assignment submission
// @route   PUT /api/assignments/student/:id/update
// @access  Private (Student)
const updateAssignmentSubmission = async (req, res) => {
  try {
    const studentId = req.user.id;
    const assignmentId = req.params.id;
    const { text } = req.body;
    
    // Check if student is enrolled and assignment exists
    const enrollmentQuery = `
      SELECT a.id, a.dueDate
      FROM assignments a
      INNER JOIN courses c ON a.courseId = c.id
      INNER JOIN course_enrollments ce ON c.id = ce.courseId
      WHERE a.id = ? AND ce.studentId = ? AND c.isActive = 1 AND a.isActive = 1
    `;
    
    const assignment = await getSingle(enrollmentQuery, [assignmentId, studentId]);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found or access denied' });
    }
    
    // Check if assignment is overdue
    if (new Date(assignment.dueDate) < new Date()) {
      return res.status(400).json({ message: 'Assignment submission deadline has passed' });
    }
    
    // Check if submission exists
    const existingSubmissionQuery = `
      SELECT id FROM assignment_submissions
      WHERE assignmentId = ? AND studentId = ?
    `;
    
    const existingSubmission = await getSingle(existingSubmissionQuery, [assignmentId, studentId]);
    
    if (!existingSubmission) {
      return res.status(404).json({ message: 'No submission found to update' });
    }
    
    // Check if already graded
    const gradedQuery = `
      SELECT score FROM assignment_submissions
      WHERE assignmentId = ? AND studentId = ? AND score IS NOT NULL
    `;
    
    const graded = await getSingle(gradedQuery, [assignmentId, studentId]);
    
    if (graded) {
      return res.status(400).json({ message: 'Cannot update graded assignment' });
    }
    
    // Update submission
    const updateQuery = `
      UPDATE assignment_submissions
      SET text = ?, submittedAt = datetime('now')
      WHERE assignmentId = ? AND studentId = ?
    `;
    
    await runQuery(updateQuery, [text, assignmentId, studentId]);
    
    res.json({
      success: true,
      message: 'Assignment updated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get assignment submission details
// @route   GET /api/assignments/student/:id/submission
// @access  Private (Student)
const getAssignmentSubmission = async (req, res) => {
  try {
    const studentId = req.user.id;
    const assignmentId = req.params.id;
    
    // Get submission details
    const submissionQuery = `
      SELECT asub.id, asub.text, asub.file, asub.score, asub.feedback, asub.submittedAt,
             a.title, a.description, a.dueDate, a.maxScore,
             c.code as courseCode, c.name as courseName
      FROM assignment_submissions asub
      INNER JOIN assignments a ON asub.assignmentId = a.id
      INNER JOIN courses c ON a.courseId = c.id
      INNER JOIN course_enrollments ce ON c.id = ce.courseId
      WHERE asub.assignmentId = ? AND asub.studentId = ? AND ce.studentId = ?
    `;
    
    const submission = await getSingle(submissionQuery, [assignmentId, studentId, studentId]);
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    res.json({
      success: true,
      submission: {
        id: submission.id,
        text: submission.text,
        file: submission.file,
        score: submission.score,
        feedback: submission.feedback,
        submittedAt: submission.submittedAt,
        assignment: {
          title: submission.title,
          description: submission.description,
          dueDate: submission.dueDate,
          maxScore: submission.maxScore,
          course: submission.courseCode,
          courseName: submission.courseName
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to calculate days remaining
function getDaysRemaining(dueDate) {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

module.exports = {
  getStudentAssignments,
  getStudentAssignment,
  submitAssignment,
  updateAssignmentSubmission,
  getAssignmentSubmission
};
