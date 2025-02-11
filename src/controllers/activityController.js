const ActivityService = require('../services/activityService');

class ActivityController {
  async createActivity(req, res) {
    try {
      const activityData = req.body;
      const activity = await ActivityService.createActivity(activityData);
      res.status(201).json({
        success: true,
        data: activity
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }

  async getAllActivities(req, res) {
    try {
      const activities = await ActivityService.getAllActivities(req.query);
      res.status(200).json({
        success: true,
        data: activities
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }

  async getActivityById(req, res) {
    try {
      const activity = await ActivityService.getActivityById(req.params.id);
      res.status(200).json({
        success: true,
        data: activity
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }

  async updateActivity(req, res) {
    try {
      const updatedActivity = await ActivityService.updateActivity(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: updatedActivity
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }

  async deleteActivity(req, res) {
    try {
      const message = await ActivityService.deleteActivity(req.params.id);
      res.status(200).json({
        success: true,
        message: message
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }
}

module.exports = new ActivityController();
