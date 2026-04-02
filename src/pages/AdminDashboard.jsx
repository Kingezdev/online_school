import { useState } from "react";
import { useW } from '../hooks/useW.js';
import { C, COURSES, LECTURER_COURSES } from '../data/constants.js';

export function AdminDashboard({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;

  const totalUsers = 15234;
  const totalCourses = COURSES.length + LECTURER_COURSES.length;
  const totalSessions = 1247;
  const systemUptime = "99.8%";

  return (
    <div style={{padding: isLg ? "32px" : "16px", backgroundColor: "#f5f5f5", minHeight: "100vh"}}>
      <h1 style={{margin: "0 0 24px", fontSize: isLg ? "24px" : "20px", color: "#333", fontWeight: "bold"}}>Dashboard</h1>
      
      {/* System Overview */}
      <div style={{marginBottom: "24px"}}>
        <div style={{backgroundColor: "#2563eb", color: "white", padding: "12px 16px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}>
          <h2 style={{margin: 0, fontSize: "18px", fontWeight: "bold"}}>System Overview</h2>
        </div>
        <div style={{backgroundColor: "white", border: "1px solid #e5e7eb", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", padding: "16px"}}>
          <div style={{display: "flex", gap: "16px", justifyContent: "space-between"}}>
            <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "16px", backgroundColor: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0", flex: "1"}}>
              <div style={{width: "48px", height: "48px", backgroundColor: "#22c55e", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <span style={{color: "white", fontSize: "20px"}}>👥</span>
              </div>
              <div>
                <div style={{fontSize: "24px", fontWeight: "bold", color: "#166534"}}>{totalUsers.toLocaleString()}</div>
                <div style={{fontSize: "14px", color: "#15803d"}}>TOTAL USERS</div>
              </div>
            </div>
            <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "16px", backgroundColor: "#fdf2f8", borderRadius: "8px", border: "1px solid #fbcfe8", flex: "1"}}>
              <div style={{width: "48px", height: "48px", backgroundColor: "#ec4899", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <span style={{color: "white", fontSize: "20px"}}>📚</span>
              </div>
              <div>
                <div style={{fontSize: "24px", fontWeight: "bold", color: "#be185d"}}>{totalCourses}</div>
                <div style={{fontSize: "14px", color: "#9f1239"}}>ACTIVE COURSES</div>
              </div>
            </div>
            <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "16px", backgroundColor: "#fff7ed", borderRadius: "8px", border: "1px solid #fed7aa", flex: "1"}}>
              <div style={{width: "48px", height: "48px", backgroundColor: "#f97316", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <span style={{color: "white", fontSize: "20px"}}>📅</span>
              </div>
              <div>
                <div style={{fontSize: "24px", fontWeight: "bold", color: "#c2410c"}}>{totalSessions.toLocaleString()}</div>
                <div style={{fontSize: "14px", color: "#ea580c"}}>TOTAL SESSIONS</div>
              </div>
            </div>
            <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "16px", backgroundColor: "#f0f9ff", borderRadius: "8px", border: "1px solid #bfdbfe", flex: "1"}}>
              <div style={{width: "48px", height: "48px", backgroundColor: "#0ea5e9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <span style={{color: "white", fontSize: "20px"}}>⚡</span>
              </div>
              <div>
                <div style={{fontSize: "24px", fontWeight: "bold", color: "#075985"}}>{systemUptime}</div>
                <div style={{fontSize: "14px", color: "#0c4a6e"}}>SYSTEM UPTIME</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Management Information */}
      <div style={{marginBottom: "24px"}}>
        <div style={{backgroundColor: "#2563eb", color: "white", padding: "12px 16px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}>
          <h2 style={{margin: 0, fontSize: "18px", fontWeight: "bold"}}>User Management Information</h2>
        </div>
        <div style={{backgroundColor: "white", border: "1px solid #e5e7eb", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", padding: "16px"}}>
          <div style={{overflowX: "auto"}}>
            <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
              <thead>
                <tr style={{backgroundColor: "#f9fafb"}}>
                  <th style={{textAlign: "left", padding: "12px", fontSize: "12px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>User Type</th>
                  <th style={{textAlign: "center", padding: "12px", fontSize: "12px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Count</th>
                  <th style={{textAlign: "center", padding: "12px", fontSize: "12px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Active</th>
                  <th style={{textAlign: "center", padding: "12px", fontSize: "12px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Status</th>
                  <th style={{textAlign: "center", padding: "12px", fontSize: "12px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px"}}>Students</td>
                  <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: "#6b7280"}}>12,456</td>
                  <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: "#6b7280"}}>11,892</td>
                  <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center"}}>
                    <span style={{padding: "4px 8px", backgroundColor: "#dcfce7", color: "#166534", borderRadius: "4px", fontSize: "12px"}}>
                      Active
                    </span>
                  </td>
                  <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center"}}>
                    <button style={{padding: "4px 8px", backgroundColor: "#f3f4f6", color: "#374151", borderRadius: "4px", fontSize: "12px", border: "none", cursor: "pointer"}}>
                      Manage
                    </button>
                  </td>
                </tr>
                <tr>
                  <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px"}}>Lecturers</td>
                  <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: "#6b7280"}}>2,567</td>
                  <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: "#6b7280"}}>2,412</td>
                  <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center"}}>
                    <span style={{padding: "4px 8px", backgroundColor: "#dcfce7", color: "#166534", borderRadius: "4px", fontSize: "12px"}}>
                      Active
                    </span>
                  </td>
                  <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center"}}>
                    <button style={{padding: "4px 8px", backgroundColor: "#f3f4f6", color: "#374151", borderRadius: "4px", fontSize: "12px", border: "none", cursor: "pointer"}}>
                      Manage
                    </button>
                  </td>
                </tr>
                <tr>
                  <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px"}}>Administrators</td>
                  <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: "#6b7280"}}>211</td>
                  <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: "#6b7280"}}>198</td>
                  <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center"}}>
                    <span style={{padding: "4px 8px", backgroundColor: "#dcfce7", color: "#166534", borderRadius: "4px", fontSize: "12px"}}>
                      Active
                    </span>
                  </td>
                  <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center"}}>
                    <button style={{padding: "4px 8px", backgroundColor: "#f3f4f6", color: "#374151", borderRadius: "4px", fontSize: "12px", border: "none", cursor: "pointer"}}>
                      Manage
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* System Activities */}
      <div style={{marginBottom: "24px"}}>
        <div style={{backgroundColor: "#2563eb", color: "white", padding: "12px 16px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}>
          <h2 style={{margin: 0, fontSize: "18px", fontWeight: "bold"}}>System Activities</h2>
        </div>
        <div style={{backgroundColor: "white", border: "1px solid #e5e7eb", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", padding: "16px"}}>
          <div style={{display: "flex", gap: "16px"}}>
            <div style={{flex: "1"}}>
              <div style={{backgroundColor: "#dbeafe", color: "#1e40af", padding: "8px 12px", borderTopLeftRadius: "6px", borderTopRightRadius: "6px", fontSize: "14px", fontWeight: "bold"}}>
                Recent Logins
              </div>
              <div style={{backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderBottomLeftRadius: "6px", borderBottomRightRadius: "6px", padding: "16px"}}>
                <div style={{color: "#dc2626", fontSize: "14px"}}>
                  Last hour: 1,234 users<br/>
                  Last 24 hours: 8,567 users<br/>
                  Today: 12,456 active users
                </div>
              </div>
            </div>
            <div style={{flex: "1"}}>
              <div style={{backgroundColor: "#dbeafe", color: "#1e40af", padding: "8px 12px", borderTopLeftRadius: "6px", borderTopRightRadius: "6px", fontSize: "14px", fontWeight: "bold"}}>
                System Health
              </div>
              <div style={{backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderBottomLeftRadius: "6px", borderBottomRightRadius: "6px", padding: "16px"}}>
                <div style={{color: "#dc2626", fontSize: "14px"}}>
                  Database: Optimal<br/>
                  Server Load: Normal<br/>
                  Storage: 67% used
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Administrative Activity */}
      <div>
        <div style={{backgroundColor: "#2563eb", color: "white", padding: "12px 16px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}>
          <h2 style={{margin: 0, fontSize: "18px", fontWeight: "bold"}}>Recent Administrative Activity</h2>
        </div>
        <div style={{backgroundColor: "white", border: "1px solid #e5e7eb", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", padding: "16px"}}>
          <div style={{backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", padding: "16px"}}>
            <div style={{color: "#dc2626", fontSize: "14px"}}>
              Recent admin activity will be displayed here<br/>
              Including user management, course updates, and system changes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
