import { useW } from '../hooks/useW.js';
import { C, LECTURER_COURSES } from '../data/constants.js';
import { SectionCard, Badge } from '../components/shared/SectionCard.jsx';

export function LecturerDashboard({ setPage }) {
  const w=useW(); const isLg=w>=1024;
  const totalStudents=LECTURER_COURSES.reduce((a,c)=>a+c.students,0);
  const recentActivity=[
    {icon:"✅",text:"Attendance marked – COSC 205 17 Mar",time:"2h ago"},
    {icon:"📝",text:"Quiz 16 uploaded for COSC 203",time:"5h ago"},
    {icon:"💬",text:"New forum post in STAT 201",time:"1d ago"},
    {icon:"📊",text:"Grades released – COSC 211 Quiz 4",time:"2d ago"},
  ];
  const pendingTasks=[
    {label:"Mark attendance – STAT 201 today",urgent:true},
    {label:"Grade 23 submissions – COSC 203 Quiz 15",urgent:true},
    {label:"Reply to 5 forum threads",urgent:false},
    {label:"Upload COSC 211 lecture notes",urgent:false},
  ];
  const courseStats=[
    {code:"STAT 201",pct:87,risk:2,col:C.orange},
    {code:"COSC 203",pct:91,risk:1,col:C.green},
    {code:"COSC 205",pct:78,risk:4,col:C.orange},
    {code:"COSC 211",pct:95,risk:0,col:C.green},
  ];
  return (
    <div style={{padding:isLg?"24px 32px":16}}>
      <h2 style={{margin:"0 0 4px",fontSize:isLg?20:15,color:"#333",fontWeight:700}}>Lecturer Dashboard</h2>
      <div style={{fontSize:12,color:"#aaa",marginBottom:16}}>Welcome back, Ahmad Jafar — 2025/2026 Semester One</div>

      <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(4,1fr)":w>=640?"repeat(4,1fr)":"repeat(2,1fr)",gap:isLg?16:10,marginBottom:16}}>
        {[
          {icon:"📚",value:LECTURER_COURSES.length,label:"MY COURSES",color:C.purple},
          {icon:"👨‍🎓",value:totalStudents,label:"TOTAL STUDENTS",color:C.blue},
          {icon:"✅",value:"88%",label:"AVG ATTENDANCE",color:C.green},
          {icon:"⚠️",value:3,label:"AT RISK",color:C.red},
        ].map(s=>(
          <div key={s.label} style={{background:"white",border:"1px solid #e0e0e0",borderRadius:8,padding:isLg?"20px 16px":"12px 10px",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:s.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{s.icon}</div>
            <div style={{fontSize:isLg?26:20,fontWeight:800,color:"#333"}}>{s.value}</div>
            <div style={{fontSize:9,color:"#888",textAlign:"center",letterSpacing:0.5}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:isLg?"1fr 1fr":w>=640?"1fr 1fr":"1fr",gap:isLg?16:12}}>
        <SectionCard title="Attendance Overview" icon="✅" color={C.green}>
          <div style={{padding:14}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              {courseStats.map((cs,i)=>{
                const course=LECTURER_COURSES[i];
                return (
                  <div key={cs.code} onClick={()=>setPage("attendance")} style={{background:"#f9fafb",border:`1px solid ${cs.col}40`,borderRadius:8,padding:10,cursor:"pointer",transition:"box-shadow 0.2s"}}
                    onMouseEnter={e=>e.currentTarget.style.boxShadow="0 2px 10px rgba(0,0,0,0.1)"}
                    onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                    <div style={{fontSize:12,fontWeight:700,color:C.blue}}>{cs.code}</div>
                    <div style={{fontSize:10,color:"#999",marginBottom:6,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{course.name}</div>
                    <div style={{height:6,background:"#e0e0e0",borderRadius:3}}>
                      <div style={{height:"100%",width:`${cs.pct}%`,background:cs.col,borderRadius:3}}/>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                      <span style={{fontSize:11,color:cs.col,fontWeight:700}}>{cs.pct}%</span>
                      {cs.risk>0&&<span style={{fontSize:10,color:C.red}}>⚠ {cs.risk} at risk</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={()=>setPage("attendance")} style={{width:"100%",background:C.green,color:"white",border:"none",borderRadius:6,padding:"10px 0",fontSize:13,fontWeight:700,cursor:"pointer"}}>
              ✅ Open Attendance Manager
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Pending Tasks" icon="⏳" color={C.orange}>
          <div style={{padding:"4px 14px 12px"}}>
            {pendingTasks.map((t,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<pendingTasks.length-1?"1px solid #f0f0f0":"none"}}>
                <span style={{fontSize:16}}>{t.urgent?"🔴":"🟡"}</span>
                <span style={{fontSize:12,color:"#444",flex:1}}>{t.label}</span>
                {t.urgent&&<Badge color={C.red}>Urgent</Badge>}
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="My Courses" icon="📚">
          {LECTURER_COURSES.map((c,i)=>(
            <div key={c.code} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 16px",borderBottom:"1px solid #f0f0f0"}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:`hsl(${i*50+180},55%,50%)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>📚</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:700,color:C.blue,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.code} – {c.name}</div>
                <div style={{fontSize:11,color:"#888"}}>{c.students} students enrolled</div>
              </div>
              <div style={{display:"flex",gap:4,flexShrink:0}}>
                <Badge color={C.blue}>{c.quizzes}</Badge>
                <Badge color={C.orange}>{c.assignments}</Badge>
              </div>
            </div>
          ))}
        </SectionCard>

        <SectionCard title="Recent Activity" icon="🕐" color="#555">
          <div style={{padding:"6px 14px"}}>
            {recentActivity.map((act,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"10px 0",borderBottom:i<recentActivity.length-1?"1px solid #f0f0f0":"none"}}>
                <div style={{width:30,height:30,borderRadius:"50%",background:"#f0f0f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{act.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,color:"#333"}}>{act.text}</div>
                  <div style={{fontSize:11,color:"#aaa"}}>{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
