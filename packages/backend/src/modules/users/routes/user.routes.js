const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const userValidator = require('../validators/user.validator');
const { protect } = require('../../../shared/middleware/auth.middleware');

// Public routes
router.get('/:id', userController.getUserById);

// Protected routes - require authentication
router.use(protect);

// My profile routes
router.get('/me/profile', userController.getMyProfile);
router.put('/me/profile', userValidator.validateUpdateProfile, userController.updateMyProfile);

// Avatar
router.put('/me/avatar', userValidator.validateUpdateAvatar, userController.updateAvatar);

// Password
router.put('/me/password', userValidator.validateChangePassword, userController.changePassword);

// Phone
router.put('/me/phone', userValidator.validateUpdatePhone, userController.updatePhone);

// Address
router.put('/me/address', userValidator.validateUpdateAddress, userController.updateAddress);

// Delete account
router.delete('/me', userValidator.validateDeleteAccount, userController.deleteAccount);

module.exports = router;

