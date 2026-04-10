import { useState, useEffect } from 'react';
import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';
import { SectionCard, Badge } from '../components/shared/SectionCard.jsx';
import { courseAPI, usersAPI } from '../utils/api.js';

export function AdminCoursesPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    code: '',
    name: '',
    credits: 3,
    description: '',
    isActive: true
  });
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [lecturers, setLecturers] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLecturer, setSelectedLecturer] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await courseAPI.getAll();
        
        if (response.success) {
          setCourses(response.courses || []);
        } else {
          setError(response.message || 'Failed to fetch courses');
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    const fetchLecturers = async () => {
      try {
        const response = await usersAPI.getUsers('lecturer');
        if (response.success) {
          setLecturers(response.users || []);
        }
      } catch (error) {
        console.error('Failed to fetch lecturers:', error);
      }
    };

    fetchCourses();
    fetchLecturers();
  }, []);

  if (loading) {
    return (
      <div style={{padding: isLg ? "24px 32px" : 16}}>
        <div style={{textAlign: "center", padding: "50px"}}>
          <div style={{fontSize: "18px", color: "#666"}}>Loading courses...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{padding: isLg ? "24px 32px" : 16}}>
        <div style={{textAlign: "center", padding: "50px"}}>
          <div style={{fontSize: "18px", color: "#dc2626"}}>Error: {error}</div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    return status === "active" ? C.green : C.red;
  };

  const handleEditCourse = async (courseId) => {
    try {
      const response = await courseAPI.getById(courseId);
      if (response.success) {
        setEditingCourse(response.course);
        setShowEditModal(true);
      } else {
        alert('Failed to load course data: ' + response.message);
      }
    } catch (error) {
      alert('Error loading course data: ' + error.message);
    }
  };

  const handleToggleCourseStatus = async (courseId, isActive) => {
    try {
      const response = await courseAPI.update(courseId, { isActive });
      if (response.success) {
        // Refresh courses list
        window.location.reload();
      } else {
        alert('Failed to update course status: ' + response.message);
      }
    } catch (error) {
      alert('Error updating course status: ' + error.message);
    }
  };

  const handleSaveCourse = async () => {
    try {
      const response = await courseAPI.update(editingCourse.id, editingCourse);
      if (response.success) {
        setShowEditModal(false);
        setEditingCourse(null);
        // Refresh courses list
        window.location.reload();
      } else {
        alert('Failed to update course: ' + response.message);
      }
    } catch (error) {
      alert('Error updating course: ' + error.message);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingCourse(null);
  };

  const handleAddCourse = () => {
    setShowAddModal(true);
  };

  const handleSaveNewCourse = async () => {
    if (!newCourse.code || !newCourse.name) {
      alert('Please fill in all required fields!');
      return;
    }

    try {
      const response = await courseAPI.create(newCourse);
      if (response.success) {
        setShowAddModal(false);
        setNewCourse({
          code: '',
          name: '',
          credits: 3,
          description: '',
          isActive: true
        });
        // Refresh courses list
        window.location.reload();
      } else {
        alert('Failed to create course: ' + response.message);
      }
    } catch (error) {
      alert('Error creating course: ' + error.message);
    }
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setNewCourse({
      code: '',
      name: '',
      credits: 3,
      description: '',
      isActive: true
    });
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ['ID', 'Code', 'Name', 'Credits', 'Student Count', 'Lecturer', 'Status'];
    const csvContent = [
      headers.join(','),
      ...courses.map(course => [
        course.id,
        course.code,
        course.name,
        course.credits || 0,
        course.studentCount || 0,
        course.lecturerFirstName && course.lecturerLastName ? 
          `${course.lecturerFirstName} ${course.lecturerLastName}` : 
          course.lecturerUsername || 'N/A',
        course.isActive ? 'Active' : 'Inactive'
      ].join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `courses_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleAssignCourse = (course) => {
    setSelectedCourse(course);
    setSelectedLecturer(course.lecturer || '');
    setShowAssignModal(true);
  };

  const handleSaveAssignment = async () => {
    if (!selectedCourse || !selectedLecturer) {
      alert('Please select a lecturer');
      return;
    }

    try {
      const response = await courseAPI.assignLecturer(selectedCourse.id, selectedLecturer);
      if (response.success) {
        // Update the course in state directly
        setCourses(prevCourses => 
          prevCourses.map(course => 
            course.id === selectedCourse.id 
              ? { 
                  ...course, 
                  lecturer: selectedLecturer,
                  lecturerFirstName: response.course.lecturerFirstName,
                  lecturerLastName: response.course.lecturerLastName,
                  lecturerUsername: response.course.lecturerUsername
                }
              : course
          )
        );
        
        setShowAssignModal(false);
        setSelectedCourse(null);
        setSelectedLecturer('');
        alert('Lecturer assigned successfully!');
      } else {
        alert('Failed to assign lecturer: ' + response.message);
      }
    } catch (error) {
      alert('Error assigning lecturer: ' + error.message);
    }
  };

  const handleCancelAssign = () => {
    setShowAssignModal(false);
    setSelectedCourse(null);
    setSelectedLecturer('');
  };

  return (
    <div style={{padding:isLg?"24px 32px":16}}>
      <h2 style={{margin:"0 0 16px",fontSize:isLg?20:15,color:"#333",fontWeight:700}}>Course Management</h2>
      
      <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(4,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:16,marginBottom:16}}>
        {[
          {label:"Total Courses",value:courses.length,icon:"📚",color:C.blue},
          {label:"Active",value:courses.filter(c => c.isActive).length,icon:"✅",color:C.green},
          {label:"Total Students",value:courses.reduce((sum, c) => sum + (c.studentCount || 0), 0),icon:"👥",color:C.orange},
          {label:"Total Credits",value:courses.reduce((sum, c) => sum + (c.credits || 0), 0),icon:"🎯",color:C.purple},
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

      <SectionCard title="Course Directory" icon="📚" color={C.blue}>
        <div style={{padding:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <h3 style={{margin:0,fontSize:14,fontWeight:600,color:"#333"}}>All Courses</h3>
            <div style={{display:"flex",gap:8}}>
              <button 
                onClick={handleAddCourse}
                style={{
                  background:C.green,color:"white",border:"none",borderRadius:6,
                  padding:"6px 12px",fontSize:11,cursor:"pointer",fontWeight:600
                }}>
                + Add Course
              </button>
              <button 
                onClick={handleExport}
                style={{
                  background:C.blue,color:"white",border:"none",borderRadius:6,
                  padding:"6px 12px",fontSize:11,cursor:"pointer",fontWeight:600
                }}>
                Export
              </button>
            </div>
          </div>
          
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead>
                <tr style={{background:"#f5f5f5"}}>
                  <th style={{padding:"8px",textAlign:"left",color:"#555",fontWeight:600}}>Code</th>
                  <th style={{padding:"8px",textAlign:"left",color:"#555",fontWeight:600}}>Name</th>
                  <th style={{padding:"8px",textAlign:"left",color:"#555",fontWeight:600}}>Lecturer</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Students</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Credits</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Sessions</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Status</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr key={index}>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",color:"#333",fontWeight:500}}>{course.code}</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",color:"#333"}}>{course.name}</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",color:"#666"}}>
                      {course.lecturerFirstName && course.lecturerLastName ? 
                        `${course.lecturerFirstName} ${course.lecturerLastName}` : 
                        course.lecturerUsername || 'N/A'}
                    </td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>{course.studentCount || 0}</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>{course.credits || 0}</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>-</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                      <Badge color={getStatusColor(course.isActive ? 'active' : 'inactive')}>
                        {course.isActive ? 'active' : 'inactive'}
                      </Badge>
                    </td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                      <button 
                        onClick={() => handleEditCourse(course.id)}
                        style={{
                          background:C.orange,color:"white",border:"none",borderRadius:4,
                          padding:"2px 6px",fontSize:9,cursor:"pointer",marginRight:2
                        }}>
                        Edit
                      </button>
                      <button 
                        onClick={() => handleAssignCourse(course)}
                        style={{
                          background:C.purple,color:"white",border:"none",borderRadius:4,
                          padding:"2px 6px",fontSize:9,cursor:"pointer",marginRight:2
                        }}>
                        Assign
                      </button>
                      <button 
                        onClick={() => handleToggleCourseStatus(course.id, !course.isActive)}
                        style={{
                          background:C.blue,color:"white",border:"none",borderRadius:4,
                          padding:"2px 6px",fontSize:9,cursor:"pointer"
                        }}>
                        {course.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>

      <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(2,1fr)":w>=640?"1fr 1fr":"1fr",gap:16}}>
        <SectionCard title="Course Statistics" icon="📊" color={C.orange}>
          <div style={{padding:12}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[
                {label:"Avg Class Size",value:courses.length > 0 ? Math.round(courses.reduce((sum, c) => sum + (c.studentCount || 0), 0) / courses.length) : 0,icon:"👥"},
                {label:"Avg Credits",value:courses.length > 0 ? (courses.reduce((sum, c) => sum + (c.credits || 0), 0) / courses.length).toFixed(1) : 0,icon:"🎯"},
                {label:"Full Capacity",value:courses.filter(c => (c.studentCount || 0) >= 50).length,icon:"📈"},
                {label:"Low Enrollment",value:courses.filter(c => (c.studentCount || 0) < 20).length,icon:"⚠️"},
              ].map((stat, index) => (
                <div key={index} style={{
                  background:"#f9f9f9",borderRadius:6,padding:8,textAlign:"center"
                }}>
                  <div style={{fontSize:16,marginBottom:4}}>{stat.icon}</div>
                  <div style={{fontSize:14,fontWeight:700,color:"#333",marginBottom:2}}>{stat.value}</div>
                  <div style={{fontSize:9,color:"#666"}}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Quick Actions" icon="⚡" color={C.green}>
          <div style={{padding:12}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[
                {title:"Schedule Courses",description:"Set course schedule",icon:"📅"},
                {title:"Assign Lecturers",description:"Manage assignments",icon:"👨‍🏫"},
                {title:"Enrollment Reports",description:"View enrollment data",icon:"📊"},
                {title:"Course Catalog",description:"Update catalog",icon:"📚"},
              ].map((action, index) => (
                <div key={index} style={{
                  background:"white",border:"1px solid #e0e0e0",borderRadius:6,
                  padding:8,cursor:"pointer",transition:"all 0.2s",textAlign:"center"
                }}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                  <div style={{fontSize:16,marginBottom:4}}>{action.icon}</div>
                  <div style={{fontSize:10,fontWeight:600,color:"#333",marginBottom:2}}>{action.title}</div>
                  <div style={{fontSize:8,color:"#666"}}>{action.description}</div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Edit Course Modal */}
      {showEditModal && editingCourse && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{margin: '0 0 16px', fontSize: '20px', fontWeight: 'bold', color: '#333'}}>
              Edit Course
            </h3>
            
            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: '#555'}}>
                Course Code
              </label>
              <input
                type="text"
                value={editingCourse.code || ''}
                onChange={(e) => setEditingCourse({...editingCourse, code: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: '#555'}}>
                Course Name
              </label>
              <input
                type="text"
                value={editingCourse.name || ''}
                onChange={(e) => setEditingCourse({...editingCourse, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: '#555'}}>
                Credits
              </label>
              <input
                type="number"
                value={editingCourse.credits || 0}
                onChange={(e) => setEditingCourse({...editingCourse, credits: parseInt(e.target.value)})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: '#555'}}>
                Description
              </label>
              <textarea
                value={editingCourse.description || ''}
                onChange={(e) => setEditingCourse({...editingCourse, description: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  minHeight: '80px'
                }}
              />
            </div>

            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: '#555'}}>
                Status
              </label>
              <select
                value={editingCourse.isActive ? 'active' : 'inactive'}
                onChange={(e) => setEditingCourse({...editingCourse, isActive: e.target.value === 'active'})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
              <button
                onClick={handleCancelEdit}
                style={{
                  padding: '8px 16px',
                  background: '#f8f9fa',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCourse}
                style={{
                  padding: '8px 16px',
                  background: C.blue,
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{margin: '0 0 16px', fontSize: '20px', fontWeight: 'bold', color: '#333'}}>
              Add New Course
            </h3>
            
            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: '#555'}}>
                Course Code *
              </label>
              <input
                type="text"
                value={newCourse.code}
                onChange={(e) => setNewCourse({...newCourse, code: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: '#555'}}>
                Course Name *
              </label>
              <input
                type="text"
                value={newCourse.name}
                onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: '#555'}}>
                Credits
              </label>
              <input
                type="number"
                value={newCourse.credits}
                onChange={(e) => setNewCourse({...newCourse, credits: parseInt(e.target.value)})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: '#555'}}>
                Description
              </label>
              <textarea
                value={newCourse.description}
                onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  minHeight: '80px'
                }}
              />
            </div>

            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: '#555'}}>
                Status
              </label>
              <select
                value={newCourse.isActive ? 'active' : 'inactive'}
                onChange={(e) => setNewCourse({...newCourse, isActive: e.target.value === 'active'})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
              <button
                onClick={handleCancelAdd}
                style={{
                  padding: '8px 16px',
                  background: '#f8f9fa',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewCourse}
                style={{
                  padding: '8px 16px',
                  background: C.green,
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Create Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Course Modal */}
      {showAssignModal && selectedCourse && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{margin: '0 0 16px', fontSize: '20px', fontWeight: 'bold', color: '#333'}}>
              Assign Lecturer to Course
            </h3>
            
            <div style={{marginBottom: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px'}}>
              <div style={{fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '4px'}}>
                Course: {selectedCourse.code} - {selectedCourse.name}
              </div>
              <div style={{fontSize: '12px', color: '#666'}}>
                Credits: {selectedCourse.credits || 0} | Status: {selectedCourse.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>

            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: '#555'}}>
                Select Lecturer *
              </label>
              <select
                value={selectedLecturer}
                onChange={(e) => setSelectedLecturer(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">-- Select a Lecturer --</option>
                {lecturers.map(lecturer => (
                  <option key={lecturer.id} value={lecturer.id}>
                    {lecturer.profile_firstName && lecturer.profile_lastName ? 
                      `${lecturer.profile_firstName} ${lecturer.profile_lastName}` : 
                      lecturer.username
                    }
                  </option>
                ))}
              </select>
            </div>

            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: '#555'}}>
                Current Assignment
              </label>
              <div style={{
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: '#f8f9fa',
                fontSize: '14px',
                color: '#666'
              }}>
                {selectedCourse.lecturerFirstName && selectedCourse.lecturerLastName ? 
                  `${selectedCourse.lecturerFirstName} ${selectedCourse.lecturerLastName}` : 
                  selectedCourse.lecturerUsername || 
                  'No lecturer assigned'
                }
              </div>
            </div>

            <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
              <button
                onClick={handleCancelAssign}
                style={{
                  padding: '8px 16px',
                  background: '#f8f9fa',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAssignment}
                style={{
                  padding: '8px 16px',
                  background: C.purple,
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Assign Lecturer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
