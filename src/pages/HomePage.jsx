import { useW } from '../hooks/useW.js';
import { C, COURSES, LECTURER_COURSES } from '../data/constants.js';
import { SectionCard, Badge, StatPill } from '../components/shared/SectionCard.jsx';

export function HomePage({ setPage, role }) {
  const w = useW();
  const isLg = w >= 1024;

  // Student Homepage Content
  if (role === "student") {
    const studentStats = [
      { icon: "📚", value: "9", label: "Enrolled Courses", color: C.blue },
      { icon: "✅", value: "87%", label: "Attendance Rate", color: C.green },
      { icon: "📊", value: "3.6", label: "GPA", color: C.orange },
      { icon: "📝", value: "12", label: "Pending Tasks", color: C.purple },
    ];

    const upcomingDeadlines = [
      { title: "Data Structures Assignment", course: "COSC 203", dueDate: "2026-03-28", priority: "high" },
      { title: "Probability Quiz", course: "STAT 201", dueDate: "2026-03-30", priority: "medium" },
      { title: "Linear Algebra Test", course: "MATH 207", dueDate: "2026-04-02", priority: "low" },
    ];

    const recentCourses = COURSES.slice(0, 4);

    return (
      <div style={{padding:isLg?"24px 32px":16}}>
        <div style={{marginBottom:24}}>
          <h2 style={{margin:"0 0 8px",fontSize:isLg?24:18,color:"#333",fontWeight:700}}>Welcome Back, Student!</h2>
          <p style={{margin:0,color:"#666",fontSize:14}}>Here's your academic overview for today</p>
        </div>

        {/* Student Statistics */}
        <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(4,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:16,marginBottom:24}}>
          {studentStats.map((stat, index) => (
            <SectionCard key={index} style={{height:"100%"}}>
              <div style={{padding:20,textAlign:"center"}}>
                <StatPill icon={stat.icon} value={stat.value} label={stat.label} color={stat.color} />
              </div>
            </SectionCard>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:isLg?"2fr 1fr":"1fr",gap:16}}>
          {/* Recent Courses */}
          <SectionCard title="My Courses" icon="📚" color={C.blue}>
            <div style={{padding:16}}>
              {recentCourses.map((course, index) => (
                <div key={index} style={{
                  display:"flex",
                  alignItems:"center",
                  gap:12,
                  padding:"12px 0",
                  borderBottom:index < recentCourses.length - 1 ? "1px solid #f0f0f0" : "none",
                  cursor:"pointer"
                }}
                  onClick={() => setPage("my courses")}>
                  <div style={{
                    width:40,
                    height:40,
                    borderRadius:"50%",
                    background:C.blue,
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    fontSize:16,
                    color:"white"
                  }}>📚</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:"#333",marginBottom:2}}>{course.code}</div>
                    <div style={{fontSize:11,color:"#666"}}>{course.name}</div>
                    <div style={{fontSize:10,color:"#888",marginTop:2}}>{course.students} students</div>
                  </div>
                  <Badge color={C.blue}>Active</Badge>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Upcoming Deadlines */}
          <SectionCard title="Upcoming Deadlines" icon="⏰" color={C.red}>
            <div style={{padding:16}}>
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} style={{
                  padding:"12px",
                  background:deadline.priority === "high" ? "#fff5f5" : deadline.priority === "medium" ? "#fffbf0" : "#f0f8ff",
                  borderRadius:8,
                  marginBottom:8,
                  borderLeft:`3px solid ${deadline.priority === "high" ? C.red : deadline.priority === "medium" ? C.orange : C.blue}`
                }}>
                  <div style={{fontSize:12,fontWeight:600,color:"#333",marginBottom:4}}>{deadline.title}</div>
                  <div style={{fontSize:10,color:"#666",marginBottom:2}}>
                    <Badge color={C.blue}>{deadline.course}</Badge>
                  </div>
                  <div style={{fontSize:10,color:"#888"}}>Due: {deadline.dueDate}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    );
  }

  // Lecturer Homepage Content
  if (role === "lecturer") {
    const lecturerStats = [
      { icon: "📚", value: "4", label: "Active Courses", color: C.blue },
      { icon: "👥", value: "451", label: "Total Students", color: C.green },
      { icon: "✅", value: "92%", label: "Avg Attendance", color: C.orange },
      { icon: "📝", value: "18", label: "Pending Grades", color: C.purple },
    ];

    const todaySchedule = [
      { time: "09:00 - 10:30", course: "COSC 203 - Discrete Structures", room: "Lab 201", type: "lecture" },
      { time: "11:00 - 12:30", course: "COSC 205 - Digital Logic Design", room: "Lab 203", type: "lab" },
      { time: "14:00 - 15:30", course: "COSC 211 - OOP I", room: "Lab 205", type: "tutorial" },
    ];

    const recentActivities = [
      { action: "Attendance marked", course: "COSC 203", time: "2 hours ago" },
      { action: "Assignment graded", course: "STAT 201", time: "4 hours ago" },
      { action: "New material uploaded", course: "COSC 205", time: "1 day ago" },
    ];

    return (
      <div style={{padding:isLg?"24px 32px":16}}>
        <div style={{marginBottom:24}}>
          <h2 style={{margin:"0 0 8px",fontSize:isLg?24:18,color:"#333",fontWeight:700}}>Welcome Back, Lecturer!</h2>
          <p style={{margin:0,color:"#666",fontSize:14}}>Here's your teaching overview for today</p>
        </div>

        {/* Lecturer Statistics */}
        <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(4,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:16,marginBottom:24}}>
          {lecturerStats.map((stat, index) => (
            <SectionCard key={index} style={{height:"100%"}}>
              <div style={{padding:20,textAlign:"center"}}>
                <StatPill icon={stat.icon} value={stat.value} label={stat.label} color={stat.color} />
              </div>
            </SectionCard>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:isLg?"2fr 1fr":"1fr",gap:16}}>
          {/* Today's Schedule */}
          <SectionCard title="Today's Schedule" icon="📅" color={C.green}>
            <div style={{padding:16}}>
              {todaySchedule.map((item, index) => (
                <div key={index} style={{
                  display:"flex",
                  alignItems:"center",
                  gap:12,
                  padding:"12px 0",
                  borderBottom:index < todaySchedule.length - 1 ? "1px solid #f0f0f0" : "none"
                }}>
                  <div style={{
                    width:40,
                    height:40,
                    borderRadius:"50%",
                    background:item.type === "lecture" ? C.blue : item.type === "lab" ? C.green : C.orange,
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    fontSize:16,
                    color:"white"
                  }}>{item.type === "lecture" ? "📚" : item.type === "lab" ? "🔬" : "💻"}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:600,color:"#333",marginBottom:2}}>{item.course}</div>
                    <div style={{fontSize:10,color:"#666",marginBottom:2}}>{item.time}</div>
                    <div style={{fontSize:10,color:"#888"}}>📍 {item.room}</div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Recent Activities */}
          <SectionCard title="Recent Activities" icon="🕐" color={C.purple}>
            <div style={{padding:16}}>
              {recentActivities.map((activity, index) => (
                <div key={index} style={{
                  padding:"10px",
                  background:"#f8f9fa",
                  borderRadius:6,
                  marginBottom:8
                }}>
                  <div style={{fontSize:11,fontWeight:600,color:"#333",marginBottom:2}}>{activity.action}</div>
                  <div style={{fontSize:10,color:"#666",marginBottom:2}}>
                    <Badge color={C.blue}>{activity.course}</Badge>
                  </div>
                  <div style={{fontSize:9,color:"#888"}}>{activity.time}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    );
  }

  // Admin Homepage Content
  if (role === "admin") {
    const adminStats = [
      { icon: "👥", value: "15,234", label: "Total Users", color: C.blue },
      { icon: "📚", value: "48", label: "Active Courses", color: C.green },
      { icon: "📅", value: "1,247", label: "Total Sessions", color: C.orange },
      { icon: "⚡", value: "99.8%", label: "System Uptime", color: C.teal },
    ];

    const systemAlerts = [
      { type: "warning", message: "Database backup scheduled for tonight", time: "30 min ago" },
      { type: "info", message: "New user registrations: 23 this week", time: "2 hours ago" },
      { type: "success", message: "System performance optimized", time: "4 hours ago" },
    ];

    const quickActions = [
      { title: "User Management", icon: "👥", description: "Manage user accounts", color: C.blue },
      { title: "Course Management", icon: "📚", description: "Administer courses", color: C.green },
      { title: "System Reports", icon: "📊", description: "Generate reports", color: C.purple },
    ];

    return (
      <div style={{padding:isLg?"24px 32px":16}}>
        <div style={{marginBottom:24}}>
          <h2 style={{margin:"0 0 8px",fontSize:isLg?24:18,color:"#333",fontWeight:700}}>Admin Dashboard</h2>
          <p style={{margin:0,color:"#666",fontSize:14}}>System administration and management overview</p>
        </div>

        {/* Admin Statistics */}
        <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(4,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:16,marginBottom:24}}>
          {adminStats.map((stat, index) => (
            <SectionCard key={index} style={{height:"100%"}}>
              <div style={{padding:20,textAlign:"center"}}>
                <StatPill icon={stat.icon} value={stat.value} label={stat.label} color={stat.color} />
              </div>
            </SectionCard>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:isLg?"2fr 1fr":"1fr",gap:16}}>
          {/* System Alerts */}
          <SectionCard title="System Alerts" icon="🔔" color={C.orange}>
            <div style={{padding:16}}>
              {systemAlerts.map((alert, index) => (
                <div key={index} style={{
                  display:"flex",
                  alignItems:"center",
                  gap:12,
                  padding:"12px",
                  background:alert.type === "warning" ? "#fffbf0" : alert.type === "success" ? "#f0fff4" : "#f0f8ff",
                  borderRadius:8,
                  marginBottom:8
                }}>
                  <div style={{
                    width:24,
                    height:24,
                    borderRadius:"50%",
                    background:alert.type === "warning" ? C.orange : alert.type === "success" ? C.green : C.blue,
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    fontSize:12,
                    color:"white"
                  }}>{alert.type === "warning" ? "⚠" : alert.type === "success" ? "✓" : "ℹ"}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,fontWeight:600,color:"#333",marginBottom:2}}>{alert.message}</div>
                    <div style={{fontSize:9,color:"#888"}}>{alert.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Quick Actions */}
          <SectionCard title="Quick Actions" icon="⚡" color={C.purple}>
            <div style={{padding:16}}>
              {quickActions.map((action, index) => (
                <div key={index} style={{
                  display:"flex",
                  alignItems:"center",
                  gap:12,
                  padding:"12px",
                  background:"#f8f9fa",
                  borderRadius:8,
                  cursor:"pointer",
                  marginBottom:8,
                  transition:"background 0.2s"
                }}
                onMouseEnter={e=>e.currentTarget.style.background="#f0f4ff"}
                onMouseLeave={e=>e.currentTarget.style.background="#f8f9fa"}
                onClick={() => setPage(action.title.toLowerCase().replace(" ", ""))}>
                  <div style={{
                    width:32,
                    height:32,
                    borderRadius:"50%",
                    background:action.color,
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    fontSize:14,
                    color:"white"
                  }}>{action.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:600,color:"#333",marginBottom:2}}>{action.title}</div>
                    <div style={{fontSize:10,color:"#666"}}>{action.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    );
  }
}
