import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';
import { SectionCard, Badge } from '../components/shared/SectionCard.jsx';

export function AdminUsersPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;

  const users = [
    { id: 1, name: "Ahmad Jafar", email: "ahmad.jafar@abu.edu.ng", role: "lecturer", status: "active", lastLogin: "2026-03-25", courses: 4 },
    { id: 2, name: "Khadija Hassan", email: "khadija.hassan@abu.edu.ng", role: "lecturer", status: "active", lastLogin: "2026-03-24", courses: 3 },
    { id: 3, name: "Musa Ibrahim", email: "musa.ibrahim@abu.edu.ng", role: "student", status: "active", lastLogin: "2026-03-25", courses: 6 },
    { id: 4, name: "Fatima Ali", email: "fatima.ali@abu.edu.ng", role: "student", status: "inactive", lastLogin: "2026-03-20", courses: 5 },
    { id: 5, name: "Omar Hassan", email: "omar.hassan@abu.edu.ng", role: "student", status: "active", lastLogin: "2026-03-25", courses: 4 },
    { id: 6, name: "Aisha Bello", email: "aisha.bello@abu.edu.ng", role: "student", status: "active", lastLogin: "2026-03-24", courses: 5 },
    { id: 7, name: "Yusuf Ahmed", email: "yusuf.ahmed@abu.edu.ng", role: "lecturer", status: "active", lastLogin: "2026-03-25", courses: 2 },
    { id: 8, name: "Khadija Sani", email: "khadija.sani@abu.edu.ng", role: "student", status: "active", lastLogin: "2026-03-23", courses: 4 },
  ];

  const getRoleColor = (role) => {
    return role === "lecturer" ? C.blue : C.green;
  };

  const getStatusColor = (status) => {
    return status === "active" ? C.green : C.red;
  };

  return (
    <div style={{padding:isLg?"24px 32px":16}}>
      <h2 style={{margin:"0 0 16px",fontSize:isLg?20:15,color:"#333",fontWeight:700}}>User Management</h2>
      
      <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(4,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:16,marginBottom:16}}>
        {[
          {label:"Total Users",value:"8",icon:"👥",color:C.blue},
          {label:"Lecturers",value:"3",icon:"👨‍🏫",color:C.green},
          {label:"Students",value:"5",icon:"👨‍🎓",color:C.orange},
          {label:"Active",value:"7",icon:"✅",color:C.green},
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

      <SectionCard title="User Directory" icon="👥" color={C.blue}>
        <div style={{padding:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <h3 style={{margin:0,fontSize:14,fontWeight:600,color:"#333"}}>All Users</h3>
            <div style={{display:"flex",gap:8}}>
              <button style={{
                background:C.green,color:"white",border:"none",borderRadius:6,
                padding:"6px 12px",fontSize:11,cursor:"pointer",fontWeight:600
              }}>
                + Add User
              </button>
              <button style={{
                background:C.blue,color:"white",border:"none",borderRadius:6,
                padding:"6px 12px",fontSize:11,cursor:"pointer",fontWeight:600
              }}>
                Export
              </button>
            </div>
          </div>
          
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead>
                <tr style={{background:"#f5f5f5"}}>
                  <th style={{padding:"8px",textAlign:"left",color:"#555",fontWeight:600}}>ID</th>
                  <th style={{padding:"8px",textAlign:"left",color:"#555",fontWeight:600}}>Name</th>
                  <th style={{padding:"8px",textAlign:"left",color:"#555",fontWeight:600}}>Email</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Role</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Status</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Courses</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Last Login</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",color:"#333"}}>{user.id}</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",color:"#333",fontWeight:500}}>{user.name}</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",color:"#666"}}>{user.email}</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                      <Badge color={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                      <Badge color={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>{user.courses}</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>{user.lastLogin}</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                      <button style={{
                        background:C.orange,color:"white",border:"none",borderRadius:4,
                        padding:"2px 6px",fontSize:9,cursor:"pointer",marginRight:2
                      }}>
                        Edit
                      </button>
                      <button style={{
                        background:C.red,color:"white",border:"none",borderRadius:4,
                        padding:"2px 6px",fontSize:9,cursor:"pointer"
                      }}>
                        {user.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>

      <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(2,1fr)":w>=640?"1fr 1fr":"1fr",gap:16}}>
        <SectionCard title="User Statistics" icon="📊" color={C.orange}>
          <div style={{padding:12}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[
                {label:"New Users (This Month)",value:"12",icon:"🆕"},
                {label:"Inactive Users",value:"1",icon:"⚠️"},
                {label:"Avg Login Frequency",value:"5.2/week",icon:"📈"},
                {label:"Course Enrollment",value:"4.2 avg",icon:"📚"},
              ].map((stat, index) => (
                <div key={index} style={{
                  background:"#f9f9f9",borderRadius:6,padding:8,textAlign:"center"
                }}>
                  <div style={{fontSize:16,marginBottom:4}}>{stat.icon}</div>
                  <div style={{fontSize:14,fontWeight:700,color:"#333",marginBottom:2}}>{stat.value}</div>
                  <div style={{fontSize:9,color:"#666"}}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Quick Actions" icon="⚡" color={C.green}>
          <div style={{padding:12}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[
                {title:"Bulk Import",description:"Import multiple users",icon:"📥"},
                {title:"Send Notifications",description:"Email all users",icon:"📧"},
                {title:"Reset Passwords",description:"Bulk password reset",icon:"🔐"},
                {title:"User Reports",description:"Generate reports",icon:"📊"},
              ].map((action, index) => (
                <div key={index} style={{
                  background:"white",border:"1px solid #e0e0e0",borderRadius:6,
                  padding:8,cursor:"pointer",transition:"all 0.2s",textAlign:"center"
                }}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                  <div style={{fontSize:16,marginBottom:4}}>{action.icon}</div>
                  <div style={{fontSize:10,fontWeight:600,color:"#333",marginBottom:2}}>{action.title}</div>
                  <div style={{fontSize:8,color:"#666"}}>{action.description}</div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
