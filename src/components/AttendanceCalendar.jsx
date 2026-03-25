import { useState, useMemo } from "react";
import { useW } from '../hooks/useW.js';
import { C, DAYS, MONTHS } from '../data/constants.js';
import { today } from '../utils/helpers.js';

export function AttendanceCalendar({ courseCode, attendanceData, selectedDate, onSelectDate }) {
  const [viewYear,setViewYear] = useState(new Date().getFullYear());
  const [viewMonth,setViewMonth] = useState(new Date().getMonth());
  const w = useW();

  const daysInMonth = new Date(viewYear,viewMonth+1,0).getDate();
  const firstDay = new Date(viewYear,viewMonth,1).getDay();
  
  const prevMonth = () => { 
    if(viewMonth===0){
      setViewMonth(11);
      setViewYear(y=>y-1);
    }else {
      setViewMonth(m=>m-1);
    }
  };
  
  const nextMonth = () => { 
    if(viewMonth===11){
      setViewMonth(0);
      setViewYear(y=>y+1);
    }else {
      setViewMonth(m=>m+1);
    }
  };

  const courseData = attendanceData[courseCode]||{};
  
  const cells = useMemo(() => {
    const arr = [];
    for(let i=0;i<firstDay;i++) {
      arr.push(null);
    }
    for(let d=1;d<=daysInMonth;d++) {
      arr.push(d);
    }
    return arr;
  }, [firstDay, daysInMonth]);

  const getDayKey = d=>`${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const getDayStatus = d=>{
    const key=getDayKey(d); if(!courseData[key]) return "none";
    const vals=Object.values(courseData[key]).filter(v=>["present","absent","excused"].includes(v));
    if(!vals.length) return "none";
    const pct=vals.filter(v=>v==="present").length/vals.length;
    return pct>=0.9?"great":pct>=0.7?"ok":"low";
  };
  const todayKey=today();
  const cellSize = w>=1024?36:w>=640?32:28;

  return (
    <div style={{userSelect:"none"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <button onClick={prevMonth} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.blue,padding:"2px 8px"}}>‹</button>
        <div style={{fontSize:14,fontWeight:700,color:"#333"}}>{MONTHS[viewMonth]} {viewYear}</div>
        <button onClick={nextMonth} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.blue,padding:"2px 8px"}}>›</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:4}}>
        {DAYS.map(d=><div key={d} style={{textAlign:"center",fontSize:10,fontWeight:700,color:"#bbb",padding:"2px 0"}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
        {cells.map((day, index)=>{
          if(!day) return <div key={`empty-${index}`}/>;
          const key=getDayKey(day), status=getDayStatus(day);
          const isSel=key===selectedDate, isToday=key===todayKey, isFuture=key>todayKey;
          const dotColor=status==="great"?C.green:status==="ok"?C.orange:status==="low"?C.red:null;
          return (
            <div key={key} onClick={()=>onSelectDate(key)} style={{
              textAlign:"center",padding:"5px 2px",borderRadius:7,
              background:isSel?C.blue:isToday?"#e8f4fd":"transparent",
              border:isToday&&!isSel?`1px solid ${C.blue}`:"1px solid transparent",
              cursor:"pointer",transition:"background 0.15s",minHeight:cellSize,
            }}
              onMouseEnter={e=>{if(!isSel) e.currentTarget.style.background="#f0f4ff";}}
              onMouseLeave={e=>{if(!isSel) e.currentTarget.style.background=isSel?C.blue:isToday?"#e8f4fd":"transparent";}}
            >
              <div style={{fontSize:12,fontWeight:isToday||isSel?700:400,color:isSel?"white":isFuture?"#ccc":"#333"}}>{day}</div>
              <div style={{width:6,height:6,borderRadius:"50%",background:isSel?"white":dotColor||"transparent",margin:"2px auto 0"}}/>
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",gap:12,marginTop:10,justifyContent:"center",flexWrap:"wrap"}}>
        {[{color:C.green,label:"≥90%"},{color:C.orange,label:"70–89%"},{color:C.red,label:"<70%"}].map(l=>(
          <div key={l.label} style={{display:"flex",alignItems:"center",gap:4}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:l.color}}/>
            <span style={{fontSize:10,color:"#888"}}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
