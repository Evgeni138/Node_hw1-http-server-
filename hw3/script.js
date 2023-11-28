const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

let pageViews = {};

function loadPageViews() {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'pageViews.json'), 'utf8');
        pageViews = JSON.parse(data);
    } catch (err) {
        console.error('Ошибка загрузки данных о просмотрах:', err);
    }
}

function savePageViews() {
    try {
        fs.writeFileSync(path.join(__dirname, 'pageViews.json'), JSON.stringify(pageViews, null, 2), 'utf8');
    } catch (err) {
        console.error('Ошибка сохранения данных о просмотрах:', err);
    }
}

// Middleware для обновления счетчика просмотров
function updatePageViews(req, res, next) {
    const { url } = req;
    if (url === '/' || url === '/index.html') {
        if (!pageViews['/index.html']) {
            pageViews['/index.html'] = 0;
        }
        pageViews['/index.html']++;
        savePageViews();
    } else if (url === '/about.html') {
        if (!pageViews['/about.html']) {
            pageViews['/about.html'] = 0;
        }
        pageViews['/about.html']++;
        savePageViews();
    }
    next();
}

// Middleware
app.use(updatePageViews);

app.use(express.static('./static'));

app.get('/', (req, res) => {
    pageViews['/index.html']++;
    savePageViews();
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

app.get('/index.html', (req, res) => {
    pageViews['/index.html']++;
    savePageViews();
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

app.get('/about.html', (req, res) => {
    pageViews['/about.html']++;
    savePageViews();
    res.sendFile(path.join(__dirname, 'static', 'about.html'));
});

// Маршрут для получения данных о просмотрах
app.get('/pageViewsData', (req, res) => {
    res.json(pageViews);
});

// Асинхронный запуск сервера и загрузка данных о просмотрах
app.listen(port, () => {
    loadPageViews();
    console.log(`Сервер запущен на порту ${port}`);
});

// Обработка завершения работы сервера для сохранения данных о просмотрах
process.on('SIGINT', () => {
    savePageViews();
    process.exit();
});
