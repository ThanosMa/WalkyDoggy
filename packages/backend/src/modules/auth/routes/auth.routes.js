const express = require('express');
const authController = require('../controllers/auth.controller');
const authValidator = require('../validators/auth.validator');
const { protect } = require('../../../shared/middleware/auth.middleware');

const router = express.Router();

/**
 * Public routes
 */
router.post('/register', authValidator.validateRegister, authController.register);

router.post('/login', authValidator.validateLogin, authController.login);

router.post('/refresh-token', authValidator.validateRefreshToken, authController.refreshToken);

router.post('/verify-email', authValidator.validateVerifyEmail, authController.verifyEmail);

router.post('/forgot-password', authValidator.validateForgotPassword, authController.forgotPassword);

router.post('/reset-password', authValidator.validateResetPassword, authController.resetPassword);

/**
 * Protected routes (require authentication)
 */
router.post('/logout', protect, authController.logout);

router.get('/me', protect, authController.getCurrentUser);

router.post('/change-password', protect, authValidator.validateChangePassword, authController.changePassword);

router.post('/resend-verification', protect, authController.resendVerificationEmail);

module.exports = router;

