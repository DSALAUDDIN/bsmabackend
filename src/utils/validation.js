const { body } = require('express-validator');

const adminValidation = {
  register: {
    firstName: body('firstName')
      .trim()
      .notEmpty()
      .withMessage('First name is required'),
    lastName: body('lastName')
      .trim()
      .notEmpty()
      .withMessage('Last name is required'),
    username: body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required'),
    email: body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format'),
    password: body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    phoneNumber: body('phoneNumber')
      .trim()
      .notEmpty()
      .withMessage('Phone number is required'),
    role: body('role')
      .optional()
      .isIn(['admin', 'super_admin'])
      .withMessage('Invalid role')
  },
  login: {
    email: body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format'),
    password: body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
  }
};

const memberValidation = {
  create: [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('memberType').isIn(['regular', 'premium']).withMessage('Invalid member type')
  ]
};

const activityValidation = {
  create: [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('date').isISO8601().withMessage('Invalid date format'),
    body('type').isIn(['event', 'meeting', 'workshop']).withMessage('Invalid activity type')
  ]
};

const newsValidation = {
  create: [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('imageUrl').notEmpty().withMessage('Image URL is required'),
  ],
  update: [
    body('title').optional().notEmpty().withMessage('Title must not be empty if provided'),
    body('content').optional().notEmpty().withMessage('Content must not be empty if provided'),
    body('imageUrl').optional().notEmpty().withMessage('Image URL must not be empty if provided'),
  ]
};

const noticeValidation = {
  create: [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('priority').isIn(['low', 'medium', 'high']).withMessage('Invalid priority level')
  ]
};

module.exports = {
  adminValidation,
  memberValidation,
  activityValidation,
  newsValidation,
  noticeValidation
};
