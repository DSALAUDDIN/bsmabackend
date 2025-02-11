const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const { formatResponse } = require('../utils/helpers');

exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json(formatResponse(false, null, 'No authentication token, access denied'));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get admin from token
    const admin = await Admin.findById(decoded.id).select('-password');
    
    if (!admin) {
      return res.status(401).json(formatResponse(false, null, 'Token is invalid'));
    }

    // Add admin to request
    req.user = admin;
    next();
  } catch (error) {
    res.status(401).json(formatResponse(false, null, 'Token is invalid'));
  }
};

exports.authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json(
        formatResponse(false, null, `User role ${req.user.role} is not authorized to access this route`)
      );
    }
    next();
  };
};
