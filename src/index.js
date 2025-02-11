require('dotenv').config();
const app = require('./app');
const config = require('./config/config');
const connectDB = require('./config/db');
const logger = require('./logs/logger');

const PORT = process.env.PORT || 5000;

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    const server = app.listen(PORT, () => {
      logger.info(`
        Server is running!
        Listening on port ${PORT}
        Environment: ${process.env.NODE_ENV}
        Database: ${process.env.MONGODB_DB}
      `);
    });

    // Handle unhandled rejections
    process.on('unhandledRejection', (err) => {
      logger.error('UNHANDLED REJECTION! Shutting down...');
      logger.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
