import { useState, useEffect } from 'react';
import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';
import { SectionCard, Badge } from '../components/shared/SectionCard.jsx';
import { studentAssignmentsAPI } from '../utils/api.js';

export function StudentAssignmentsPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    pending: 0,
    overdue: 0,
    graded: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await studentAssignmentsAPI.getStudentAssignments();
      
      console.log('API Response:', response);
      
      if (response.success) {
        setAssignments(response.assignments || []);
        setStats(response.stats || {
          total: 0,
          submitted: 0,
          pending: 0,
          overdue: 0,
          graded: 0
        });
      } else {
        console.log('API returned success=false');
        setError('Failed to fetch assignments');
      }
    } catch (error) {
      console.log('API Error:', error);
      setError(error.message || 'Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "graded": return C.green;
      case "submitted": return C.blue;
      case "in-progress": return C.orange;
      case "pending": return C.red;
      default: return C.gray;
    }
  };

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleStartAssignment = (assignmentId) => {
    // Navigate to assignment details or start assignment
    console.log('Starting assignment:', assignmentId);
    // This could navigate to a detailed assignment view
  };

  const handleContinueAssignment = (assignmentId) => {
    // Navigate to continue assignment
    console.log('Continuing assignment:', assignmentId);
    // This could navigate to the assignment submission page
  };

  const handleViewDetails = (assignmentId) => {
    // Navigate to assignment details
    console.log('Viewing assignment details:', assignmentId);
    // This could navigate to a detailed assignment view
  };

  return (
    <div style={{padding:isLg?"24px 32px":16}}>
      <h2 style={{margin:"0 0 16px",fontSize:isLg?20:15,color:"#333",fontWeight:700}}>My Assignments</h2>
      
      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: "#fee",
          color: "#c53030",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "16px",
          fontSize: "14px",
          border: "1px solid #fed7d7"
        }}>
          {error}
        </div>
      )}
      
      <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(4,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:16,marginBottom:16}}>
        {[
          {label:"Total",value:stats.total.toString(),icon:"",color:C.blue},
          {label:"Submitted",value:stats.submitted.toString(),icon:"",color:C.green},
          {label:"Pending",value:stats.pending.toString(),icon:"",color:C.orange},
          {label:"Overdue",value:stats.overdue.toString(),icon:"",color:C.red},
        ].map((stat, index) => (
          <div key={index} style={{
            background:"white",border:"1px solid #e0e0e0",borderRadius:8,
            padding:16,textAlign:"center"
          }}>
            <div style={{fontSize:24,marginBottom:8}}>{stat.icon}</div>
            <div style={{fontSize:20,fontWeight:700,color:"#333",marginBottom:4}}>{stat.value}</div>
            <div style={{fontSize:11,color:"#666"}}>{stat.label}</div>
          </div>
        ))}
      </div>

      <SectionCard title="Assignment List" icon="📝" color={C.blue}>
        <div style={{padding:12}}>
          {loading ? (
            <div style={{textAlign: "center", padding: "40px"}}>
              <div style={{fontSize: "16px", color: "#6b7280"}}>Loading assignments...</div>
            </div>
          ) : assignments.length === 0 ? (
            <div style={{textAlign: "center", padding: "40px"}}>
              <div style={{fontSize: "16px", color: "#6b7280"}}>No assignments found</div>
              <div style={{fontSize: "14px", color: "#9ca3af", marginTop: "8px"}}>
                Enroll in courses to see assignments here
              </div>
            </div>
          ) : (
            assignments.map((assignment, index) => (
              <div key={index} style={{
                background:"#f9f9f9",borderRadius:8,padding:12,marginBottom:8,
                borderLeft:`3px solid ${getStatusColor(assignment.status)}`
              }}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:600,color:"#333",marginBottom:4}}>{assignment.title}</div>
                    <div style={{fontSize:11,color:"#666",marginBottom:4}}>
                      {assignment.course} • {assignment.type}
                    </div>
                    <div style={{fontSize:10,color:"#888",marginBottom:4}}>
                      {assignment.description}
                    </div>
                    <div style={{display:"flex",gap:12,fontSize:10,color:"#666"}}>
                      <span>📅 Due: {assignment.dueDate}</span>
                      {assignment.submittedDate !== "--" && (
                        <span>✅ Submitted: {assignment.submittedDate}</span>
                      )}
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                    <Badge color={getStatusColor(assignment.status)}>
                      {assignment.status}
                    </Badge>
                    {assignment.score !== "--" && (
                      <div style={{fontSize:16,fontWeight:700,color:C.green}}>
                        {assignment.score}%
                      </div>
                    )}
                    {assignment.status === "pending" && (
                      <div style={{fontSize:10,color:C.red,fontWeight:600}}>
                        {getDaysRemaining(assignment.dueDate)} days left
                      </div>
                    )}
                  </div>
                </div>
                
                <div style={{display:"flex",gap:8,marginTop:8}}>
                  {assignment.status === "pending" && (
                    <button 
                      onClick={() => handleStartAssignment(assignment.id)}
                      style={{
                        background:C.blue,color:"white",border:"none",borderRadius:4,
                        padding:"4px 8px",fontSize:9,cursor:"pointer"
                      }}
                    >
                      Start Assignment
                    </button>
                  )}
                  {assignment.status === "in-progress" && (
                    <button 
                      onClick={() => handleContinueAssignment(assignment.id)}
                      style={{
                        background:C.orange,color:"white",border:"none",borderRadius:4,
                        padding:"4px 8px",fontSize:9,cursor:"pointer"
                      }}
                    >
                      Continue
                    </button>
                  )}
                  <button 
                    onClick={() => handleViewDetails(assignment.id)}
                    style={{
                      background:C.gray,color:"white",border:"none",borderRadius:4,
                      padding:"4px 8px",fontSize:9,cursor:"pointer"
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </SectionCard>
    </div>
  );
}
