import { useState, useEffect } from 'react';
import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';
import { SectionCard, Badge } from '../components/shared/SectionCard.jsx';
import { gradebookAPI } from '../utils/api.js';

export function LecturerGradeBookPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;
  const [gradebookData, setGradebookData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchGradebook();
  }, []);

  const fetchGradebook = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching gradebook data...');
      const response = await gradebookAPI.getLecturerGradebook();
      
      console.log('Gradebook response:', response);
      
      if (response.success) {
        console.log('=== FRONTEND DATA RECEIVED ===');
        response.courses.forEach(course => {
          console.log(`Course ${course.code}:`);
          course.students.forEach(student => {
            if (student.id === 11) {
              console.log(`  Student ${student.username}: Assignment=${student.assignmentScore}%, Overall=${student.overallScore}%`);
            }
          });
        });
        // Force a complete refresh by creating a new array reference and incrementing refresh key
        setGradebookData([...(response.courses || [])]);
        setRefreshKey(prev => prev + 1);
      } else {
        console.error('Gradebook fetch failed:', response.message);
        setError(response.message || 'Failed to fetch gradebook data');
      }
    } catch (error) {
      console.error('Error fetching gradebook:', error);
      setError(error.message || 'Failed to fetch gradebook data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGrade = async (studentId, courseId, type, itemId, currentScore) => {
    const newScore = prompt(`Enter new score (current: ${currentScore}):`);
    
    if (newScore === null) return; // User cancelled
    
    const score = parseInt(newScore);
    
    if (isNaN(score) || score < 0 || score > 100) {
      alert('Please enter a valid score between 0 and 100');
      return;
    }

    try {
      const gradeData = {
        type,
        itemId,
        studentId,
        score,
        feedback: type === 'assignment' ? 'Updated by lecturer' : undefined
      };

      const response = await gradebookAPI.updateStudentGrade(gradeData);
      
      if (response.success) {
        // Show success message
        console.log('Grade updated successfully, refreshing gradebook...');
        // Refresh the gradebook data
        await fetchGradebook();
        // Optional: Show success feedback to user
        // alert('Grade updated successfully!');
      } else {
        setError(response.message || 'Failed to update grade');
      }
    } catch (error) {
      console.error('Error updating grade:', error);
      setError(error.message || 'Failed to update grade');
    }
  };

  const getGradeColor = (score) => {
    if (score >= 90) return C.green;
    if (score >= 80) return C.blue;
    if (score >= 70) return C.orange;
    if (score >= 60) return C.red;
    return C.red;
  };

  const calculateOverallStats = () => {
    const allStudents = gradebookData.flatMap(course => course.students);
    const totalStudents = allStudents.length;
    const avgPerformance = totalStudents > 0 
      ? Math.round(allStudents.reduce((sum, student) => sum + student.overallScore, 0) / totalStudents)
      : 0;
    
    // Count graded assignments and quizzes
    let gradedAssignments = 0;
    let pendingGrades = 0;
    
    gradebookData.forEach(course => {
      course.students.forEach(student => {
        if (student.assignmentScore > 0) gradedAssignments++;
        else if (student.assignmentScore === 0) pendingGrades++;
      });
    });

    return {
      totalStudents,
      avgPerformance,
      gradedAssignments,
      pendingGrades
    };
  };

  const stats = calculateOverallStats();

  return (
    <div key={refreshKey} style={{padding:isLg?"24px 32px":16}}>
      <h2 style={{margin:"0 0 16px",fontSize:isLg?20:15,color:"#333",fontWeight:700}}>Grade Book</h2>
      
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
          {label:"Total Students",value:stats.totalStudents.toString(),icon:"",color:C.blue},
          {label:"Avg Class Performance",value:`${stats.avgPerformance}%`,icon:"",color:C.green},
          {label:"Graded Assignments",value:stats.gradedAssignments.toString(),icon:"",color:C.orange},
          {label:"Pending Grades",value:stats.pendingGrades.toString(),icon:"",color:C.red},
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

      {loading ? (
        <div style={{textAlign: "center", padding: "40px", backgroundColor: "white", borderRadius: "8px", border: "1px solid #e0e0e0"}}>
          <div style={{fontSize: "16px", color: "#6b7280"}}>Loading gradebook...</div>
        </div>
      ) : gradebookData.length === 0 ? (
        <div style={{textAlign: "center", padding: "40px", backgroundColor: "white", borderRadius: "8px", border: "1px solid #e0e0e0"}}>
          <div style={{fontSize: "16px", color: "#6b7280"}}>No courses found</div>
        </div>
      ) : (
        gradebookData.map((courseData) => (
          <SectionCard key={courseData.code} title={`${courseData.code} - Grade Overview`} icon="" color={C.blue}>
            <div style={{padding:12}}>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:14,fontWeight:600,color:"#333",marginBottom:4}}>
                  Class Average: {courseData.statistics.classAverage}%
                </div>
                <div style={{fontSize:11,color:"#666"}}>
                  {courseData.statistics.totalStudents} students enrolled
                </div>
              </div>
              
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
                  <thead>
                    <tr style={{background:"#f5f5f5"}}>
                      <th style={{padding:"6px",textAlign:"left",color:"#555",fontWeight:600}}>Student ID</th>
                      <th style={{padding:"6px",textAlign:"left",color:"#555",fontWeight:600}}>Name</th>
                      <th style={{padding:"6px",textAlign:"center",color:"#555",fontWeight:600}}>Assignments</th>
                      <th style={{padding:"6px",textAlign:"center",color:"#555",fontWeight:600}}>Quizzes</th>
                      <th style={{padding:"6px",textAlign:"center",color:"#555",fontWeight:600}}>Overall</th>
                      <th style={{padding:"6px",textAlign:"center",color:"#555",fontWeight:600}}>Grade</th>
                      <th style={{padding:"6px",textAlign:"center",color:"#555",fontWeight:600}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseData.students.map((student) => (
                      <tr key={`${student.id}-${refreshKey}`}>
                        <td style={{padding:"6px",borderTop:"1px solid #eee",color:"#333"}}>{student.username}</td>
                        <td style={{padding:"6px",borderTop:"1px solid #eee",color:"#333",fontWeight:500}}>
                          {student.firstName} {student.lastName}
                        </td>
                        <td key={`assignment-${student.id}-${refreshKey}`} style={{padding:"6px",borderTop:"1px solid #eee",textAlign:"center"}}>
                          {student.assignmentScore}%
                        </td>
                        <td key={`quiz-${student.id}-${refreshKey}`} style={{padding:"6px",borderTop:"1px solid #eee",textAlign:"center"}}>
                          {student.quizScore}%
                        </td>
                        <td key={`overall-${student.id}-${refreshKey}`} style={{padding:"6px",borderTop:"1px solid #eee",textAlign:"center",fontWeight:600}}>
                          {student.overallScore}%
                        </td>
                        <td style={{padding:"6px",borderTop:"1px solid #eee",textAlign:"center"}}>
                          <Badge color={getGradeColor(student.overallScore)}>
                            {student.grade}
                          </Badge>
                        </td>
                        <td style={{padding:"6px",borderTop:"1px solid #eee",textAlign:"center"}}>
                          <button 
                            onClick={() => handleUpdateGrade(student.id, courseData.id, 'assignment', 1, student.assignmentScore)}
                            style={{
                              background:C.orange,color:"white",border:"none",borderRadius:3,
                              padding:"2px 6px",fontSize:8,cursor:"pointer",marginRight:2
                            }}
                          >
                            Edit
                          </button>
                          <button style={{
                            background:C.blue,color:"white",border:"none",borderRadius:3,
                            padding:"2px 6px",fontSize:8,cursor:"pointer"
                          }}>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </SectionCard>
        ))
      )}
    </div>
  );
}
