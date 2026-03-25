import { useState } from "react";
import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';

export function HomePage({ onRoleSelect }) {
  const w = useW();
  const isLg = w >= 1024;
  
  const roles = [
    {
      id: 'student',
      title: 'Student',
      icon: '👨‍🎓',
      description: 'Access your courses, view grades, and manage your academic journey',
      color: C.blue,
      features: ['Course Materials', 'Attendance Tracking', 'Grade Reports', 'Assignments']
    },
    {
      id: 'lecturer',
      title: 'Lecturer',
      icon: '👨‍🏫',
      description: 'Manage courses, track attendance, and engage with students',
      color: C.green,
      features: ['Course Management', 'Attendance System', 'Grade Book', 'Student Analytics']
    },
    {
      id: 'admin',
      title: 'Administrator',
      icon: '👨‍💼',
      description: 'System administration, user management, and institutional oversight',
      color: C.purple,
      features: ['User Management', 'System Settings', 'Reports & Analytics', 'Data Management']
    }
  ];

  return (
    <div style={{
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden",
      fontFamily: "Arial,sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      {/* Fullscreen background */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(45, 54, 97, 0.9) 50%, rgba(74, 86, 104, 0.9) 100%), url('/ABU.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        {/* Decorative elements */}
        <div style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)"
        }}/>
        <div style={{
          position: "absolute",
          bottom: -80,
          left: -80,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.03)"
        }}/>
        
        {/* Center content */}
        <div style={{
          textAlign: "center",
          color: "white",
          zIndex: 1,
          maxWidth: 600,
          padding: isLg ? 40 : 20
        }}>
          <div style={{fontSize: isLg ? 72 : 48, marginBottom: 20}}>🎓</div>
          <div style={{fontSize: isLg ? 36 : 28, fontWeight: 800, marginBottom: 12}}>
            VigilearnLMS
          </div>
          <div style={{
            fontSize: isLg ? 18 : 16,
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.6,
            marginBottom: 40
          }}>
            Ahmadu Bello University Distance Learning Centre
            <br />
            Choose your role to continue
          </div>
        </div>
      </div>

      {/* Role selection cards */}
      <div style={{
        position: "absolute",
        bottom: isLg ? 60 : 40,
        left: 0,
        right: 0,
        zIndex: 10,
        padding: isLg ? "0 40px" : "0 20px"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isLg ? "repeat(3, 1fr)" : "1fr",
          gap: isLg ? 24 : 16,
          maxWidth: 1200,
          margin: "0 auto"
        }}>
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => onRoleSelect(role.id)}
              style={{
                background: "white",
                borderRadius: 16,
                padding: isLg ? 32 : 24,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                border: `2px solid transparent`,
                textAlign: "center"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)";
                e.currentTarget.style.borderColor = role.color;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              <div style={{
                width: isLg ? 80 : 60,
                height: isLg ? 80 : 60,
                borderRadius: "50%",
                background: role.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: isLg ? 32 : 24,
                margin: "0 auto 16px"
              }}>
                {role.icon}
              </div>
              
              <h3 style={{
                fontSize: isLg ? 24 : 20,
                fontWeight: 700,
                color: "#333",
                marginBottom: 8
              }}>
                {role.title}
              </h3>
              
              <p style={{
                fontSize: isLg ? 14 : 12,
                color: "#666",
                lineHeight: 1.5,
                marginBottom: 20
              }}>
                {role.description}
              </p>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 8,
                textAlign: "left"
              }}>
                {role.features.map((feature, index) => (
                  <div key={index} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: isLg ? 12 : 11,
                    color: "#888"
                  }}>
                    <div style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: role.color
                    }}/>
                    {feature}
                  </div>
                ))}
              </div>
              
              <button style={{
                background: role.color,
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: isLg ? "12px 24px" : "10px 20px",
                fontSize: isLg ? 14 : 12,
                fontWeight: 600,
                cursor: "pointer",
                marginTop: 20,
                width: "100%",
                transition: "background 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = role.color + "dd"}
              onMouseLeave={e => e.currentTarget.style.background = role.color}
              >
                Continue as {role.title}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
