import { useState } from "react";
import { useW } from '../hooks/useW.js';
import { C, LECTURER_COURSES } from '../data/constants.js';

export function LecturerDashboard({ setPage }) {
  const w = useW(); 
  const isLg = w >= 1024;

  return (
    <div style={{padding: isLg ? "32px" : "16px", backgroundColor: "#f5f5f5", minHeight: "100vh"}}>
      <h1 style={{margin: "0 0 24px", fontSize: isLg ? "24px" : "20px", color: "#333", fontWeight: "bold"}}>Dashboard</h1>
      
      {/* Course & Teaching Information */}
      <div style={{marginBottom: "24px"}}>
        <div style={{backgroundColor: "#2563eb", color: "white", padding: "12px 16px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}>
          <h2 style={{margin: 0, fontSize: "18px", fontWeight: "bold"}}>Course & Teaching Information</h2>
        </div>
        <div style={{backgroundColor: "white", border: "1px solid #e5e7eb", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", padding: "16px"}}>
          <div style={{display: "flex", gap: "16px", justifyContent: "space-between"}}>
            <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "16px", backgroundColor: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0", flex: "1"}}>
              <div style={{width: "48px", height: "48px", backgroundColor: "#22c55e", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <span style={{color: "white", fontSize: "20px"}}>📚</span>
              </div>
              <div>
                <div style={{fontSize: "24px", fontWeight: "bold", color: "#166534"}}>{LECTURER_COURSES.length}</div>
                <div style={{fontSize: "14px", color: "#15803d"}}>COURSES</div>
              </div>
            </div>
            <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "16px", backgroundColor: "#fdf2f8", borderRadius: "8px", border: "1px solid #fbcfe8", flex: "1"}}>
              <div style={{width: "48px", height: "48px", backgroundColor: "#ec4899", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <span style={{color: "white", fontSize: "20px"}}>👥</span>
              </div>
              <div>
                <div style={{fontSize: "24px", fontWeight: "bold", color: "#be185d"}}>{LECTURER_COURSES.reduce((a,c)=>a+c.students,0)}</div>
                <div style={{fontSize: "14px", color: "#9f1239"}}>TOTAL STUDENTS</div>
              </div>
            </div>
            <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "16px", backgroundColor: "#fff7ed", borderRadius: "8px", border: "1px solid #fed7aa", flex: "1"}}>
              <div style={{width: "48px", height: "48px", backgroundColor: "#f97316", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <span style={{color: "white", fontSize: "20px"}}>📊</span>
              </div>
              <div>
                <div style={{fontSize: "24px", fontWeight: "bold", color: "#c2410c"}}>87%</div>
                <div style={{fontSize: "14px", color: "#ea580c"}}>AVG ATTENDANCE</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teaching Progress Information */}
      <div style={{marginBottom: "24px"}}>
        <div style={{backgroundColor: "#2563eb", color: "white", padding: "12px 16px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}>
          <h2 style={{margin: 0, fontSize: "18px", fontWeight: "bold"}}>Teaching Progress Information</h2>
        </div>
        <div style={{backgroundColor: "white", border: "1px solid #e5e7eb", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", padding: "16px"}}>
          <div style={{overflowX: "auto"}}>
            <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
              <thead>
                <tr style={{backgroundColor: "#f9fafb"}}>
                  <th style={{textAlign: "left", padding: "12px", fontSize: "12px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Course</th>
                  <th style={{textAlign: "center", padding: "12px", fontSize: "12px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Students</th>
                  <th style={{textAlign: "center", padding: "12px", fontSize: "12px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Attendance Rate</th>
                  <th style={{textAlign: "center", padding: "12px", fontSize: "12px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Assignment Completion</th>
                  <th style={{textAlign: "center", padding: "12px", fontSize: "12px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Progress</th>
                </tr>
              </thead>
              <tbody>
                {LECTURER_COURSES.map((course, index) => (
                  <tr key={index}>
                    <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px"}}>{course.code} - {course.name}</td>
                    <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: "#6b7280"}}>{course.students}</td>
                    <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: "#6b7280"}}>{course.attendanceRate || "85"}%</td>
                    <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: "#6b7280"}}>{course.assignmentCompletion || "78"}%</td>
                    <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center"}}>
                      <span style={{padding: "4px 8px", backgroundColor: "#f3f4f6", color: "#6b7280", borderRadius: "4px", fontSize: "12px"}}>
                        {course.progress || "In Progress"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upcoming Activities */}
      <div style={{marginBottom: "24px"}}>
        <div style={{backgroundColor: "#2563eb", color: "white", padding: "12px 16px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}>
          <h2 style={{margin: 0, fontSize: "18px", fontWeight: "bold"}}>Upcoming Activities</h2>
        </div>
        <div style={{backgroundColor: "white", border: "1px solid #e5e7eb", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", padding: "16px"}}>
          <div style={{display: "flex", gap: "16px"}}>
            <div style={{flex: "1"}}>
              <div style={{backgroundColor: "#dbeafe", color: "#1e40af", padding: "8px 12px", borderTopLeftRadius: "6px", borderTopRightRadius: "6px", fontSize: "14px", fontWeight: "bold"}}>
                Next Classes
              </div>
              <div style={{backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderBottomLeftRadius: "6px", borderBottomRightRadius: "6px", padding: "16px"}}>
                <div style={{color: "#dc2626", fontSize: "14px"}}>
                  Today: COSC 203 (10:00 AM)<br/>
                  Tomorrow: STAT 201 (2:00 PM)<br/>
                  Friday: MATH 207 (9:00 AM)
                </div>
              </div>
            </div>
            <div style={{flex: "1"}}>
              <div style={{backgroundColor: "#dbeafe", color: "#1e40af", padding: "8px 12px", borderTopLeftRadius: "6px", borderTopRightRadius: "6px", fontSize: "14px", fontWeight: "bold"}}>
                Pending Grading
              </div>
              <div style={{backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderBottomLeftRadius: "6px", borderBottomRightRadius: "6px", padding: "16px"}}>
                <div style={{color: "#dc2626", fontSize: "14px"}}>
                  COSC 203: 15 assignments<br/>
                  STAT 201: 8 assignments<br/>
                  MATH 207: 12 assignments
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teaching Activity */}
      <div>
        <div style={{backgroundColor: "#2563eb", color: "white", padding: "12px 16px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}>
          <h2 style={{margin: 0, fontSize: "18px", fontWeight: "bold"}}>Recent Teaching Activity</h2>
        </div>
        <div style={{backgroundColor: "white", border: "1px solid #e5e7eb", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", padding: "16px"}}>
          <div style={{backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", padding: "16px"}}>
            <div style={{color: "#dc2626", fontSize: "14px"}}>
              Recent activity will be displayed here<br/>
              Including attendance records, assignment submissions, and student interactions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
