import { useW } from '../hooks/useW.js';
import { C, COURSES, LECTURER_COURSES } from '../data/constants.js';

export function MyCoursesPage({ role }) {
  const w = useW(); 
  const isLg = w >= 1024;
  const courses = role === "lecturer" ? LECTURER_COURSES : COURSES;

  return (
    <div style={{padding: isLg ? "32px" : "16px", backgroundColor: "#f5f5f5", minHeight: "100vh"}}>
      <div style={{marginBottom: "24px"}}>
        <h1 style={{fontSize: "24px", fontWeight: "bold", color: "#111827", margin: "0 0 8px"}}>My Courses</h1>
        <div style={{fontSize: "14px", color: "#6b7280", marginTop: "8px"}}>Home / My Courses</div>
      </div>

      {/* Course Statistics Cards */}
      <div style={{backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", border: "1px solid #e5e7eb", padding: "24px", marginBottom: "24px"}}>
        <div style={{display: "flex", gap: "24px", justifyContent: "space-between"}}>
          <div style={{display: "flex", alignItems: "center", gap: "16px", flex: "1"}}>
            <div style={{width: "48px", height: "48px", backgroundColor: "#fed7aa", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
              <span style={{fontSize: "24px"}}>📋</span>
            </div>
            <div>
              <div style={{fontSize: "24px", fontWeight: "bold", color: "#ea580c"}}>{courses.length}</div>
              <div style={{fontSize: "14px", color: "#6b7280"}}>Courses</div>
            </div>
          </div>
          <div style={{display: "flex", alignItems: "center", gap: "16px", flex: "1"}}>
            <div style={{width: "48px", height: "48px", backgroundColor: "#fecaca", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
              <span style={{fontSize: "24px"}}>👥</span>
            </div>
            <div>
              <div style={{fontSize: "24px", fontWeight: "bold", color: "#dc2626"}}>{courses.length}</div>
              <div style={{fontSize: "14px", color: "#6b7280"}}>Course Grouping</div>
            </div>
          </div>
          <div style={{display: "flex", alignItems: "center", gap: "16px", flex: "1"}}>
            <div style={{width: "48px", height: "48px", backgroundColor: "#f3f4f6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
              <span style={{fontSize: "24px"}}>👥</span>
            </div>
            <div>
              <div style={{fontSize: "24px", fontWeight: "bold", color: "#6b7280"}}>0</div>
              <div style={{fontSize: "14px", color: "#6b7280"}}>Tutor Grouping</div>
            </div>
          </div>
        </div>
      </div>

      {/* Course List */}
      <div style={{backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", border: "1px solid #e5e7eb", padding: "24px"}}>
        <h2 style={{fontSize: "18px", fontWeight: "bold", color: "#111827", marginBottom: "16px"}}>Course List</h2>
        {courses.map((course, index) => (
          <div key={index} style={{borderBottom: index !== courses.length - 1 ? "1px solid #e5e7eb" : "none", paddingBottom: index !== courses.length - 1 ? "16px" : "0", marginBottom: index !== courses.length - 1 ? "16px" : "0"}}>
            <div style={{display: "flex", alignItems: "flex-start", justifyContent: "space-between"}}>
              <div style={{flex: "1"}}>
                <h3 style={{fontSize: "18px", fontWeight: "bold", color: "#111827", marginBottom: "8px", margin: "0 0 8px"}}>
                  {course.name} - {course.code}
                </h3>
                <div style={{display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", color: "#6b7280"}}>
                  <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                    <span style={{fontWeight: "medium"}}>Groupings:</span>
                    <span style={{padding: "2px 8px", backgroundColor: "#dbeafe", color: "#1e40af", borderRadius: "4px", fontSize: "12px"}}>
                      GROUP {course.tutor}
                    </span>
                  </div>
                  <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                    <span style={{fontWeight: "medium"}}>Tutor:</span>
                    <span>GROUP {course.tutor}</span>
                  </div>
                  <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                    <span style={{fontWeight: "medium"}}>Sub Group:</span>
                    <span style={{color: "#9ca3af"}}>
                      {course.code === "COSC 211" ? "No grouping yet" : "No grouping yet"}
                    </span>
                  </div>
                </div>
                <div style={{display: "flex", alignItems: "center", gap: "16px", marginTop: "16px"}}>
                  <button style={{padding: "8px 16px", backgroundColor: "#f3f4f6", color: "#374151", borderRadius: "8px", transition: "background-color 0.2s", fontSize: "14px", fontWeight: "medium", border: "none", cursor: "pointer"}} 
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e5e7eb"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}>
                    Assignment | {course.assignments}
                  </button>
                  <button style={{padding: "8px 16px", backgroundColor: "#f3f4f6", color: "#374151", borderRadius: "8px", transition: "background-color 0.2s", fontSize: "14px", fontWeight: "medium", border: "none", cursor: "pointer"}} 
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e5e7eb"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}>
                    Quizzes | {course.quizzes}
                  </button>
                  <button style={{padding: "8px 16px", backgroundColor: "#f3f4f6", color: "#374151", borderRadius: "8px", transition: "background-color 0.2s", fontSize: "14px", fontWeight: "medium", border: "none", cursor: "pointer"}} 
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e5e7eb"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}>
                    Gradable Forum | 0
                  </button>
                  <button style={{padding: "8px 16px", backgroundColor: "#2563eb", color: "white", borderRadius: "8px", transition: "background-color 0.2s", fontSize: "14px", fontWeight: "medium", border: "none", cursor: "pointer"}} 
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}>
                    Go to Class
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
