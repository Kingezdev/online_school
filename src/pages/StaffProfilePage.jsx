import { useState, useEffect } from "react";
import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';
import { authAPI } from '../utils/api.js';

export function StaffProfilePage({ setPage, role }) {
  const w = useW();
  const isLg = w >= 1024;
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    employeeId: '',
    officeLocation: '',
    specialization: '',
    qualifications: '',
    researchInterests: '',
    address: ''
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await authAPI.getProfile();
        if (response.success) {
          setUser(response.user);
          setFormData({
            firstName: response.user.profile?.firstName || '',
            lastName: response.user.profile?.lastName || '',
            email: response.user.email || '',
            phone: response.user.profile?.phone || '',
            department: response.user.profile?.department || '',
            employeeId: response.user.profile?.employeeId || '',
            officeLocation: response.user.profile?.officeLocation || '',
            specialization: response.user.profile?.specialization || '',
            qualifications: response.user.profile?.qualifications || '',
            researchInterests: response.user.profile?.researchInterests || '',
            address: response.user.profile?.address || ''
          });
        }
      } catch (error) {
        setError(error.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const profileData = {
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          department: formData.department,
          employeeId: formData.employeeId,
          officeLocation: formData.officeLocation,
          specialization: formData.specialization,
          qualifications: formData.qualifications,
          researchInterests: formData.researchInterests,
          address: formData.address
        }
      };
      
      const response = await authAPI.updateProfile(profileData);
      if (response.success) {
        setUser(response.user);
        setIsEditing(false);
        setError("");
      }
    } catch (error) {
      setError(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.profile?.firstName || '',
        lastName: user.profile?.lastName || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        department: user.profile?.department || '',
        employeeId: user.profile?.employeeId || '',
        officeLocation: user.profile?.officeLocation || '',
        specialization: user.profile?.specialization || '',
        qualifications: user.profile?.qualifications || '',
        researchInterests: user.profile?.researchInterests || '',
        address: user.profile?.address || ''
      });
    }
    setIsEditing(false);
    setError("");
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getRoleTitle = () => {
    if (role === "lecturer") return "Lecturer";
    if (role === "admin") return "Administrator";
    return "Staff";
  };

  return (
    <div style={{padding: isLg ? "32px" : "16px", backgroundColor: "#f5f5f5", minHeight: "100vh"}}>
      <h1 style={{margin: "0 0 24px", fontSize: isLg ? "24px" : "20px", color: "#333", fontWeight: "bold"}}>
        {getRoleTitle()} Profile
      </h1>
      
      {error && (
        <div style={{
          backgroundColor: "#fee",
          color: "#c53030",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "24px",
          fontSize: "14px",
          border: "1px solid #fed7d7"
        }}>
          {error}
        </div>
      )}
      
      {loading ? (
        <div style={{textAlign: "center", padding: "60px 20px"}}>
          <div style={{fontSize: "16px", color: "#6b7280"}}>Loading profile data...</div>
        </div>
      ) : (
        <>
      {/* Profile Overview Card */}
      <div style={{marginBottom: "24px"}}>
        <div style={{backgroundColor: "#2563eb", color: "white", padding: "12px 16px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}>
          <h2 style={{margin: 0, fontSize: "18px", fontWeight: "bold"}}>Profile Overview</h2>
        </div>
        <div style={{backgroundColor: "white", border: "1px solid #e5e7eb", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", padding: "24px"}}>
          <div style={{display: "flex", gap: "24px", alignItems: "flex-start"}}>
            {/* Avatar Section */}
            <div style={{textAlign: "center"}}>
              <div style={{width: "120px", height: "120px", borderRadius: "50%", backgroundColor: role === "lecturer" ? "#059669" : "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px", fontWeight: "bold", color: "white", marginBottom: "16px"}}>
                {user ? `${user.profile?.firstName?.charAt(0) || ''}${user.profile?.lastName?.charAt(0) || ''}`.toUpperCase() : 'U'}
              </div>
              <div style={{display: "flex", gap: "8px", flexDirection: "column"}}>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  style={{
                    background: isEditing ? "#6b7280" : C.blue,
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 16px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "background 0.2s"
                  }}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
                {isEditing && (
                  <div style={{display: "flex", gap: "8px"}}>
                    <button 
                      onClick={handleSave}
                      disabled={loading}
                      style={{
                        background: loading ? "#ccc" : "#10b981",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 16px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: loading ? "not-allowed" : "pointer",
                        transition: "background 0.2s"
                      }}
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                      onClick={handleCancel}
                      style={{
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 16px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                    >
                      Discard
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div style={{flex: "1"}}>
              <h3 style={{margin: "0 0 16px", fontSize: "16px", fontWeight: "bold", color: "#333"}}>Basic Information</h3>
              
              {isEditing ? (
                <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px"}}>
                  <div>
                    <label style={{display: "block", marginBottom: "6px", fontSize: "14px", color: "#374151", fontWeight: "500"}}>First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{display: "block", marginBottom: "6px", fontSize: "14px", color: "#374151", fontWeight: "500"}}>Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{display: "block", marginBottom: "6px", fontSize: "14px", color: "#374151", fontWeight: "500"}}>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{display: "block", marginBottom: "6px", fontSize: "14px", color: "#374151", fontWeight: "500"}}>Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px"
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px"}}>
                  <div>
                    <div style={{fontSize: "12px", color: "#6b7280", marginBottom: "4px"}}>First Name</div>
                    <div style={{fontSize: "16px", color: "#333", fontWeight: "500"}}>{formData.firstName}</div>
                  </div>
                  <div>
                    <div style={{fontSize: "12px", color: "#6b7280", marginBottom: "4px"}}>Last Name</div>
                    <div style={{fontSize: "16px", color: "#333", fontWeight: "500"}}>{formData.lastName}</div>
                  </div>
                  <div>
                    <div style={{fontSize: "12px", color: "#6b7280", marginBottom: "4px"}}>Email</div>
                    <div style={{fontSize: "16px", color: "#333", fontWeight: "500"}}>{formData.email}</div>
                  </div>
                  <div>
                    <div style={{fontSize: "12px", color: "#6b7280", marginBottom: "4px"}}>Phone</div>
                    <div style={{fontSize: "16px", color: "#333", fontWeight: "500"}}>{formData.phone}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div style={{marginBottom: "24px"}}>
        <div style={{backgroundColor: "#2563eb", color: "white", padding: "12px 16px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}>
          <h2 style={{margin: 0, fontSize: "18px", fontWeight: "bold"}}>Professional Information</h2>
        </div>
        <div style={{backgroundColor: "white", border: "1px solid #e5e7eb", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", padding: "24px"}}>
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px"}}>
            <div>
              <div style={{fontSize: "12px", color: "#6b7280", marginBottom: "4px"}}>Employee ID</div>
              <div style={{fontSize: "16px", color: "#333", fontWeight: "500"}}>{formData.employeeId}</div>
            </div>
            <div>
              <div style={{fontSize: "12px", color: "#6b7280", marginBottom: "4px"}}>Department</div>
              <div style={{fontSize: "16px", color: "#333", fontWeight: "500"}}>{formData.department}</div>
            </div>
            <div>
              <div style={{fontSize: "12px", color: "#6b7280", marginBottom: "4px"}}>Office Location</div>
              <div style={{fontSize: "16px", color: "#333", fontWeight: "500"}}>{formData.officeLocation}</div>
            </div>
            <div>
              <div style={{fontSize: "12px", color: "#6b7280", marginBottom: "4px"}}>Specialization</div>
              <div style={{fontSize: "16px", color: "#333", fontWeight: "500"}}>{formData.specialization}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic/Professional Details */}
      <div style={{marginBottom: "24px"}}>
        <div style={{backgroundColor: "#2563eb", color: "white", padding: "12px 16px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}>
          <h2 style={{margin: 0, fontSize: "18px", fontWeight: "bold"}}>
            {role === "lecturer" ? "Academic Details" : "Professional Details"}
          </h2>
        </div>
        <div style={{backgroundColor: "white", border: "1px solid #e5e7eb", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", padding: "24px"}}>
          <div style={{marginBottom: "16px"}}>
            <div style={{fontSize: "12px", color: "#6b7280", marginBottom: "4px"}}>
              {role === "lecturer" ? "Qualifications" : "Professional Qualifications"}
            </div>
            <div style={{fontSize: "16px", color: "#333", fontWeight: "500", lineHeight: "1.6"}}>
              {formData.qualifications}
            </div>
          </div>
          <div>
            <div style={{fontSize: "12px", color: "#6b7280", marginBottom: "4px"}}>
              {role === "lecturer" ? "Research Interests" : "Areas of Expertise"}
            </div>
            <div style={{fontSize: "16px", color: "#333", fontWeight: "500", lineHeight: "1.6"}}>
              {formData.researchInterests}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div style={{marginBottom: "24px"}}>
        <div style={{backgroundColor: "#2563eb", color: "white", padding: "12px 16px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}>
          <h2 style={{margin: 0, fontSize: "18px", fontWeight: "bold"}}>Contact Information</h2>
        </div>
        <div style={{backgroundColor: "white", border: "1px solid #e5e7eb", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", padding: "24px"}}>
          <div style={{fontSize: "16px", color: "#333", fontWeight: "500", lineHeight: "1.6"}}>
            {formData.address}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div style={{display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px"}}>
          <button 
            onClick={handleCancel}
            style={{
              background: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            style={{
              background: C.blue,
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Save Changes
          </button>
        </div>
      )}
        </>
      )}
    </div>
  );
}
