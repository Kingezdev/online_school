import { useState } from "react";
import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';

export function LecturerLogin({ onLogin, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const w = useW();
  const isLg = w >= 1024;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin("lecturer");
    }, 700);
  };

  return (
    <div style={{
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden",
      fontFamily: "Arial,sans-serif"
    }}>
      {/* Background */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(135deg, rgba(39, 174, 96, 0.9) 0%, rgba(46, 204, 113, 0.8) 50%, rgba(52, 152, 219, 0.9) 100%), url('/ABU.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}>
        {/* Decorative elements */}
        <div style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)"
        }}/>
        <div style={{
          position: "absolute",
          bottom: -80,
          left: -80,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)"
        }}/>
      </div>

      {/* Back button */}
      <div style={{
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 20
      }}>
        <button
          onClick={onBack}
          style={{
            background: "rgba(255,255,255,0.2)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 14,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            backdropFilter: "blur(10px)"
          }}
        >
          ← Back
        </button>
      </div>

      {/* Login Form */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "white",
        borderRadius: 20,
        padding: isLg ? 48 : 32,
        width: "100%",
        maxWidth: isLg ? 480 : 400,
        boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
        zIndex: 10
      }}>
        <div style={{textAlign: "center", marginBottom: 32}}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: C.green,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            margin: "0 auto 20px"
          }}>
            👨‍🏫
          </div>
          
          <h2 style={{
            fontSize: isLg ? 28 : 24,
            fontWeight: 700,
            color: "#333",
            marginBottom: 8
          }}>
            Lecturer Login
          </h2>
          
          <p style={{
            fontSize: 14,
            color: "#666",
            marginBottom: 8
          }}>
            Welcome to VigilearnLMS
          </p>
          
          <p style={{
            fontSize: 12,
            color: "#888"
          }}>
            Manage your courses and engage with students
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: 20}}>
            <label style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: "#555",
              marginBottom: 6
            }}>
              Staff ID / Email
            </label>
            <div style={{position: "relative"}}>
              <span style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#aaa",
                fontSize: 16
              }}>👤</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your staff ID or email"
                required
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 40px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                  background: "#f8f9fa",
                  transition: "border-color 0.2s"
                }}
                onFocus={e => e.currentTarget.style.borderColor = C.green}
                onBlur={e => e.currentTarget.style.borderColor = "#ddd"}
              />
            </div>
          </div>

          <div style={{marginBottom: 24}}>
            <label style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: "#555",
              marginBottom: 6
            }}>
              Password
            </label>
            <div style={{position: "relative"}}>
              <span style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#aaa",
                fontSize: 16
              }}>🔑</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 40px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                  background: "#f8f9fa",
                  transition: "border-color 0.2s"
                }}
                onFocus={e => e.currentTarget.style.borderColor = C.green}
                onBlur={e => e.currentTarget.style.borderColor = "#ddd"}
              />
            </div>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 24
          }}>
            <input
              type="checkbox"
              id="remember"
              style={{
                marginRight: 8,
                width: 16,
                height: 16
              }}
            />
            <label htmlFor="remember" style={{
              fontSize: 12,
              color: "#666",
              cursor: "pointer"
            }}>
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "#ccc" : C.green,
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "14px",
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              marginBottom: 16
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div style={{textAlign: "center"}}>
            <a href="#" style={{
              fontSize: 12,
              color: C.green,
              textDecoration: "none",
              cursor: "pointer"
            }}>
              Forgot your password?
            </a>
          </div>
        </form>

        <div style={{
          marginTop: 24,
          padding: "16px",
          background: "#f8f9fa",
          borderRadius: 8,
          textAlign: "center"
        }}>
          <div style={{fontSize: 11, color: "#888", marginBottom: 4}}>
            Need help? Contact Academic Affairs
          </div>
          <div style={{fontSize: 11, color: "#888"}}>
            Email: academic@abu.edu.ng | Phone: +234-800-111-1111
          </div>
        </div>
      </div>
    </div>
  );
}
