import { useState } from "react";
import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';

export function HelpSupportPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      id: 1,
      question: "How do I reset my password?",
      answer: "Click on your profile icon in the top bar, select 'My Profile', then click on 'Change Password' or contact the IT support team for assistance."
    },
    {
      id: 2,
      question: "Where can I find my course materials?",
      answer: "Navigate to 'My Courses' from the main menu, select your course, and you'll find all materials in the 'Resources' section."
    },
    {
      id: 3,
      question: "How do I submit an assignment?",
      answer: "Go to the 'Assignments' section, select the assignment you want to submit, and click the 'Submit' button to upload your work."
    },
    {
      id: 4,
      question: "What is the attendance policy?",
      answer: "Students are required to maintain a minimum of 75% attendance in each course. Check the 'Attendance' section to track your attendance record."
    },
    {
      id: 5,
      question: "How can I contact my lecturer?",
      answer: "You can contact your lecturer through the 'Forum' section or find their contact information in the course details page."
    }
  ];

  const handleFaqToggle = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Support request submitted:', formData);
    alert('Your support request has been submitted. We will get back to you within 24 hours.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div style={{padding: isLg ? "32px" : "16px", backgroundColor: "#f5f5f5", minHeight: "100vh"}}>
      <h1 style={{margin: "0 0 24px", fontSize: isLg ? "24px" : "20px", color: "#333", fontWeight: "bold"}}>Help & Support</h1>
      
      {/* Quick Help Section */}
      <div style={{marginBottom: "32px"}}>
        <div style={{backgroundColor: "#2563eb", color: "white", padding: "12px 16px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}>
          <h2 style={{margin: 0, fontSize: "18px", fontWeight: "bold"}}>Quick Help</h2>
        </div>
        <div style={{backgroundColor: "white", border: "1px solid #e5e7eb", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", padding: "24px"}}>
          <div style={{display: "grid", gridTemplateColumns: isLg ? "repeat(auto-fit, minmax(250px, 1fr))" : "1fr", gap: "16px"}}>
            <div style={{padding: "16px", border: "1px solid #e5e7eb", borderRadius: "6px", textAlign: "center"}}>
              <div style={{fontSize: "32px", marginBottom: "8px"}}>📚</div>
              <h3 style={{margin: "0 0 8px", fontSize: "16px", fontWeight: "bold", color: "#333"}}>Course Materials</h3>
              <p style={{margin: 0, fontSize: "14px", color: "#666"}}>Access all your course resources and study materials</p>
            </div>
            <div style={{padding: "16px", border: "1px solid #e5e7eb", borderRadius: "6px", textAlign: "center"}}>
              <div style={{fontSize: "32px", marginBottom: "8px"}}>💬</div>
              <h3 style={{margin: "0 0 8px", fontSize: "16px", fontWeight: "bold", color: "#333"}}>Discussion Forum</h3>
              <p style={{margin: 0, fontSize: "14px", color: "#666"}}>Connect with lecturers and fellow students</p>
            </div>
            <div style={{padding: "16px", border: "1px solid #e5e7eb", borderRadius: "6px", textAlign: "center"}}>
              <div style={{fontSize: "32px", marginBottom: "8px"}}>📞</div>
              <h3 style={{margin: "0 0 8px", fontSize: "16px", fontWeight: "bold", color: "#333"}}>Contact Support</h3>
              <p style={{margin: 0, fontSize: "14px", color: "#666"}}>Get technical assistance from our support team</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{marginBottom: "32px"}}>
        <div style={{backgroundColor: "#2563eb", color: "white", padding: "12px 16px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}>
          <h2 style={{margin: 0, fontSize: "18px", fontWeight: "bold"}}>Frequently Asked Questions</h2>
        </div>
        <div style={{backgroundColor: "white", border: "1px solid #e5e7eb", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", padding: "16px"}}>
          {faqs.map(faq => (
            <div key={faq.id} style={{marginBottom: "8px"}}>
              <button
                onClick={() => handleFaqToggle(faq.id)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  backgroundColor: expandedFaq === faq.id ? "#f3f4f6" : "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  textAlign: "left"
                }}
              >
                <span style={{fontSize: "14px", fontWeight: "500", color: "#333"}}>{faq.question}</span>
                <svg style={{width: "16px", height: "16px", color: "#6b7280", transform: expandedFaq === faq.id ? "rotate(180deg)" : "none"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedFaq === faq.id && (
                <div style={{padding: "12px 16px", backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderTop: "none", borderRadius: "0 0 6px 6px"}}>
                  <p style={{margin: 0, fontSize: "14px", color: "#666", lineHeight: "1.5"}}>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form Section */}
      <div style={{marginBottom: "32px"}}>
        <div style={{backgroundColor: "#2563eb", color: "white", padding: "12px 16px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}>
          <h2 style={{margin: 0, fontSize: "18px", fontWeight: "bold"}}>Contact Support</h2>
        </div>
        <div style={{backgroundColor: "white", border: "1px solid #e5e7eb", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", padding: "24px"}}>
          <form onSubmit={handleSubmit}>
            <div style={{display: "grid", gridTemplateColumns: isLg ? "repeat(2, 1fr)" : "1fr", gap: "16px", marginBottom: "16px"}}>
              <div>
                <label style={{display: "block", marginBottom: "6px", fontSize: "14px", color: "#374151", fontWeight: "500"}}>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
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
                  required
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
            <div style={{marginBottom: "16px"}}>
              <label style={{display: "block", marginBottom: "6px", fontSize: "14px", color: "#374151", fontWeight: "500"}}>Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              />
            </div>
            <div style={{marginBottom: "16px"}}>
              <label style={{display: "block", marginBottom: "6px", fontSize: "14px", color: "#374151", fontWeight: "500"}}>Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                required
                rows="4"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                  resize: "vertical"
                }}
              />
            </div>
            <button
              type="submit"
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
              Submit Request
            </button>
          </form>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <div style={{backgroundColor: "#2563eb", color: "white", padding: "12px 16px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}>
          <h2 style={{margin: 0, fontSize: "18px", fontWeight: "bold"}}>Contact Information</h2>
        </div>
        <div style={{backgroundColor: "white", border: "1px solid #e5e7eb", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", padding: "24px"}}>
          <div style={{display: "grid", gridTemplateColumns: isLg ? "repeat(auto-fit, minmax(250px, 1fr))" : "1fr", gap: "16px"}}>
            <div>
              <h3 style={{margin: "0 0 8px", fontSize: "16px", fontWeight: "bold", color: "#333"}}>IT Support</h3>
              <p style={{margin: "0 0 4px", fontSize: "14px", color: "#666"}}>📧 support@abu.edu.ng</p>
              <p style={{margin: "0 0 4px", fontSize: "14px", color: "#666"}}>📞 +234 123 4567 890</p>
              <p style={{margin: 0, fontSize: "14px", color: "#666"}}>🕒 Monday - Friday, 8:00 AM - 5:00 PM</p>
            </div>
            <div>
              <h3 style={{margin: "0 0 8px", fontSize: "16px", fontWeight: "bold", color: "#333"}}>Academic Support</h3>
              <p style={{margin: "0 0 4px", fontSize: "14px", color: "#666"}}>📧 academics@abu.edu.ng</p>
              <p style={{margin: "0 0 4px", fontSize: "14px", color: "#666"}}>📞 +234 123 4567 891</p>
              <p style={{margin: 0, fontSize: "14px", color: "#666"}}>🕒 Monday - Friday, 9:00 AM - 4:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
