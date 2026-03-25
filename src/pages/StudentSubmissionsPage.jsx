import { useW } from '../hooks/useW.js';
import { C, COURSES } from '../data/constants.js';
import { SectionCard, Badge } from '../components/shared/SectionCard.jsx';

export function StudentSubmissionsPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;

  const submissions = [
    { id: 1, course: "COSC 203", title: "Algorithm Analysis Assignment", type: "Assignment", submitted: "2026-03-20", status: "graded", score: 85, feedback: "Good work on complexity analysis" },
    { id: 2, course: "STAT 201", title: "Probability Theory Quiz", type: "Quiz", submitted: "2026-03-22", status: "graded", score: 92, feedback: "Excellent understanding of concepts" },
    { id: 3, course: "MATH 207", title: "Linear Algebra Problem Set", type: "Assignment", submitted: "2026-03-24", status: "pending", score: "--", feedback: "Awaiting grading" },
    { id: 4, course: "COSC 205", title: "Digital Logic Lab Report", type: "Lab", submitted: "2026-03-25", status: "submitted", score: "--", feedback: "Submitted for review" },
    { id: 5, course: "COSC 211", title: "Object-Oriented Programming Project", type: "Project", submitted: "--", status: "due", score: "--", feedback: "Due: 2026-03-28" },
  ];

  return (
    <div style={{padding:isLg?"24px 32px":16}}>
      <h2 style={{margin:"0 0 16px",fontSize:isLg?20:15,color:"#333",fontWeight:700}}>My Submissions</h2>
      
      <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(3,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:16,marginBottom:16}}>
        {[
          {label:"Total Submitted",value:"4",icon:"📤",color:C.blue},
          {label:"Graded",value:"2",icon:"✅",color:C.green},
          {label:"Pending",value:"2",icon:"⏳",color:C.orange},
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

      <SectionCard title="Recent Submissions" icon="📋" color={C.blue}>
        <div style={{padding:12}}>
          {submissions.map((submission, index) => (
            <div key={index} style={{
              background:"#f9f9f9",borderRadius:8,padding:12,marginBottom:8,
              borderLeft:`3px solid ${submission.status === "graded" ? C.green : submission.status === "pending" ? C.orange : C.blue}`
            }}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:"#333",marginBottom:4}}>{submission.title}</div>
                  <div style={{fontSize:11,color:"#666",marginBottom:2}}>
                    {submission.course} • {submission.type}
                  </div>
                  <div style={{fontSize:10,color:"#888"}}>
                    {submission.submitted !== "--" ? `Submitted: ${submission.submitted}` : `Due: ${submission.feedback}`}
                  </div>
                </div>
                <Badge color={
                  submission.status === "graded" ? C.green : 
                  submission.status === "pending" ? C.orange : 
                  submission.status === "submitted" ? C.blue : C.red
                }>
                  {submission.status}
                </Badge>
              </div>
              
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:12,color:"#666"}}>
                  {submission.feedback}
                </div>
                {submission.score !== "--" && (
                  <div style={{fontSize:16,fontWeight:700,color:C.green}}>
                    {submission.score}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
