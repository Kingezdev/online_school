import { useState } from "react";
import { useW } from '../hooks/useW.js';
import { C, LECTURER_COURSES } from '../data/constants.js';
import { SectionCard, Badge, StatPill } from '../components/shared/SectionCard.jsx';

export function LecturerDashboard({ setPage }) {
  const w = useW(); 
  const isLg = w >= 1024;
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [showBiometricSetup, setShowBiometricSetup] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(LECTURER_COURSES[0]);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const totalStudents = LECTURER_COURSES.reduce((a,c)=>a+c.students,0);
  
  const attendanceHistory = [
    { date: "2026-03-25", course: "COSC 203", present: 45, total: 48, rate: 94 },
    { date: "2026-03-24", course: "STAT 201", present: 52, total: 55, rate: 95 },
    { date: "2026-03-23", course: "MATH 207", present: 38, total: 42, rate: 90 },
    { date: "2026-03-22", course: "COSC 205", present: 41, total: 45, rate: 91 },
  ];

  const attendanceList = [
    { id: "STU001", name: "Ahmad Muhammad", course: "COSC 203", status: "present", time: "09:15 AM", method: "qr" },
    { id: "STU002", name: "Fatima Ali", course: "COSC 203", status: "present", time: "09:18 AM", method: "biometric" },
    { id: "STU003", name: "Omar Hassan", course: "COSC 203", status: "absent", time: "--", method: "--" },
    { id: "STU004", name: "Aisha Bello", course: "COSC 203", status: "present", time: "09:12 AM", method: "qr" },
    { id: "STU005", name: "Musa Ibrahim", course: "COSC 203", status: "present", time: "09:20 AM", method: "biometric" },
  ];

  const studentParticipation = [
    { name: "Ahmad Muhammad", attendance: 95, assignments: 88, forum: 72, overall: 85 },
    { name: "Fatima Ali", attendance: 92, assignments: 95, forum: 88, overall: 92 },
    { name: "Omar Hassan", attendance: 78, assignments: 65, forum: 45, overall: 63 },
    { name: "Aisha Bello", attendance: 98, assignments: 92, forum: 85, overall: 92 },
    { name: "Musa Ibrahim", attendance: 85, assignments: 78, forum: 68, overall: 77 },
  ];

  const courseStats = [
    {code:"STAT 201",pct:87,risk:2,col:C.orange},
    {code:"COSC 203",pct:91,risk:1,col:C.green},
    {code:"COSC 205",pct:78,risk:4,col:C.orange},
    {code:"COSC 211",pct:95,risk:0,col:C.green},
  ];

  const generateQRCode = () => {
    setShowQRGenerator(true);
    setTimeout(() => {
      setShowQRGenerator(false);
      setQrGenerated(true);
      setTimeout(() => setQrGenerated(false), 3000);
    }, 2000);
  };

  const setupBiometric = () => {
    setShowBiometricSetup(true);
    setTimeout(() => {
      setShowBiometricSetup(false);
      setBiometricEnabled(true);
      setTimeout(() => setBiometricEnabled(false), 3000);
    }, 3000);
  };

  const generateReport = () => {
    alert("Generating comprehensive attendance report...\n\nReport includes:\n• Attendance statistics\n• Student participation rates\n• Course performance metrics\n• Risk analysis\n\nReport will be downloaded as PDF.");
  };

  return (
    <div style={{padding:isLg?"24px 32px":16, position:"relative"}}>
      {/* Success Messages */}
      {qrGenerated && (
        <div style={{
          position:"fixed",top:20,right:20,background:"#f0fff4",border:`1px solid ${C.green}`,
          borderRadius:8,padding:16,boxShadow:"0 4px 12px rgba(0,0,0,0.15)",zIndex:1000,
          minWidth:300,animation:"slideIn 0.3s ease"
        }}>
          <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:C.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"white",flexShrink:0}}>✓</div>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:"#333",marginBottom:4}}>QR Code Generated!</div>
              <div style={{fontSize:11,color:"#666"}}>Attendance QR code ready for {selectedCourse.code}</div>
            </div>
          </div>
        </div>
      )}

      {biometricEnabled && (
        <div style={{
          position:"fixed",top:20,right:20,background:"#f0fff4",border:`1px solid ${C.green}`,
          borderRadius:8,padding:16,boxShadow:"0 4px 12px rgba(0,0,0,0.15)",zIndex:1000,
          minWidth:300,animation:"slideIn 0.3s ease"
        }}>
          <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:C.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"white",flexShrink:0}}>✓</div>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:"#333",marginBottom:4}}>Biometric Enabled!</div>
              <div style={{fontSize:11,color:"#666"}}>Biometric verification activated for {selectedCourse.code}</div>
            </div>
          </div>
        </div>
      )}

      <h2 style={{margin:"0 0 4px",fontSize:isLg?20:15,color:"#333",fontWeight:700}}>Lecturer Dashboard</h2>
      <div style={{fontSize:12,color:"#aaa",marginBottom:16}}>Welcome back, Ahmad Jafar — 2025/2026 Semester One</div>

      {/* Quick Actions */}
      <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(4,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:isLg?16:10,marginBottom:16}}>
        {[
          {icon:"📱",value:"Generate QR",label:"Class QR Code",color:C.blue, action: generateQRCode},
          {icon:"👆",value:"Biometric",label:"Class Biometrics",color:C.green, action: setupBiometric},
          {icon:"📊",value:"Reports",label:"Generate Reports",color:C.orange, action: generateReport},
          {icon:"👥",value:totalStudents,label:"Total Students",color:C.purple}
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
        <SectionCard title="Recent Attendance History" icon="📅" color={C.blue}>
          <div style={{padding:12}}>
            {attendanceHistory.map((record, index) => (
              <div key={index} style={{
                background:"#f9f9f9",borderRadius:6,padding:"10px",marginBottom:8,
                borderLeft:`3px solid ${record.rate >= 90 ? C.green : record.rate >= 80 ? C.orange : C.red}`
              }}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#333"}}>{record.course}</div>
                  <Badge color={record.rate >= 90 ? C.green : record.rate >= 80 ? C.orange : C.red}>
                    {record.rate}%
                  </Badge>
                </div>
                <div style={{fontSize:10,color:"#666",marginBottom:2}}>
                  📅 {record.date} | 👥 {record.present}/{record.total} students
                </div>
              </div>
            ))}
            <button onClick={()=>setPage("attendance")} style={{
              width:"100%",background:C.blue,color:"white",border:"none",borderRadius:6,
              padding:"8px",fontSize:11,cursor:"pointer",marginTop:8
            }}>
              View Full Attendance History
            </button>
          </div>
        </SectionCard>

        {/* Current Attendance List */}
        <SectionCard title="Current Session - Attendance List" icon="✅" color={C.green}>
          <div style={{padding:12}}>
            <div style={{marginBottom:12}}>
              <label style={{fontSize:11,color:"#666",marginBottom:4,display:"block"}}>Select Course:</label>
              <select value={selectedCourse.code} onChange={(e)=>setSelectedCourse(LECTURER_COURSES.find(c=>c.code===e.target.value))} 
                      style={{width:"100%",padding:"6px",border:"1px solid #ddd",borderRadius:4,fontSize:12}}>
                {LECTURER_COURSES.map(course=>(
                  <option key={course.code} value={course.code}>{course.code} - {course.name}</option>
                ))}
              </select>
            </div>
            {attendanceList.map((student, index) => (
              <div key={index} style={{
                background:"#f9f9f9",borderRadius:6,padding:"8px",marginBottom:6,
                borderLeft:`3px solid ${student.status === "present" ? C.green : C.red}`
              }}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:11,fontWeight:600,color:"#333"}}>{student.name}</div>
                    <div style={{fontSize:9,color:"#666"}}>{student.id} | {student.method === "qr" ? "📱" : student.method === "biometric" ? "👆" : "--"} {student.time}</div>
                  </div>
                  <Badge color={student.status === "present" ? C.green : C.red}>
                    {student.status === "present" ? "Present" : "Absent"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Student Participation Monitoring */}
      <SectionCard title="Student Participation Monitoring" icon="📊" color={C.orange}>
        <div style={{padding:12}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead>
                <tr style={{background:"#f5f5f5"}}>
                  <th style={{padding:"8px",textAlign:"left",color:"#555",fontWeight:600}}>Student Name</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Attendance</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Assignments</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Forum</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Overall</th>
                </tr>
              </thead>
              <tbody>
                {studentParticipation.map((student, index) => (
                  <tr key={index}>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",color:"#333",fontWeight:500}}>{student.name}</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                      <Badge color={student.attendance >= 90 ? C.green : student.attendance >= 80 ? C.orange : C.red}>
                        {student.attendance}%
                      </Badge>
                    </td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                      <Badge color={student.assignments >= 90 ? C.green : student.assignments >= 80 ? C.orange : C.red}>
                        {student.assignments}%
                      </Badge>
                    </td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                      <Badge color={student.forum >= 80 ? C.green : student.forum >= 60 ? C.orange : C.red}>
                        {student.forum}%
                      </Badge>
                    </td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                      <Badge color={student.overall >= 80 ? C.green : student.overall >= 70 ? C.orange : C.red}>
                        {student.overall}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>

      {/* QR Generator Modal */}
      {showQRGenerator && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000}}>
          <div style={{background:"white",borderRadius:16,padding:32,width:"100%",maxWidth:400,textAlign:"center"}}>
            <div style={{fontSize:24,fontWeight:700,color:"#333",marginBottom:16}}>Generating QR Code...</div>
            <div style={{width:200,height:200,background:"#f0f0f0",borderRadius:12,margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:48,animation:"pulse 1.5s infinite"}}>
              📱
            </div>
            <div style={{fontSize:14,color:"#666"}}>Creating QR code for {selectedCourse.code}...</div>
          </div>
        </div>
      )}

      {/* Biometric Setup Modal */}
      {showBiometricSetup && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000}}>
          <div style={{background:"white",borderRadius:16,padding:32,width:"100%",maxWidth:400,textAlign:"center"}}>
            <div style={{fontSize:24,fontWeight:700,color:"#333",marginBottom:16}}>Setting Up Biometrics...</div>
            <div style={{width:200,height:200,background:"#f0f0f0",borderRadius:"50%",margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:48,animation:"pulse 1.5s infinite"}}>
              👆
            </div>
            <div style={{fontSize:14,color:"#666"}}>Configuring biometric verification for {selectedCourse.code}...</div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
