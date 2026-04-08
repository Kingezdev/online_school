import { useState } from "react";
import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';

export function MyProfilePage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@abu.edu.ng',
    phone: '+234 567 8900',
    department: 'Computer Science',
    level: '400',
    studentId: '2020/123456',
    address: 'Ahmadu Bello University, Zaria, Nigeria'
  });

  const handleSave = () => {
    console.log('Saving profile data:', formData);
    setIsEditing(false);
    // Add save logic here
  };

  const handleCancel = () => {
    console.log('Canceling edit');
    setIsEditing(false);
    // Reset form data to original values
    setFormData({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@abu.edu.ng',
      phone: '+234 567 8900',
      department: 'Computer Science',
      level: '400',
      studentId: '2020/123456',
      address: 'Ahmadu Bello University, Zaria, Nigeria'
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div style={{padding: isLg ? "32px" : "16px", backgroundColor: "#f5f5f5", minHeight: "100vh"}}>
      <h1 style={{margin: "0 0 24px", fontSize: isLg ? "24px" : "20px", color: "#333", fontWeight: "bold"}}>My Profile</h1>
      
      {/* Profile Overview Card */}
      <div style={{marginBottom: "24px"}}>
        <div style={{backgroundColor: "#2563eb", color: "white", padding: "12px 16px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}>
          <h2 style={{margin: 0, fontSize: "18px", fontWeight: "bold"}}>Profile Overview</h2>
        </div>
        <div style={{backgroundColor: "white", border: "1px solid #e5e7eb", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", padding: "24px"}}>
          <div style={{display: "flex", gap: "24px", alignItems: "flex-start"}}>
            {/* Avatar Section */}
            <div style={{textAlign: "center"}}>
              <div style={{width: "120px", height: "120px", borderRadius: "50%", backgroundColor: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px", fontWeight: "bold", color: "white", marginBottom: "16px"}}>
                JD
              </div>
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

      {/* Academic Information */}
      <div style={{marginBottom: "24px"}}>
        <div style={{backgroundColor: "#2563eb", color: "white", padding: "12px 16px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}>
          <h2 style={{margin: 0, fontSize: "18px", fontWeight: "bold"}}>Academic Information</h2>
        </div>
        <div style={{backgroundColor: "white", border: "1px solid #e5e7eb", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", padding: "24px"}}>
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px"}}>
            <div>
              <div style={{fontSize: "12px", color: "#6b7280", marginBottom: "4px"}}>Student ID</div>
              <div style={{fontSize: "16px", color: "#333", fontWeight: "500"}}>{formData.studentId}</div>
            </div>
            <div>
              <div style={{fontSize: "12px", color: "#6b7280", marginBottom: "4px"}}>Department</div>
              <div style={{fontSize: "16px", color: "#333", fontWeight: "500"}}>{formData.department}</div>
            </div>
            <div>
              <div style={{fontSize: "12px", color: "#6b7280", marginBottom: "4px"}}>Level</div>
              <div style={{fontSize: "16px", color: "#333", fontWeight: "500"}}>{formData.level}</div>
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
    </div>
  );
}
