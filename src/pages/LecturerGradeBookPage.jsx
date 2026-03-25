import { useW } from '../hooks/useW.js';
import { C, LECTURER_COURSES } from '../data/constants.js';
import { SectionCard, Badge } from '../components/shared/SectionCard.jsx';

export function LecturerGradeBookPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;

  const gradeData = [
    {
      course: "COSC 203",
      students: [
        { id: "STU001", name: "Ahmad Muhammad", assignments: [85, 92, 78], quizzes: [90, 85], midterm: 82, final: 85, overall: 85 },
        { id: "STU002", name: "Fatima Ali", assignments: [88, 90, 85], quizzes: [92, 88], midterm: 88, final: 90, overall: 89 },
        { id: "STU003", name: "Omar Hassan", assignments: [78, 82, 80], quizzes: [85, 80], midterm: 80, final: 82, overall: 81 },
        { id: "STU004", name: "Aisha Bello", assignments: [90, 88, 92], quizzes: [88, 90], midterm: 88, final: 90, overall: 88 },
      ]
    },
    {
      course: "STAT 201",
      students: [
        { id: "STU005", name: "Musa Ibrahim", assignments: [87, 89, 85], quizzes: [91, 87], midterm: 86, final: 88, overall: 87 },
        { id: "STU006", name: "Khadija Sani", assignments: [92, 94, 90], quizzes: [93, 91], midterm: 92, final: 93, overall: 92 },
        { id: "STU007", name: "Yusuf Ahmed", assignments: [80, 82, 78], quizzes: [82, 80], midterm: 81, final: 82, overall: 81 },
      ]
    }
  ];

  const calculateClassAverage = (students) => {
    return (students.reduce((sum, student) => sum + student.overall, 0) / students.length).toFixed(1);
  };

  return (
    <div style={{padding:isLg?"24px 32px":16}}>
      <h2 style={{margin:"0 0 16px",fontSize:isLg?20:15,color:"#333",fontWeight:700}}>Grade Book</h2>
      
      <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(4,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:16,marginBottom:16}}>
        {[
          {label:"Total Students",value:"7",icon:"👥",color:C.blue},
          {label:"Avg Class Performance",value:"85.4%",icon:"📊",color:C.green},
          {label:"Graded Assignments",value:"24",icon:"✅",color:C.orange},
          {label:"Pending Grades",value:"3",icon:"⏳",color:C.red},
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

      {gradeData.map((courseData, courseIndex) => (
        <SectionCard key={courseIndex} title={`${courseData.course} - Grade Overview`} icon="📊" color={C.blue}>
          <div style={{padding:12}}>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:14,fontWeight:600,color:"#333",marginBottom:4}}>
                Class Average: {calculateClassAverage(courseData.students)}%
              </div>
              <div style={{fontSize:11,color:"#666"}}>
                {courseData.students.length} students enrolled
              </div>
            </div>
            
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
                <thead>
                  <tr style={{background:"#f5f5f5"}}>
                    <th style={{padding:"6px",textAlign:"left",color:"#555",fontWeight:600}}>Student ID</th>
                    <th style={{padding:"6px",textAlign:"left",color:"#555",fontWeight:600}}>Name</th>
                    <th style={{padding:"6px",textAlign:"center",color:"#555",fontWeight:600}}>Assignments</th>
                    <th style={{padding:"6px",textAlign:"center",color:"#555",fontWeight:600}}>Quizzes</th>
                    <th style={{padding:"6px",textAlign:"center",color:"#555",fontWeight:600}}>Midterm</th>
                    <th style={{padding:"6px",textAlign:"center",color:"#555",fontWeight:600}}>Final</th>
                    <th style={{padding:"6px",textAlign:"center",color:"#555",fontWeight:600}}>Overall</th>
                    <th style={{padding:"6px",textAlign:"center",color:"#555",fontWeight:600}}>Grade</th>
                    <th style={{padding:"6px",textAlign:"center",color:"#555",fontWeight:600}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courseData.students.map((student, studentIndex) => (
                    <tr key={studentIndex}>
                      <td style={{padding:"6px",borderTop:"1px solid #eee",color:"#333"}}>{student.id}</td>
                      <td style={{padding:"6px",borderTop:"1px solid #eee",color:"#333",fontWeight:500}}>{student.name}</td>
                      <td style={{padding:"6px",borderTop:"1px solid #eee",textAlign:"center"}}>
                        {(student.assignments.reduce((a,b)=>a+b,0)/student.assignments.length).toFixed(0)}%
                      </td>
                      <td style={{padding:"6px",borderTop:"1px solid #eee",textAlign:"center"}}>
                        {(student.quizzes.reduce((a,b)=>a+b,0)/student.quizzes.length).toFixed(0)}%
                      </td>
                      <td style={{padding:"6px",borderTop:"1px solid #eee",textAlign:"center"}}>{student.midterm}%</td>
                      <td style={{padding:"6px",borderTop:"1px solid #eee",textAlign:"center"}}>{student.final}%</td>
                      <td style={{padding:"6px",borderTop:"1px solid #eee",textAlign:"center",fontWeight:600}}>
                        {student.overall}%
                      </td>
                      <td style={{padding:"6px",borderTop:"1px solid #eee",textAlign:"center"}}>
                        <Badge color={
                          student.overall >= 90 ? C.green : 
                          student.overall >= 80 ? C.blue : 
                          student.overall >= 70 ? C.orange : C.red
                        }>
                          {student.overall >= 90 ? "A" : student.overall >= 80 ? "B" : student.overall >= 70 ? "C" : "D"}
                        </Badge>
                      </td>
                      <td style={{padding:"6px",borderTop:"1px solid #eee",textAlign:"center"}}>
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
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SectionCard>
      ))}
    </div>
  );
}
