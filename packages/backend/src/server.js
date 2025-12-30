require('dotenv').config();
const app = require('./app');
const logger = require('./shared/utils/logger');
const connectDatabase = require('./shared/config/database');
const { connectRedis } = require('./shared/config/redis');
const killPort = require('../scripts/kill-port');

const PORT = process.env.PORT || 3000;

// Start server
const startServer = async () => {
  // Kill any process using the port before starting (only in development)
  if (process.env.NODE_ENV === 'development') {
    logger.info(`🔍 Checking port ${PORT}...`);
    await killPort(PORT);
    // Give it a moment to fully release
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Connect to Redis (optional)
    try {
      await connectRedis();
    } catch (error) {
      logger.warn('⚠️  Starting without Redis');
    }

    // Start Express server with error handling for port conflicts
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📍 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🌐 API URL: http://localhost:${PORT}`);
      logger.info(`💚 Health check: http://localhost:${PORT}/health`);
    });

    // Handle port already in use error (fallback)
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`❌ Port ${PORT} is still in use after cleanup attempt.`);
        logger.info('💡 Try manually: netstat -ano | findstr :3000  then: taskkill /PID <PID> /F');
        process.exit(1);
      } else {
        logger.error('❌ Server error:', error);
        process.exit(1);
      }
    });

    // Graceful shutdown
    const gracefulShutdown = () => {
      logger.info('Received shutdown signal, closing server gracefully...');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

