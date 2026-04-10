import { useState, useEffect } from 'react';
import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';
import { SectionCard, Badge } from '../components/shared/SectionCard.jsx';
import { usersAPI } from '../utils/api.js';

export function AdminUsersPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'student',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await usersAPI.getUsers();
        
        if (response.success) {
          setUsers(response.users || []);
        } else {
          setError(response.message || 'Failed to fetch users');
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div style={{padding: isLg ? "24px 32px" : 16}}>
        <div style={{textAlign: "center", padding: "50px"}}>
          <div style={{fontSize: "18px", color: "#666"}}>Loading users...</div>
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

  const getRoleColor = (role) => {
    return role === "lecturer" ? C.blue : C.green;
  };

  const getStatusColor = (status) => {
    return status === "active" ? C.green : C.red;
  };

  const handleEditUser = async (userId) => {
    try {
      const response = await usersAPI.getUserById(userId);
      if (response.success) {
        setEditingUser(response.user);
        setShowEditModal(true);
      } else {
        alert('Failed to load user data: ' + response.message);
      }
    } catch (error) {
      alert('Error loading user data: ' + error.message);
    }
  };

  const handleToggleUserStatus = async (userId, isActive) => {
    try {
      const response = await usersAPI.updateUser(userId, { isActive });
      if (response.success) {
        // Refresh users list
        window.location.reload();
      } else {
        alert('Failed to update user status: ' + response.message);
      }
    } catch (error) {
      alert('Error updating user status: ' + error.message);
    }
  };

  const handleSaveUser = async () => {
    try {
      const response = await usersAPI.updateUser(editingUser.id, editingUser);
      if (response.success) {
        setShowEditModal(false);
        setEditingUser(null);
        // Refresh users list
        window.location.reload();
      } else {
        alert('Failed to update user: ' + response.message);
      }
    } catch (error) {
      alert('Error updating user: ' + error.message);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingUser(null);
  };

  const handleAddUser = () => {
    setShowAddModal(true);
  };

  const handleSaveNewUser = async () => {
    if (newUser.password !== newUser.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (newUser.password.length < 6) {
      alert('Password must be at least 6 characters!');
      return;
    }

    try {
      const response = await usersAPI.createUser({
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        password: newUser.password
      });

      if (response.success) {
        setShowAddModal(false);
        setNewUser({
          username: '',
          email: '',
          firstName: '',
          lastName: '',
          role: 'student',
          password: '',
          confirmPassword: ''
        });
        // Refresh users list
        window.location.reload();
      } else {
        alert('Failed to create user: ' + response.message);
      }
    } catch (error) {
      alert('Error creating user: ' + error.message);
    }
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setNewUser({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      role: 'student',
      password: '',
      confirmPassword: ''
    });
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ['ID', 'Username', 'Email', 'First Name', 'Last Name', 'Role', 'Status', 'Last Login'];
    const csvContent = [
      headers.join(','),
      ...users.map(user => [
        user.id,
        user.username,
        user.email,
        user.firstName || '',
        user.lastName || '',
        user.role,
        user.isActive ? 'Active' : 'Inactive',
        user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'
      ].join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{padding:isLg?"24px 32px":16}}>
      <h2 style={{margin:"0 0 16px",fontSize:isLg?20:15,color:"#333",fontWeight:700}}>User Management</h2>
      
      <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(4,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:16,marginBottom:16}}>
        {[
          {label:"Total Users",value:users.length,icon:"",color:C.blue},
          {label:"Lecturers",value:users.filter(u => u.role === 'lecturer').length,icon:"",color:C.green},
          {label:"Administrators",value:users.filter(u => u.role === 'admin').length,icon:"",color:C.purple},
          {label:"Active",value:users.filter(u => u.isActive).length,icon:"",color:C.green},
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

      <SectionCard title="User Directory" icon="👥" color={C.blue}>
        <div style={{padding:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <h3 style={{margin:0,fontSize:14,fontWeight:600,color:"#333"}}>All Users</h3>
            <div style={{display:"flex",gap:8}}>
              <button 
                onClick={handleAddUser}
                style={{
                  background:C.green,color:"white",border:"none",borderRadius:6,
                  padding:"6px 12px",fontSize:11,cursor:"pointer",fontWeight:600
                }}>
                + Add User
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
                  <th style={{padding:"8px",textAlign:"left",color:"#555",fontWeight:600}}>ID</th>
                  <th style={{padding:"8px",textAlign:"left",color:"#555",fontWeight:600}}>Name</th>
                  <th style={{padding:"8px",textAlign:"left",color:"#555",fontWeight:600}}>Email</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Role</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Status</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Courses</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Last Login</th>
                  <th style={{padding:"8px",textAlign:"center",color:"#555",fontWeight:600}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",color:"#333"}}>{user.id}</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",color:"#333",fontWeight:500}}>
                      {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
                    </td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",color:"#666"}}>{user.email}</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                      <Badge color={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                      <Badge color={getStatusColor(user.isActive ? 'active' : 'inactive')}>
                        {user.isActive ? 'active' : 'inactive'}
                      </Badge>
                    </td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>-</td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td style={{padding:"8px",borderTop:"1px solid #eee",textAlign:"center"}}>
                      <button 
                        onClick={() => handleEditUser(user.id)}
                        style={{
                          background:C.orange,color:"white",border:"none",borderRadius:4,
                          padding:"2px 6px",fontSize:9,cursor:"pointer",marginRight:2
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleToggleUserStatus(user.id, !user.isActive)}
                        style={{
                          background:C.red,color:"white",border:"none",borderRadius:4,
                          padding:"2px 6px",fontSize:9,cursor:"pointer"
                        }}
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
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
        <SectionCard title="User Statistics" icon="📊" color={C.orange}>
          <div style={{padding:12}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[
                {label:"New Users (This Month)",value:users.filter(u => {
                  const createdDate = new Date(u.createdAt);
                  const oneMonthAgo = new Date();
                  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                  return createdDate >= oneMonthAgo;
                }).length,icon:"📈"},
                {label:"Inactive Users",value:users.filter(u => !u.isActive).length,icon:"⚠️"},
                {label:"Avg Login Frequency",value:"N/A",icon:"�"},
                {label:"Course Enrollment",value:"N/A",icon:"📚"},
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
                {title:"Bulk Import",description:"Import multiple users",icon:"📥"},
                {title:"Send Notifications",description:"Email all users",icon:"📧"},
                {title:"Reset Passwords",description:"Bulk password reset",icon:"🔐"},
                {title:"User Reports",description:"Generate reports",icon:"📊"},
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

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
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
              Edit User
            </h3>
            
            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: '#555'}}>
                Username
              </label>
              <input
                type="text"
                value={editingUser.username || ''}
                onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
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
                Email
              </label>
              <input
                type="email"
                value={editingUser.email || ''}
                onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
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
                First Name
              </label>
              <input
                type="text"
                value={editingUser.firstName || ''}
                onChange={(e) => setEditingUser({...editingUser, firstName: e.target.value})}
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
                Last Name
              </label>
              <input
                type="text"
                value={editingUser.lastName || ''}
                onChange={(e) => setEditingUser({...editingUser, lastName: e.target.value})}
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
                Role
              </label>
              <select
                value={editingUser.role || ''}
                onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: '#555'}}>
                Status
              </label>
              <select
                value={editingUser.isActive ? 'active' : 'inactive'}
                onChange={(e) => setEditingUser({...editingUser, isActive: e.target.value === 'active'})}
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
                onClick={handleSaveUser}
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

      {/* Add User Modal */}
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
              Add New User
            </h3>
            
            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: '#555'}}>
                Username *
              </label>
              <input
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
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
                Email *
              </label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
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
                First Name *
              </label>
              <input
                type="text"
                value={newUser.firstName}
                onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
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
                Last Name *
              </label>
              <input
                type="text"
                value={newUser.lastName}
                onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
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
                Role *
              </label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: '#555'}}>
                Password *
              </label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
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
                Confirm Password *
              </label>
              <input
                type="password"
                value={newUser.confirmPassword}
                onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
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
                onClick={handleSaveNewUser}
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
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
