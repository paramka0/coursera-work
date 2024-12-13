const express = require('express');
const { register, login, getUsers, deleteUser } = require('../controllers/userController');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', authenticate, isAdmin, getUsers);
router.delete('/:id', authenticate, isAdmin, deleteUser);

module.exports = router;
