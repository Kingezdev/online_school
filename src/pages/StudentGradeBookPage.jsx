import { useW } from '../hooks/useW.js';
import { C, COURSES } from '../data/constants.js';
import { SectionCard, Badge } from '../components/shared/SectionCard.jsx';

export function StudentGradeBookPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;

  const grades = [
    { course: "COSC 203", assignments: [85, 92, 78, 88], quizzes: [90, 85, 88], midterm: 82, final: 85, overall: 85 },
    { course: "STAT 201", assignments: [88, 90, 85, 92], quizzes: [92, 88, 90], midterm: 88, final: 90, overall: 89 },
    { course: "MATH 207", assignments: [78, 82, 80, 85], quizzes: [85, 80, 82], midterm: 80, final: 82, overall: 81 },
    { course: "COSC 205", assignments: [90, 88, 92, 86], quizzes: [88, 90, 85], midterm: 88, final: 90, overall: 88 },
  ];

  const calculateGPA = (overall) => {
    if (overall >= 90) return "4.0";
    if (overall >= 85) return "3.7";
    if (overall >= 80) return "3.3";
    if (overall >= 75) return "3.0";
    if (overall >= 70) return "2.7";
    if (overall >= 65) return "2.3";
    if (overall >= 60) return "2.0";
    return "1.0";
  };

  const currentGPA = (grades.reduce((sum, g) => sum + parseFloat(calculateGPA(g.overall)), 0) / grades.length).toFixed(2);

  return (
    <div style={{padding:isLg?"24px 32px":16}}>
      <h2 style={{margin:"0 0 16px",fontSize:isLg?20:15,color:"#333",fontWeight:700}}>Grade Book</h2>
      
      <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(4,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:16,marginBottom:16}}>
        {[
          {label:"Current GPA",value:currentGPA,icon:"🎯",color:C.blue},
          {label:"Total Credits",value:"16",icon:"📚",color:C.green},
          {label:"Avg Grade",value:"85.8%",icon:"📊",color:C.orange},
          {label:"Class Rank",value:"12/48",icon:"🏆",color:C.purple},
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

      <SectionCard title="Course Grades" icon="📊" color={C.blue}>
        <div style={{padding:12}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead>
                <tr style={{background:"#f5f5f5"}}>
                  <th style={{padding:"8px",textAlign:"left",color:"#555",fontWeight:600}}>Course</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Assignments</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Quizzes</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Midterm</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Final</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Overall</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Grade</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade, index) => (
                  <tr key={index}>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",color:"#333",fontWeight:500}}>{grade.course}</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                      {grade.assignments.reduce((a,b)=>a+b,0)/grade.assignments.length}%
                    </td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                      {grade.quizzes.reduce((a,b)=>a+b,0)/grade.quizzes.length}%
                    </td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>{grade.midterm}%</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>{grade.final}%</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center",fontWeight:600}}>
                      {grade.overall}%
                    </td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                      <Badge color={
                        grade.overall >= 90 ? C.green : 
                        grade.overall >= 80 ? C.blue : 
                        grade.overall >= 70 ? C.orange : C.red
                      }>
                        {grade.overall >= 90 ? "A" : grade.overall >= 80 ? "B" : grade.overall >= 70 ? "C" : "D"}
                      </Badge>
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
