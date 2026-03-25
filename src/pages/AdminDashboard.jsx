import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';
import { SectionCard, Badge, StatPill } from '../components/shared/SectionCard.jsx';

export function AdminDashboard({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;
  
  const systemStats = [
    { label: "Total Users", value: "15,234", icon: "👥", color: C.blue },
    { label: "Active Courses", value: "48", icon: "📚", color: C.green },
    { label: "Total Sessions", value: "1,247", icon: "📅", color: C.orange },
    { label: "System Uptime", value: "99.8%", icon: "⚡", color: C.teal },
  ];
  
  const recentActivity = [
    { user: "Ahmad Jafar", action: "Created new course", time: "2 hours ago", type: "course" },
    { user: "Khadija Hassan", action: "Updated attendance records", time: "3 hours ago", type: "attendance" },
    { user: "Musa'ab Silas", action: "Generated system report", time: "5 hours ago", type: "report" },
    { user: "System", action: "Database backup completed", time: "6 hours ago", type: "system" },
  ];
  
  const quickActions = [
    { title: "User Management", icon: "👥", description: "Manage user accounts and permissions", color: C.blue },
    { title: "Course Management", icon: "📚", description: "Create and edit courses", color: C.green },
    { title: "System Settings", icon: "⚙️", description: "Configure system preferences", color: C.orange },
    { title: "Reports", icon: "📊", description: "Generate system reports", color: C.purple },
    { title: "Backup", icon: "💾", description: "Manage data backups", color: C.teal },
  ];

  return (
    <div style={{padding:isLg?"24px 32px":16}}>
      <h2 style={{margin:"0 0 4px",fontSize:isLg?20:16,color:"#333",fontWeight:700}}>Admin Dashboard</h2>
      <div style={{fontSize:12,color:"#aaa",marginBottom:16}}>System administration and management</div>
      
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
      
      <div style={{display:"grid",gridTemplateColumns:isLg?"2fr 1fr":"1fr",gap:16,marginBottom:16}}>
        {/* Quick Actions */}
        <div>
          <SectionCard title="Quick Actions" icon="⚡" color={C.blue}>
            <div style={{padding:16}}>
              {quickActions.map((action, index) => (
                <div 
                  key={index}
                  onClick={() => setPage(action.title.toLowerCase().replace(" ", ""))}
                  style={{
                    display:"flex",
                    alignItems:"center",
                    gap:12,
                    padding:"12px",
                    borderRadius:6,
                    cursor:"pointer",
                    transition:"background 0.2s",
                    marginBottom:8
                  }}
                  onMouseEnter={e=>e.currentTarget.style.background="#f0f4ff"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                >
                  <div style={{
                    width:40,
                    height:40,
                    borderRadius:"50%",
                    background:action.color,
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    fontSize:16
                  }}>
                    {action.icon}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:"#333",marginBottom:2}}>{action.title}</div>
                    <div style={{fontSize:11,color:"#666"}}>{action.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
        
        {/* Recent Activity */}
        <div>
          <SectionCard title="Recent Activity" icon="🕐" color={C.purple}>
            <div style={{padding:16}}>
              {recentActivity.map((activity, index) => (
                <div key={index} style={{
                  display:"flex",
                  alignItems:"center",
                  gap:12,
                  padding:"12px 0",
                  borderBottom:index < recentActivity.length - 1 ? "1px solid #f0f0f0" : "none"
                }}>
                  <div style={{
                    width:32,
                    height:32,
                    borderRadius:"50%",
                    background:activity.type === "system" ? C.teal : activity.type === "report" ? C.orange : activity.type === "course" ? C.green : C.blue,
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    fontSize:12,
                    color:"white"
                  }}>
                    {activity.type === "system" ? "⚙️" : activity.type === "report" ? "📊" : activity.type === "course" ? "📚" : "📅"}
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
      </div>
      
      {/* System Status */}
      <SectionCard title="System Status" icon="🔧" color={C.green}>
        <div style={{padding:16}}>
          <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(2,1fr)":"1fr",gap:16}}>
            <div style={{textAlign:"center",padding:16,background:"#f8f9fa",borderRadius:8}}>
              <div style={{fontSize:24,fontWeight:700,color:C.green,marginBottom:8}}>🟢</div>
              <div style={{fontSize:14,fontWeight:600,color:"#333",marginBottom:4}}>All Systems Operational</div>
              <div style={{fontSize:11,color:"#666"}}>All services running normally</div>
            </div>
            <div style={{textAlign:"center",padding:16,background:"#f8f9fa",borderRadius:8}}>
              <div style={{fontSize:24,fontWeight:700,color:C.orange,marginBottom:8}}>📊</div>
              <div style={{fontSize:14,fontWeight:600,color:"#333",marginBottom:4}}>Database Status</div>
              <div style={{fontSize:11,color:"#666"}}>Last backup: 2 hours ago</div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
