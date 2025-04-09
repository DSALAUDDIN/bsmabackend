const express = require('express');
const memberController = require('../controllers/memberController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// ✅ Public routes
router.get('/search', memberController.searchMembers);
router.get('/', memberController.getAllMembers);           // 👈 Public: all members
router.get('/:id', memberController.getMemberById);        // 👈 Public: single member

// 🔒 Protected routes
router.use(protect);

// ✅ Authenticated CRUD
router.post('/', memberController.createMember);
router.put('/:id', memberController.updateMember);
router.delete('/:id', memberController.deleteMember);

module.exports = router;
