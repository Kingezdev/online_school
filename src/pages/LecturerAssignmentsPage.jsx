import { useW } from '../hooks/useW.js';
import { C, LECTURER_COURSES } from '../data/constants.js';
import { SectionCard, Badge } from '../components/shared/SectionCard.jsx';

export function LecturerAssignmentsPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;

  const assignments = [
    {
      id: 1,
      course: "COSC 203",
      title: "Algorithm Complexity Analysis",
      type: "Assignment",
      dueDate: "2026-03-28",
      status: "active",
      submissions: 45,
      totalStudents: 48,
      description: "Analyze time and space complexity of given algorithms",
      weight: "15%"
    },
    {
      id: 2,
      course: "STAT 201",
      title: "Probability Distribution Project",
      type: "Project",
      dueDate: "2026-03-30",
      status: "active",
      submissions: 52,
      totalStudents: 55,
      description: "Complete probability distribution analysis with real data",
      weight: "20%"
    },
    {
      id: 3,
      course: "MATH 207",
      title: "Linear Algebra Problem Set 5",
      type: "Assignment",
      dueDate: "2026-04-01",
      status: "draft",
      submissions: 0,
      totalStudents: 42,
      description: "Solve problems on eigenvalues and eigenvectors",
      weight: "10%"
    },
    {
      id: 4,
      course: "COSC 205",
      title: "Digital Logic Lab Report",
      type: "Lab",
      dueDate: "2026-03-27",
      status: "grading",
      submissions: 41,
      totalStudents: 45,
      description: "Complete lab report on digital circuit design",
      weight: "25%"
    },
    {
      id: 5,
      course: "COSC 211",
      title: "Object-Oriented Programming Project",
      type: "Project",
      dueDate: "2026-04-05",
      status: "active",
      submissions: 38,
      totalStudents: 48,
      description: "Develop a complete OOP application with documentation",
      weight: "30%"
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case "active": return C.blue;
      case "grading": return C.orange;
      case "completed": return C.green;
      case "draft": return C.gray;
      default: return C.red;
    }
  };

  const getSubmissionRate = (submissions, total) => {
    return ((submissions / total) * 100).toFixed(0);
  };

  return (
    <div style={{padding:isLg?"24px 32px":16}}>
      <h2 style={{margin:"0 0 16px",fontSize:isLg?20:15,color:"#333",fontWeight:700}}>Assignments</h2>
      
      <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(4,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:16,marginBottom:16}}>
        {[
          {label:"Total",value:"5",icon:"📝",color:C.blue},
          {label:"Active",value:"3",icon:"✅",color:C.green},
          {label:"Grading",value:"1",icon:"⏳",color:C.orange},
          {label:"Draft",value:"1",icon:"📝",color:C.gray},
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

      <SectionCard title="Assignment Management" icon="📝" color={C.blue}>
        <div style={{padding:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <h3 style={{margin:0,fontSize:14,fontWeight:600,color:"#333"}}>All Assignments</h3>
            <button style={{
              background:C.green,color:"white",border:"none",borderRadius:6,
              padding:"6px 12px",fontSize:11,cursor:"pointer",fontWeight:600
            }}>
              + Create Assignment
            </button>
          </div>
          
          {assignments.map((assignment, index) => (
            <div key={index} style={{
              background:"#f9f9f9",borderRadius:8,padding:12,marginBottom:8,
              borderLeft:`3px solid ${getStatusColor(assignment.status)}`
            }}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:600,color:"#333",marginBottom:4}}>{assignment.title}</div>
                  <div style={{fontSize:11,color:"#666",marginBottom:4}}>
                    {assignment.course} • {assignment.type} • Weight: {assignment.weight}
                  </div>
                  <div style={{fontSize:10,color:"#888",marginBottom:4}}>
                    {assignment.description}
                  </div>
                  <div style={{display:"flex",gap:12,fontSize:10,color:"#666"}}>
                    <span>📅 Due: {assignment.dueDate}</span>
                    <span>📊 {assignment.submissions}/{assignment.totalStudents} submitted</span>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                  <Badge color={getStatusColor(assignment.status)}>
                    {assignment.status}
                  </Badge>
                  <div style={{fontSize:12,fontWeight:600,color:C.blue}}>
                    {getSubmissionRate(assignment.submissions, assignment.totalStudents)}%
                  </div>
                </div>
              </div>
              
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",gap:8}}>
                  <div style={{width:"100%",background:"#e0e0e0",borderRadius:4,height:6}}>
                    <div style={{
                      width:`${getSubmissionRate(assignment.submissions, assignment.totalStudents)}%`,
                      height:"100%",background:C.green,borderRadius:4
                    }}/>
                  </div>
                  <span style={{fontSize:10,color:"#666"}}>
                    {assignment.submissions}/{assignment.totalStudents} submitted
                  </span>
                </div>
                
                <div style={{display:"flex",gap:4}}>
                  {assignment.status === "grading" && (
                    <button style={{
                      background:C.orange,color:"white",border:"none",borderRadius:4,
                      padding:"4px 8px",fontSize:9,cursor:"pointer"
                    }}>
                      Grade Now
                    </button>
                  )}
                  {assignment.status === "draft" && (
                    <button style={{
                      background:C.blue,color:"white",border:"none",borderRadius:4,
                      padding:"4px 8px",fontSize:9,cursor:"pointer"
                    }}>
                      Publish
                    </button>
                  )}
                  <button style={{
                    background:C.gray,color:"white",border:"none",borderRadius:4,
                    padding:"4px 8px",fontSize:9,cursor:"pointer"
                  }}>
                    Edit
                  </button>
                  <button style={{
                    background:C.blue,color:"white",border:"none",borderRadius:4,
                    padding:"4px 8px",fontSize:9,cursor:"pointer"
                  }}>
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Quick Actions" icon="⚡" color={C.orange}>
        <div style={{padding:12}}>
          <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(3,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:12}}>
            {[
              {title:"Create Assignment",description:"Add new assignment",icon:"➕",color:C.green},
              {title:"Grade Submissions",description:"Review and grade work",icon:"✅",color:C.orange},
              {title:"Export Grades",description:"Download grade reports",icon:"📊",color:C.blue},
            ].map((action, index) => (
              <div key={index} style={{
                background:"white",border:"1px solid #e0e0e0",borderRadius:8,
                padding:12,cursor:"pointer",transition:"all 0.2s",textAlign:"center"
              }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                <div style={{fontSize:20,marginBottom:8,color:action.color}}>{action.icon}</div>
                <div style={{fontSize:11,fontWeight:600,color:"#333",marginBottom:2}}>{action.title}</div>
                <div style={{fontSize:9,color:"#666"}}>{action.description}</div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
