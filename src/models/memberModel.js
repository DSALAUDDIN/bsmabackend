const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  memberNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  designation: {
    type: String,
    required: true,
    trim: true,
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
  },
  nid: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  bin: {
    type: String,
    trim: true,
    required: false, // Optional field
  },
  tin: {
    type: String,
    trim: true,
    required: false, // Optional field
  },
  tradeLicenses: [{
    type: String,
    trim: true,
  }],
  photo: {
    type: String,
    required: false, // Optional field
  },
  memberType: {
    type: String,
    required: true,
    enum: ['Committee', 'Donor Member', 'Premium Member', 'Lifetime Member', 'General Member'],
    trim: true,
  },
  // Additional fields from the form that are missing in the schema
  specialization: {
    type: String,
    required: false,
    trim: true,
  },
  qualifications: [{
    degree: { type: String, trim: true },
    institution: { type: String, trim: true },
    year: { type: String, trim: true },
  }],
  socialMedia: {
    linkedin: { type: String, trim: true },
    twitter: { type: String, trim: true },
    facebook: { type: String, trim: true },
    instagram: { type: String, trim: true },
  },
  optional: {
    website: { type: String, trim: true },
    fax: { type: String, trim: true },
    alternatePhone: { type: String, trim: true },
  },
}, {
  timestamps: true,
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;