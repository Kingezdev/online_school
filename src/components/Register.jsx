import { useState } from "react";
import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';
import { authAPI } from '../utils/api.js';

export function Register({ onRegister, onBack }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    profile: {
      firstName: '',
      lastName: '',
      department: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: Account Info, 2: Profile Info, 3: Success
  const w = useW();
  const isLg = w >= 1024;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfileChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value
      }
    }));
  };

  const validateStep1 = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all required fields");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.profile.firstName || !formData.profile.lastName || !formData.profile.department) {
      setError("Please fill in all profile fields");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError("");
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await authAPI.register(formData);
      if (response.success) {
        setStep(3);
        setTimeout(() => {
          onRegister("student", response.user);
        }, 2000);
      }
    } catch (error) {
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div>
      <h2 style={{
        fontSize: isLg ? 24 : 20,
        fontWeight: 700,
        color: "#333",
        marginBottom: 24,
        textAlign: "center"
      }}>
        Create Account
      </h2>
      <p style={{
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginBottom: 32
      }}>
        Join VigilearnLMS to access your courses and manage your academic journey
      </p>

      <div style={{marginBottom: 20}}>
        <label style={{
          display: "block",
          fontSize: 12,
          fontWeight: 600,
          color: "#555",
          marginBottom: 6
        }}>
          Username *
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
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            placeholder="Choose a username"
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
            onFocus={e => e.currentTarget.style.borderColor = C.blue}
            onBlur={e => e.currentTarget.style.borderColor = "#ddd"}
          />
        </div>
      </div>

      <div style={{marginBottom: 20}}>
        <label style={{
          display: "block",
          fontSize: 12,
          fontWeight: 600,
          color: "#555",
          marginBottom: 6
        }}>
          Email Address *
        </label>
        <div style={{position: "relative"}}>
          <span style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#aaa",
            fontSize: 16
          }}>✉</span>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email address"
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
            onFocus={e => e.currentTarget.style.borderColor = C.blue}
            onBlur={e => e.currentTarget.style.borderColor = "#ddd"}
          />
        </div>
      </div>

      <div style={{marginBottom: 20}}>
        <label style={{
          display: "block",
          fontSize: 12,
          fontWeight: 600,
          color: "#555",
          marginBottom: 6
        }}>
          Password *
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
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Create a strong password"
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
            onFocus={e => e.currentTarget.style.borderColor = C.blue}
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
          Confirm Password *
        </label>
        <div style={{position: "relative"}}>
          <span style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#aaa",
            fontSize: 16
          }}>🔒</span>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="Confirm your password"
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
            onFocus={e => e.currentTarget.style.borderColor = C.blue}
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
          Account Type
        </label>
        <div style={{position: "relative"}}>
          <span style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#aaa",
            fontSize: 16
          }}>👥</span>
          <select
            value={formData.role}
            onChange={(e) => handleInputChange('role', e.target.value)}
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
            onFocus={e => e.currentTarget.style.borderColor = C.blue}
            onBlur={e => e.currentTarget.style.borderColor = "#ddd"}
          >
            <option value="student">Student</option>
            <option value="lecturer">Lecturer</option>
          </select>
        </div>
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

      <div style={{display: "flex", gap: "12px", justifyContent: "space-between"}}>
        <button
          onClick={handleBack}
          style={{
            padding: "12px 24px",
            background: "#f8f9fa",
            color: "#6b7280",
            border: "1px solid #d1d5db",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          disabled={loading}
          style={{
            padding: "12px 32px",
            background: loading ? "#ccc" : C.blue,
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s"
          }}
        >
          {loading ? "Creating..." : "Next Step"}
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h2 style={{
        fontSize: isLg ? 24 : 20,
        fontWeight: 700,
        color: "#333",
        marginBottom: 24,
        textAlign: "center"
      }}>
        Profile Information
      </h2>
      <p style={{
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginBottom: 32
      }}>
        Tell us more about yourself
      </p>

      <div style={{marginBottom: 20}}>
        <label style={{
          display: "block",
          fontSize: 12,
          fontWeight: 600,
          color: "#555",
          marginBottom: 6
        }}>
          First Name *
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
            value={formData.profile.firstName}
            onChange={(e) => handleProfileChange('firstName', e.target.value)}
            placeholder="Enter your first name"
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
            onFocus={e => e.currentTarget.style.borderColor = C.blue}
            onBlur={e => e.currentTarget.style.borderColor = "#ddd"}
          />
        </div>
      </div>

      <div style={{marginBottom: 20}}>
        <label style={{
          display: "block",
          fontSize: 12,
          fontWeight: 600,
          color: "#555",
          marginBottom: 6
        }}>
          Last Name *
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
            value={formData.profile.lastName}
            onChange={(e) => handleProfileChange('lastName', e.target.value)}
            placeholder="Enter your last name"
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
            onFocus={e => e.currentTarget.style.borderColor = C.blue}
            onBlur={e => e.currentTarget.style.borderColor = "#ddd"}
          />
        </div>
      </div>

      <div style={{marginBottom: 20}}>
        <label style={{
          display: "block",
          fontSize: 12,
          fontWeight: 600,
          color: "#555",
          marginBottom: 6
        }}>
          Department *
        </label>
        <div style={{position: "relative"}}>
          <span style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#aaa",
            fontSize: 16
          }}>🏢</span>
          <input
            type="text"
            value={formData.profile.department}
            onChange={(e) => handleProfileChange('department', e.target.value)}
            placeholder="Enter your department"
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
            onFocus={e => e.currentTarget.style.borderColor = C.blue}
            onBlur={e => e.currentTarget.style.borderColor = "#ddd"}
          />
        </div>
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

      <div style={{display: "flex", gap: "12px", justifyContent: "space-between"}}>
        <button
          onClick={handleBack}
          style={{
            padding: "12px 24px",
            background: "#f8f9fa",
            color: "#6b7280",
            border: "1px solid #d1d5db",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          disabled={loading}
          style={{
            padding: "12px 32px",
            background: loading ? "#ccc" : C.blue,
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s"
          }}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div style={{textAlign: "center", padding: "60px 20px"}}>
      <div style={{
        width: "80px",
        height: "80px",
        backgroundColor: "#10b981",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 24px"
      }}>
        <span style={{color: "white", fontSize: "32px"}}>✓</span>
      </div>
      <h2 style={{
        fontSize: isLg ? 28 : 24,
        fontWeight: 700,
        color: "#10b981",
        marginBottom: 16
      }}>
        Registration Successful!
      </h2>
      <p style={{
        fontSize: 16,
        color: "#666",
        marginBottom: 32,
        lineHeight: 1.5
      }}>
        Your account has been created successfully.<br />
        You will be redirected to the login page shortly.
      </p>
      <div style={{
        fontSize: 14,
        color: "#888"
      }}>
        Redirecting in {2} seconds...
      </div>
    </div>
  );

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
        background: "linear-gradient(135deg, rgba(44, 123, 229, 0.9) 0%, rgba(39, 174, 96, 0.8) 50%, rgba(26, 188, 156, 0.9) 100%), url('/ABU.jpeg')",
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

      {/* Registration Form */}
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
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
}
