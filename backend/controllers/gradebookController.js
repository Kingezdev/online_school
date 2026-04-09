const { getQuery, getSingle, runQuery } = require('../config/database');

// @desc    Get student's gradebook summary
// @route   GET /api/gradebook/student
// @access  Private (Student)
const getStudentGradebook = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    // Get student's enrolled courses
    const coursesQuery = `
      SELECT c.id, c.code, c.name,
             ce.createdAt as enrolledAt
      FROM courses c
      INNER JOIN course_enrollments ce ON c.id = ce.courseId
      WHERE ce.studentId = ? AND c.isActive = 1
      ORDER BY c.name
    `;
    
    const courses = await getQuery(coursesQuery, [studentId]);
    
    // Get grades for each course
    const gradebookData = await Promise.all(courses.map(async (course) => {
      // Get assignment grades
      const assignmentGradesQuery = `
        SELECT a.title, a.maxScore as totalPoints, asub.score, asub.submittedAt
        FROM assignments a
        LEFT JOIN assignment_submissions asub ON a.id = asub.assignmentId AND asub.studentId = ?
        WHERE a.courseId = ? AND a.isActive = 1
        ORDER BY a.createdAt
      `;
      
      const assignmentGrades = await getQuery(assignmentGradesQuery, [studentId, course.id]);
      
      // Get quiz grades
      const quizGradesQuery = `
        SELECT q.title, q.timeLimit, qa.score, qa.attemptedAt
        FROM quizzes q
        LEFT JOIN quiz_attempts qa ON q.id = qa.quizId AND qa.studentId = ?
        WHERE q.courseId = ? AND q.isActive = 1
        ORDER BY q.createdAt
      `;
      
      const quizGrades = await getQuery(quizGradesQuery, [studentId, course.id]);
      
      // Calculate totals
      const assignmentTotal = assignmentGrades.reduce((sum, a) => sum + (a.score || 0), 0);
      const assignmentMaxPoints = assignmentGrades.reduce((sum, a) => sum + (a.totalPoints || 0), 0);
      const quizTotal = quizGrades.reduce((sum, q) => sum + (q.score || 0), 0);
      const quizMaxPoints = quizGrades.reduce((sum, q) => sum + 100, 0); // Assuming each quiz is out of 100
      
      // Calculate overall grade (simple average)
      const totalPoints = assignmentTotal + quizTotal;
      const maxPoints = assignmentMaxPoints + quizMaxPoints;
      const overallGrade = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;
      
      return {
        id: course.id,
        code: course.code,
        name: course.name,
        enrolledAt: course.enrolledAt,
        assignments: {
          total: assignmentTotal,
          maxPoints: assignmentMaxPoints,
          count: assignmentGrades.length,
          graded: assignmentGrades.filter(a => a.score !== null).length
        },
        quizzes: {
          total: quizTotal,
          maxPoints: quizMaxPoints,
          count: quizGrades.length,
          graded: quizGrades.filter(q => q.score !== null).length
        },
        overall: {
          score: overallGrade,
          grade: getLetterGrade(overallGrade)
        }
      };
    }));
    
    res.json({
      success: true,
      courses: gradebookData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get detailed grade breakdown for a specific course
// @route   GET /api/gradebook/student/:courseId
// @access  Private (Student)
const getStudentCourseGrades = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;
    
    // Check if student is enrolled in the course
    const enrollmentQuery = 'SELECT * FROM course_enrollments WHERE studentId = ? AND courseId = ?';
    const enrollment = await getSingle(enrollmentQuery, [studentId, courseId]);
    
    if (!enrollment) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }
    
    // Get course details
    const courseQuery = 'SELECT id, code, name FROM courses WHERE id = ?';
    const course = await getSingle(courseQuery, [courseId]);
    
    // Get assignment details with grades
    const assignmentQuery = `
      SELECT a.id, a.title, a.description, a.maxScore as totalPoints, a.dueDate, a.createdAt,
             asub.score, asub.feedback, asub.submittedAt
      FROM assignments a
      LEFT JOIN assignment_submissions asub ON a.id = asub.assignmentId AND asub.studentId = ?
      WHERE a.courseId = ? AND a.isActive = 1
      ORDER BY a.createdAt
    `;
    
    const assignments = await getQuery(assignmentQuery, [studentId, courseId]);
    
    // Get quiz details with grades
    const quizQuery = `
      SELECT q.id, q.title, q.timeLimit, q.createdAt,
             qa.score, qa.answers, qa.attemptedAt
      FROM quizzes q
      LEFT JOIN quiz_attempts qa ON q.id = qa.quizId AND qa.studentId = ?
      WHERE q.courseId = ? AND q.isActive = 1
      ORDER BY q.createdAt
    `;
    
    const quizzes = await getQuery(quizQuery, [studentId, courseId]);
    
    // Calculate overall grade
    const assignmentTotal = assignments.reduce((sum, a) => sum + (a.score || 0), 0);
    const assignmentMaxPoints = assignments.reduce((sum, a) => sum + (a.totalPoints || 0), 0);
    const quizTotal = quizzes.reduce((sum, q) => sum + (q.score || 0), 0);
    const quizMaxPoints = quizzes.length * 100; // Assuming each quiz is out of 100
    
    const totalPoints = assignmentTotal + quizTotal;
    const maxPoints = assignmentMaxPoints + quizMaxPoints;
    const overallGrade = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;
    
    res.json({
      success: true,
      course: {
        id: course.id,
        code: course.code,
        name: course.name
      },
      assignments: assignments.map(a => ({
        id: a.id,
        title: a.title,
        description: a.description,
        totalPoints: a.totalPoints,
        dueDate: a.dueDate,
        score: a.score,
        feedback: a.feedback,
        submittedAt: a.submittedAt,
        percentage: a.totalPoints > 0 ? Math.round((a.score / a.totalPoints) * 100) : 0,
        grade: a.score !== null ? getLetterGrade(Math.round((a.score / a.totalPoints) * 100)) : null
      })),
      quizzes: quizzes.map(q => ({
        id: q.id,
        title: q.title,
        timeLimit: q.timeLimit,
        score: q.score,
        answers: q.answers ? JSON.parse(q.answers) : null,
        attemptedAt: q.attemptedAt,
        grade: q.score !== null ? getLetterGrade(q.score) : null
      })),
      overall: {
        score: overallGrade,
        grade: getLetterGrade(overallGrade),
        assignmentScore: assignmentMaxPoints > 0 ? Math.round((assignmentTotal / assignmentMaxPoints) * 100) : 0,
        quizScore: quizMaxPoints > 0 ? Math.round((quizTotal / quizMaxPoints) * 100) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get lecturer's gradebook for their courses
// @route   GET /api/gradebook/lecturer
// @access  Private (Lecturer)
const getLecturerGradebook = async (req, res) => {
  try {
    const lecturerId = req.user.id;
    
    // Get lecturer's courses
    const coursesQuery = `
      SELECT c.id, c.code, c.name, c.isActive
      FROM courses c
      WHERE c.lecturer = ? AND c.isActive = 1
      ORDER BY c.name
    `;
    
    const courses = await getQuery(coursesQuery, [lecturerId]);
    
    // Get gradebook data for each course
    const gradebookData = await Promise.all(courses.map(async (course) => {
      // Get enrolled students
      const studentsQuery = `
        SELECT u.id, u.username, u.profile_firstName, u.profile_lastName, ce.createdAt as enrolledAt
        FROM users u
        INNER JOIN course_enrollments ce ON u.id = ce.studentId
        WHERE ce.courseId = ?
        ORDER BY u.profile_lastName, u.profile_firstName
      `;
      
      const students = await getQuery(studentsQuery, [course.id]);
      
      // Get grades for each student
      const studentGrades = await Promise.all(students.map(async (student) => {
        // Get assignment grades
        const assignmentGradesQuery = `
          SELECT a.maxScore as totalPoints, asub.score
          FROM assignments a
          LEFT JOIN assignment_submissions asub ON a.id = asub.assignmentId AND asub.studentId = ?
          WHERE a.courseId = ? AND a.isActive = 1
        `;
        
        const assignmentGrades = await getQuery(assignmentGradesQuery, [student.id, course.id]);
        
        // Get quiz grades
        const quizGradesQuery = `
          SELECT qa.score
          FROM quizzes q
          LEFT JOIN quiz_attempts qa ON q.id = qa.quizId AND qa.studentId = ?
          WHERE q.courseId = ? AND q.isActive = 1
        `;
        
        const quizGrades = await getQuery(quizGradesQuery, [student.id, course.id]);
        
        // Calculate totals - changed to average of submitted assignments instead of percentage of all possible
        const submittedAssignments = assignmentGrades.filter(a => a.score !== null);
        const assignmentTotal = assignmentGrades.reduce((sum, a) => sum + (a.score || 0), 0);
        const assignmentAverage = submittedAssignments.length > 0 
          ? Math.round(assignmentTotal / submittedAssignments.length)
          : 0;
        
        const submittedQuizzes = quizGrades.filter(q => q.score !== null);
        const quizTotal = quizGrades.reduce((sum, q) => sum + (q.score || 0), 0);
        const quizAverage = submittedQuizzes.length > 0
          ? Math.round(quizTotal / submittedQuizzes.length)
          : 0;
        
        const overallAverage = (submittedAssignments.length + submittedQuizzes.length) > 0
          ? Math.round((assignmentTotal + quizTotal) / (submittedAssignments.length + submittedQuizzes.length))
          : 0;
        
                
        return {
          id: student.id,
          username: student.username,
          firstName: student.profile_firstName,
          lastName: student.profile_lastName,
          enrolledAt: student.enrolledAt,
          assignmentScore: assignmentAverage,
          quizScore: quizAverage,
          overallScore: overallAverage,
          grade: getLetterGrade(overallAverage)
        };
      }));
      
      // Calculate class statistics
      const classAverage = studentGrades.length > 0 
        ? Math.round(studentGrades.reduce((sum, s) => sum + s.overallScore, 0) / studentGrades.length)
        : 0;
      
      return {
        id: course.id,
        code: course.code,
        name: course.name,
        students: studentGrades,
        statistics: {
          totalStudents: studentGrades.length,
          classAverage: classAverage,
          gradeDistribution: calculateGradeDistribution(studentGrades)
        }
      };
    }));
    
    // Debug logging for final data structure
    console.log('=== FINAL GRADEBOOK DATA ===');
    gradebookData.forEach(course => {
      const student11 = course.students.find(s => s.id === 11);
      if (student11) {
        console.log(`Course ${course.code} - Student 11: Assignment=${student11.assignmentScore}%, Overall=${student11.overallScore}%, Grade=${student11.grade}`);
      }
    });

    res.json({
      success: true,
      courses: gradebookData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update student grade
// @route   PUT /api/gradebook/update
// @access  Private (Lecturer)
const updateStudentGrade = async (req, res) => {
  try {
    const { type, itemId, studentId, score, feedback } = req.body;
    const lecturerId = req.user.id;
    
    if (!type || !itemId || !studentId || score === undefined) {
      return res.status(400).json({ message: 'Type, itemId, studentId, and score are required' });
    }
    
    if (type === 'assignment') {
      // Verify lecturer owns the assignment
      const assignmentQuery = `
        SELECT a.id, a.maxScore FROM assignments a
        INNER JOIN courses c ON a.courseId = c.id
        WHERE a.id = ? AND c.lecturer = ?
      `;
      
      const assignment = await getSingle(assignmentQuery, [itemId, lecturerId]);
      
      if (!assignment) {
        return res.status(403).json({ message: 'Assignment not found or access denied' });
      }
      
      // Update or insert submission grade
      const upsertQuery = `
        INSERT INTO assignment_submissions (assignmentId, studentId, score, feedback, submittedAt)
        VALUES (?, ?, ?, ?, datetime('now'))
        ON CONFLICT(assignmentId, studentId) 
        DO UPDATE SET score = ?, feedback = ?, submittedAt = datetime('now')
      `;
      
      await runQuery(upsertQuery, [itemId, studentId, score, feedback, score, feedback]);
      
    } else if (type === 'quiz') {
      // Verify lecturer owns the quiz
      const quizQuery = `
        SELECT q.id FROM quizzes q
        INNER JOIN courses c ON q.courseId = c.id
        WHERE q.id = ? AND c.lecturer = ?
      `;
      
      const quiz = await getSingle(quizQuery, [itemId, lecturerId]);
      
      if (!quiz) {
        return res.status(403).json({ message: 'Quiz not found or access denied' });
      }
      
      // Update or insert quiz attempt
      const upsertQuery = `
        INSERT INTO quiz_attempts (quizId, studentId, score, attemptedAt)
        VALUES (?, ?, ?, datetime('now'))
        ON CONFLICT(quizId, studentId) 
        DO UPDATE SET score = ?, attemptedAt = datetime('now')
      `;
      
      await runQuery(upsertQuery, [itemId, studentId, score, score]);
      
    } else {
      return res.status(400).json({ message: 'Invalid type. Must be assignment or quiz' });
    }
    
    res.json({
      success: true,
      message: 'Grade updated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to get letter grade
function getLetterGrade(score) {
  // Debug logging for specific scores
  if (score === 89 || score === 22 || score === 0) {
    console.log(`getLetterGrade called with score: ${score}`);
  }
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

// Helper function to calculate grade distribution
function calculateGradeDistribution(students) {
  const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  
  students.forEach(student => {
    distribution[student.grade]++;
  });
  
  return distribution;
}

module.exports = {
  getStudentGradebook,
  getStudentCourseGrades,
  getLecturerGradebook,
  updateStudentGrade
};
