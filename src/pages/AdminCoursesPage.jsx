import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';
import { SectionCard, Badge } from '../components/shared/SectionCard.jsx';

export function AdminCoursesPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;

  const courses = [
    { code: "COSC 203", name: "Discrete Structures", lecturer: "Ahmad Jafar", students: 48, status: "active", sessions: 24, credits: 3 },
    { code: "STAT 201", name: "Probability and Statistics", lecturer: "Khadija Hassan", students: 55, status: "active", sessions: 30, credits: 4 },
    { code: "MATH 207", name: "Linear Algebra", lecturer: "Ahmad Jafar", students: 42, status: "inactive", sessions: 18, credits: 3 },
    { code: "COSC 205", name: "Digital Logic Design", lecturer: "Khadija Hassan", students: 45, status: "active", sessions: 22, credits: 3 },
    { code: "COSC 211", name: "Object-Oriented Programming", lecturer: "Yusuf Ahmed", students: 48, status: "active", sessions: 26, credits: 4 },
    { code: "ENGL 101", name: "English Composition", lecturer: "Sarah Johnson", students: 62, status: "active", sessions: 28, credits: 3 },
  ];

  const getStatusColor = (status) => {
    return status === "active" ? C.green : C.red;
  };

  return (
    <div style={{padding:isLg?"24px 32px":16}}>
      <h2 style={{margin:"0 0 16px",fontSize:isLg?20:15,color:"#333",fontWeight:700}}>Course Management</h2>
      
      <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(4,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:16,marginBottom:16}}>
        {[
          {label:"Total Courses",value:"6",icon:"📚",color:C.blue},
          {label:"Active",value:"5",icon:"✅",color:C.green},
          {label:"Total Students",value:"300",icon:"👥",color:C.orange},
          {label:"Total Credits",value:"20",icon:"🎯",color:C.purple},
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

      <SectionCard title="Course Directory" icon="📚" color={C.blue}>
        <div style={{padding:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <h3 style={{margin:0,fontSize:14,fontWeight:600,color:"#333"}}>All Courses</h3>
            <div style={{display:"flex",gap:8}}>
              <button style={{
                background:C.green,color:"white",border:"none",borderRadius:6,
                padding:"6px 12px",fontSize:11,cursor:"pointer",fontWeight:600
              }}>
                + Add Course
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
                  <th style={{padding:"8px",textAlign:"left",color:"#555",fontWeight:600}}>Code</th>
                  <th style={{padding:"8px",textAlign:"left",color:"#555",fontWeight:600}}>Name</th>
                  <th style={{padding:"8px",textAlign:"left",color:"#555",fontWeight:600}}>Lecturer</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Students</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Credits</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Sessions</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Status</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr key={index}>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",color:"#333",fontWeight:500}}>{course.code}</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",color:"#333"}}>{course.name}</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",color:"#666"}}>{course.lecturer}</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>{course.students}</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>{course.credits}</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>{course.sessions}</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                      <Badge color={getStatusColor(course.status)}>
                        {course.status}
                      </Badge>
                    </td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                      <button style={{
                        background:C.orange,color:"white",border:"none",borderRadius:4,
                        padding:"2px 6px",fontSize:9,cursor:"pointer",marginRight:2
                      }}>
                        Edit
                      </button>
                      <button style={{
                        background:C.blue,color:"white",border:"none",borderRadius:4,
                        padding:"2px 6px",fontSize:9,cursor:"pointer"
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

      <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(2,1fr)":w>=640?"1fr 1fr":"1fr",gap:16}}>
        <SectionCard title="Course Statistics" icon="📊" color={C.orange}>
          <div style={{padding:12}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[
                {label:"Avg Class Size",value:"50",icon:"👥"},
                {label:"Avg Credits",value:"3.3",icon:"🎯"},
                {label:"Full Capacity",value:"2",icon:"📈"},
                {label:"Low Enrollment",value:"1",icon:"⚠️"},
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
                {title:"Schedule Courses",description:"Set course schedule",icon:"📅"},
                {title:"Assign Lecturers",description:"Manage assignments",icon:"👨‍🏫"},
                {title:"Enrollment Reports",description:"View enrollment data",icon:"📊"},
                {title:"Course Catalog",description:"Update catalog",icon:"📚"},
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
