import { useState } from "react";
import { useW } from '../hooks/useW.js';
import { C, COURSES, LECTURER_COURSES } from '../data/constants.js';
import { SectionCard, Badge, StatPill } from '../components/shared/SectionCard.jsx';

export function AdminDashboard({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;
  const [activeTab, setActiveTab] = useState("users");
  const [showUserForm, setShowUserForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const systemStats = [
    { label: "Total Users", value: "15,234", icon: "👥", color: C.blue },
    { label: "Active Courses", value: "48", icon: "📚", color: C.green },
    { label: "Total Sessions", value: "1,247", icon: "📅", color: C.orange },
    { label: "System Uptime", value: "99.8%", icon: "⚡", color: C.teal },
  ];

  // Sample users data
  const users = [
    { id: 1, name: "Ahmad Jafar", email: "ahmad.jafar@abu.edu.ng", role: "lecturer", status: "active", courses: 4 },
    { id: 2, name: "Khadija Hassan", email: "khadija.hassan@abu.edu.ng", role: "lecturer", status: "active", courses: 3 },
    { id: 3, name: "Musa Ibrahim", email: "musa.ibrahim@abu.edu.ng", role: "student", status: "active", courses: 6 },
    { id: 4, name: "Fatima Ali", email: "fatima.ali@abu.edu.ng", role: "student", status: "inactive", courses: 5 },
    { id: 5, name: "Omar Hassan", email: "omar.hassan@abu.edu.ng", role: "student", status: "active", courses: 4 },
  ];

  // Sample courses data
  const courses = [
    { code: "COSC 203", name: "Discrete Structures", lecturer: "Ahmad Jafar", students: 48, status: "active", sessions: 24 },
    { code: "STAT 201", name: "Probability and Statistics", lecturer: "Khadija Hassan", students: 55, status: "active", sessions: 30 },
    { code: "MATH 207", name: "Linear Algebra", lecturer: "Ahmad Jafar", students: 42, status: "inactive", sessions: 18 },
    { code: "COSC 205", name: "Digital Logic Design", lecturer: "Khadija Hassan", students: 45, status: "active", sessions: 22 },
  ];

  // Sample sessions data
  const sessions = [
    { id: 1, course: "COSC 203", type: "lecture", date: "2026-03-25", time: "09:00 AM", room: "Lab 201", status: "scheduled" },
    { id: 2, course: "STAT 201", type: "lab", date: "2026-03-25", time: "11:00 AM", room: "Lab 203", status: "in-progress" },
    { id: 3, course: "MATH 207", type: "tutorial", date: "2026-03-25", time: "02:00 PM", room: "Room 105", status: "completed" },
    { id: 4, course: "COSC 205", type: "lecture", date: "2026-03-26", time: "10:00 AM", room: "Lab 205", status: "scheduled" },
  ];

  const recentActivity = [
    { user: "Admin", action: "Created new user account", time: "2 hours ago", type: "user" },
    { user: "Admin", action: "Updated course schedule", time: "3 hours ago", type: "course" },
    { user: "Admin", action: "Generated global report", time: "5 hours ago", type: "report" },
    { user: "System", action: "Database backup completed", time: "6 hours ago", type: "system" },
  ];

  const addUser = () => {
    setShowUserForm(true);
    setTimeout(() => {
      setShowUserForm(false);
      alert("User added successfully!");
    }, 2000);
  };

  const addCourse = () => {
    setShowCourseForm(true);
    setTimeout(() => {
      setShowCourseForm(false);
      alert("Course created successfully!");
    }, 2000);
  };

  const configureSession = () => {
    setShowSessionForm(true);
    setTimeout(() => {
      setShowSessionForm(false);
      alert("Session configured successfully!");
    }, 2000);
  };

  const generateGlobalReport = () => {
    setShowReportModal(true);
    setTimeout(() => {
      setShowReportModal(false);
      alert("Global report generated successfully!\n\nReport includes:\n• User statistics\n• Course performance\n• Attendance analytics\n• System metrics\n\nReport downloaded as PDF.");
    }, 2000);
  };

  const generateReport = () => {
    alert("Generating admin report...\n\nReport includes:\n• System overview\n• User management summary\n• Course statistics\n• Session analytics\n• Performance metrics\n\nReport will be downloaded as PDF.");
  };

  return (
    <div style={{padding:isLg?"24px 32px":16, position:"relative"}}>
      {/* System Statistics */}
      <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(4,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:isLg?16:12,marginBottom:16}}>
        {systemStats.map((stat, index) => (
          <SectionCard key={index} style={{height:"100%"}}>
            <div style={{padding:20,textAlign:"center"}}>
              <StatPill icon={stat.icon} value={stat.value} label={stat.label} color={stat.color} />
            </div>
          </SectionCard>
        ))}
      </div>

      {/* Management Tabs */}
      <div style={{marginBottom:16}}>
        <div style={{display:"flex",gap:4,background:"#f5f5f5",borderRadius:8,padding:4}}>
          {[
            {id: "users", label: "Manage Users", icon: "👥"},
            {id: "courses", label: "Manage Courses", icon: "📚"},
            {id: "sessions", label: "Configure Sessions", icon: "📅"},
            {id: "reports", label: "Global Reports", icon: "📊"}
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex:1,
                padding:"8px 12px",
                border:"none",
                borderRadius:6,
                background:activeTab === tab.id ? "white" : "transparent",
                color:activeTab === tab.id ? C.blue : "#666",
                fontSize:12,
                fontWeight:activeTab === tab.id ? 600 : 400,
                cursor:"pointer",
                transition:"all 0.2s",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                gap:6
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "users" && (
        <div>
          <SectionCard title="User Management" icon="👥" color={C.blue}>
            <div style={{padding:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <h3 style={{margin:0,fontSize:14,fontWeight:600,color:"#333"}}>All Users</h3>
                <button onClick={addUser} style={{
                  background:C.blue,color:"white",border:"none",borderRadius:6,
                  padding:"6px 12px",fontSize:11,cursor:"pointer",fontWeight:600
                }}>
                  + Add User
                </button>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead>
                    <tr style={{background:"#f5f5f5"}}>
                      <th style={{padding:"8px",textAlign:"left",color:"#555",fontWeight:600}}>Name</th>
                      <th style={{padding:"8px",textAlign:"left",color:"#555",fontWeight:600}}>Email</th>
                      <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Role</th>
                      <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Status</th>
                      <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Courses</th>
                      <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={index}>
                        <td style={{padding:"8px",borderTop:"1px solid #eee",color:"#333",fontWeight:500}}>{user.name}</td>
                        <td style={{padding:"8px",borderTop:"1px solid #eee",color:"#666"}}>{user.email}</td>
                        <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                          <Badge color={user.role === "lecturer" ? C.blue : C.green}>
                            {user.role}
                          </Badge>
                        </td>
                        <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                          <Badge color={user.status === "active" ? C.green : C.red}>
                            {user.status}
                          </Badge>
                        </td>
                        <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>{user.courses}</td>
                        <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                          <button style={{background:C.orange,color:"white",border:"none",borderRadius:4,padding:"2px 6px",fontSize:9,cursor:"pointer"}}>
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {activeTab === "courses" && (
        <div>
          <SectionCard title="Course Management" icon="📚" color={C.green}>
            <div style={{padding:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <h3 style={{margin:0,fontSize:14,fontWeight:600,color:"#333"}}>All Courses</h3>
                <button onClick={addCourse} style={{
                  background:C.green,color:"white",border:"none",borderRadius:6,
                  padding:"6px 12px",fontSize:11,cursor:"pointer",fontWeight:600
                }}>
                  + Add Course
                </button>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead>
                    <tr style={{background:"#f5f5f5"}}>
                      <th style={{padding:"8px",textAlign:"left",color:"#555",fontWeight:600}}>Code</th>
                      <th style={{padding:"8px",textAlign:"left",color:"#555",fontWeight:600}}>Name</th>
                      <th style={{padding:"8px",textAlign:"left",color:"#555",fontWeight:600}}>Lecturer</th>
                      <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Students</th>
                      <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Sessions</th>
                      <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Status</th>
                      <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course, index) => (
                      <tr key={index}>
                        <td style={{padding:"8px",borderTop:"1px solid #eee",color:"#333",fontWeight:500}}>{course.code}</td>
                        <td style={{padding:"8px",borderTop:"1px solid #eee",color:"#333"}}>{course.name}</td>
                        <td style={{padding:"8px",borderTop:"1px solid #eee",color:"#666"}}>{course.lecturer}</td>
                        <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>{course.students}</td>
                        <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>{course.sessions}</td>
                        <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                          <Badge color={course.status === "active" ? C.green : C.red}>
                            {course.status}
                          </Badge>
                        </td>
                        <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                          <button style={{background:C.orange,color:"white",border:"none",borderRadius:4,padding:"2px 6px",fontSize:9,cursor:"pointer"}}>
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {activeTab === "sessions" && (
        <div>
          <SectionCard title="Session Configuration" icon="📅" color={C.orange}>
            <div style={{padding:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <h3 style={{margin:0,fontSize:14,fontWeight:600,color:"#333"}}>All Sessions</h3>
                <button onClick={configureSession} style={{
                  background:C.orange,color:"white",border:"none",borderRadius:6,
                  padding:"6px 12px",fontSize:11,cursor:"pointer",fontWeight:600
                }}>
                  + Configure Session
                </button>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead>
                    <tr style={{background:"#f5f5f5"}}>
                      <th style={{padding:"8px",textAlign:"left",color:"#555",fontWeight:600}}>Course</th>
                      <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Type</th>
                      <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Date</th>
                      <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Time</th>
                      <th style={{padding:"8px",textAlign:"left",color:"#555",fontWeight:600}}>Room</th>
                      <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Status</th>
                      <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session, index) => (
                      <tr key={index}>
                        <td style={{padding:"8px",borderTop:"1px solid #eee",color:"#333",fontWeight:500}}>{session.course}</td>
                        <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                          <Badge color={session.type === "lecture" ? C.blue : session.type === "lab" ? C.green : C.orange}>
                            {session.type}
                          </Badge>
                        </td>
                        <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>{session.date}</td>
                        <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>{session.time}</td>
                        <td style={{padding:"8px",borderTop:"1px solid #eee",color:"#666"}}>{session.room}</td>
                        <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                          <Badge color={
                            session.status === "completed" ? C.green : 
                            session.status === "in-progress" ? C.orange : 
                            C.blue
                          }>
                            {session.status}
                          </Badge>
                        </td>
                        <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                          <button style={{background:C.orange,color:"white",border:"none",borderRadius:4,padding:"2px 6px",fontSize:9,cursor:"pointer"}}>
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {activeTab === "reports" && (
        <div>
          <SectionCard title="Global Reports" icon="📊" color={C.purple}>
            <div style={{padding:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <h3 style={{margin:0,fontSize:14,fontWeight:600,color:"#333"}}>System Reports</h3>
                <button onClick={generateGlobalReport} style={{
                  background:C.purple,color:"white",border:"none",borderRadius:6,
                  padding:"6px 12px",fontSize:11,cursor:"pointer",fontWeight:600
                }}>
                  Generate Global Report
                </button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(2,1fr)":w>=640?"1fr 1fr":"1fr",gap:12}}>
                {[
                  { title: "User Analytics", icon: "👥", count: "15,234", change: "+2.3%" },
                  { title: "Course Performance", icon: "📚", count: "48", change: "+5.2%" },
                  { title: "Attendance Rates", icon: "✅", count: "87.3%", change: "+1.8%" },
                  { title: "System Usage", icon: "⚡", count: "99.8%", change: "0.0%" }
                ].map((report, index) => (
                  <div key={index} style={{
                    background:"#f9f9f9",border:"1px solid #e0e0e0",borderRadius:8,
                    padding:16,cursor:"pointer",transition:"all 0.2s"
                  }}
                  onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                      <div style={{width:40,height:40,borderRadius:"50%",background:C.purple,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>
                        {report.icon}
                      </div>
                      <div>
                        <div style={{fontSize:12,fontWeight:600,color:"#333"}}>{report.title}</div>
                        <div style={{fontSize:10,color:"#666"}}>Last updated: 2 hours ago</div>
                      </div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{fontSize:18,fontWeight:700,color:"#333"}}>{report.count}</div>
                      <div style={{fontSize:10,color:C.green,fontWeight:600}}>{report.change}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {/* Recent Activity */}
      <div style={{marginTop:16}}>
        <SectionCard title="Recent Activity" icon="🕐" color={C.blue}>
          <div style={{padding:16}}>
            {recentActivity.map((activity, index) => (
              <div key={index} style={{
                display:"flex",alignItems:"center",gap:12,padding:"12px 0",
                borderBottom:index < recentActivity.length - 1 ? "1px solid #f0f0f0" : "none"
              }}>
                <div style={{
                  width:32,height:32,borderRadius:"50%",
                  background:activity.type === "system" ? C.teal : activity.type === "report" ? C.purple : activity.type === "course" ? C.green : C.blue,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"white"
                }}>
                  {activity.type === "system" ? "⚙️" : activity.type === "report" ? "📊" : activity.type === "course" ? "📚" : "👥"}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#333",marginBottom:2}}>{activity.user}</div>
                  <div style={{fontSize:11,color:"#666",marginBottom:2}}>{activity.action}</div>
                  <div style={{fontSize:10,color:"#aaa"}}>{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Generate Report Button */}
      <div style={{marginTop:16,textAlign:"center"}}>
        <button onClick={generateReport} style={{
          background:C.purple,color:"white",border:"none",borderRadius:8,
          padding:"12px 24px",fontSize:13,cursor:"pointer",fontWeight:600
        }}>
          📊 Generate Admin Report
        </button>
      </div>

      {/* Modal Overlays */}
      {showUserForm && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000}}>
          <div style={{background:"white",borderRadius:16,padding:32,width:"100%",maxWidth:400,textAlign:"center"}}>
            <div style={{fontSize:24,fontWeight:700,color:"#333",marginBottom:16}}>Adding User...</div>
            <div style={{width:60,height:60,borderRadius:"50%",background:"#f0f0f0",margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,animation:"pulse 1.5s infinite"}}>
              👥
            </div>
            <div style={{fontSize:14,color:"#666"}}>Creating new user account...</div>
          </div>
        </div>
      )}

      {showCourseForm && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000}}>
          <div style={{background:"white",borderRadius:16,padding:32,width:"100%",maxWidth:400,textAlign:"center"}}>
            <div style={{fontSize:24,fontWeight:700,color:"#333",marginBottom:16}}>Creating Course...</div>
            <div style={{width:60,height:60,borderRadius:"50%",background:"#f0f0f0",margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,animation:"pulse 1.5s infinite"}}>
              📚
            </div>
            <div style={{fontSize:14,color:"#666"}}>Setting up new course...</div>
          </div>
        </div>
      )}

      {showSessionForm && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000}}>
          <div style={{background:"white",borderRadius:16,padding:32,width:"100%",maxWidth:400,textAlign:"center"}}>
            <div style={{fontSize:24,fontWeight:700,color:"#333",marginBottom:16}}>Configuring Session...</div>
            <div style={{width:60,height:60,borderRadius:"50%",background:"#f0f0f0",margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,animation:"pulse 1.5s infinite"}}>
              📅
            </div>
            <div style={{fontSize:14,color:"#666"}}>Setting up session parameters...</div>
          </div>
        </div>
      )}

      {showReportModal && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000}}>
          <div style={{background:"white",borderRadius:16,padding:32,width:"100%",maxWidth:400,textAlign:"center"}}>
            <div style={{fontSize:24,fontWeight:700,color:"#333",marginBottom:16}}>Generating Report...</div>
            <div style={{width:60,height:60,borderRadius:"50%",background:"#f0f0f0",margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,animation:"pulse 1.5s infinite"}}>
              📊
            </div>
            <div style={{fontSize:14,color:"#666"}}>Compiling global system data...</div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
