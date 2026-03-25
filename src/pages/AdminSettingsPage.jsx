import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';
import { SectionCard, Badge } from '../components/shared/SectionCard.jsx';

export function AdminSettingsPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;

  const settings = [
    {
      category: "System Settings",
      items: [
        { name: "System Name", value: "Online School Management System", type: "text" },
        { name: "System Email", value: "admin@abu.edu.ng", type: "email" },
        { name: "Maintenance Mode", value: "Disabled", type: "toggle" },
        { name: "Debug Mode", value: "Disabled", type: "toggle" },
      ]
    },
    {
      category: "Security Settings",
      items: [
        { name: "Password Policy", value: "Strong (8+ chars)", type: "select" },
        { name: "Session Timeout", value: "30 minutes", type: "select" },
        { name: "Two-Factor Auth", value: "Enabled", type: "toggle" },
        { name: "Login Attempts", value: "5 attempts", type: "number" },
      ]
    },
    {
      category: "Email Settings",
      items: [
        { name: "SMTP Server", value: "smtp.abu.edu.ng", type: "text" },
        { name: "SMTP Port", value: "587", type: "number" },
        { name: "Email From", value: "noreply@abu.edu.ng", type: "email" },
        { name: "Email Notifications", value: "Enabled", type: "toggle" },
      ]
    },
    {
      category: "Backup Settings",
      items: [
        { name: "Auto Backup", value: "Enabled", type: "toggle" },
        { name: "Backup Frequency", value: "Daily", type: "select" },
        { name: "Backup Retention", value: "30 days", type: "select" },
        { name: "Backup Location", value: "Cloud Storage", type: "select" },
      ]
    }
  ];

  const recentActivity = [
    { action: "System settings updated", user: "Admin", timestamp: "2026-03-25 09:15:23" },
    { action: "Security policy changed", user: "Admin", timestamp: "2026-03-24 14:30:12" },
    { action: "Email configuration updated", user: "Admin", timestamp: "2026-03-23 11:45:67" },
    { action: "Backup settings modified", user: "Admin", timestamp: "2026-03-22 16:20:34" },
  ];

  return (
    <div style={{padding:isLg?"24px 32px":16}}>
      <h2 style={{margin:"0 0 16px",fontSize:isLg?20:15,color:"#333",fontWeight:700}}>System Settings</h2>
      
      <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(3,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:16,marginBottom:16}}>
        {[
          {label:"Settings Categories",value:"4",icon:"⚙️",color:C.blue},
          {label:"Configured Items",value:"16",icon:"✅",color:C.green},
          {label:"Recent Changes",value:"4",icon:"🔄",color:C.orange},
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

      <div style={{display:"grid",gridTemplateColumns:isLg?"2fr 1fr":w>=640?"1fr 1fr":"1fr",gap:16}}>
        <SectionCard title="Configuration" icon="⚙️" color={C.blue}>
          <div style={{padding:12}}>
            {settings.map((category, catIndex) => (
              <div key={catIndex} style={{marginBottom:24}}>
                <h3 style={{margin:"0 0 12px",fontSize:14,fontWeight:600,color:"#333",borderBottom:"1px solid #e0e0e0",paddingBottom:8}}>
                  {category.category}
                </h3>
                <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(2,1fr)":"1fr",gap:12}}>
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} style={{display:"flex",flexDirection:"column",gap:4}}>
                      <label style={{fontSize:11,color:"#666",fontWeight:500}}>{item.name}</label>
                      {item.type === "text" || item.type === "email" ? (
                        <input
                          type={item.type}
                          value={item.value}
                          style={{
                            padding:"6px 8px",border:"1px solid #ddd",borderRadius:4,
                            fontSize:11,color:"#333"
                          }}
                          readOnly
                        />
                      ) : item.type === "number" ? (
                        <input
                          type="number"
                          value={item.value}
                          style={{
                            padding:"6px 8px",border:"1px solid #ddd",borderRadius:4,
                            fontSize:11,color:"#333"
                          }}
                          readOnly
                        />
                      ) : item.type === "select" ? (
                        <select
                          value={item.value}
                          style={{
                            padding:"6px 8px",border:"1px solid #ddd",borderRadius:4,
                            fontSize:11,color:"#333"
                          }}
                        >
                          <option>{item.value}</option>
                        </select>
                      ) : (
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{
                            width:16,height:16,borderRadius:"50%",
                            background:item.value === "Enabled" ? C.green : C.gray
                          }}/>
                          <span style={{fontSize:11,color:"#666"}}>{item.value}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <div style={{display:"flex",gap:8,marginTop:16}}>
              <button style={{
                background:C.green,color:"white",border:"none",borderRadius:6,
                padding:"8px 16px",fontSize:11,cursor:"pointer",fontWeight:600
              }}>
                Save Changes
              </button>
              <button style={{
                background:C.gray,color:"white",border:"none",borderRadius:6,
                padding:"8px 16px",fontSize:11,cursor:"pointer",fontWeight:600
              }}>
                Reset to Default
              </button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Recent Activity" icon="🕐" color={C.orange}>
          <div style={{padding:12}}>
            <h3 style={{margin:"0 0 12px",fontSize:14,fontWeight:600,color:"#333"}}>Settings History</h3>
            {recentActivity.map((activity, index) => (
              <div key={index} style={{
                background:"#f9f9f9",borderRadius:6,padding:10,marginBottom:8
              }}>
                <div style={{fontSize:11,fontWeight:600,color:"#333",marginBottom:4}}>
                  {activity.action}
                </div>
                <div style={{fontSize:10,color:"#666",marginBottom:2}}>
                  By {activity.user}
                </div>
                <div style={{fontSize:9,color:"#888"}}>
                  🕐 {activity.timestamp}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="System Information" icon="ℹ️" color={C.green}>
        <div style={{padding:12}}>
          <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(3,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:16}}>
            {[
              {title:"System Version",value:"v2.1.0",icon:"🔢"},
              {title:"Last Updated",value:"2026-03-20",icon:"📅"},
              {title:"Database Version",value:"MySQL 8.0",icon:"🗄️"},
              {title:"PHP Version",value:"8.1.0",icon:"🐘"},
              {title:"Node Version",value:"18.17.0",icon:"🟢"},
              {title:"Environment",value:"Production",icon:"🏭"},
            ].map((info, index) => (
              <div key={index} style={{
                background:"white",border:"1px solid #e0e0e0",borderRadius:8,
                padding:12,textAlign:"center"
              }}>
                <div style={{fontSize:16,marginBottom:8}}>{info.icon}</div>
                <div style={{fontSize:10,color:"#666",marginBottom:4}}>{info.title}</div>
                <div style={{fontSize:12,fontWeight:600,color:"#333"}}>{info.value}</div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
