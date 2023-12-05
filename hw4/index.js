const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const joi = require('joi');
const port = 3001;

let users = {};

app.use(express.json());

function loadUsersData() {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'data.json'), 'utf-8');
        return data ? JSON.parse(data) : {};
    } catch (error) {
        console.error('Ошибка загрузки данных о пользователях:', error);
    }
};

function saveUsersData() {
    try {
        fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(users, null, 2), 'utf-8');
    } catch (error) {
        console.error('Ошибка записи данных о пользователях:', error);
    }
}

app.get('/users', (req, res) => {
    users = loadUsersData();
    let usersCount;
    if (Array.isArray(users)) {
        usersCount = users.length;
    } else {
        usersCount = Object.keys(users).length;
    };
    res.send({ users, usersCount });
});

app.post('/users', (req, res) => {
    users = loadUsersData();
    // let usersCount;
    // if (Array.isArray(users)) {
    //     usersCount = users.length;
    // } else {
    //     usersCount = Object.keys(users).length;
    // };
    // const userID = usersCount + 1;
    // const newUser = {
    //     id: userID,
    //     ...req.body,
    // };

    const newUser = {
        id: users.length + 1,
        ...req.body,
    };

    users.push(newUser);

    saveUsersData(users);

    res.send({ users });
});

app.get('/users/:id', (req, res) => {
    users = loadUsersData();
    const user = users.find((user) => user.id === Number(req.params.id));

    if (user) {
        res.send({ user });
    } else {
        res.status(404);
        res.send({ users: null });
    };
});

app.put('/users/:id', (req, res) => {
    users = loadUsersData();
    const user = users.find((user) => user.id === Number(req.params.id));

    if (user) {
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.age = req.body.age;
        user.city = req.body.city;

        saveUsersData();
        res.send({ user });
    } else {
        res.status(404);
        res.send({ users: null });
    };
});

app.delete('/users/:id', (req, res) => {
    users = loadUsersData();
    const user = users.find((user) => user.id === Number(req.params.id));

    if (user) {
        const userIndex = users.indexOf(user);
        console.log(userIndex);
        users.splice(userIndex, 1);
        saveUsersData();
        res.send({ user });
    } else {
        res.status(404);
        res.send({ users: null });
    };
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});