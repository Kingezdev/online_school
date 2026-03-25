import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';

export function HomePage({ setPage, role }) {
  const w=useW(); const isLg=w>=1024;
  const cards = role==="lecturer"
    ? [
        {icon:"📚",title:"My Courses",   desc:"View and manage your courses",   action:"View",   page:"my courses"},
        {icon:"✅",title:"Attendance",   desc:"Mark and review attendance",     action:"Manage", page:"attendance"},
        {icon:"📊",title:"Grade Book",   desc:"Manage student grades",          action:"View",   page:"grade book"},
        {icon:"📝",title:"Assignments",  desc:"Create and grade assignments",   action:"Manage", page:"assignments"},
        {icon:"💬",title:"Forum",        desc:"Manage course discussions",      action:"Manage", page:"forum"},
        {icon:"👤",title:"Profile",      desc:"Edit your profile",              action:"Manage", page:"profile"},
      ]
    : [
        {icon:"📋",title:"My Courses",     desc:"View all registered courses",      action:"View",   page:"my courses"},
        {icon:"📝",title:"My Assignments", desc:"View assignments and submissions",  action:"View",   page:"assignment"},
        {icon:"✅",title:"Quizzes",        desc:"View quizzes and submissions",      action:"View",   page:"sub"},
        {icon:"💬",title:"Discussions",    desc:"Manage discussions",               action:"Manage", page:"forum"},
        {icon:"👤",title:"Profile",        desc:"Manage your profile",              action:"Manage", page:"profile"},
      ];
  const cols = isLg?4:w>=640?3:2;
  return (
    <div style={{padding:isLg?"24px 32px":16}}>
      <h2 style={{margin:"0 0 16px",fontSize:isLg?20:15,color:"#333",fontWeight:700}}>Home</h2>
      <input placeholder="🔍 Search pages and content…" style={{width:"100%",padding:"10px 14px",border:"1px solid #ddd",borderRadius:8,marginBottom:20,boxSizing:"border-box",fontSize:13,outline:"none"}}/>
      <div style={{display:"grid",gridTemplateColumns:`repeat(${cols},1fr)`,gap:isLg?16:10}}>
        {cards.map(card=>(
          <div key={card.title} style={{background:"white",border:"1px solid #e0e0e0",borderRadius:10,overflow:"hidden",transition:"box-shadow 0.2s",cursor:"pointer"}}
            onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.1)"}
            onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
            <div style={{background:C.blue,padding:isLg?"28px 0":"20px 0",textAlign:"center",fontSize:isLg?36:28}}>{card.icon}</div>
            <div style={{padding:isLg?"14px 16px 16px":"10px 12px 14px"}}>
              <div style={{fontSize:isLg?14:12,fontWeight:700,color:"#333",marginBottom:4}}>{card.title}</div>
              <div style={{fontSize:isLg?12:10,color:"#888",marginBottom:12}}>{card.desc}</div>
              <button onClick={()=>setPage(card.page)} style={{background:C.blue,color:"white",border:"none",borderRadius:6,padding:isLg?"8px 0":"5px 0",fontSize:isLg?12:10,cursor:"pointer",width:"100%",fontWeight:600}}>
                {card.action==="View"?"👁":"⚙"} {card.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
