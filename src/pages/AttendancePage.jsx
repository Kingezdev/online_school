import { useState, useMemo, useCallback } from "react";
import { useW } from '../hooks/useW.js';
import { C, LECTURER_COURSES, MONTHS, DAYS } from '../data/constants.js';
import { SectionCard, Badge } from '../components/shared/SectionCard.jsx';
import { AttendanceCalendar } from '../components/AttendanceCalendar.jsx';
import { seedAttendance, generateStudents, fmtDisplay, today } from '../utils/helpers.js';

export function AttendancePage() {
  const w = useW();
  const isLg = w >= 1024;
  const [attendanceData,setAttendanceData] = useState(()=>seedAttendance());
  const [selCourse,setSelCourse]     = useState(LECTURER_COURSES[0].code);
  const [selDate,setSelDate]         = useState(today());
  const [sessionLabel,setSessionLabel]= useState("Lecture");
  const [search,setSearch]           = useState("");
  const [saved,setSaved]             = useState(false);
  const [tab,setTab]                 = useState("mark");

  const course   = LECTURER_COURSES.find(c=>c.code===selCourse);
  const students = useMemo(()=>generateStudents(selCourse),[selCourse]);
  const dayData  = useMemo(()=>attendanceData[selCourse]?.[selDate]||{},[attendanceData,selCourse,selDate]);
  const filtered = students.filter(s=>s.name.toLowerCase().includes(search.toLowerCase())||s.matric.toLowerCase().includes(search.toLowerCase()));
  const recordedDates = useMemo(()=>Object.keys(attendanceData[selCourse]||{}).sort((a,b)=>b.localeCompare(a)),[attendanceData,selCourse]);
  const isFutureDate = selDate > today();

  const markOne = useCallback((id,status)=>{
    setAttendanceData(prev=>({...prev,[selCourse]:{...prev[selCourse],[selDate]:{...(prev[selCourse]?.[selDate]||{}),label:sessionLabel,[id]:status}}}));
    setSaved(false);
  },[selCourse,selDate,sessionLabel]);

  const markAll = status=>{
    const upd={label:sessionLabel,locked:false};
    students.forEach(s=>{upd[s.id]=status;});
    setAttendanceData(prev=>({...prev,[selCourse]:{...prev[selCourse],[selDate]:upd}}));
    setSaved(false);
  };

  const handleSave = ()=>{
    setAttendanceData(prev=>({...prev,[selCourse]:{...prev[selCourse],[selDate]:{...(prev[selCourse]?.[selDate]||{}),locked:false,label:sessionLabel}}}));
    setSaved(true); setTimeout(()=>setSaved(false),2500);
  };

  const summary = useMemo(()=>{
    const vals=students.map(s=>dayData[s.id]).filter(Boolean);
    return {
      present:vals.filter(v=>v==="present").length, absent:vals.filter(v=>v==="absent").length,
      excused:vals.filter(v=>v==="excused").length,
      unmarked:students.length-vals.filter(v=>["present","absent","excused"].includes(v)).length,
      total:students.length,
    };
  },[dayData,students]);

  const reportData = useMemo(()=>students.map(s=>{
    let present=0,absent=0,excused=0;
    recordedDates.forEach(d=>{ const v=attendanceData[selCourse]?.[d]?.[s.id]; if(v==="present")present++;else if(v==="absent")absent++;else if(v==="excused")excused++; });
    const pct=recordedDates.length>0?Math.round((present/recordedDates.length)*100):0;
    return {...s,present,absent,excused,pct};
  }),[students,attendanceData,selCourse,recordedDates]);

  return (
    <div style={{padding:isLg?"24px 32px":16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <h2 style={{margin:0,fontSize:isLg?20:15,color:"#333",fontWeight:700}}>Attendance Management</h2>
        <span style={{fontSize:11,color:"#888"}}>2025/2026 – Semester One</span>
      </div>
      <div style={{fontSize:12,color:"#aaa",marginBottom:16}}>Home / Attendance</div>

      <SectionCard title="Select Course" icon="📚" color={C.purple}>
        <div style={{padding:"10px 14px"}}>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {LECTURER_COURSES.map(c=>(
              <button key={c.code} onClick={()=>{setSelCourse(c.code);setSaved(false);}} style={{
                background:selCourse===c.code?C.blue:"#f0f0f0",
                color:selCourse===c.code?"white":"#555",
                border:"none",borderRadius:6,padding:isLg?"7px 16px":"5px 10px",
                fontSize:isLg?13:11,cursor:"pointer",fontWeight:selCourse===c.code?700:400,transition:"all 0.15s"
              }}>{c.code}{isLg?` – ${c.name.split(" ").slice(0,2).join(" ")}`:""}</button>
            ))}
          </div>
          <div style={{marginTop:10,background:"#f0f4ff",borderRadius:6,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:isLg?14:12,fontWeight:700,color:C.blue}}>{course?.name}</div>
              <div style={{fontSize:11,color:"#888"}}>{course?.students} enrolled · {recordedDates.length} session{recordedDates.length!==1?"s":""} recorded · Lecturer: Ahmad Jafar</div>
            </div>
            <Badge color={C.blue}>{selCourse}</Badge>
          </div>
        </div>
      </SectionCard>

      <div style={{display:"grid",gridTemplateColumns:isLg?"340px 1fr":"1fr",gap:isLg?20:0,alignItems:"start"}}>
        <div>
          <SectionCard title="Pick a Date" icon="📅" color={C.teal}>
            <div style={{padding:14}}>
              <AttendanceCalendar courseCode={selCourse} attendanceData={attendanceData} selectedDate={selDate}
                onSelectDate={d=>{setSelDate(d);setSaved(false);setTab("mark");setSessionLabel(attendanceData[selCourse]?.[d]?.label||"Lecture");}}/>

              <div style={{marginTop:14,background:isFutureDate?"#fff8e1":recordedDates.includes(selDate)?"#eafaf1":"#f0f4ff",border:`1px solid ${isFutureDate?C.orange:recordedDates.includes(selDate)?C.green:C.blue}44`,borderRadius:8,padding:"10px 12px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:"#333"}}>📆 {fmtDisplay(selDate)}</div>
                    <div style={{fontSize:11,color:"#888",marginTop:2}}>
                      {isFutureDate?"Future date – you can pre-fill attendance"
                        :recordedDates.includes(selDate)?`${summary.present} present · ${summary.absent} absent · ${summary.excused} excused`
                        :"No attendance recorded yet for this date"}
                    </div>
                  </div>
                  {recordedDates.includes(selDate)&&<Badge color={C.green}>✓ Saved</Badge>}
                  {!recordedDates.includes(selDate)&&!isFutureDate&&<Badge color={C.orange}>Not recorded</Badge>}
                  {isFutureDate&&<Badge color={C.orange}>Future</Badge>}
                </div>
                <div style={{marginTop:8,display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{fontSize:11,color:"#666",whiteSpace:"nowrap"}}>Label:</span>
                  <input value={sessionLabel} onChange={e=>setSessionLabel(e.target.value)}
                    placeholder="Lecture / Lab / Tutorial"
                    style={{flex:1,padding:"5px 8px",border:"1px solid #ddd",borderRadius:5,fontSize:11,outline:"none"}}/>
                </div>
              </div>

              {recordedDates.length>0&&(
                <div style={{marginTop:12}}>
                  <div style={{fontSize:10,color:"#aaa",fontWeight:700,marginBottom:6,letterSpacing:0.5}}>RECENT SESSIONS</div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    {recordedDates.slice(0,8).map(d=>{
                      const cData=attendanceData[selCourse]?.[d]||{};
                      const vals=students.map(s=>cData[s.id]).filter(v=>["present","absent","excused"].includes(v));
                      const pct=vals.length>0?Math.round(vals.filter(v=>v==="present").length/vals.length*100):0;
                      const col=pct>=90?C.green:pct>=70?C.orange:C.red;
                      const dd=new Date(d+"T00:00:00");
                      return (
                        <button key={d} onClick={()=>{setSelDate(d);setSessionLabel(cData.label||"Lecture");setSaved(false);}} style={{
                          background:d===selDate?"#1a1a2e":"white",color:d===selDate?"white":"#444",
                          border:`1px solid ${d===selDate?"#1a1a2e":col}`,borderRadius:6,
                          padding:"4px 8px",fontSize:10,cursor:"pointer",textAlign:"center",minWidth:50
                        }}>
                          <div style={{fontWeight:700}}>{dd.getDate()} {MONTHS[dd.getMonth()].slice(0,3)}</div>
                          <div style={{fontSize:9,color:d===selDate?"#8df":col}}>{pct}%</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        <div>
          {!isFutureDate ? (
            <>
              <div style={{display:"flex",background:"white",border:"1px solid #e0e0e0",borderRadius:"8px 8px 0 0"}}>
                {[{key:"mark",label:"✅ Mark Attendance"},{key:"report",label:"📈 Full Report"}].map(t=>(
                  <button key={t.key} onClick={()=>setTab(t.key)} style={{
                    flex:1,background:"none",border:"none",padding:"12px 0",fontSize:isLg?13:12,
                    fontWeight:tab===t.key?700:400,color:tab===t.key?C.blue:"#666",
                    borderBottom:tab===t.key?`2px solid ${C.blue}`:"2px solid transparent",cursor:"pointer"
                  }}>{t.label}</button>
                ))}
              </div>

              {tab==="mark"&&(
                <div style={{background:"white",border:"1px solid #e0e0e0",borderTop:"none",borderRadius:"0 0 8px 8px",marginBottom:16}}>
                  <div style={{display:"flex",borderBottom:"1px solid #eee"}}>
                    {[
                      {label:"Present",value:summary.present,color:C.green},
                      {label:"Absent", value:summary.absent, color:C.red},
                      {label:"Excused",value:summary.excused,color:C.orange},
                      {label:"Unmarked",value:summary.unmarked,color:"#bbb"},
                      {label:"Total",  value:summary.total,  color:C.blue},
                    ].map(s=>(
                      <div key={s.label} style={{flex:1,textAlign:"center",padding:"12px 0",borderRight:"1px solid #f0f0f0"}}>
                        <div style={{fontSize:isLg?20:16,fontWeight:800,color:s.color}}>{s.value}</div>
                        <div style={{fontSize:9,color:"#999"}}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{padding:"10px 14px",borderBottom:"1px solid #eee",display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search name / matric…"
                      style={{flex:1,minWidth:140,padding:"7px 10px",border:"1px solid #ddd",borderRadius:6,fontSize:12,outline:"none"}}/>
                    <button onClick={()=>markAll("present")} style={{background:C.green,color:"white",border:"none",borderRadius:6,padding:"7px 12px",fontSize:11,cursor:"pointer",fontWeight:700}}>✅ All Present</button>
                    <button onClick={()=>markAll("absent")}  style={{background:C.red,  color:"white",border:"none",borderRadius:6,padding:"7px 12px",fontSize:11,cursor:"pointer",fontWeight:700}}>❌ All Absent</button>
                    <button onClick={()=>markAll("unmarked")} style={{background:"#e8e8e8",color:"#444",border:"none",borderRadius:6,padding:"7px 12px",fontSize:11,cursor:"pointer",fontWeight:700}}>↩ Reset</button>
                  </div>

                  <div style={{maxHeight:isLg?520:360,overflowY:"auto"}}>
                    {filtered.map((student,i)=>{
                      const status=(()=>{const v=dayData[student.id];return["present","absent","excused"].includes(v)?v:"unmarked";})();
                      const rowBg=status==="present"?"#f0faf4":status==="absent"?"#fff5f5":status==="excused"?"#fffbf0":"white";
                      return (
                        <div key={student.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 16px",borderBottom:"1px solid #f8f8f8",background:rowBg}}>
                          <div style={{width:isLg?36:30,height:isLg?36:30,borderRadius:"50%",background:`hsl(${(i*37)%360},50%,60%)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:isLg?13:11,fontWeight:700,color:"white",flexShrink:0}}>
                            {student.name.split(" ").map(n=>n[0]).slice(0,2).join("")}
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:isLg?13:12,fontWeight:600,color:"#333",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{student.name}</div>
                            <div style={{fontSize:10,color:"#aaa"}}>{student.matric} · {student.level}</div>
                          </div>
                          <div style={{display:"flex",gap:6}}>
                            {[{key:"present",label:"P",bg:C.green},{key:"absent",label:"A",bg:C.red},{key:"excused",label:"E",bg:C.orange}].map(opt=>(
                              <button key={opt.key} onClick={()=>markOne(student.id,opt.key)} style={{
                                width:isLg?32:28,height:isLg?32:28,borderRadius:"50%",
                                background:status===opt.key?opt.bg:"#f0f0f0",
                                color:status===opt.key?"white":"#aaa",
                                border:status===opt.key?`2px solid ${opt.bg}`:"2px solid #e0e0e0",
                                cursor:"pointer",fontSize:12,fontWeight:700,transition:"all 0.15s"
                              }}>{opt.label}</button>
                            ))}
                          </div>
                          <div style={{width:64,textAlign:"right",flexShrink:0}}>
                            {status==="present"&&<Badge color={C.green}>Present</Badge>}
                            {status==="absent" &&<Badge color={C.red}>Absent</Badge>}
                            {status==="excused"&&<Badge color={C.orange}>Excused</Badge>}
                            {status==="unmarked"&&<span style={{fontSize:11,color:"#ccc"}}>—</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{padding:"12px 16px",borderTop:"1px solid #eee",display:"flex",gap:12,alignItems:"center"}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:11,color:"#888"}}>Saving for: <strong style={{color:"#333"}}>{fmtDisplay(selDate)}</strong></div>
                      <div style={{fontSize:11,color:"#aaa"}}>{sessionLabel||"No session label"}</div>
                    </div>
                    <button onClick={handleSave} style={{background:C.blue,color:"white",border:"none",borderRadius:7,padding:"10px 22px",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                      💾 Save Attendance
                    </button>
                    {saved&&<div style={{background:"#eafaf1",border:`1px solid ${C.green}`,borderRadius:6,padding:"8px 12px",fontSize:12,color:C.green,fontWeight:700,whiteSpace:"nowrap"}}>✓ Saved!</div>}
                  </div>
                </div>
              )}

              {tab==="report"&&(
                <div style={{background:"white",border:"1px solid #e0e0e0",borderTop:"none",borderRadius:"0 0 8px 8px",marginBottom:16,overflow:"hidden"}}>
                  <div style={{padding:"10px 16px",borderBottom:"1px solid #eee",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontSize:13,fontWeight:700,color:"#333"}}>{course?.code} – Full Attendance Report</div>
                    <div style={{fontSize:11,color:"#888"}}>{recordedDates.length} sessions</div>
                  </div>
                  <div style={{padding:"8px 16px",background:"#f9f9f9",borderBottom:"1px solid #eee",display:"flex",gap:14,flexWrap:"wrap"}}>
                    <span style={{fontSize:12,color:C.green,fontWeight:700}}>✅ {reportData.filter(s=>s.pct>=90).length} Excellent ≥90%</span>
                    <span style={{fontSize:12,color:C.orange,fontWeight:700}}>⚠ {reportData.filter(s=>s.pct>=70&&s.pct<90).length} Good 70–89%</span>
                    <span style={{fontSize:12,color:C.red,fontWeight:700}}>❌ {reportData.filter(s=>s.pct<70).length} At Risk &lt;70%</span>
                  </div>
                  {recordedDates.length===0?(
                    <div style={{padding:32,textAlign:"center",color:"#aaa"}}>No sessions recorded yet.</div>
                  ):(
                    <div style={{overflowX:"auto"}}>
                      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                        <thead>
                          <tr style={{background:"#f5f5f5"}}>
                            <th style={{padding:"9px 12px",textAlign:"left",fontWeight:700,color:"#555",minWidth:120,position:"sticky",left:0,background:"#f5f5f5",zIndex:1}}>Student</th>
                            {recordedDates.map(d=>(
                              <th key={d} style={{padding:"6px 4px",textAlign:"center",fontWeight:600,color:d===selDate?C.blue:"#777",minWidth:44,fontSize:10,borderBottom:d===selDate?`2px solid ${C.blue}`:"none"}}>
                                <div>{new Date(d+"T00:00:00").getDate()}</div>
                                <div>{MONTHS[new Date(d+"T00:00:00").getMonth()].slice(0,3)}</div>
                              </th>
                            ))}
                            <th style={{padding:"9px 12px",textAlign:"center",fontWeight:700,color:"#333",minWidth:70}}>Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.map((s,ri)=>(
                            <tr key={s.id} style={{borderTop:"1px solid #eee",background:s.pct<70?"#fff5f5":ri%2===0?"white":"#fafafa"}}>
                              <td style={{padding:"8px 12px",position:"sticky",left:0,background:s.pct<70?"#fff5f5":ri%2===0?"white":"#fafafa",zIndex:1}}>
                                <div style={{fontSize:12,fontWeight:600,color:"#333"}}>{s.name}</div>
                                <div style={{fontSize:10,color:"#aaa"}}>{s.matric}</div>
                              </td>
                              {recordedDates.map((d,di)=>{
                                const v=attendanceData[selCourse]?.[d]?.[s.id];
                                return (
                                  <td key={di} style={{padding:"8px 4px",textAlign:"center",background:d===selDate?"#f0f8ff":"transparent"}}>
                                    {v==="present"?<span style={{color:C.green,fontSize:14}}>✓</span>
                                    :v==="absent"?<span style={{color:C.red,fontSize:14}}>✗</span>
                                    :v==="excused"?<span style={{color:C.orange,fontSize:11,fontWeight:700}}>E</span>
                                    :<span style={{color:"#e0e0e0"}}>·</span>}
                                  </td>
                                );
                              })}
                              <td style={{padding:"8px 12px",textAlign:"center"}}>
                                <div style={{fontSize:13,fontWeight:800,color:s.pct>=70?C.green:C.red}}>{s.pct}%</div>
                                <div style={{height:5,background:"#eee",borderRadius:3,marginTop:3}}>
                                  <div style={{height:"100%",width:`${s.pct}%`,background:s.pct>=70?C.green:C.red,borderRadius:3}}/>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div style={{padding:"8px 16px",background:"#f9f9f9",borderTop:"1px solid #eee",display:"flex",gap:14,flexWrap:"wrap"}}>
                    <span style={{fontSize:11,color:C.green}}>✓ Present</span>
                    <span style={{fontSize:11,color:C.red}}>✗ Absent</span>
                    <span style={{fontSize:11,color:C.orange}}>E Excused</span>
                    <span style={{fontSize:11,color:"#ccc"}}>· Unmarked</span>
                    <span style={{marginLeft:"auto",fontSize:11,color:"#888"}}>Minimum required: 70%</span>
                  </div>
                </div>
              )}
            </>
          ):(
            <div style={{background:"white",border:"1px solid #e0e0e0",borderRadius:8,padding:32,textAlign:"center",marginBottom:16}}>
              <div style={{fontSize:36,marginBottom:10}}>📅</div>
              <div style={{fontSize:14,fontWeight:700,color:"#555",marginBottom:6}}>Future Date Selected</div>
              <div style={{fontSize:12,color:"#888",marginBottom:16}}>{fmtDisplay(selDate)} is ahead. You can pre-fill attendance and save it.</div>
              <button onClick={()=>{setTab("mark");}} style={{background:C.blue,color:"white",border:"none",borderRadius:6,padding:"10px 24px",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                Pre-fill Attendance
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
