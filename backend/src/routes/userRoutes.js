const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
  exportToCSV,
  updateUserStatus,
  getUserStats,
} = require('../controllers/userController');

// Stats route (must be before /:id routes)
router.get('/stats', getUserStats);

// Search route (must be before /:id routes)
router.get('/search', searchUsers);

// Export to CSV route (must be before /:id routes)
router.get('/export/csv', exportToCSV);

// CRUD routes
router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', upload.single('profileImage'), createUser);
router.put('/:id', upload.single('profileImage'), updateUser);
router.delete('/:id', deleteUser);

// Inline status update
router.patch('/:id/status', updateUserStatus);

module.exports = router;
