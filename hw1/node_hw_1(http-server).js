const http = require('http');

const count = {
    '/': 0,
    '/about': 0
}

const server = http.createServer((req, res) => {
    console.log('Request getted');

    if (req.url === '/') {
        count['/']++;
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=UTF-8',
        });
        res.end(`<a href="/about">Перейти на страницу About</a><br><p style="color: red;">Количество переходов = ${count['/']}</p>`)
    } else if (req.url === '/about') {
        count['/about']++;
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=UTF-8',
        });
        res.end(`<a href="/">Перейти на главную страницу</a><br><p style="color: red;">Количество переходов = ${count['/about']}</p>`)
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html; charset=UTF-8',
        });
        res.end('<h1>404</h1>')
    }
});

const port = 3000;

server.listen(port, () => {
    console.log(`Server started on the ${port} port `);
})