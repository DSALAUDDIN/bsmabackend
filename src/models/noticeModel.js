const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  noticeDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: false
  },
  category: {
    type: String,
    enum: ['general', 'urgent', 'announcement'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['active', 'expired'],
    default: 'active'
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
