import { useW } from '../hooks/useW.js';
import { C, COURSES } from '../data/constants.js';

export function StudentGradeBookPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;

  return (
    <div style={{padding: isLg ? "32px" : "16px", backgroundColor: "#f5f5f5", minHeight: "100vh"}}>
      <div style={{marginBottom: "24px"}}>
        <h1 style={{fontSize: "24px", fontWeight: "bold", color: "#111827", margin: "0 0 8px"}}>My Grade Book</h1>
        <div style={{fontSize: "14px", color: "#6b7280", marginTop: "8px"}}>Home / Pick a course</div>
      </div>

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
        <h2 style={{fontSize: "18px", fontWeight: "bold", color: "#111827", marginBottom: "16px"}}>Courses (1)</h2>
        
        <div style={{overflowX: "auto"}}>
          <table style={{width: "100%", borderCollapse: "collapse"}}>
            <thead>
              <tr style={{backgroundColor: "#f9fafb"}}>
                <th style={{textAlign: "left", padding: "12px", fontSize: "14px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Course</th>
                <th style={{textAlign: "center", padding: "12px", fontSize: "14px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Assignment</th>
                <th style={{textAlign: "center", padding: "12px", fontSize: "14px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Quiz</th>
                <th style={{textAlign: "center", padding: "12px", fontSize: "14px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Forum</th>
                <th style={{textAlign: "center", padding: "12px", fontSize: "14px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", fontWeight: "medium", color: "#111827"}}>
                  Advanced Database Systems - COSC 406
                </td>
                <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: "#6b7280"}}>
                  0.00 / 0.00
                </td>
                <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: "#6b7280"}}>
                  0.00 / 0.00
                </td>
                <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: "#6b7280"}}>
                  0.00 / 0.00
                </td>
                <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center"}}>
                  <button style={{padding: "8px 16px", backgroundColor: "#2563eb", color: "white", borderRadius: "8px", transition: "background-color 0.2s", fontSize: "14px", fontWeight: "medium", border: "none", cursor: "pointer"}} 
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}>
                    See Breakdown
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
