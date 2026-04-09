const API_BASE_URL = 'http://localhost:5000/api';

// Store token in localStorage
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

// Store user data
const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));
const removeUser = () => localStorage.removeItem('user');

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    console.log('API Request:', {
      url: `${API_BASE_URL}${endpoint}`,
      config: config
    });
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.log('API Error response:', errorData);
      throw new Error(errorData.message || 'API request failed');
    }

    const data = await response.json();
    console.log('API Response data:', data);
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication APIs
export const authAPI = {
  login: async (username, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (data.success && data.token) {
      setToken(data.token);
      setUser(data.user);
    }
    
    return data;
  },

  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getProfile: async () => {
    return apiRequest('/auth/profile');
  },

  updateProfile: async (profileData) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  logout: () => {
    removeToken();
    removeUser();
  },

  isAuthenticated: () => {
    return !!getToken();
  },

  getCurrentUser: () => {
    return getUser();
  },
};

// Course APIs
export const courseAPI = {
  getAll: async () => {
    return apiRequest('/courses');
  },

  getById: async (id) => {
    return apiRequest(`/courses/${id}`);
  },

  create: async (courseData) => {
    return apiRequest('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  },

  update: async (id, courseData) => {
    return apiRequest(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/courses/${id}`, {
      method: 'DELETE',
    });
  },

  enroll: async (courseId) => {
    return apiRequest(`/courses/${courseId}/enroll`, {
      method: 'POST',
    });
  },

  unenroll: async (courseId) => {
    return apiRequest(`/courses/${courseId}/unenroll`, {
      method: 'POST',
    });
  },
};

// Assignment APIs
export const assignmentAPI = {
  getAll: async () => {
    return apiRequest('/assignments');
  },

  getById: async (id) => {
    return apiRequest(`/assignments/${id}`);
  },

  create: async (assignmentData) => {
    return apiRequest('/assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  },

  update: async (id, assignmentData) => {
    return apiRequest(`/assignments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(assignmentData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/assignments/${id}`, {
      method: 'DELETE',
    });
  },

  submit: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiRequest(`/assignments/${id}/submit`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  grade: async (id, gradeData) => {
    return apiRequest(`/assignments/${id}/grade`, {
      method: 'PUT',
      body: JSON.stringify(gradeData),
    });
  },
};

// Quiz APIs
export const quizAPI = {
  getAll: async () => {
    return apiRequest('/quizzes');
  },

  getById: async (id) => {
    return apiRequest(`/quizzes/${id}`);
  },

  create: async (quizData) => {
    return apiRequest('/quizzes', {
      method: 'POST',
      body: JSON.stringify(quizData),
    });
  },

  update: async (id, quizData) => {
    return apiRequest(`/quizzes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(quizData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/quizzes/${id}`, {
      method: 'DELETE',
    });
  },

  attempt: async (id, answers) => {
    return apiRequest(`/quizzes/${id}/attempt`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  },
};

// Forum APIs
export const forumAPI = {
  getAll: async () => {
    return apiRequest('/forums');
  },

  getById: async (id) => {
    return apiRequest(`/forums/${id}`);
  },

  create: async (forumData) => {
    return apiRequest('/forums', {
      method: 'POST',
      body: JSON.stringify(forumData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/forums/${id}`, {
      method: 'DELETE',
    });
  },

  createPost: async (forumId, content) => {
    return apiRequest(`/forums/${forumId}/posts`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  replyToPost: async (forumId, postId, content) => {
    return apiRequest(`/forums/${forumId}/posts/${postId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
};

// Attendance APIs
export const attendanceAPI = {
  getByCourse: async (courseId) => {
    return apiRequest(`/attendance/${courseId}`);
  },

  getStudentAttendance: async (courseId) => {
    return apiRequest(`/attendance/student/${courseId}`);
  },

  mark: async (courseId, attendanceData) => {
    return apiRequest(`/attendance/${courseId}`, {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    });
  },

  update: async (id, attendanceData) => {
    return apiRequest(`/attendance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(attendanceData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/attendance/${id}`, {
      method: 'DELETE',
    });
  },

  // QR Attendance APIs
  activateQRCode: async (courseId, date, sessionLabel) => {
    return apiRequest('/attendance/activate-qr', {
      method: 'POST',
      body: JSON.stringify({ courseId, date, sessionLabel }),
    });
  },

  deactivateQRCode: async (courseId, date) => {
    return apiRequest('/attendance/deactivate-qr', {
      method: 'POST',
      body: JSON.stringify({ courseId, date }),
    });
  },

  getActiveQRCodes: async () => {
    return apiRequest('/attendance/active-qr');
  },

  markAttendanceViaQR: async (qrData) => {
    return apiRequest('/attendance/mark-qr', {
      method: 'POST',
      body: JSON.stringify({ qrData }),
    });
  },
};

// Dashboard APIs
export const dashboardAPI = {
  getStudent: async () => {
    return apiRequest('/dashboard/student');
  },

  getLecturer: async () => {
    return apiRequest('/dashboard/lecturer');
  },

  getAdmin: async () => {
    return apiRequest('/dashboard/admin');
  },
};

// Books APIs
export const booksAPI = {
  getAll: async () => {
    return apiRequest('/books');
  },

  getById: async (id) => {
    return apiRequest(`/books/${id}`);
  },

  search: async (term) => {
    return apiRequest(`/books/search/${term}`);
  },

  getByGenre: async (genre) => {
    return apiRequest(`/books/genre/${genre}`);
  },

  getAvailable: async () => {
    return apiRequest('/books/available');
  },

  create: async (bookData) => {
    return apiRequest('/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
  },

  update: async (id, bookData) => {
    return apiRequest(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/books/${id}`, {
      method: 'DELETE',
    });
  },

  download: async (id) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/books/${id}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download book');
    }

    // Get the filename from the Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = 'book.txt';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Create blob and download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};

// Messages APIs
export const messagesAPI = {
  getAll: async (type = 'all') => {
    return apiRequest(`/messages?type=${type}`);
  },

  getById: async (id) => {
    return apiRequest(`/messages/${id}`);
  },

  send: async (messageData) => {
    return apiRequest('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  markAsRead: async (id) => {
    return apiRequest(`/messages/${id}/read`, {
      method: 'PUT',
    });
  },

  markAsUnread: async (id) => {
    return apiRequest(`/messages/${id}/unread`, {
      method: 'PUT',
    });
  },

  delete: async (id) => {
    return apiRequest(`/messages/${id}`, {
      method: 'DELETE',
    });
  },

  getUnreadCount: async () => {
    return apiRequest('/messages/unread/count');
  },

  sendSystemMessage: async (messageData) => {
    return apiRequest('/messages/system', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },
};

// Forums APIs
export const forumsAPI = {
  getAll: async () => {
    return apiRequest('/forums');
  },

  getById: async (id) => {
    return apiRequest(`/forums/${id}`);
  },

  create: async (forumData) => {
    return apiRequest('/forums', {
      method: 'POST',
      body: JSON.stringify(forumData),
    });
  },

  createPost: async (forumId, content) => {
    return apiRequest(`/forums/${forumId}/posts`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  replyToPost: async (forumId, postId, content) => {
    return apiRequest(`/forums/${forumId}/posts/${postId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  delete: async (id) => {
    return apiRequest(`/forums/${id}`, {
      method: 'DELETE',
    });
  },
};

// Enrollment APIs
export const enrollmentAPI = {
  getMyCourses: async () => {
    return apiRequest('/enrollments/my-courses');
  },
  getTeachingCourses: async () => {
    return apiRequest('/enrollments/teaching-courses');
  },
  getCourseStudents: async (courseId) => {
    return apiRequest(`/enrollments/course/${courseId}/students`);
  },
  getAvailableCourses: async () => {
    return apiRequest('/enrollments/available');
  },
  enrollInCourse: async (courseId) => {
    return apiRequest('/enrollments', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    });
  },
  unenrollFromCourse: async (courseId) => {
    return apiRequest(`/enrollments/${courseId}`, {
      method: 'DELETE',
    });
  },
  getEnrollmentStats: async () => {
    return apiRequest('/enrollments/stats');
  },
};

// Gradebook APIs
export const gradebookAPI = {
  getStudentGradebook: async () => {
    return apiRequest('/gradebook/student');
  },

  getStudentCourseGrades: async (courseId) => {
    return apiRequest(`/gradebook/student/${courseId}`);
  },

  getLecturerGradebook: async () => {
    return apiRequest('/gradebook/lecturer');
  },

  updateStudentGrade: async (gradeData) => {
    return apiRequest('/gradebook/update', {
      method: 'PUT',
      body: JSON.stringify(gradeData),
    });
  },
};

// Student Assignments APIs
export const studentAssignmentsAPI = {
  getStudentAssignments: async () => {
    console.log('Making API call to /assignments/student');
    const response = await apiRequest('/assignments/student');
    console.log('API call completed, response:', response);
    return response;
  },

  getStudentAssignment: async (assignmentId) => {
    return apiRequest(`/assignments/student/${assignmentId}`);
  },

  submitAssignment: async (assignmentId, text) => {
    return apiRequest(`/assignments/student/${assignmentId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  updateAssignmentSubmission: async (assignmentId, text) => {
    return apiRequest(`/assignments/student/${assignmentId}/update`, {
      method: 'PUT',
      body: JSON.stringify({ text }),
    });
  },

  getAssignmentSubmission: async (assignmentId) => {
    return apiRequest(`/assignments/student/${assignmentId}/submission`);
  },
};

// Student Studio APIs
export const studentStudioAPI = {
  getStudioResources: async () => {
    console.log('Making API call to /studio/student');
    const response = await apiRequest('/studio/student');
    console.log('API call completed, response:', response);
    return response;
  },

  getStudioResource: async (resourceId) => {
    return apiRequest(`/studio/student/${resourceId}`);
  },
};

// Student Extras APIs
export const studentExtrasAPI = {
  getStudentExtras: async () => {
    console.log('Making API call to /extras/student');
    const response = await apiRequest('/extras/student');
    console.log('API call completed, response:', response);
    return response;
  },
};

// Lecturer Extras APIs
export const lecturerExtrasAPI = {
  getLecturerExtras: async () => {
    console.log('Making API call to /extras/lecturer');
    const response = await apiRequest('/extras/lecturer');
    console.log('API call completed, response:', response);
    return response;
  },
};

// Users API (Admin only)
export const usersAPI = {
  getUsers: async (role = null, search = null) => {
    let url = '/users';
    const params = new URLSearchParams();
    
    if (role && role !== 'all') {
      params.append('role', role);
    }
    
    if (search) {
      params.append('search', search);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    console.log('Making API call to', url);
    const response = await apiRequest(url);
    console.log('API call completed, response:', response);
    return response;
  },

  getUserById: async (userId) => {
    return apiRequest(`/users/${userId}`);
  },

  createUser: async (userData) => {
    return apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  updateUser: async (userId, userData) => {
    return apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (userId) => {
    return apiRequest(`/users/${userId}`, {
      method: 'DELETE',
    });
  },
};

export { getToken, setToken, removeToken, getUser, setUser, removeUser };
