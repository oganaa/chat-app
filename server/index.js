const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/../public');

const { createMessage, createLocationMessage } = require('./utils/message');

const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('a new user just connected')
    socket.emit("newMessage",
        createMessage("Admin", "Welcome to the chat app")
    );

    socket.broadcast.emit("newMessage", createMessage("Admin", "New User Join"));
    socket.on('createMessage', (message, callback) => {
        console.log("createMessage", message);
        io.emit("newMessage", createMessage(message.from, message.text));
        callback("This is the server")
    })
    socket.on('createLocationMessage', (coords) => {
        io.emit("newLocationMessage", createLocationMessage('User', coords.lat, coords.lng));
    })
    socket.on('disconnect', function() {
        console.log('user disconnected')
    });
});

server.listen(port, () => {
    console.log(`listening on ${port}`);
});