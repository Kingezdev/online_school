import { useW } from '../hooks/useW.js';
import { C, COURSES } from '../data/constants.js';
import { SectionCard } from '../components/shared/SectionCard.jsx';

const PROG_DATA = COURSES.map(c=>({
  name:`${c.code} – ${c.name}`, assignment:"0 out of 0", quiz:"0 out of 0",
  forum:"0 out of 0", progress:c.code==="GENS 103"?"Completed":"N/A", completed:c.code==="GENS 103",
}));

export function StudentDashboard() {
  const w=useW(); const isLg=w>=1024;
  const attendPct=[85,92,78,100,88,95,70,80];
  return (
    <div style={{padding:isLg?"24px 32px":16}}>
      <h2 style={{margin:"0 0 16px",fontSize:isLg?20:15,color:"#333",fontWeight:700}}>Dashboard</h2>
      <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(3,1fr)":w>=640?"repeat(3,1fr)":"1fr",gap:isLg?16:10,marginBottom:16}}>
        {[{icon:"🎓",value:9,label:"Courses",color:C.green},{icon:"👥",value:9,label:"Course Groupings",color:C.red},{icon:"👤",value:2,label:"Tutor Groupings",color:C.orange}].map(s=>(
          <div key={s.label} style={{background:"white",border:"1px solid #e0e0e0",borderRadius:8,padding:isLg?"20px 16px":12,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
            <div style={{width:44,height:44,borderRadius:"50%",background:s.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{s.icon}</div>
            <div style={{fontSize:isLg?28:22,fontWeight:800,color:"#333"}}>{s.value}</div>
            <div style={{fontSize:11,color:"#888",textAlign:"center"}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:isLg?"1fr 1fr":w>=640?"1fr 1fr":"1fr",gap:isLg?16:12}}>
        <SectionCard title="My Attendance Summary" icon="✅" color={C.green}>
          <div style={{padding:12,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {COURSES.slice(0,6).map((c,i)=>{
              const pct=attendPct[i]; const col=pct>=90?C.green:pct>=75?C.orange:C.red;
              return (
                <div key={c.code} style={{background:"#f9f9f9",borderRadius:6,padding:"8px 10px",border:`1px solid ${col}33`}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#333",marginBottom:4}}>{c.code}</div>
                  <div style={{height:6,background:"#eee",borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pct}%`,background:col,borderRadius:3}}/>
                  </div>
                  <div style={{fontSize:11,color:col,fontWeight:700,marginTop:3}}>{pct}% present</div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Deadlines" icon="⏰">
          <div style={{padding:12,display:"grid",gridTemplateColumns:"1fr",gap:8}}>
            <div style={{background:"#fff3f3",border:"1px solid #fcc",borderRadius:6,padding:12}}>
              <div style={{fontSize:12,fontWeight:700,color:C.red,marginBottom:4}}>Quiz Deadlines</div>
              <div style={{fontSize:11,color:C.red}}>No gradable quiz deadline yet</div>
            </div>
            <div style={{background:"#fff3f3",border:"1px solid #fcc",borderRadius:6,padding:12}}>
              <div style={{fontSize:12,fontWeight:700,color:C.red,marginBottom:4}}>Assignment Deadlines</div>
              <div style={{fontSize:11,color:C.red}}>No gradable assignment deadline yet</div>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Course Progress Information" icon="↗">
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:isLg?12:11}}>
            <thead>
              <tr style={{background:"#f5f5f5"}}>
                {["Course","Assignment","Quiz","Forum","Progress"].map(h=>(
                  <th key={h} style={{padding:"8px 10px",textAlign:h==="Course"?"left":"center",color:"#555",fontWeight:600,fontSize:isLg?12:10}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PROG_DATA.map((row,i)=>(
                <tr key={i} style={{borderTop:"1px solid #eee"}}>
                  <td style={{padding:"8px 10px",color:"#333",fontSize:isLg?12:10}}>{row.name}</td>
                  <td style={{padding:"8px 10px",textAlign:"center",color:"#aaa",fontSize:isLg?12:10}}>{row.assignment}</td>
                  <td style={{padding:"8px 10px",textAlign:"center",color:"#aaa",fontSize:isLg?12:10}}>{row.quiz}</td>
                  <td style={{padding:"8px 10px",textAlign:"center",color:"#aaa",fontSize:isLg?12:10}}>{row.forum}</td>
                  <td style={{padding:"8px 10px",textAlign:"center"}}>
                    <span style={{color:row.completed?C.green:C.blue,fontWeight:row.completed?700:400,fontSize:isLg?12:10}}>{row.progress}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Forum Activity – Latest Topics & Comments" icon="↗">
        <div style={{padding:14,display:"flex",gap:12,alignItems:"flex-start"}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:C.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>💬</div>
          <div style={{flex:1}}>
            <div style={{fontSize:isLg?13:11,fontWeight:600,color:C.blue}}>MODULE 1 STUDY SKILLS AND LANGUAGE SKILLS: STUDY SESSION 1</div>
            <div style={{fontSize:11,color:"#888",marginTop:2}}>Course: ENGLISH AND COMMUNICATION SKILLS by RUKAYYA Funmilayo</div>
          </div>
          <div style={{fontSize:11,color:"#aaa",flexShrink:0}}>No Deadline</div>
        </div>
      </SectionCard>
    </div>
  );
}
