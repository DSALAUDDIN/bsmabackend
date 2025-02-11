const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: '30d',
  });
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

const formatResponse = (success, data, message = '') => {
  return {
    success,
    data,
    message
  };
};

module.exports = {
  generateToken,
  hashPassword,
  comparePassword,
  formatResponse
};
// function isValidObjectId(id) {
//   return mongoose.Types.ObjectId.isValid(id);
// }
//
// module.exports = { isValidObjectId };