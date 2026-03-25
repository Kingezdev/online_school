import { useW } from '../hooks/useW.js';
import { C, COURSES, LECTURER_COURSES } from '../data/constants.js';
import { SectionCard, Badge, StatPill } from '../components/shared/SectionCard.jsx';

export function MyCoursesPage({ role }) {
  const w=useW(); const isLg=w>=1024;
  const courses=role==="lecturer"?LECTURER_COURSES:COURSES;
  const cols=isLg?3:w>=640?2:2;
  return (
    <div style={{padding:isLg?"24px 32px":16}}>
      <h2 style={{margin:"0 0 4px",fontSize:isLg?20:15,color:"#333",fontWeight:700}}>My Courses</h2>
      <div style={{fontSize:12,color:"#aaa",marginBottom:16}}>Home / My Courses</div>
      <div style={{background:"white",border:"1px solid #e0e0e0",borderRadius:8,padding:isLg?"16px 20px":"12px 16px",marginBottom:16,display:"flex",gap:isLg?40:24}}>
        <StatPill icon="📋" value={courses.length} label="Courses"     color={C.orange}/>
        <StatPill icon="👥" value={courses.length} label="Groupings"   color={C.red}/>
        <StatPill icon="👤" value={2}              label="Tutor Groups" color="#95a5a6"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:`repeat(${cols},1fr)`,gap:isLg?16:8}}>
        {courses.map((course,i)=>(
          <div key={i} style={{background:"white",border:"1px solid #e0e0e0",borderRadius:8,padding:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div style={{flex:1,marginRight:8}}>
                <div style={{fontSize:isLg?13:11,fontWeight:700,color:C.blue,marginBottom:4,lineHeight:1.3}}>{course.name}</div>
                <Badge color={C.blue}>{course.code}</Badge>
              </div>
              <div style={{width:38,height:38,borderRadius:"50%",background:`hsl(${i*40},60%,55%)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>📚</div>
            </div>
            <div style={{fontSize:11,color:"#666",marginBottom:10}}>
              <div><strong>Tutor:</strong> {course.tutor} · 👤 {course.students}</div>
              <div style={{color:"#aaa",marginTop:2}}><strong>Sub Group:</strong> {course.code==="COSC 211"?"Group 5 | 10":"No grouping yet"}</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginBottom:4}}>
              <div style={{background:"#f5f5f5",borderRadius:4,padding:"4px 6px",fontSize:10,color:"#555",textAlign:"center"}}>📝 {course.assignments} Tasks</div>
              <div style={{background:"#f5f5f5",borderRadius:4,padding:"4px 6px",fontSize:10,color:"#555",textAlign:"center"}}>✅ {course.quizzes} Quizzes</div>
            </div>
            <button style={{width:"100%",background:C.blue,color:"white",border:"none",borderRadius:5,padding:"7px 0",fontSize:11,cursor:"pointer",fontWeight:600}}>🏛 Go to Class</button>
          </div>
        ))}
      </div>
    </div>
  );
}
