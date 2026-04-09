import { useState, useEffect } from 'react';
import { useW } from '../hooks/useW.js';
import { enrollmentAPI } from '../utils/api.js';
import { C } from '../data/constants.js';

export function CourseStudentsPage({ setPage, courseId }) {
  const w = useW();
  const isLg = w >= 1024;
  const isMd = w >= 640 && w < 1024;

  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourseStudents();
  }, [courseId]);

  const fetchCourseStudents = async () => {
    try {
      setLoading(true);
      const response = await enrollmentAPI.getCourseStudents(courseId);
      setCourse(response.course);
      setStudents(response.students || []);
    } catch (error) {
      setError(error.message || 'Failed to fetch course students');
    } finally {
      setLoading(false);
    }
  };

  const getEnrollmentStatusColor = (status) => {
    return status ? C.green : C.gray;
  };

  const getEnrollmentStatusText = (status) => {
    return status ? 'Active' : 'Inactive';
  };

  if (loading) {
    return (
      <div style={{ padding: isLg ? "24px 32px" : 16, textAlign: "center" }}>
        <div style={{ fontSize: 18, color: "#666", marginBottom: 16 }}>Loading course students...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: isLg ? "24px 32px" : 16, textAlign: "center" }}>
        <div style={{ fontSize: 18, color: C.red, marginBottom: 16 }}>Error: {error}</div>
        <button
          onClick={fetchCourseStudents}
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
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <button
            onClick={() => setPage('my courses')}
            style={{
              background: "transparent",
              border: "none",
              color: C.blue,
              fontSize: 14,
              cursor: "pointer",
              marginBottom: 8
            }}
          >
            &larr; Back to My Courses
          </button>
          <h2 style={{ margin: 0, fontSize: isLg ? 24 : 20, color: "#333", fontWeight: 700 }}>
            {course?.code}: {course?.name}
          </h2>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ display: "grid", gridTemplateColumns: isLg ? "repeat(4,1fr)" : w >= 640 ? "repeat(2,1fr)" : "1fr", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Students", value: students.length, icon: "Users", color: C.blue },
          { label: "Active Students", value: students.filter(s => s.enrollmentStatus).length, icon: "UserCheck", color: C.green },
          { label: "Inactive Students", value: students.filter(s => !s.enrollmentStatus).length, icon: "UserX", color: C.gray },
          { label: "Course Code", value: course?.code || "N/A", icon: "Book", color: C.orange }
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

      {/* Students List */}
      <div style={{ background: "white", border: "1px solid #e0e0e0", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ padding: 16, borderBottom: "1px solid #e0e0e0", background: "#f8f9fa" }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#333" }}>
            Enrolled Students ({students.length})
          </h3>
        </div>

        {students.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16, color: "#ccc" }}>Users</div>
            <div style={{ fontSize: 16, color: "#666", marginBottom: 8 }}>No students enrolled</div>
            <div style={{ fontSize: 13, color: "#999" }}>
              No students have enrolled in this course yet.
            </div>
          </div>
        ) : (
          <div>
            {/* Table Header */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: isLg ? "2fr 2fr 2fr 1fr 1fr" : w >= 640 ? "1fr 1fr 1fr 1fr" : "1fr",
              padding: "12px 16px",
              borderBottom: "1px solid #e0e0e0",
              background: "#f8f9fa",
              fontSize: 12,
              fontWeight: 600,
              color: "#666"
            }}>
              <div>Student Name</div>
              {isLg && <div>Username</div>}
              <div>Email</div>
              <div>Department</div>
              <div>Status</div>
            </div>

            {/* Students List */}
            {students.map((student, index) => (
              <div key={student.id} style={{
                display: "grid",
                gridTemplateColumns: isLg ? "2fr 2fr 2fr 1fr 1fr" : w >= 640 ? "1fr 1fr 1fr 1fr" : "1fr",
                padding: "12px 16px",
                borderBottom: index < students.length - 1 ? "1px solid #e0e0e0" : "none",
                fontSize: 13,
                alignItems: "center",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f8f9fa"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <div style={{ fontWeight: 500, color: "#333" }}>
                  {student.profile.firstName} {student.profile.lastName}
                </div>
                {isLg && <div style={{ color: "#666" }}>{student.username}</div>}
                <div style={{ color: "#666", fontSize: 12 }}>{student.email}</div>
                <div style={{ color: "#666", fontSize: 12 }}>{student.profile.department}</div>
                <div>
                  <span style={{
                    background: getEnrollmentStatusColor(student.enrollmentStatus),
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: 12,
                    fontSize: 10,
                    fontWeight: 600
                  }}>
                    {getEnrollmentStatusText(student.enrollmentStatus)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button style={{
          background: C.blue,
          color: "white",
          border: "none",
          borderRadius: 4,
          padding: "8px 16px",
          fontSize: 12,
          cursor: "pointer"
        }}>
          Export Student List
        </button>
        <button style={{
          background: C.green,
          color: "white",
          border: "none",
          borderRadius: 4,
          padding: "8px 16px",
          fontSize: 12,
          cursor: "pointer"
        }}>
          Send Announcement
        </button>
        <button style={{
          background: C.orange,
          color: "white",
          border: "none",
          borderRadius: 4,
          padding: "8px 16px",
          fontSize: 12,
          cursor: "pointer"
        }}>
          Mark Attendance
        </button>
        <button 
          onClick={() => setPage('grade book')}
          style={{
            background: C.purple,
            color: "white",
            border: "none",
            borderRadius: 4,
            padding: "8px 16px",
            fontSize: 12,
            cursor: "pointer"
          }}>
          Gradebook
        </button>
      </div>
    </div>
  );
}
