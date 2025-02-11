const express = require('express');
const memberController = require('../controllers/memberController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// Public routes
router.get('/search', memberController.searchMembers);

// Protected routes (require authentication middleware)
router.use(protect);

// CRUD operations
router.route('/')
  .post(memberController.createMember)
  .get(memberController.getAllMembers);

router.route('/:id')
  .get(memberController.getMemberById)
  .put(memberController.updateMember)
  .delete(memberController.deleteMember);

module.exports = router;
