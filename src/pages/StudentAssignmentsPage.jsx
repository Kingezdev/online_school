import { useW } from '../hooks/useW.js';
import { C, COURSES } from '../data/constants.js';
import { SectionCard, Badge } from '../components/shared/SectionCard.jsx';

export function StudentAssignmentsPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;

  const assignments = [
    {
      id: 1,
      course: "COSC 203",
      title: "Algorithm Complexity Analysis",
      type: "Assignment",
      dueDate: "2026-03-28",
      status: "submitted",
      submittedDate: "2026-03-25",
      score: 85,
      description: "Analyze time and space complexity of given algorithms"
    },
    {
      id: 2,
      course: "STAT 201",
      title: "Probability Distribution Project",
      type: "Project",
      dueDate: "2026-03-30",
      status: "in-progress",
      submittedDate: "--",
      score: "--",
      description: "Complete probability distribution analysis with real data"
    },
    {
      id: 3,
      course: "MATH 207",
      title: "Linear Algebra Problem Set 5",
      type: "Assignment",
      dueDate: "2026-04-01",
      status: "pending",
      submittedDate: "--",
      score: "--",
      description: "Solve problems on eigenvalues and eigenvectors"
    },
    {
      id: 4,
      course: "COSC 205",
      title: "Digital Logic Lab Report",
      type: "Lab",
      dueDate: "2026-03-27",
      status: "graded",
      submittedDate: "2026-03-25",
      score: 92,
      description: "Complete lab report on digital circuit design"
    },
    {
      id: 5,
      course: "COSC 211",
      title: "Object-Oriented Programming Project",
      type: "Project",
      dueDate: "2026-04-05",
      status: "pending",
      submittedDate: "--",
      score: "--",
      description: "Develop a complete OOP application with documentation"
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case "graded": return C.green;
      case "submitted": return C.blue;
      case "in-progress": return C.orange;
      case "pending": return C.red;
      default: return C.gray;
    }
  };

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div style={{padding:isLg?"24px 32px":16}}>
      <h2 style={{margin:"0 0 16px",fontSize:isLg?20:15,color:"#333",fontWeight:700}}>My Assignments</h2>
      
      <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(4,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:16,marginBottom:16}}>
        {[
          {label:"Total",value:"5",icon:"📝",color:C.blue},
          {label:"Submitted",value:"2",icon:"✅",color:C.green},
          {label:"Pending",value:"2",icon:"⏳",color:C.orange},
          {label:"Overdue",value:"1",icon:"⚠️",color:C.red},
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

      <SectionCard title="Assignment List" icon="📝" color={C.blue}>
        <div style={{padding:12}}>
          {assignments.map((assignment, index) => (
            <div key={index} style={{
              background:"#f9f9f9",borderRadius:8,padding:12,marginBottom:8,
              borderLeft:`3px solid ${getStatusColor(assignment.status)}`
            }}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:600,color:"#333",marginBottom:4}}>{assignment.title}</div>
                  <div style={{fontSize:11,color:"#666",marginBottom:4}}>
                    {assignment.course} • {assignment.type}
                  </div>
                  <div style={{fontSize:10,color:"#888",marginBottom:4}}>
                    {assignment.description}
                  </div>
                  <div style={{display:"flex",gap:12,fontSize:10,color:"#666"}}>
                    <span>📅 Due: {assignment.dueDate}</span>
                    {assignment.submittedDate !== "--" && (
                      <span>✅ Submitted: {assignment.submittedDate}</span>
                    )}
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                  <Badge color={getStatusColor(assignment.status)}>
                    {assignment.status}
                  </Badge>
                  {assignment.score !== "--" && (
                    <div style={{fontSize:16,fontWeight:700,color:C.green}}>
                      {assignment.score}%
                    </div>
                  )}
                  {assignment.status === "pending" && (
                    <div style={{fontSize:10,color:C.red,fontWeight:600}}>
                      {getDaysRemaining(assignment.dueDate)} days left
                    </div>
                  )}
                </div>
              </div>
              
              <div style={{display:"flex",gap:8,marginTop:8}}>
                {assignment.status === "pending" && (
                  <button style={{
                    background:C.blue,color:"white",border:"none",borderRadius:4,
                    padding:"4px 8px",fontSize:9,cursor:"pointer"
                  }}>
                    Start Assignment
                  </button>
                )}
                {assignment.status === "in-progress" && (
                  <button style={{
                    background:C.orange,color:"white",border:"none",borderRadius:4,
                    padding:"4px 8px",fontSize:9,cursor:"pointer"
                  }}>
                    Continue
                  </button>
                )}
                <button style={{
                  background:C.gray,color:"white",border:"none",borderRadius:4,
                  padding:"4px 8px",fontSize:9,cursor:"pointer"
                }}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
