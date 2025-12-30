const { createClient } = require('redis');
const logger = require('../utils/logger');

let redisClient = null;

const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    redisClient.on('error', err => {
      logger.error('❌ Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      logger.info('✅ Redis connected');
    });

    redisClient.on('reconnecting', () => {
      logger.warn('⚠️  Redis reconnecting...');
    });

    await redisClient.connect();

    return redisClient;
  } catch (error) {
    logger.error('❌ Redis connection failed:', error);
    // Don't exit - Redis is optional for basic functionality
    return null;
  }
};

const getRedisClient = () => {
  if (!redisClient) {
    logger.warn('⚠️  Redis client not initialized');
  }
  return redisClient;
};

module.exports = { connectRedis, getRedisClient };

