const express = require('express');
const sequelize = require('./config');
const userRoutes = require('./routers/userRoutes');
const taskRoutes = require('./routers/taskRoutes');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Маршруты
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Запуск сервера
const PORT = 3000;
sequelize.sync({ alter: true }).then(() => {
    console.log('Database connected');
    app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
});
