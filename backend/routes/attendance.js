const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getAttendance,
  markAttendance,
  updateAttendance,
  deleteAttendance,
  getStudentAttendance,
  activateQRCode,
  getActiveQRCodes,
  markAttendanceViaQR,
  deactivateQRCode
} = require('../controllers/attendanceController');

// All routes require authentication
router.use(auth);

// QR Attendance routes (must come before /:courseId routes)
router.post('/activate-qr', authorize('lecturer'), activateQRCode);
router.post('/deactivate-qr', authorize('lecturer'), deactivateQRCode);
router.get('/active-qr', authorize('student'), getActiveQRCodes);
router.post('/mark-qr', authorize('student'), markAttendanceViaQR);

// Student routes
router.get('/student/:courseId', authorize('student'), getStudentAttendance);

// Lecturer and Admin routes
router.get('/:courseId', authorize('lecturer', 'admin'), getAttendance);
router.post('/:courseId', authorize('lecturer'), markAttendance);
router.put('/:id', authorize('lecturer'), updateAttendance);
router.delete('/:id', authorize('lecturer', 'admin'), deleteAttendance);

module.exports = router;
