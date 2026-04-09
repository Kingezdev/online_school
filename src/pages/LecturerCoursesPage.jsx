import { useState, useEffect } from 'react';
import { useW } from '../hooks/useW.js';
import { enrollmentAPI } from '../utils/api.js';
import { C } from '../data/constants.js';

export function LecturerCoursesPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;
  const isMd = w >= 640 && w < 1024;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeachingCourses();
  }, []);

  const fetchTeachingCourses = async () => {
    try {
      setLoading(true);
      const response = await enrollmentAPI.getTeachingCourses();
      setCourses(response.courses || []);
    } catch (error) {
      setError(error.message || 'Failed to fetch teaching courses');
    } finally {
      setLoading(false);
    }
  };

  const getCourseStatusColor = (course) => {
    if (!course.isActive) return C.gray;
    if (course.stats.enrolledStudents === 0) return C.orange;
    if (course.stats.enrolledStudents < 5) return C.yellow;
    return C.green;
  };

  const getCourseStatusText = (course) => {
    if (!course.isActive) return 'Inactive';
    if (course.stats.enrolledStudents === 0) return 'No Students';
    if (course.stats.enrolledStudents < 5) return 'Low Enrollment';
    return 'Active';
  };

  if (loading) {
    return (
      <div style={{ padding: isLg ? "24px 32px" : 16, textAlign: "center" }}>
        <div style={{ fontSize: 18, color: "#666", marginBottom: 16 }}>Loading teaching courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: isLg ? "24px 32px" : 16, textAlign: "center" }}>
        <div style={{ fontSize: 18, color: C.red, marginBottom: 16 }}>Error: {error}</div>
        <button
          onClick={fetchTeachingCourses}
          style={{
            background: C.blue,
            color: "white",
            border: "none",
            borderRadius: 4,
            padding: "8px 16px",
            cursor: "pointer"
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: isLg ? "24px 32px" : 16 }}>
      <h2 style={{ margin: "0 0 16px", fontSize: isLg ? 20 : 15, color: "#333", fontWeight: 700 }}>
        My Teaching Courses
      </h2>

      {/* Summary Stats */}
      <div style={{ display: "grid", gridTemplateColumns: isLg ? "repeat(4,1fr)" : w >= 640 ? "repeat(2,1fr)" : "1fr", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Courses", value: courses.length, icon: "Book", color: C.blue },
          { label: "Total Students", value: courses.reduce((sum, course) => sum + course.stats.enrolledStudents, 0), icon: "Users", color: C.green },
          { label: "Total Assignments", value: courses.reduce((sum, course) => sum + course.stats.totalAssignments, 0), icon: "FileText", color: C.orange },
          { label: "Total Quizzes", value: courses.reduce((sum, course) => sum + course.stats.totalQuizzes, 0), icon: "HelpCircle", color: C.purple }
        ].map((stat, index) => (
          <div key={index} style={{
            background: "white",
            border: "1px solid #e0e0e0",
            borderRadius: 8,
            padding: 16,
            textAlign: "center"
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#333", marginBottom: 4 }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: "#666" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Courses List */}
      <div style={{ display: "grid", gap: 16 }}>
        {courses.map((course, index) => (
          <div key={index} style={{
            background: "white",
            border: "1px solid #e0e0e0",
            borderRadius: 8,
            padding: 16,
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          onClick={() => setPage('course')}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 600, color: "#333" }}>
                  {course.code}: {course.name}
                </h3>
                <p style={{ margin: "0 0 8px", fontSize: 13, color: "#666", lineHeight: 1.4 }}>
                  {course.description}
                </p>
              </div>
              <div style={{
                background: getCourseStatusColor(course),
                color: "white",
                padding: "4px 8px",
                borderRadius: 4,
                fontSize: 10,
                fontWeight: 600
              }}>
                {getCourseStatusText(course)}
              </div>
            </div>

            {/* Course Stats */}
            <div style={{ display: "grid", gridTemplateColumns: isLg ? "repeat(5,1fr)" : w >= 640 ? "repeat(3,1fr)" : "repeat(2,1fr)", gap: 12, marginBottom: 12 }}>
              {[
                { label: "Students", value: course.stats.enrolledStudents, icon: "Users" },
                { label: "Assignments", value: course.stats.totalAssignments, icon: "FileText" },
                { label: "Quizzes", value: course.stats.totalQuizzes, icon: "HelpCircle" },
                { label: "Forum Posts", value: course.stats.totalForumPosts, icon: "MessageSquare" },
                { label: "Attendance", value: course.stats.totalAttendanceRecords, icon: "Calendar" }
              ].map((stat, statIndex) => (
                <div key={statIndex} style={{
                  background: "#f8f9fa",
                  borderRadius: 4,
                  padding: 8,
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: 12, marginBottom: 2 }}>{stat.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>{stat.value}</div>
                  <div style={{ fontSize: 9, color: "#666" }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setPage('course students', course.id);
                }}
                style={{
                  background: C.green,
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  padding: "6px 12px",
                  fontSize: 11,
                  cursor: "pointer"
                }}>
                View Students
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setPage('grade book');
                }}
                style={{
                  background: C.orange,
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  padding: "6px 12px",
                  fontSize: 11,
                  cursor: "pointer"
                }}>
                Gradebook
              </button>
              </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div style={{
          background: "white",
          border: "1px solid #e0e0e0",
          borderRadius: 8,
          padding: 32,
          textAlign: "center"
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>Book</div>
          <div style={{ fontSize: 16, color: "#666", marginBottom: 8 }}>No teaching courses assigned</div>
          <div style={{ fontSize: 13, color: "#999" }}>
            You haven't been assigned to teach any courses yet.
          </div>
        </div>
      )}
    </div>
  );
}
