const Activity = require('../models/activityModel');

class ActivityService {
  async createActivity(activityData) {
    // Validate required fields
    const requiredFields = ['title', 'description', 'imageUrl', 'date', 'activityType'];
    const missingFields = requiredFields.filter(field => !activityData[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Set initial status based on date
    const activityDate = new Date(activityData.date);
    const currentDate = new Date();

    if (activityDate < currentDate) {
      activityData.status = 'completed';
    } else {
      activityData.status = 'upcoming';
    }

    return await Activity.create(activityData);
  }

  async getAllActivities(query = {}) {
    const { page = 1, limit = 10, activityType, status, startDate, endDate, sortBy = 'date', sortOrder = 'asc' } = query;

    const filter = {};

    if (activityType) filter.activityType = activityType;
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const activities = await Activity.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions);

    const count = await Activity.countDocuments(filter);

    return {
      activities,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalActivities: count
    };
  }

  async getActivityById(id) {
    const activity = await Activity.findById(id);

    if (!activity) {
      throw new Error('Activity not found');
    }
    return activity;
  }

  async updateActivity(id, updateData) {
    // Update status based on date if date is being updated
    if (updateData.date) {
      const activityDate = new Date(updateData.date);
      const currentDate = new Date();
      updateData.status = activityDate < currentDate ? 'completed' : 'upcoming';
    }

    const activity = await Activity.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!activity) {
      throw new Error('Activity not found');
    }

    return activity;
  }

  async deleteActivity(id) {
    const activity = await Activity.findByIdAndDelete(id);
    if (!activity) {
      throw new Error('Activity not found');
    }
    return { message: 'Activity deleted successfully' };
  }
}

module.exports = new ActivityService();
