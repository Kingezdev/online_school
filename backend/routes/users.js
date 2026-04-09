const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// All user routes require admin authentication
router.use(auth, authorize('admin'));

// GET /api/users - Get all users (lecturers and admins only)
router.get('/', getUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', getUserById);

// POST /api/users - Create new user (lecturer or admin)
router.post('/', createUser);

// PUT /api/users/:id - Update user
router.put('/:id', updateUser);

// DELETE /api/users/:id - Delete user (soft delete)
router.delete('/:id', deleteUser);

module.exports = router;
