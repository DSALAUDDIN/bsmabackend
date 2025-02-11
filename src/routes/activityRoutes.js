const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { authenticate } = require('../middleware/auth');

// Base route: /api/activities

// Public routes
router.get('/', activityController.getAllActivities);
router.get('/:id', activityController.getActivityById);

// Protected routes
router.use(authenticate);

// Admin only routes
router.post('/', activityController.createActivity);
router.put('/:id', activityController.updateActivity);
router.delete('/:id', activityController.deleteActivity);

module.exports = router;
