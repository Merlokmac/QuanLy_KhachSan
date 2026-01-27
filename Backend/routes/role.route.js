const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

router.get('/', authenticateToken, isAdmin, roleController.getAll);

router.get('/:id', authenticateToken, isAdmin, roleController.getById);

router.post('/', authenticateToken, isAdmin, roleController.create);

router.put('/:id', authenticateToken, isAdmin, roleController.update);

router.delete('/:id', authenticateToken, isAdmin, roleController.delete);

module.exports = router;