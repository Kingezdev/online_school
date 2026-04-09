import { useState, useEffect } from 'react';
import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';
import { gradebookAPI } from '../utils/api.js';

export function StudentGradeBookPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;
  const [gradebookData, setGradebookData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseDetails, setCourseDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchGradebook();
  }, []);

  const fetchGradebook = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await gradebookAPI.getStudentGradebook();
      
      if (response.success) {
        setGradebookData(response.courses || []);
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch gradebook data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewBreakdown = async (course) => {
    try {
      setSelectedCourse(course);
      setShowDetails(true);
      
      const response = await gradebookAPI.getStudentCourseGrades(course.id);
      
      if (response.success) {
        setCourseDetails(response);
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch course details');
    }
  };

  const handleBackToList = () => {
    setShowDetails(false);
    setSelectedCourse(null);
    setCourseDetails(null);
  };

  const formatGrade = (score) => {
    if (score === null || score === undefined) return 'N/A';
    return `${score}%`;
  };

  const getGradeColor = (score) => {
    if (score === null || score === undefined) return '#6b7280';
    if (score >= 90) return '#22c55e';
    if (score >= 80) return '#3b82f6';
    if (score >= 70) return '#f59e0b';
    if (score >= 60) return '#ef4444';
    return '#dc2626';
  };

  if (showDetails && courseDetails) {
    return (
      <div style={{padding: isLg ? "32px" : "16px", backgroundColor: "#f5f5f5", minHeight: "100vh"}}>
        <div style={{marginBottom: "24px"}}>
          <div style={{display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px"}}>
            <button
              onClick={handleBackToList}
              style={{
                background: "#f3f4f6",
                color: "#374151",
                border: "none",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Back to Courses
            </button>
            <h1 style={{fontSize: "24px", fontWeight: "bold", color: "#111827", margin: 0}}>
              {courseDetails.course.name} - Grade Details
            </h1>
          </div>
          <div style={{fontSize: "14px", color: "#6b7280"}}>
            Home / Grade Book / {courseDetails.course.code}
          </div>
        </div>

        {/* Overall Grade */}
        <div style={{backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", border: "1px solid #e5e7eb", padding: "24px", marginBottom: "24px"}}>
          <h2 style={{fontSize: "18px", fontWeight: "bold", color: "#111827", marginBottom: "16px"}}>Overall Grade</h2>
          <div style={{display: "flex", alignItems: "center", gap: "24px"}}>
            <div style={{fontSize: "48px", fontWeight: "bold", color: getGradeColor(courseDetails.overall.score)}}>
              {courseDetails.overall.score}%
            </div>
            <div>
              <div style={{fontSize: "24px", fontWeight: "bold", color: "#111827"}}>
                Grade: {courseDetails.overall.grade}
              </div>
              <div style={{fontSize: "14px", color: "#6b7280"}}>
                Assignment: {formatGrade(courseDetails.overall.assignmentScore)} | Quiz: {formatGrade(courseDetails.overall.quizScore)}
              </div>
            </div>
          </div>
        </div>

        {/* Assignments */}
        <div style={{backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", border: "1px solid #e5e7eb", padding: "24px", marginBottom: "24px"}}>
          <h2 style={{fontSize: "18px", fontWeight: "bold", color: "#111827", marginBottom: "16px"}}>
            Assignments ({courseDetails.assignments.length})
          </h2>
          <div style={{overflowX: "auto"}}>
            <table style={{width: "100%", borderCollapse: "collapse"}}>
              <thead>
                <tr style={{backgroundColor: "#f9fafb"}}>
                  <th style={{textAlign: "left", padding: "12px", fontSize: "14px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Assignment</th>
                  <th style={{textAlign: "center", padding: "12px", fontSize: "14px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Points</th>
                  <th style={{textAlign: "center", padding: "12px", fontSize: "14px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Grade</th>
                  <th style={{textAlign: "center", padding: "12px", fontSize: "14px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {courseDetails.assignments.map((assignment, index) => (
                  <tr key={assignment.id}>
                    <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", fontWeight: "medium", color: "#111827"}}>
                      {assignment.title}
                    </td>
                    <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: "#6b7280"}}>
                      {assignment.score !== null ? `${assignment.score}/${assignment.totalPoints}` : `${assignment.totalPoints} pts`}
                    </td>
                    <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: getGradeColor(assignment.percentage)}}>
                      {assignment.grade || 'Not graded'}
                    </td>
                    <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: "#6b7280"}}>
                      {assignment.submittedAt ? new Date(assignment.submittedAt).toLocaleDateString() : 'Not submitted'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quizzes */}
        <div style={{backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", border: "1px solid #e5e7eb", padding: "24px"}}>
          <h2 style={{fontSize: "18px", fontWeight: "bold", color: "#111827", marginBottom: "16px"}}>
            Quizzes ({courseDetails.quizzes.length})
          </h2>
          <div style={{overflowX: "auto"}}>
            <table style={{width: "100%", borderCollapse: "collapse"}}>
              <thead>
                <tr style={{backgroundColor: "#f9fafb"}}>
                  <th style={{textAlign: "left", padding: "12px", fontSize: "14px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Quiz</th>
                  <th style={{textAlign: "center", padding: "12px", fontSize: "14px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Score</th>
                  <th style={{textAlign: "center", padding: "12px", fontSize: "14px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Grade</th>
                  <th style={{textAlign: "center", padding: "12px", fontSize: "14px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Attempted</th>
                </tr>
              </thead>
              <tbody>
                {courseDetails.quizzes.map((quiz, index) => (
                  <tr key={quiz.id}>
                    <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", fontWeight: "medium", color: "#111827"}}>
                      {quiz.title}
                    </td>
                    <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: getGradeColor(quiz.score)}}>
                      {quiz.score !== null ? `${quiz.score}/100` : 'Not attempted'}
                    </td>
                    <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: getGradeColor(quiz.score)}}>
                      {quiz.grade || 'Not graded'}
                    </td>
                    <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: "#6b7280"}}>
                      {quiz.attemptedAt ? new Date(quiz.attemptedAt).toLocaleDateString() : 'Not attempted'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{padding: isLg ? "32px" : "16px", backgroundColor: "#f5f5f5", minHeight: "100vh"}}>
      <div style={{marginBottom: "24px"}}>
        <h1 style={{fontSize: "24px", fontWeight: "bold", color: "#111827", margin: "0 0 8px"}}>My Grade Book</h1>
        <div style={{fontSize: "14px", color: "#6b7280", marginTop: "8px"}}>Home / Pick a course</div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: "#fee",
          color: "#c53030",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "24px",
          fontSize: "14px",
          border: "1px solid #fed7d7"
        }}>
          {error}
        </div>
      )}

      {/* Progress Indicator */}
      <div style={{display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "32px"}}>
        <div style={{display: "flex", alignItems: "center", gap: "16px"}}>
          <div style={{display: "flex", alignItems: "center"}}>
            <div style={{width: "32px", height: "32px", backgroundColor: "#22c55e", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "14px", fontWeight: "bold"}}>
              1
            </div>
            <span style={{marginLeft: "8px", fontSize: "14px", fontWeight: "medium", color: "#111827"}}>Pick a course</span>
          </div>
          <div style={{width: "64px", height: "4px", backgroundColor: "#d1d5db"}}></div>
          <div style={{display: "flex", alignItems: "center"}}>
            <div style={{width: "32px", height: "32px", backgroundColor: "#d1d5db", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "14px", fontWeight: "bold"}}>
              2
            </div>
            <span style={{marginLeft: "8px", fontSize: "14px", color: "#6b7280"}}>See grade breakdown</span>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div style={{backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", border: "1px solid #e5e7eb", padding: "24px"}}>
        <h2 style={{fontSize: "18px", fontWeight: "bold", color: "#111827", marginBottom: "16px"}}>
          Courses ({gradebookData.length})
        </h2>
        
        {loading ? (
          <div style={{textAlign: "center", padding: "40px"}}>
            <div style={{fontSize: "16px", color: "#6b7280"}}>Loading gradebook...</div>
          </div>
        ) : gradebookData.length === 0 ? (
          <div style={{textAlign: "center", padding: "40px"}}>
            <div style={{fontSize: "16px", color: "#6b7280"}}>No enrolled courses found</div>
          </div>
        ) : (
          <div style={{overflowX: "auto"}}>
            <table style={{width: "100%", borderCollapse: "collapse"}}>
              <thead>
                <tr style={{backgroundColor: "#f9fafb"}}>
                  <th style={{textAlign: "left", padding: "12px", fontSize: "14px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Course</th>
                  <th style={{textAlign: "center", padding: "12px", fontSize: "14px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Assignment</th>
                  <th style={{textAlign: "center", padding: "12px", fontSize: "14px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Quiz</th>
                  <th style={{textAlign: "center", padding: "12px", fontSize: "14px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Overall</th>
                  <th style={{textAlign: "center", padding: "12px", fontSize: "14px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {gradebookData.map((course, index) => (
                  <tr key={course.id}>
                    <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", fontWeight: "medium", color: "#111827"}}>
                      {course.name} - {course.code}
                    </td>
                    <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: getGradeColor(course.assignments.maxPoints > 0 ? Math.round((course.assignments.total / course.assignments.maxPoints) * 100) : null)}}>
                      {course.assignments.maxPoints > 0 ? `${course.assignments.total}/${course.assignments.maxPoints}` : 'N/A'}
                    </td>
                    <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: getGradeColor(course.quizzes.maxPoints > 0 ? Math.round((course.quizzes.total / course.quizzes.maxPoints) * 100) : null)}}>
                      {course.quizzes.maxPoints > 0 ? `${course.quizzes.total}/${course.quizzes.maxPoints}` : 'N/A'}
                    </td>
                    <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: getGradeColor(course.overall.score), fontWeight: "bold"}}>
                      {course.overall.score}% ({course.overall.grade})
                    </td>
                    <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center"}}>
                      <button
                        onClick={() => handleViewBreakdown(course)}
                        style={{padding: "8px 16px", backgroundColor: "#2563eb", color: "white", borderRadius: "8px", transition: "background-color 0.2s", fontSize: "14px", fontWeight: "medium", border: "none", cursor: "pointer"}} 
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}>
                        See Breakdown
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
