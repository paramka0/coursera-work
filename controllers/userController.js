const User = require('../models/User');
const Task = require('../models/Task');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Регистрация пользователя
const register = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully', user });
};

// Авторизация пользователя
const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '1d' });
    res.json({ token, user });
};

// Получение списка пользователей (только админ)
const getUsers = async (req, res) => {
    const users = await User.findAll({ attributes: ['id', 'username', 'role'] });
    res.json(users);
};

// Удаление пользователя (только админ)
const deleteUser = async (req, res) => {
    const { id } = req.params;
    await Task.destroy({ where: { userId: id } });
    await User.destroy({ where: { id } });
    res.status(200).json({ message: 'User and associated tasks deleted' });
};

module.exports = { register, login, getUsers, deleteUser };
