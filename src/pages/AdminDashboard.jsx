import { useState, useEffect } from "react";
import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';
import { dashboardAPI } from '../utils/api.js';

export function AdminDashboard({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dashboardAPI.getAdmin();
        if (response.success) {
          setDashboardData(response.data);
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{padding: isLg ? "32px" : "16px", backgroundColor: "#f5f5f5", minHeight: "100vh"}}>
        <div style={{textAlign: "center", padding: "50px"}}>
          <div style={{fontSize: "18px", color: "#666"}}>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{padding: isLg ? "32px" : "16px", backgroundColor: "#f5f5f5", minHeight: "100vh"}}>
        <div style={{textAlign: "center", padding: "50px"}}>
          <div style={{fontSize: "18px", color: "#dc2626"}}>Error: {error}</div>
        </div>
      </div>
    );
  }

  const { overview, userDistribution, recentUsers, recentCourses, courseStats, systemHealth } = dashboardData || {};

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
                <span style={{color: "white", fontSize: "20px"}}>???</span>
              </div>
              <div>
                <div style={{fontSize: "24px", fontWeight: "bold", color: "#166534"}}>{overview?.totalUsers || 0}</div>
                <div style={{fontSize: "14px", color: "#15803d"}}>TOTAL USERS</div>
              </div>
            </div>
            <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "16px", backgroundColor: "#fdf2f8", borderRadius: "8px", border: "1px solid #fbcfe8", flex: "1"}}>
              <div style={{width: "48px", height: "48px", backgroundColor: "#ec4899", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <span style={{color: "white", fontSize: "20px"}}>???</span>
              </div>
              <div>
                <div style={{fontSize: "24px", fontWeight: "bold", color: "#be185d"}}>{overview?.totalCourses || 0}</div>
                <div style={{fontSize: "14px", color: "#9f1239"}}>ACTIVE COURSES</div>
              </div>
            </div>
            <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "16px", backgroundColor: "#fff7ed", borderRadius: "8px", border: "1px solid #fed7aa", flex: "1"}}>
              <div style={{width: "48px", height: "48px", backgroundColor: "#f97316", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <span style={{color: "white", fontSize: "20px"}}>??</span>
              </div>
              <div>
                <div style={{fontSize: "24px", fontWeight: "bold", color: "#c2410c"}}>{overview?.totalAssignments || 0}</div>
                <div style={{fontSize: "14px", color: "#ea580c"}}>TOTAL ASSIGNMENTS</div>
              </div>
            </div>
            <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "16px", backgroundColor: "#f0f9ff", borderRadius: "8px", border: "1px solid #bfdbfe", flex: "1"}}>
              <div style={{width: "48px", height: "48px", backgroundColor: "#0ea5e9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <span style={{color: "white", fontSize: "20px"}}>??</span>
              </div>
              <div>
                <div style={{fontSize: "24px", fontWeight: "bold", color: "#075985"}}>{systemHealth?.uptime || "N/A"}</div>
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
                {userDistribution?.map((userType, index) => (
                  <tr key={index}>
                    <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px"}}>{userType.type}</td>
                    <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: "#6b7280"}}>{userType.count}</td>
                    <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: "#6b7280"}}>{userType.active}</td>
                    <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center"}}>
                      <span style={{padding: "4px 8px", backgroundColor: "#dcfce7", color: "#166534", borderRadius: "4px", fontSize: "12px"}}>
                        Active
                      </span>
                    </td>
                    <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center"}}>
                      <button 
                        onClick={() => setPage('users')}
                        style={{padding: "4px 8px", backgroundColor: "#f3f4f6", color: "#374151", borderRadius: "4px", fontSize: "12px", border: "none", cursor: "pointer"}}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
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
                  {recentUsers?.length > 0 ? (
                    recentUsers.slice(0, 5).map((user, index) => (
                      <div key={index} style={{marginBottom: "8px"}}>
                        <strong>{user.firstName} {user.lastName}</strong> ({user.username})<br/>
                        <small style={{color: "#666"}}>{user.role} - {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</small>
                      </div>
                    ))
                  ) : (
                    <div>No recent logins</div>
                  )}
                </div>
              </div>
            </div>
            <div style={{flex: "1"}}>
              <div style={{backgroundColor: "#dbeafe", color: "#1e40af", padding: "8px 12px", borderTopLeftRadius: "6px", borderTopRightRadius: "6px", fontSize: "14px", fontWeight: "bold"}}>
                System Health
              </div>
              <div style={{backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderBottomLeftRadius: "6px", borderBottomRightRadius: "6px", padding: "16px"}}>
                <div style={{color: "#dc2626", fontSize: "14px"}}>
                  Database: {systemHealth?.databaseStatus || 'Unknown'}<br/>
                  Server Load: {systemHealth?.serverLoad || 'Unknown'}<br/>
                  Storage: {systemHealth?.storageUsage || 'Unknown'}
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
              {recentCourses?.length > 0 ? (
                recentCourses.slice(0, 5).map((course, index) => (
                  <div key={index} style={{marginBottom: "8px"}}>
                    <strong>{course.code}</strong> - {course.name}<br/>
                    <small style={{color: "#666"}}>
                      Lecturer: {course.lecturerFirstName} {course.lecturerLastName} | 
                      Students: {course.studentCount} | 
                      Created: {new Date(course.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                ))
              ) : (
                <div>No recent courses</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
