const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const { authenticate } = require('../middleware/auth');

// Base route: /api/notices

// Public routes
router.get('/', noticeController.getAllNotices);
router.get('/:id', noticeController.getNoticeById);

// Protected routes (Admin only)
router.use(authenticate);
router.post('/', noticeController.createNotice);
router.put('/:id', noticeController.updateNotice);
router.delete('/:id', noticeController.deleteNotice);

module.exports = router;
