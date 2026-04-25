import { useState } from "react";
import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';

export function HomePage({ onRoleSelect }) {
  const w = useW();
  const isLg = w >= 1024;
  const [selectedRole, setSelectedRole] = useState('student');
  
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

  const currentRole = roles.find(r => r.id === selectedRole);

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

      {/* Role selection area */}
      <div style={{
        position: "absolute",
        bottom: isLg ? 60 : 40,
        left: 0,
        right: 0,
        zIndex: 10,
        padding: isLg ? "0 40px" : "0 20px"
      }}>
        <div style={{
          background: "white",
          borderRadius: 16,
          padding: isLg ? 40 : 24,
          maxWidth: 500,
          margin: "0 auto",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
        }}>
          {/* Tab buttons */}
          <div style={{
            display: "flex",
            marginBottom: 32,
            borderBottom: "1px solid #e5e7eb"
          }}>
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                style={{
                  flex: 1,
                  padding: "16px 8px",
                  background: "none",
                  border: "none",
                  borderBottom: selectedRole === role.id ? `3px solid ${role.color}` : "3px solid transparent",
                  color: selectedRole === role.id ? role.color : "#6b7280",
                  fontSize: isLg ? 14 : 12,
                  fontWeight: selectedRole === role.id ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {role.title}
              </button>
            ))}
          </div>

          {/* Register Button */}
          <div style={{
            textAlign: "center",
            marginBottom: 32
          }}>
            <button
              onClick={() => onRoleSelect('register', selectedRole)}
            
              style={{
                padding: "16px 32px",
                background: "transparent",
                border: "2px solid #6b7280",
                borderRadius: 8,
                color: "#6b7280",
                fontSize: isLg ? 14 : 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              📝 Create New Account
            </button>
          </div>

          {/* Current role content */}
          {currentRole && (
            <div style={{textAlign: "center"}}>
              <div style={{
                width: isLg ? 100 : 80,
                height: isLg ? 100 : 80,
                borderRadius: "50%",
                background: currentRole.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: isLg ? 40 : 32,
                margin: "0 auto 24px"
              }}>
                {currentRole.icon}
              </div>
              
              <h3 style={{
                fontSize: isLg ? 24 : 20,
                fontWeight: 700,
                color: "#333",
                marginBottom: 12
              }}>
                {currentRole.title}
              </h3>
              
              <p style={{
                fontSize: isLg ? 14 : 12,
                color: "#666",
                lineHeight: 1.5,
                marginBottom: 24
              }}>
                {currentRole.description}
              </p>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 12,
                textAlign: "left",
                marginBottom: 32
              }}>
                {currentRole.features.map((feature, index) => (
                  <div key={index} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontSize: isLg ? 13 : 12,
                    color: "#666"
                  }}>
                    <div style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: currentRole.color,
                      flexShrink: 0
                    }}/>
                    {feature}
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => onRoleSelect(currentRole.id)}
                style={{
                  background: currentRole.color,
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  padding: isLg ? "14px 32px" : "12px 24px",
                  fontSize: isLg ? 15 : 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  width: "100%",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                Continue as {currentRole.title}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
