const express = require('express');
const { createTask, getTasks, updateTask, deleteTask, getUserTasks } = require('../controllers/taskController');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/', authenticate, createTask);
router.get('/', authenticate, getTasks);
router.put('/:id', authenticate, updateTask);
router.delete('/:id', authenticate, deleteTask);

router.get('/user/:userId', authenticate, isAdmin, getUserTasks);
router.put('/tasks/:id', authenticate, taskController.updateTask);
router.get('/user/:userId', authenticate, getUserTasks);

module.exports = router;
