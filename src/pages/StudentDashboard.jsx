import { useState } from "react";
import { useW } from '../hooks/useW.js';
import { C, COURSES } from '../data/constants.js';

export function StudentDashboard({ setPage }) {
  const w = useW(); 
  const isLg = w >= 1024;

  return (
    <div style={{padding: isLg ? "32px" : "16px", backgroundColor: "#f5f5f5", minHeight: "100vh"}}>
      <h1 style={{margin: "0 0 24px", fontSize: isLg ? "24px" : "20px", color: "#333", fontWeight: "bold"}}>Dashboard</h1>
      
      {/* Course & Grouping Information */}
      <div style={{marginBottom: "24px"}}>
        <div style={{backgroundColor: "#2563eb", color: "white", padding: "12px 16px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}>
          <h2 style={{margin: 0, fontSize: "18px", fontWeight: "bold"}}>Course & Grouping Information</h2>
        </div>
        <div style={{backgroundColor: "white", border: "1px solid #e5e7eb", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", padding: "16px"}}>
          <div style={{display: "flex", gap: "16px", justifyContent: "space-between"}}>
            <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "16px", backgroundColor: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0", flex: "1"}}>
              <div style={{width: "48px", height: "48px", backgroundColor: "#22c55e", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <span style={{color: "white", fontSize: "20px"}}>🎓</span>
              </div>
              <div>
                <div style={{fontSize: "24px", fontWeight: "bold", color: "#166534"}}>1</div>
                <div style={{fontSize: "14px", color: "#15803d"}}>COURSE</div>
              </div>
            </div>
            <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "16px", backgroundColor: "#fdf2f8", borderRadius: "8px", border: "1px solid #fbcfe8", flex: "1"}}>
              <div style={{width: "48px", height: "48px", backgroundColor: "#ec4899", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <span style={{color: "white", fontSize: "20px"}}>👥</span>
              </div>
              <div>
                <div style={{fontSize: "24px", fontWeight: "bold", color: "#be185d"}}>1</div>
                <div style={{fontSize: "14px", color: "#9f1239"}}>COURSE GROUPING</div>
              </div>
            </div>
            <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "16px", backgroundColor: "#fff7ed", borderRadius: "8px", border: "1px solid #fed7aa", flex: "1"}}>
              <div style={{width: "48px", height: "48px", backgroundColor: "#f97316", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <span style={{color: "white", fontSize: "20px"}}>👥</span>
              </div>
              <div>
                <div style={{fontSize: "24px", fontWeight: "bold", color: "#c2410c"}}>0</div>
                <div style={{fontSize: "14px", color: "#ea580c"}}>TUTOR GROUPING</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Progress Information */}
      <div style={{marginBottom: "24px"}}>
        <div style={{backgroundColor: "#2563eb", color: "white", padding: "12px 16px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}>
          <h2 style={{margin: 0, fontSize: "18px", fontWeight: "bold"}}>Course Progress Information</h2>
        </div>
        <div style={{backgroundColor: "white", border: "1px solid #e5e7eb", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", padding: "16px"}}>
          <div style={{overflowX: "auto"}}>
            <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
              <thead>
                <tr style={{backgroundColor: "#f9fafb"}}>
                  <th style={{textAlign: "left", padding: "12px", fontSize: "12px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Name</th>
                  <th style={{textAlign: "center", padding: "12px", fontSize: "12px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Assignment Completion</th>
                  <th style={{textAlign: "center", padding: "12px", fontSize: "12px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Quiz Completion</th>
                  <th style={{textAlign: "center", padding: "12px", fontSize: "12px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Forum Participation</th>
                  <th style={{textAlign: "center", padding: "12px", fontSize: "12px", fontWeight: "bold", color: "#374151", borderBottom: "1px solid #e5e7eb"}}>Progress</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px"}}>COSC 406 - Advanced Database Systems</td>
                  <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: "#6b7280"}}>0 out of 0</td>
                  <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: "#6b7280"}}>0 out of 0</td>
                  <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", color: "#6b7280"}}>0 out of 0</td>
                  <td style={{padding: "12px", borderBottom: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center"}}>
                    <span style={{padding: "4px 8px", backgroundColor: "#f3f4f6", color: "#6b7280", borderRadius: "4px", fontSize: "12px"}}>N/A</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Deadlines */}
      <div style={{marginBottom: "24px"}}>
        <div style={{backgroundColor: "#2563eb", color: "white", padding: "12px 16px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}>
          <h2 style={{margin: 0, fontSize: "18px", fontWeight: "bold"}}>Deadlines</h2>
        </div>
        <div style={{backgroundColor: "white", border: "1px solid #e5e7eb", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", padding: "16px"}}>
          <div style={{display: "flex", gap: "16px"}}>
            <div style={{flex: "1"}}>
              <div style={{backgroundColor: "#dbeafe", color: "#1e40af", padding: "8px 12px", borderTopLeftRadius: "6px", borderTopRightRadius: "6px", fontSize: "14px", fontWeight: "bold"}}>
                Quiz Deadlines
              </div>
              <div style={{backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderBottomLeftRadius: "6px", borderBottomRightRadius: "6px", padding: "16px"}}>
                <div style={{color: "#dc2626", fontSize: "14px"}}>
                  We're sorry we can't display any quiz details<br/>
                  No gradable quiz with deadline for you yet!
                </div>
              </div>
            </div>
            <div style={{flex: "1"}}>
              <div style={{backgroundColor: "#dbeafe", color: "#1e40af", padding: "8px 12px", borderTopLeftRadius: "6px", borderTopRightRadius: "6px", fontSize: "14px", fontWeight: "bold"}}>
                Assignment Deadlines
              </div>
              <div style={{backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderBottomLeftRadius: "6px", borderBottomRightRadius: "6px", padding: "16px"}}>
                <div style={{color: "#dc2626", fontSize: "14px"}}>
                  We're sorry we can't display any assignment details<br/>
                  No gradable assignment with deadline for you yet!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forum Activity */}
      <div>
        <div style={{backgroundColor: "#2563eb", color: "white", padding: "12px 16px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}>
          <h2 style={{margin: 0, fontSize: "18px", fontWeight: "bold"}}>Forum Activity - Latest topics & comments</h2>
        </div>
        <div style={{backgroundColor: "white", border: "1px solid #e5e7eb", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", padding: "16px"}}>
          <div style={{backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", padding: "16px"}}>
            <div style={{color: "#dc2626", fontSize: "14px"}}>
              We're sorry we can't display any forum activity<br/>
              No course forum yet!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
