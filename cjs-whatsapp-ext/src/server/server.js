const http = require('http')
const express = require('express')
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app)

server.listen(55337, function () {
    console.log('Server running')
});

const wss = new WebSocket.Server({ server });

const getTime = () => new Date().toISOString().split("T")[1].split(".")[0];

wss.on('connection', function (ws) {
    console.log('new connection');

    ws.on('message', function (data) {
        console.log('New message: ' + data);
        setTimeout(() => {
            ws.send(`${getTime()} - Thanks for connecting client...`);
        }, 2 * 1000)
    })
});