import { useState } from "react";
import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';
import { authAPI } from '../utils/api.js';

export function AdminLogin({ onLogin, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const w = useW();
  const isLg = w >= 1024;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await authAPI.login(username, password);
      if (response.success) {
        onLogin("admin", response.user);
      }
    } catch (error) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
        background: "linear-gradient(135deg, rgba(142, 68, 173, 0.9) 0%, rgba(155, 89, 182, 0.8) 50%, rgba(192, 57, 183, 0.9) 100%), url('/ABU.jpeg')",
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
            background: C.purple,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            margin: "0 auto 20px"
          }}>
            👨‍💼
          </div>
          
          <h2 style={{
            fontSize: isLg ? 28 : 24,
            fontWeight: 700,
            color: "#333",
            marginBottom: 8
          }}>
            Administrator Login
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
            System administration and institutional oversight
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
              Admin Username
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
                placeholder="Enter your admin username"
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
                onFocus={e => e.currentTarget.style.borderColor = C.purple}
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
              Admin Password
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
                placeholder="Enter your admin password"
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
                onFocus={e => e.currentTarget.style.borderColor = C.purple}
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

          {error && (
            <div style={{
              background: "#fee",
              color: "#c53030",
              padding: "12px",
              borderRadius: 8,
              marginBottom: 16,
              fontSize: 14,
              border: "1px solid #fed7d7"
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "#ccc" : C.purple,
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
              color: C.purple,
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
            🔒 Restricted Access - Authorized Personnel Only
          </div>
          <div style={{fontSize: 11, color: "#888"}}>
            Contact System Administrator if you need assistance
          </div>
        </div>
      </div>
    </div>
  );
}
