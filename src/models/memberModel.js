const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  memberNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  designation: {
    type: String,
    required: true,
    trim: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String
  },
  nid: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  bin: {
    type: String,
    trim: true,
    required: false // Optional field
  },
  tin: {
    type: String,
    trim: true,
    required: false // Optional field
  },
  tradeLicenses: [{
    type: String,
    trim: true
  }],
  photo: {
    type: String,
    required: false // Optional field
  }
}, {
  timestamps: true
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
