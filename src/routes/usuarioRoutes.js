const express = require('express');
const router = express.Router();
const usuarioController = require('./../controllers/usuariocontroller');
const authMiddleware = require('./../middleware/auth');

router.post('/register', usuarioController.createUser);
router.post('/login', usuarioController.login);
router.post('/logout', authMiddleware, usuarioController.logout);
router.get('/profile', authMiddleware, usuarioController.getProfile);

module.exports = router;