const mongoose = require('mongoose');
const config = require('./config');
const logger = require('../logs/logger');

const connectDB = async () => {
  try {
    const options = {
      dbName: config.mongoDBName,
      useNewUrlParser: true,
      useUnifiedTopology: true
    };

    await mongoose.connect(config.mongoURI, options);
    logger.info('MongoDB Connected Successfully');
  } catch (error) {
    logger.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
