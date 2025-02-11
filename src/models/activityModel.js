const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: false
  },
  location: {
    venue: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    }
  },
  activityType: {
    type: String,
    required: true,
    enum: ['workshop', 'conference', 'seminar', 'training', 'other']
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed'],
    default: 'upcoming'
  }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
