const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');

const logger = require('./shared/utils/logger');
const errorHandler = require('./shared/middleware/errorHandler');
const notFound = require('./shared/middleware/notFound');

const app = express();

// Trust proxy (for rate limiting behind load balancer)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later',
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// API routes
app.use('/api/v1/auth', require('./modules/auth/routes/auth.routes'));
app.use('/api/v1/pets', require('./modules/pets/routes/pet.routes'));
app.use('/api/v1/businesses', require('./modules/businesses/routes/business.routes'));
app.use('/api/v1/users', require('./modules/users/routes/user.routes'));

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: '🐾 Welcome to WalkyDoggy API',
    version: '1.0.0',
    documentation: '/api-docs',
  });
});

// 404 handler
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;

