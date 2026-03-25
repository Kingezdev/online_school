import { useW } from '../hooks/useW.js';
import { C, COURSES } from '../data/constants.js';
import { SectionCard, Badge } from '../components/shared/SectionCard.jsx';

export function StudentCoursesPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;

  return (
    <div style={{padding:isLg?"24px 32px":16}}>
      <h2 style={{margin:"0 0 16px",fontSize:isLg?20:15,color:"#333",fontWeight:700}}>My Courses</h2>
      
      <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(2,1fr)":"1fr",gap:16}}>
        {COURSES.map((course, index) => (
          <SectionCard key={index} style={{cursor:"pointer"}} onClick={() => setPage("dashboard")}>
            <div style={{padding:16}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                <div style={{
                  width:48,height:48,borderRadius:"50%",background:C.blue,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"white"
                }}>📚</div>
                <div>
                  <div style={{fontSize:16,fontWeight:600,color:"#333",marginBottom:2}}>{course.code}</div>
                  <div style={{fontSize:12,color:"#666"}}>{course.name}</div>
                </div>
              </div>
              
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div>
                  <div style={{fontSize:11,color:"#888",marginBottom:2}}>{course.students} students enrolled</div>
                  <div style={{fontSize:11,color:"#888"}}>{course.credits} credits</div>
                </div>
                <Badge color={C.green}>Active</Badge>
              </div>
              
              <div style={{display:"flex",gap:8}}>
                <div style={{flex:1,textAlign:"center",padding:"8px",background:"#f8f9fa",borderRadius:6}}>
                  <div style={{fontSize:18,fontWeight:700,color:C.blue}}>85%</div>
                  <div style={{fontSize:10,color:"#666"}}>Attendance</div>
                </div>
                <div style={{flex:1,textAlign:"center",padding:"8px",background:"#f8f9fa",borderRadius:6}}>
                  <div style={{fontSize:18,fontWeight:700,color:C.green}}>3.2</div>
                  <div style={{fontSize:10,color:"#666"}}>GPA</div>
                </div>
                <div style={{flex:1,textAlign:"center",padding:"8px",background:"#f8f9fa",borderRadius:6}}>
                  <div style={{fontSize:18,fontWeight:700,color:C.orange}}>12</div>
                  <div style={{fontSize:10,color:"#666"}}>Assignments</div>
                </div>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
