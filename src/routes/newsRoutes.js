const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { authenticate } = require('../middleware/auth');

// Public Routes
router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);

// Protected Routes (Admin Only)
router.use(authenticate);
router.post('/', newsController.createNews);
router.put('/:id', newsController.updateNews);
router.delete('/:id', newsController.deleteNews);

module.exports = router;
