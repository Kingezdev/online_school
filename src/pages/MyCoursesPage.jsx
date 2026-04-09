import { useState, useEffect } from 'react';
import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';
import { enrollmentAPI } from '../utils/api.js';

export function MyCoursesPage({ role }) {
  const w = useW(); 
  const isLg = w >= 1024;
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAvailable, setShowAvailable] = useState(false);
  const [enrolling, setEnrolling] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch enrolled courses
      const enrolledResponse = await enrollmentAPI.getMyCourses();
      if (enrolledResponse.success) {
        setEnrolledCourses(enrolledResponse.courses || []);
      }

      // Fetch available courses for enrollment
      const availableResponse = await enrollmentAPI.getAvailableCourses();
      if (availableResponse.success) {
        setAvailableCourses(availableResponse.courses || []);
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      setEnrolling(courseId);
      const response = await enrollmentAPI.enrollInCourse(courseId);
      
      if (response.success) {
        // Refresh courses
        await fetchCourses();
      }
    } catch (error) {
      setError(error.message || 'Failed to enroll in course');
    } finally {
      setEnrolling(null);
    }
  };

  const handleUnenroll = async (courseId) => {
    try {
      const response = await enrollmentAPI.unenrollFromCourse(courseId);
      
      if (response.success) {
        // Refresh courses
        await fetchCourses();
      }
    } catch (error) {
      setError(error.message || 'Failed to unenroll from course');
    }
  };

  return (
    <div style={{padding: isLg ? "32px" : "16px", backgroundColor: "#f5f5f5", minHeight: "100vh"}}>
      <div style={{marginBottom: "24px"}}>
        <h1 style={{fontSize: "24px", fontWeight: "bold", color: "#111827", margin: "0 0 8px"}}>My Courses</h1>
        <div style={{fontSize: "14px", color: "#6b7280", marginTop: "8px"}}>Home / My Courses</div>
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

      {/* Course Statistics Cards */}
      <div style={{backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", border: "1px solid #e5e7eb", padding: "24px", marginBottom: "24px"}}>
        <div style={{display: "flex", gap: "24px", justifyContent: "space-between"}}>
          <div style={{display: "flex", alignItems: "center", gap: "16px", flex: "1"}}>
            <div style={{width: "48px", height: "48px", backgroundColor: "#fed7aa", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
              <span style={{fontSize: "24px"}}>??</span>
            </div>
            <div>
              <div style={{fontSize: "24px", fontWeight: "bold", color: "#ea580c"}}>{loading ? "..." : enrolledCourses.length}</div>
              <div style={{fontSize: "14px", color: "#6b7280"}}>Enrolled Courses</div>
            </div>
          </div>
          <div style={{display: "flex", alignItems: "center", gap: "16px", flex: "1"}}>
            <div style={{width: "48px", height: "48px", backgroundColor: "#fecaca", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
              <span style={{fontSize: "24px"}}>??</span>
            </div>
            <div>
              <div style={{fontSize: "24px", fontWeight: "bold", color: "#dc2626"}}>{loading ? "..." : availableCourses.length}</div>
              <div style={{fontSize: "14px", color: "#6b7280"}}>Available Courses</div>
            </div>
          </div>
          <div style={{display: "flex", alignItems: "center", gap: "16px", flex: "1"}}>
            <div style={{width: "48px", height: "48px", backgroundColor: "#f3f4f6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
              <span style={{fontSize: "24px"}}>?</span>
            </div>
            <div>
              <div style={{fontSize: "24px", fontWeight: "bold", color: "#6b7280"}}>{loading ? "..." : enrolledCourses.length + availableCourses.length}</div>
              <div style={{fontSize: "14px", color: "#6b7280"}}>Total Courses</div>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Buttons */}
      <div style={{display: "flex", gap: "16px", marginBottom: "24px"}}>
        <button
          onClick={() => setShowAvailable(false)}
          style={{
            padding: "12px 24px",
            backgroundColor: !showAvailable ? C.blue : "#f3f4f6",
            color: !showAvailable ? "white" : "#374151",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          My Enrolled Courses ({enrolledCourses.length})
        </button>
        <button
          onClick={() => setShowAvailable(true)}
          style={{
            padding: "12px 24px",
            backgroundColor: showAvailable ? C.blue : "#f3f4f6",
            color: showAvailable ? "white" : "#374151",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          Available for Enrollment ({availableCourses.length})
        </button>
      </div>

      {/* Course List */}
      <div style={{backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", border: "1px solid #e5e7eb", padding: "24px"}}>
        <h2 style={{fontSize: "18px", fontWeight: "bold", color: "#111827", marginBottom: "16px"}}>
          {showAvailable ? "Available Courses" : "My Enrolled Courses"}
        </h2>
        {loading ? (
          <div style={{textAlign: "center", padding: "40px"}}>
            <div style={{fontSize: "16px", color: "#6b7280"}}>Loading courses...</div>
          </div>
        ) : (showAvailable ? availableCourses : enrolledCourses).length === 0 ? (
          <div style={{textAlign: "center", padding: "40px"}}>
            <div style={{fontSize: "16px", color: "#6b7280"}}>
              {showAvailable ? "No available courses for enrollment" : "You haven't enrolled in any courses yet"}
            </div>
          </div>
        ) : (
          (showAvailable ? availableCourses : enrolledCourses).map((course, index) => (
            <div key={course.id} style={{borderBottom: index !== (showAvailable ? availableCourses : enrolledCourses).length - 1 ? "1px solid #e5e7eb" : "none", paddingBottom: index !== (showAvailable ? availableCourses : enrolledCourses).length - 1 ? "16px" : "0", marginBottom: index !== (showAvailable ? availableCourses : enrolledCourses).length - 1 ? "16px" : "0"}}>
              <div style={{display: "flex", alignItems: "flex-start", justifyContent: "space-between"}}>
                <div style={{flex: "1"}}>
                  <h3 style={{fontSize: "18px", fontWeight: "bold", color: "#111827", marginBottom: "8px", margin: "0 0 8px"}}>
                    {course.name} - {course.code}
                  </h3>
                  <div style={{display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", color: "#6b7280"}}>
                    <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                      <span style={{fontWeight: "medium"}}>Lecturer:</span>
                      <span style={{padding: "2px 8px", backgroundColor: "#dbeafe", color: "#1e40af", borderRadius: "4px", fontSize: "12px"}}>
                        {course.lecturer?.profile?.firstName || 'N/A'} {course.lecturer?.profile?.lastName || ''}
                      </span>
                    </div>
                    <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                      <span style={{fontWeight: "medium"}}>Credits:</span>
                      <span style={{color: "#9ca3af"}}>
                        {course.credits || 0}
                      </span>
                    </div>
                    {!showAvailable && course.enrolledAt && (
                      <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                        <span style={{fontWeight: "medium"}}>Enrolled:</span>
                        <span style={{color: "#9ca3af"}}>
                          {new Date(course.enrolledAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                      <span style={{fontWeight: "medium"}}>Description:</span>
                      <span style={{color: "#9ca3af", fontSize: "12px"}}>
                        {course.description || 'No description available'}
                      </span>
                    </div>
                  </div>
                  <div style={{display: "flex", alignItems: "center", gap: "16px", marginTop: "16px"}}>
                    {showAvailable ? (
                      <button
                        onClick={() => handleEnroll(course.id)}
                        disabled={enrolling === course.id}
                        style={{
                          padding: "8px 16px",
                          backgroundColor: enrolling === course.id ? "#9ca3af" : C.blue,
                          color: "white",
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontWeight: "600",
                          border: "none",
                          cursor: enrolling === course.id ? "not-allowed" : "pointer",
                          transition: "background-color 0.2s"
                        }}
                        onMouseEnter={(e) => enrolling !== course.id && (e.currentTarget.style.backgroundColor = "#1d4ed8")}
                        onMouseLeave={(e) => enrolling !== course.id && (e.currentTarget.style.backgroundColor = C.blue)}
                      >
                        {enrolling === course.id ? "Enrolling..." : "Enroll Now"}
                      </button>
                    ) : (
                      <>
                        <button style={{padding: "8px 16px", backgroundColor: "#f3f4f6", color: "#374151", borderRadius: "8px", transition: "background-color 0.2s", fontSize: "14px", fontWeight: "medium", border: "none", cursor: "pointer"}} 
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e5e7eb"}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}>
                          View Assignments
                        </button>
                        <button style={{padding: "8px 16px", backgroundColor: "#f3f4f6", color: "#374151", borderRadius: "8px", transition: "background-color 0.2s", fontSize: "14px", fontWeight: "medium", border: "none", cursor: "pointer"}} 
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e5e7eb"}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}>
                          View Quizzes
                        </button>
                        <button style={{padding: "8px 16px", backgroundColor: "#f3f4f6", color: "#374151", borderRadius: "8px", transition: "background-color 0.2s", fontSize: "14px", fontWeight: "medium", border: "none", cursor: "pointer"}} 
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e5e7eb"}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}>
                          View Forum
                        </button>
                        <button
                          onClick={() => handleUnenroll(course.id)}
                          style={{padding: "8px 16px", backgroundColor: "#dc2626", color: "white", borderRadius: "8px", transition: "background-color 0.2s", fontSize: "14px", fontWeight: "medium", border: "none", cursor: "pointer"}} 
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#b91c1c"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#dc2626"}>
                          Unenroll
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
