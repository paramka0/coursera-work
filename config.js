const { Sequelize } = require('sequelize');

// Настройки подключения к базе данных
const sequelize = new Sequelize('task_manager', 'user1', 'user1password', {
    host: 'localhost',
    dialect: 'postgres'
});

// Экспортируем объект sequelize для использования в других файлах
module.exports = sequelize;