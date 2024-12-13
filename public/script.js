const API_URL = '/api';

// Регистрация пользователя
async function registerUser() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
        alert('Регистрация удалась! Авторизуйтесь.');
    } else {
        alert('Ошибка регистрации');
    }
}

// Авторизация пользователя
async function loginUser() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
        const { token, user } = await response.json();
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        loadDashboard(user);
    } else {
        alert('Ошибка авторизации');
    }
}

// Загрузка интерфейса
function loadDashboard(user) {
    document.getElementById('auth-section').style.display = 'none';
    if (user.role === 'admin') {
        document.getElementById('admin-section').style.display = 'block';
        loadUsers();
    } else {
        document.getElementById('user-section').style.display = 'block';
        document.getElementById('user-name').innerText = user.username;
        loadTasks();
    }
}

// Выход из системы
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    location.reload();
}

// Загрузка задач пользователя
async function loadTasks() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')); // Получаем текущего пользователя
    const response = await fetch(`${API_URL}/tasks`, {
        headers: { Authorization: token },
    });

    const tasks = await response.json();
    const tasksContainer = document.getElementById('tasks');
    tasksContainer.innerHTML = '';

    tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.innerHTML = `
            <strong>${task.title}</strong>
            <p>${task.description}</p>
            <button onclick="deleteTask(${task.id})">Удалить</button>
            <button onclick="editTask(${task.id})">Изменить</button> <!-- Добавлена кнопка редактирования -->
        `;
        tasksContainer.appendChild(taskDiv);
    });
}

// Добавление задачи
async function addTask() {
    const token = localStorage.getItem('token');
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-desc').value;
    await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { Authorization: token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
    });
    loadTasks();
}

// Загрузка списка пользователей (только для админа)
async function loadUsers() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/users`, {
        headers: { Authorization: token },
    });
    const users = await response.json();
    const usersContainer = document.getElementById('users');
    usersContainer.innerHTML = '';
    users.forEach(user => {
        const div = document.createElement('div');
        div.innerHTML = `
            <strong>${user.username} (${user.role})</strong>
            <button onclick="deleteUser(${user.id})">Удалить</button>
            <button onclick="viewUserTasks(${user.id})">Посмотреть задачи</button> 
        `;
        usersContainer.appendChild(div);
    });
}

// Просмотр задач конкретного пользователя
async function viewUserTasks(userId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/tasks/user/${userId}`, { // Эндпоинт для задач пользователя
        headers: { Authorization: token },
    });

    if (response.ok) {
        const tasks = await response.json();
        displayUserTasks(tasks, userId); // Функция отображения задач
    } else {
        alert('Failed to load tasks');
    }
}

// Отображение задач пользователя (только просмотр и удаление)
function displayUserTasks(tasks, userId) {
    const usersContainer = document.getElementById('users');
    usersContainer.innerHTML = `<h3>Задачи пользователя с ID: ${userId}</h3>`;
    tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.innerHTML = `
            <strong>${task.title}</strong>
            <p>${task.description}</p>
            <button onclick="deleteUserTask(${task.id}, ${userId})">Удалить</button>
        `;
        usersContainer.appendChild(taskDiv);
    });

    const backButton = document.createElement('button');
    backButton.innerText = 'Назад';
    backButton.onclick = loadUsers;
    usersContainer.appendChild(backButton);
}


// Удаление пользователя (только для админа)
async function deleteUser(userId) {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: token },
    });
    loadUsers();
}

// Функция для отображения задач с кнопкой "Изменить"
async function displayTasks(tasks) {
    const tasksContainer = document.getElementById('tasks');
    tasksContainer.innerHTML = ''; // Clear the tasks container

    tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.innerHTML = `
            <p><strong>${task.title}</strong></p>
            <p>${task.description}</p>
            <button onclick="modifyTask(${task.id})">Изменить</button>
        `;
        tasksContainer.appendChild(taskDiv);
    });
}

// Удаление задачи
async function deleteTask(taskId) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: { Authorization: token },
        });
        if (response.ok) {
            alert('Задача успешно удалена!');
            loadTasks(); // Обновляем список задач после удаления
        } else {
            alert('Ошибка удаления задачи');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}


// Удаление задачи пользователя
async function deleteUserTask(taskId, userId) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: { Authorization: token },
        });
        if (response.ok) {
            alert('Задача успешно удалена!');
            viewUserTasks(userId); // Обновление списка задач пользователя
        } else {
            alert('Ошибка удаления задачи');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Редактирование задачи
async function editTask(taskId) {
    const title = prompt('Введите название:');
    const description = prompt('Введите описание задачи:');
    const token = localStorage.getItem('token');

    if (!title && !description) {
        alert('No changes made.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
            body: JSON.stringify({ title, description }),
        });

        if (response.ok) {
            alert('Задача успешно обновлена!');
            loadTasks(); // Обновление списка задач
        } else {
            const errorData = await response.json();
            alert(`Ошибка обновления задачи: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error updating task:', error);
        alert('Error updating task.');
    }
}


// Функция для загрузки задач с сервера
async function fetchTasks() {
    try {
        const response = await fetch('/tasks', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const tasks = await response.json();
            renderTasks(tasks); // Вызываем рендер задач
        } else {
            console.error('Failed to fetch tasks');
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// Вызываем fetchTasks, чтобы загрузить задачи при загрузке страницы
fetchTasks();

