import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';
import { SectionCard, Badge } from '../components/shared/SectionCard.jsx';

export function AdminSystemPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;

  const systemStatus = [
    { service: "Database", status: "operational", uptime: "99.9%", lastCheck: "2 min ago", response: "12ms" },
    { service: "API Server", status: "operational", uptime: "99.8%", lastCheck: "1 min ago", response: "45ms" },
    { service: "Authentication", status: "operational", uptime: "99.9%", lastCheck: "3 min ago", response: "8ms" },
    { service: "File Storage", status: "operational", uptime: "99.7%", lastCheck: "5 min ago", response: "23ms" },
    { service: "Email Service", status: "degraded", uptime: "98.5%", lastCheck: "10 min ago", response: "156ms" },
    { service: "Backup System", status: "operational", uptime: "100%", lastCheck: "1 hour ago", response: "N/A" },
  ];

  const recentLogs = [
    { timestamp: "2026-03-25 09:15:23", level: "INFO", service: "API Server", message: "User login successful", user: "ahmad.jafar@abu.edu.ng" },
    { timestamp: "2026-03-25 09:14:18", level: "WARNING", service: "Database", message: "High memory usage detected", user: "System" },
    { timestamp: "2026-03-25 09:12:45", level: "INFO", service: "Authentication", message: "Password reset requested", user: "fatima.ali@abu.edu.ng" },
    { timestamp: "2026-03-25 09:10:12", level: "ERROR", service: "Email Service", message: "Email delivery failed", user: "System" },
    { timestamp: "2026-03-25 09:08:33", level: "INFO", service: "Backup System", message: "Daily backup completed", user: "System" },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case "operational": return C.green;
      case "degraded": return C.orange;
      case "down": return C.red;
      default: return C.gray;
    }
  };

  const getLevelColor = (level) => {
    switch(level) {
      case "INFO": return C.blue;
      case "WARNING": return C.orange;
      case "ERROR": return C.red;
      default: return C.gray;
    }
  };

  return (
    <div style={{padding:isLg?"24px 32px":16}}>
      <h2 style={{margin:"0 0 16px",fontSize:isLg?20:15,color:"#333",fontWeight:700}}>System Management</h2>
      
      <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(4,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:16,marginBottom:16}}>
        {[
          {label:"System Health",value:"98.5%",icon:"🏥",color:C.green},
          {label:"Active Services",value:"5/6",icon:"⚡",color:C.blue},
          {label:"Avg Response",value:"42ms",icon:"⏱️",color:C.orange},
          {label:"Uptime",value:"99.8%",icon:"📈",color:C.purple},
        ].map((stat, index) => (
          <div key={index} style={{
            background:"white",border:"1px solid #e0e0e0",borderRadius:8,
            padding:16,textAlign:"center"
          }}>
            <div style={{fontSize:24,marginBottom:8}}>{stat.icon}</div>
            <div style={{fontSize:20,fontWeight:700,color:"#333",marginBottom:4}}>{stat.value}</div>
            <div style={{fontSize:11,color:"#666"}}>{stat.label}</div>
          </div>
        ))}
      </div>

      <SectionCard title="Service Status" icon="⚡" color={C.blue}>
        <div style={{padding:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <h3 style={{margin:0,fontSize:14,fontWeight:600,color:"#333"}}>System Services</h3>
            <button style={{
              background:C.orange,color:"white",border:"none",borderRadius:6,
              padding:"6px 12px",fontSize:11,cursor:"pointer",fontWeight:600
            }}>
              Refresh Status
            </button>
          </div>
          
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead>
                <tr style={{background:"#f5f5f5"}}>
                  <th style={{padding:"8px",textAlign:"left",color:"#555",fontWeight:600}}>Service</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Status</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Uptime</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Response</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Last Check</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {systemStatus.map((service, index) => (
                  <tr key={index}>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",color:"#333",fontWeight:500}}>{service.service}</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                      <Badge color={getStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                    </td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>{service.uptime}</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>{service.response}</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>{service.lastCheck}</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                      <button style={{
                        background:C.blue,color:"white",border:"none",borderRadius:4,
                        padding:"2px 6px",fontSize:9,cursor:"pointer",marginRight:2
                      }}>
                        Restart
                      </button>
                      <button style={{
                        background:C.gray,color:"white",border:"none",borderRadius:4,
                        padding:"2px 6px",fontSize:9,cursor:"pointer"
                      }}>
                        Logs
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>

      <div style={{display:"grid",gridTemplateColumns:isLg?"2fr 1fr":w>=640?"1fr 1fr":"1fr",gap:16}}>
        <SectionCard title="System Logs" icon="📋" color={C.orange}>
          <div style={{padding:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h3 style={{margin:0,fontSize:14,fontWeight:600,color:"#333"}}>Recent Activity</h3>
              <button style={{
                background:C.blue,color:"white",border:"none",borderRadius:6,
                padding:"6px 12px",fontSize:11,cursor:"pointer",fontWeight:600
              }}>
                View All Logs
              </button>
            </div>
            
            {recentLogs.map((log, index) => (
              <div key={index} style={{
                background:"#f9f9f9",borderRadius:6,padding:8,marginBottom:6,
                borderLeft:`3px solid ${getLevelColor(log.level)}`
              }}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                  <div style={{fontSize:10,color:"#666"}}>{log.timestamp}</div>
                  <Badge color={getLevelColor(log.level)} style={{fontSize:8}}>
                    {log.level}
                  </Badge>
                </div>
                <div style={{fontSize:11,color:"#333",marginBottom:2}}>
                  <strong>{log.service}:</strong> {log.message}
                </div>
                <div style={{fontSize:9,color:"#666"}}>
                  User: {log.user}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="System Actions" icon="🛠️" color={C.green}>
          <div style={{padding:12}}>
            <h3 style={{margin:0,fontSize:14,fontWeight:600,color:"#333",marginBottom:12}}>Quick Actions</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr",gap:8}}>
              {[
                {title:"System Backup",description:"Create backup",icon:"💾",color:C.blue},
                {title:"Clear Cache",description:"Clear system cache",icon:"🗑️",color:C.orange},
                {title:"Update System",description:"Check for updates",icon:"🔄",color:C.green},
                {title:"Maintenance Mode",description:"Enable/disable",icon:"🔧",color:C.red},
                {title:"Export Logs",description:"Download system logs",icon:"📥",color:C.purple},
                {title:"Health Check",description:"Run diagnostics",icon:"🏥",color:C.teal},
              ].map((action, index) => (
                <div key={index} style={{
                  background:"white",border:"1px solid #e0e0e0",borderRadius:6,
                  padding:8,cursor:"pointer",transition:"all 0.2s"
                }}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{fontSize:16,color:action.color}}>{action.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:10,fontWeight:600,color:"#333"}}>{action.title}</div>
                      <div style={{fontSize:8,color:"#666"}}>{action.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
