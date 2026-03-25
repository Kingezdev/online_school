import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';
import { SectionCard, Badge } from '../components/shared/SectionCard.jsx';

export function AdminReportsPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;

  const reportTypes = [
    {
      id: 1,
      title: "System Performance Report",
      description: "Overall system metrics and performance indicators",
      type: "System",
      frequency: "Weekly",
      lastGenerated: "2026-03-24",
      status: "available",
      size: "2.1 MB"
    },
    {
      id: 2,
      title: "User Activity Analytics",
      description: "User engagement and activity patterns",
      type: "Analytics",
      frequency: "Monthly",
      lastGenerated: "2026-03-20",
      status: "available",
      size: "3.4 MB"
    },
    {
      id: 3,
      title: "Course Enrollment Statistics",
      description: "Enrollment trends and course popularity",
      type: "Academic",
      frequency: "Bi-weekly",
      lastGenerated: "2026-03-23",
      status: "available",
      size: "1.8 MB"
    },
    {
      id: 4,
      title: "Attendance Summary",
      description: "Comprehensive attendance data across all courses",
      type: "Attendance",
      frequency: "Daily",
      lastGenerated: "2026-03-25",
      status: "generating",
      size: "1.2 MB"
    },
    {
      id: 5,
      title: "Financial Overview",
      description: "Revenue and financial metrics",
      type: "Financial",
      frequency: "Monthly",
      lastGenerated: "2026-03-01",
      status: "available",
      size: "4.7 MB"
    }
  ];

  const recentReports = [
    {
      name: "March 2026 System Performance",
      date: "2026-03-24",
      type: "System",
      size: "2.1 MB",
      downloads: 28,
      generatedBy: "Admin"
    },
    {
      name: "User Activity - February 2026",
      date: "2026-03-20",
      type: "Analytics",
      size: "3.4 MB",
      downloads: 15,
      generatedBy: "Admin"
    },
    {
      name: "Course Enrollment - Week 12",
      date: "2026-03-23",
      type: "Academic",
      size: "1.8 MB",
      downloads: 22,
      generatedBy: "Admin"
    }
  ];

  const scheduledReports = [
    {report:"System Performance",frequency:"Weekly",nextRun:"2026-03-28",status:"Active"},
    {report:"User Activity",frequency:"Monthly",nextRun:"2026-04-01",status:"Active"},
    {report:"Course Enrollment",frequency:"Bi-weekly",nextRun:"2026-03-30",status:"Active"},
    {report:"Attendance Summary",frequency:"Daily",nextRun:"2026-03-26",status:"Active"},
    {report:"Financial Overview",frequency:"Monthly",nextRun:"2026-04-01",status:"Paused"},
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case "available": return C.green;
      case "generating": return C.orange;
      case "scheduled": return C.blue;
      case "active": return C.green;
      case "paused": return C.orange;
      default: return C.gray;
    }
  };

  return (
    <div style={{padding:isLg?"24px 32px":16}}>
      <h2 style={{margin:"0 0 16px",fontSize:isLg?20:15,color:"#333",fontWeight:700}}>System Reports</h2>
      
      <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(4,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:16,marginBottom:16}}>
        {[
          {label:"Total Reports",value:"5",icon:"📊",color:C.blue},
          {label:"Generated Today",value:"1",icon:"✅",color:C.green},
          {label:"Scheduled",value:"4",icon:"📅",color:C.orange},
          {label:"Total Downloads",value:"65",icon:"⬇️",color:C.purple},
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
        <SectionCard title="Report Generation" icon="📊" color={C.blue}>
          <div style={{padding:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h3 style={{margin:0,fontSize:14,fontWeight:600,color:"#333"}}>Available Reports</h3>
              <button style={{
                background:C.green,color:"white",border:"none",borderRadius:6,
                padding:"6px 12px",fontSize:11,cursor:"pointer",fontWeight:600
              }}>
                Generate New
              </button>
            </div>
            
            {reportTypes.map((report, index) => (
              <div key={index} style={{
                background:"#f9f9f9",borderRadius:8,padding:12,marginBottom:8,
                cursor:"pointer",transition:"all 0.2s"
              }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:600,color:"#333",marginBottom:4}}>{report.title}</div>
                    <div style={{fontSize:11,color:"#666",marginBottom:4}}>
                      {report.description}
                    </div>
                    <div style={{display:"flex",gap:12,fontSize:10,color:"#666"}}>
                      <span>📋 {report.type}</span>
                      <span>🔄 {report.frequency}</span>
                      <span>📅 Last: {report.lastGenerated}</span>
                      <span>📦 {report.size}</span>
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                    <Badge color={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </div>
                </div>
                
                <div style={{display:"flex",gap:4}}>
                  <button style={{
                    background:C.blue,color:"white",border:"none",borderRadius:4,
                    padding:"4px 8px",fontSize:9,cursor:"pointer"
                  }}>
                    Generate
                  </button>
                  <button style={{
                    background:C.green,color:"white",border:"none",borderRadius:4,
                    padding:"4px 8px",fontSize:9,cursor:"pointer"
                  }}>
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Recent Downloads" icon="⬇️" color={C.green}>
          <div style={{padding:12}}>
            <h3 style={{margin:"0 0 12px",fontSize:14,fontWeight:600,color:"#333"}}>Latest Reports</h3>
            {recentReports.map((report, index) => (
              <div key={index} style={{
                background:"#f9f9f9",borderRadius:6,padding:10,marginBottom:8
              }}>
                <div style={{fontSize:12,fontWeight:600,color:"#333",marginBottom:4}}>
                  {report.name}
                </div>
                <div style={{fontSize:10,color:"#666",marginBottom:4}}>
                  {report.type} • {report.date} • {report.size} • By {report.generatedBy}
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <Badge color={C.blue} style={{fontSize:9}}>
                    {report.downloads} downloads
                  </Badge>
                  <button style={{
                    background:C.green,color:"white",border:"none",borderRadius:4,
                    padding:"2px 6px",fontSize:8,cursor:"pointer"
                  }}>
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Scheduled Reports" icon="📅" color={C.orange}>
        <div style={{padding:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <h3 style={{margin:0,fontSize:14,fontWeight:600,color:"#333"}}>Automated Reports</h3>
            <button style={{
              background:C.blue,color:"white",border:"none",borderRadius:6,
              padding:"6px 12px",fontSize:11,cursor:"pointer",fontWeight:600
            }}>
              Manage Schedule
            </button>
          </div>
          
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead>
                <tr style={{background:"#f5f5f5"}}>
                  <th style={{padding:"8px",textAlign:"left",color:"#555",fontWeight:600}}>Report</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Frequency</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Next Run</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Status</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {scheduledReports.map((schedule, index) => (
                  <tr key={index}>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",color:"#333",fontWeight:500}}>{schedule.report}</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>{schedule.frequency}</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>{schedule.nextRun}</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                      <Badge color={getStatusColor(schedule.status)}>
                        {schedule.status}
                      </Badge>
                    </td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                      <button style={{
                        background:C.orange,color:"white",border:"none",borderRadius:3,
                        padding:"2px 6px",fontSize:8,cursor:"pointer",marginRight:2
                      }}>
                        Edit
                      </button>
                      <button style={{
                        background:C.blue,color:"white",border:"none",borderRadius:3,
                        padding:"2px 6px",fontSize:8,cursor:"pointer"
                      }}>
                        Run Now
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
  );
}
