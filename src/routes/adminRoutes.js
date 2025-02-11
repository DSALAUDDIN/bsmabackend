const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/auth');

// Public routes
router.post('/register', adminController.register);
router.post('/login', adminController.login);

// Protected routes
router.use(authenticate);

// Admin routes (Authenticated users)
router.post('/', adminController.createAdmin);  // Admin can create other admins (with role specified)
router.delete('/:id', adminController.deleteAdmin);  // Admin can delete a specific admin

router.get('/', adminController.getAllAdmins);  // Get all admins
router.get('/:id', adminController.getAdminById);  // Get specific admin by ID
router.put('/:id', adminController.updateAdmin);  // Admin can update a specific admin's info (including password)
router.post('/change-password', adminController.changePassword);  // Admin can change their own password

module.exports = router;
