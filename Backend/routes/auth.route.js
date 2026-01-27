const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.post('/login', authController.login);

router.post('/register', authController.register);

router.post('/refresh-token', authController.refreshToken);

router.get('/profile', authenticateToken, authController.getProfile);

router.post('/change-password', authenticateToken, authController.changePassword);

router.post('/logout', authenticateToken, authController.logout);

module.exports = router;
