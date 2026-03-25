import { useState } from "react";
import { useW } from '../hooks/useW.js';
import { C, COURSES } from '../data/constants.js';
import { SectionCard, Badge, StatPill } from '../components/shared/SectionCard.jsx';

const PROG_DATA = COURSES.map(c=>({
  name:`${c.code} – ${c.name}`, assignment:"0 out of 0", quiz:"0 out of 0",
  forum:"0 out of 0", progress:c.code==="GENS 103"?"Completed":"N/A", completed:c.code==="GENS 103",
}));

export function StudentDashboard({ setPage }) {
  const w = useW(); 
  const isLg = w >= 1024;
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState([
    { date: "2026-03-25", course: "COSC 203", status: "present", time: "09:15 AM", method: "qr" },
    { date: "2026-03-24", course: "STAT 201", status: "present", time: "10:05 AM", method: "biometric" },
    { date: "2026-03-23", course: "MATH 207", status: "absent", time: "--", method: "--" },
    { date: "2026-03-22", course: "COSC 205", status: "present", time: "11:30 AM", method: "qr" },
    { date: "2026-03-21", course: "COSC 211", status: "present", time: "02:45 PM", method: "biometric" },
  ]);
  const [confirmationMessage, setConfirmationMessage] = useState(null);

  const attendPct = [85, 92, 78, 100, 88, 95, 70, 80];

  const simulateQRScan = () => {
    setShowQRScanner(true);
    setTimeout(() => {
      setShowQRScanner(false);
      const newAttendance = {
        date: new Date().toISOString().split('T')[0],
        course: "COSC 203",
        status: "present",
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        method: "qr"
      };
      setAttendanceHistory([newAttendance, ...attendanceHistory.slice(0, 4)]);
      setConfirmationMessage({
        type: "success",
        title: "QR Code Scanned Successfully!",
        message: "Your attendance has been marked for COSC 203 - Discrete Structures",
        time: new Date().toLocaleTimeString()
      });
      setTimeout(() => setConfirmationMessage(null), 5000);
    }, 2000);
  };

  const simulateBiometric = () => {
    setShowBiometric(true);
    setTimeout(() => {
      setShowBiometric(false);
      const newAttendance = {
        date: new Date().toISOString().split('T')[0],
        course: "STAT 201",
        status: "present", 
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        method: "biometric"
      };
      setAttendanceHistory([newAttendance, ...attendanceHistory.slice(0, 4)]);
      setConfirmationMessage({
        type: "success",
        title: "Biometric Verification Successful!",
        message: "Your attendance has been marked for STAT 201 - Probability and Statistics",
        time: new Date().toLocaleTimeString()
      });
      setTimeout(() => setConfirmationMessage(null), 5000);
    }, 3000);
  };

  return (
    <div style={{padding:isLg?"24px 32px":16, position:"relative"}}>
      {/* Confirmation Message Popup */}
      {confirmationMessage && (
        <div style={{
          position: "fixed",
          top: 20,
          right: 20,
          background: confirmationMessage.type === "success" ? "#f0fff4" : "#fff5f5",
          border: `1px solid ${confirmationMessage.type === "success" ? C.green : C.red}`,
          borderRadius: 8,
          padding: 16,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          zIndex: 1000,
          minWidth: 300,
          animation: "slideIn 0.3s ease"
        }}>
          <div style={{display:"flex", alignItems:"flex-start", gap:12}}>
            <div style={{
              width:24,
              height:24,
              borderRadius:"50%",
              background: confirmationMessage.type === "success" ? C.green : C.red,
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              fontSize:12,
              color:"white",
              flexShrink:0
            }}>
              {confirmationMessage.type === "success" ? "✓" : "!"}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600,color:"#333",marginBottom:4}}>
                {confirmationMessage.title}
              </div>
              <div style={{fontSize:11,color:"#666",marginBottom:4}}>
                {confirmationMessage.message}
              </div>
              <div style={{fontSize:9,color:"#888"}}>
                {confirmationMessage.time}
              </div>
            </div>
          </div>
        </div>
      )}

      <h2 style={{margin:"0 0 16px",fontSize:isLg?20:15,color:"#333",fontWeight:700}}>Student Dashboard</h2>
      
      {/* Quick Actions */}
      <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(4,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:isLg?16:10,marginBottom:16}}>
        {[
          {icon:"📱",value:"Scan QR",label:"Mark Attendance",color:C.blue, action: simulateQRScan},
          {icon:"👆",value:"Biometric",label:"Verify Identity",color:C.green, action: simulateBiometric},
          {icon:"📊",value:"87%",label:"Attendance Rate",color:C.orange},
          {icon:"📚",value:9,label:"Active Courses",color:C.purple}
        ].map((item, index) => (
          <div key={item.label} style={{background:"white",border:"1px solid #e0e0e0",borderRadius:8,padding:isLg?"20px 16px":12,display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:item.action?"pointer":"default"}}
               onClick={item.action}
               onMouseEnter={item.action?e=>e.currentTarget.style.transform="translateY(-2px)":null}
               onMouseLeave={item.action?e=>e.currentTarget.style.transform="translateY(0)":null}
               style={{...item.action && {transition:"transform 0.2s"}}}>
            <div style={{width:44,height:44,borderRadius:"50%",background:item.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{item.icon}</div>
            <div style={{fontSize:isLg?16:14,fontWeight:700,color:"#333"}}>{item.value}</div>
            <div style={{fontSize:11,color:"#888",textAlign:"center"}}>{item.label}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:isLg?"1fr 1fr":w>=640?"1fr 1fr":"1fr",gap:isLg?16:12}}>
        {/* Attendance History */}
        <SectionCard title="Recent Attendance" icon="📅" color={C.blue}>
          <div style={{padding:12}}>
            {attendanceHistory.map((record, index) => (
              <div key={index} style={{
                background:"#f9f9f9",
                borderRadius:6,
                padding:"10px",
                marginBottom:8,
                borderLeft:`3px solid ${record.status === "present" ? C.green : C.red}`
              }}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#333"}}>{record.course}</div>
                  <Badge color={record.status === "present" ? C.green : C.red}>
                    {record.status === "present" ? "Present" : "Absent"}
                  </Badge>
                </div>
                <div style={{fontSize:10,color:"#666",marginBottom:2}}>
                  📅 {record.date} | 🕐 {record.time}
                </div>
                <div style={{fontSize:10,color:"#888"}}>
                  Method: {record.method === "qr" ? "📱 QR Code" : record.method === "biometric" ? "👆 Biometric" : "--"}
                </div>
              </div>
            ))}
            <button 
              onClick={() => setPage("attendance")}
              style={{
                width:"100%",
                background:C.blue,
                color:"white",
                border:"none",
                borderRadius:6,
                padding:"8px",
                fontSize:11,
                cursor:"pointer",
                marginTop:8
              }}>
              View Full Attendance History
            </button>
          </div>
        </SectionCard>

        {/* Deadlines */}
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

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div style={{
          position:"fixed",
          top:0,
          left:0,
          right:0,
          bottom:0,
          background:"rgba(0,0,0,0.8)",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          zIndex:2000
        }}>
          <div style={{
            background:"white",
            borderRadius:16,
            padding:32,
            width:"100%",
            maxWidth:400,
            textAlign:"center"
          }}>
            <div style={{fontSize:24,fontWeight:700,color:"#333",marginBottom:16}}>
              Scanning QR Code...
            </div>
            {/* QR Code Display */}
            <div style={{
              width:200,
              height:200,
              background:"white",
              borderRadius:12,
              margin:"0 auto 20px",
              border:"2px solid #ddd",
              padding:8,
              position:"relative"
            }}>
              {/* QR Code Pattern */}
              <div style={{
                width:"100%",
                height:"100%",
                display:"grid",
                gridTemplateColumns:"repeat(25, 1fr)",
                gridTemplateRows:"repeat(25, 1fr)",
                gap:0
              }}>
                {Array.from({length: 625}, (_, i) => {
                  const row = Math.floor(i / 25);
                  const col = i % 25;
                  let isBlack = false;
                  
                  // Position markers (7x7 squares in corners)
                  if ((row < 7 && col < 7) || (row < 7 && col >= 18) || (row >= 18 && col < 7)) {
                    if ((row === 0 || row === 6) || (col === 0 || col === 6) || 
                        (row >= 2 && row <= 4 && col >= 2 && col <= 4)) {
                      isBlack = true;
                    }
                  }
                  
                  // Timing patterns
                  if (row === 6 && col > 6 && col < 18) isBlack = col % 2 === 0;
                  if (col === 6 && row > 6 && row < 18) isBlack = row % 2 === 0;
                  
                  // Bottom position marker (row >= 18, col >= 18)
                  if (row >= 18 && col >= 18) {
                    if ((row === 18 || row === 24) || (col === 18 || col === 24) || 
                        (row >= 20 && row <= 22 && col >= 20 && col <= 22)) {
                      isBlack = true;
                    }
                  }
                  
                  // Data patterns in all remaining areas
                  if (!isBlack) {
                    // Top area (rows 0-5, cols 8-17)
                    if (row < 6 && col >= 8 && col < 18) {
                      isBlack = (row * col + 13) % 3 === 0;
                    }
                    // Left area (rows 8-17, cols 0-5)
                    else if (row >= 8 && row < 18 && col < 6) {
                      isBlack = (row * col + 7) % 2 === 0;
                    }
                    // Center area (rows 8-17, cols 8-17)
                    else if (row >= 8 && row < 18 && col >= 8 && col < 18) {
                      isBlack = (row * col + 17) % 3 === 0;
                    }
                    // Right area (rows 8-17, cols 19-24)
                    else if (row >= 8 && row < 18 && col >= 19) {
                      isBlack = (row * col + 23) % 2 === 0;
                    }
                    // Bottom area (rows 19-24, cols 8-17)
                    else if (row >= 19 && col >= 8 && col < 18) {
                      isBlack = (row * col + 31) % 3 === 0;
                    }
                    // Bottom-left corner area (rows 19-24, cols 0-5)
                    else if (row >= 19 && col < 6) {
                      isBlack = (row * col + 11) % 2 === 0;
                    }
                    // Top-right corner area (rows 0-5, cols 19-24)
                    else if (row < 6 && col >= 19) {
                      isBlack = (row * col + 29) % 2 === 0;
                    }
                    // Bottom-right corner area (rows 19-24, cols 19-24) - handled by position marker
                    else if (row >= 19 && col >= 19 && !(row >= 20 && row <= 22 && col >= 20 && col <= 22)) {
                      isBlack = (row * col + 37) % 3 === 0;
                    }
                  }
                  
                  return (
                    <div
                      key={i}
                      style={{
                        background: isBlack ? "#000" : "#fff",
                        width:"100%",
                        height:"100%"
                      }}
                    />
                  );
                })}
              </div>
              
              {/* Scanning line animation */}
              <div style={{
                position:"absolute",
                top:0,
                left:0,
                right:0,
                height:2,
                background:"linear-gradient(90deg, transparent, #00ff00, transparent)",
                animation:"scan 2s linear infinite"
              }}/>
            </div>
            <div style={{fontSize:14,color:"#666"}}>
              Please hold your device steady...
            </div>
          </div>
        </div>
      )}

      {/* Biometric Scanner Modal */}
      {showBiometric && (
        <div style={{
          position:"fixed",
          top:0,
          left:0,
          right:0,
          bottom:0,
          background:"rgba(0,0,0,0.8)",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          zIndex:2000
        }}>
          <div style={{
            background:"white",
            borderRadius:16,
            padding:32,
            width:"100%",
            maxWidth:400,
            textAlign:"center"
          }}>
            <div style={{fontSize:24,fontWeight:700,color:"#333",marginBottom:16}}>
              Biometric Verification...
            </div>
            <div style={{
              width:200,
              height:200,
              background:"#f0f0f0",
              borderRadius:"50%",
              margin:"0 auto 20px",
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              fontSize:48,
              animation:"pulse 1.5s infinite"
            }}>
              👆
            </div>
            <div style={{fontSize:14,color:"#666"}}>
              Place your finger on the sensor...
            </div>
          </div>
        </div>
      )}

      {/* Course Progress Information */}
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
                <tr key={i}>
                  <td style={{padding:"8px 10px",borderTop:"1px solid #eee",color:"#333"}}>{row.name}</td>
                  <td style={{padding:"8px 10px",borderTop:"1px solid #eee",textAlign:"center",color:"#666"}}>{row.assignment}</td>
                  <td style={{padding:"8px 10px",borderTop:"1px solid #eee",textAlign:"center",color:"#666"}}>{row.quiz}</td>
                  <td style={{padding:"8px 10px",borderTop:"1px solid #eee",textAlign:"center",color:"#666"}}>{row.forum}</td>
                  <td style={{padding:"8px 10px",borderTop:"1px solid #eee",textAlign:"center"}}>
                    <Badge color={row.completed?C.green:C.orange}>{row.progress}</Badge>
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
