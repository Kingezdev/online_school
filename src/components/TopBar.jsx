import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';

export function TopBar({ role, setRole }) {
  const w = useW();
  const isLg = w >= 1024;
  return (
    <div style={{background:C.dark,color:"white",padding:`0 ${isLg?24:12}px`,display:"flex",alignItems:"center",minHeight:isLg?52:44,gap:6,flexWrap:"wrap"}}>
      <div style={{marginRight:6}}>
        <img src="/ABU.jpeg" alt="ABU Logo" style={{height:isLg?32:24,width:"auto"}}/>
      </div>
      {isLg&&["2025/2026 ▾","Semester One ▾","Resources ▾","Help(0) ▾"].map(t=>(
        <span key={t} style={{fontSize:11,color:"#ccc",marginRight:4,cursor:"pointer"}}>{t}</span>
      ))}
      <div style={{marginLeft:"auto",display:"flex",gap:isLg?12:8,alignItems:"center"}}>
        {isLg&&<><span style={{fontSize:15,cursor:"pointer"}}>📋</span><span style={{fontSize:15,cursor:"pointer"}}>✉️</span><span style={{fontSize:15,cursor:"pointer"}}>🔔</span></>}
        <div style={{display:"flex",background:"#2a2a3e",borderRadius:20,overflow:"hidden",border:"1px solid #444"}}>
          {["student","lecturer"].map(r=>(
            <button key={r} onClick={()=>setRole(r)} style={{
              background:role===r?C.blue:"transparent",color:role===r?"white":"#aaa",
              border:"none",padding:isLg?"4px 12px":"3px 8px",fontSize:isLg?11:10,cursor:"pointer",fontWeight:role===r?700:400
            }}>{r==="student"?"👨‍🎓 Student":"👨‍🏫 Lecturer"}</button>
          ))}
        </div>
        <div style={{background:role==="lecturer"?C.purple:C.green,borderRadius:"50%",width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700}}>
          {role==="lecturer"?"AJ":"GR"}
        </div>
        {isLg&&(
          <div style={{fontSize:11,lineHeight:"14px"}}>
            <div style={{fontWeight:700}}>{role==="lecturer"?"AHMAD JAFAR":"GITAR RITMUN"}</div>
            <div style={{color:"#aaa",fontSize:10}}>{role==="lecturer"?"Lecturer":"Student"}</div>
          </div>
        )}
      </div>
    </div>
  );
}
