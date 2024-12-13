const Task = require('../models/Task');

// Создание задачи
const createTask = async (req, res) => {
    const { title, description } = req.body;
    const task = await Task.create({ title, description, userId: req.user.id });
    res.status(201).json(task);
};

// Получение задач текущего пользователя
const getTasks = async (req, res) => {
    const tasks = await Task.findAll({ where: { userId: req.user.id } });
    res.json(tasks);
};

// Обновление задачи
const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    const task = await Task.findByPk(id);

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    // Проверяем, что пользователь имеет доступ к задаче
    if (task.userId !== req.user.id) {
        return res.status(403).json({ message: 'You are not authorized to edit this task' });
    }

    task.title = title || task.title;
    task.description = description || task.description;

    await task.save();
    res.json(task);
};


// Удаление задачи
const deleteTask = async (req, res) => {
    const { id } = req.params;
    await Task.destroy({ where: { id } });
    res.status(204).send();
};

// Получение задач пользователя (для админа)
const getUserTasks = async (req, res) => {
    const { userId } = req.params;
    try {
        const tasks = await Task.findAll({ where: { userId } });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tasks' });
    }
};


module.exports = { createTask, getTasks, updateTask, deleteTask, getUserTasks };
