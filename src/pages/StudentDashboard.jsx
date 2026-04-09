import { useState, useEffect } from "react";
import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';
import { dashboardAPI, courseAPI, attendanceAPI } from '../utils/api.js';

export function StudentDashboard({ setPage }) {
  const w = useW(); 
  const isLg = w >= 1024;
  const [dashboardData, setDashboardData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQRCodes, setActiveQRCodes] = useState([]);
  const [qrLoading, setQrLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardResponse, coursesResponse] = await Promise.all([
          dashboardAPI.getStudent(),
          courseAPI.getAll()
        ]);
        
        setDashboardData(dashboardResponse);
        setCourses(coursesResponse.courses || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchActiveQRCodes = async () => {
      try {
        setQrLoading(true);
        const response = await attendanceAPI.getActiveQRCodes();
        if (response.success) {
          // Filter out QR codes that the student has already marked attendance for
          const filteredQRCodes = (response.activeQRCodes || []).filter(qr => {
            // Check if student has already marked attendance for this QR code
            return !qr.alreadyMarked;
          });
          setActiveQRCodes(filteredQRCodes);
        }
      } catch (error) {
        console.error('Failed to fetch active QR codes:', error);
      } finally {
        setQrLoading(false);
      }
    };

    fetchActiveQRCodes();
    // Refresh every 30 seconds
    const interval = setInterval(fetchActiveQRCodes, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{padding: isLg ? "32px" : "16px", backgroundColor: "#f5f5f5", minHeight: "100vh"}}>
      <h1 style={{margin: "0 0 24px", fontSize: isLg ? "24px" : "20px", color: "#333", fontWeight: "bold"}}>Dashboard</h1>
      
      {/* QR Attendance Alert - Only shows when QR codes are active */}
      {!qrLoading && activeQRCodes.length > 0 && (
        <div style={{marginBottom: "24px"}}>
          <div style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "white",
            padding: "16px 20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: "16px"
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px"
            }}>
              QR
            </div>
            <div style={{flex: 1}}>
              <div style={{fontSize: "18px", fontWeight: "bold", marginBottom: "4px"}}>
                QR Attendance Active!
              </div>
              <div style={{fontSize: "14px", opacity: 0.9, marginBottom: "12px"}}>
                {activeQRCodes.length} QR code{activeQRCodes.length > 1 ? 's' : ''} available for your courses
              </div>
              <button
                onClick={() => setPage('qr attendance')}
                style={{
                  background: "white",
                  color: "#10b981",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                Scan QR Code
              </button>
            </div>
            <div style={{
              fontSize: "32px",
              animation: "pulse 2s infinite"
            }}>
              1
            </div>
          </div>
        </div>
      )}
      
      {/* Course & Grouping Information */}
      <div style={{marginBottom: "24px"}}>
        <div style={{backgroundColor: "#2563eb", color: "white", padding: "12px 16px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}>
          <h2 style={{margin: 0, fontSize: "18px", fontWeight: "bold"}}>Course & Grouping Information</h2>
        </div>
        <div style={{backgroundColor: "white", border: "1px solid #e5e7eb", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", padding: "16px"}}>
          <div style={{display: "flex", gap: "16px", justifyContent: "space-between"}}>
            <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "16px", backgroundColor: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0", flex: "1"}}>
              <div style={{width: "48px", height: "48px", backgroundColor: "#22c55e", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <span style={{color: "white", fontSize: "20px"}}>🎓</span>
              </div>
              <div>
                <div style={{fontSize: "24px", fontWeight: "bold", color: "#166534"}}>{loading ? "..." : courses.length}</div>
                <div style={{fontSize: "14px", color: "#15803d"}}>COURSES</div>
              </div>
            </div>
            <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "16px", backgroundColor: "#fdf2f8", borderRadius: "8px", border: "1px solid #fbcfe8", flex: "1"}}>
              <div style={{width: "48px", height: "48px", backgroundColor: "#ec4899", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <span style={{color: "white", fontSize: "20px"}}>�</span>
              </div>
              <div>
                <div style={{fontSize: "24px", fontWeight: "bold", color: "#be185d"}}>{loading ? "..." : dashboardData?.assignments || 0}</div>
                <div style={{fontSize: "14px", color: "#9f1239"}}>ASSIGNMENTS</div>
              </div>
            </div>
            <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "16px", backgroundColor: "#fff7ed", borderRadius: "8px", border: "1px solid #fed7aa", flex: "1"}}>
              <div style={{width: "48px", height: "48px", backgroundColor: "#f97316", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <span style={{color: "white", fontSize: "20px"}}>�</span>
              </div>
              <div>
                <div style={{fontSize: "24px", fontWeight: "bold", color: "#c2410c"}}>{loading ? "..." : dashboardData?.averageGrade || "N/A"}</div>
                <div style={{fontSize: "14px", color: "#ea580c"}}>AVG GRADE</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Progress Information */}
      <div style={{marginBottom: "24px"}}>
        <div style={{backgroundColor: "#2563eb", color: "white", padding: "12px 16px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}>
          <h2 style={{margin: 0, fontSize: "18px", fontWeight: "bold"}}>Course Progress Information</h2>
        </div>
        <div style={{backgroundColor: "white", border: "1px solid #e5e7eb", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", padding: "16px"}}>
          <div style={{overflowX: "auto"}}>
            <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
              <thead>
                <tr style={{backgroundColor: "#f9fafb"}}>
                  <th style={{textAlign: "left", padding: "12px", fontSize: "12px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Name</th>
                  <th style={{textAlign: "center", padding: "12px", fontSize: "12px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Assignment Completion</th>
                  <th style={{textAlign: "center", padding: "12px", fontSize: "12px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Quiz Completion</th>
                  <th style={{textAlign: "center", padding: "12px", fontSize: "12px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Forum Participation</th>
                  <th style={{textAlign: "center", padding: "12px", fontSize: "12px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Progress</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px"}}>COSC 406 - Advanced Database Systems</td>
                  <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: "#6b7280"}}>0 out of 0</td>
                  <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: "#6b7280"}}>0 out of 0</td>
                  <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: "#6b7280"}}>0 out of 0</td>
                  <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center"}}>
                    <span style={{padding: "4px 8px", backgroundColor: "#f3f4f6", color: "#6b7280", borderRadius: "4px", fontSize: "12px"}}>N/A</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Deadlines */}
      <div style={{marginBottom: "24px"}}>
        <div style={{backgroundColor: "#2563eb", color: "white", padding: "12px 16px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}>
          <h2 style={{margin: 0, fontSize: "18px", fontWeight: "bold"}}>Deadlines</h2>
        </div>
        <div style={{backgroundColor: "white", border: "1px solid #e5e7eb", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", padding: "16px"}}>
          <div style={{display: "flex", gap: "16px"}}>
            <div style={{flex: "1"}}>
              <div style={{backgroundColor: "#dbeafe", color: "#1e40af", padding: "8px 12px", borderTopLeftRadius: "6px", borderTopRightRadius: "6px", fontSize: "14px", fontWeight: "bold"}}>
                Quiz Deadlines
              </div>
              <div style={{backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderBottomLeftRadius: "6px", borderBottomRightRadius: "6px", padding: "16px"}}>
                <div style={{color: "#dc2626", fontSize: "14px"}}>
                  We're sorry we can't display any quiz details<br/>
                  No gradable quiz with deadline for you yet!
                </div>
              </div>
            </div>
            <div style={{flex: "1"}}>
              <div style={{backgroundColor: "#dbeafe", color: "#1e40af", padding: "8px 12px", borderTopLeftRadius: "6px", borderTopRightRadius: "6px", fontSize: "14px", fontWeight: "bold"}}>
                Assignment Deadlines
              </div>
              <div style={{backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderBottomLeftRadius: "6px", borderBottomRightRadius: "6px", padding: "16px"}}>
                <div style={{color: "#dc2626", fontSize: "14px"}}>
                  We're sorry we can't display any assignment details<br/>
                  No gradable assignment with deadline for you yet!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forum Activity */}
      <div>
        <div style={{backgroundColor: "#2563eb", color: "white", padding: "12px 16px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}>
          <h2 style={{margin: 0, fontSize: "18px", fontWeight: "bold"}}>Forum Activity - Latest topics & comments</h2>
        </div>
        <div style={{backgroundColor: "white", border: "1px solid #e5e7eb", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", padding: "16px"}}>
          <div style={{backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", padding: "16px"}}>
            <div style={{color: "#dc2626", fontSize: "14px"}}>
              We're sorry we can't display any forum activity<br/>
              No course forum yet!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
