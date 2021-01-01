const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/../public');

const { createMessage, createLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/isRealString');
const { Users } = require('./utils/users');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('a new user just connected')
    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            callback('Name and room are required');
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUsersList', users.getUserList(params.room))
        socket.emit("newMessage",
            createMessage("Admin", "Welcome to the chat app")
        );

        socket.broadcast.to(params.room).emit("newMessage", createMessage("Admin", "New User Join"));
        callback();
    })

    socket.on('createMessage', (message, callback) => {
        let user = users.getUser(socket.id);
        console.log("createMessage", message);
        if (user && isRealString(message.text)) {
            io.to(user.room).emit("newMessage", createMessage(user.name, message.text));
        }
        callback("This is the server")
    })
    socket.on('createLocationMessage', (coords) => {
        let user = users.getUser(socket.id)
        if (user) {
            io.to(user.room).emit("newLocationMessage", createLocationMessage(user.name, coords.lat, coords.lng));
        }

    })
    socket.on('disconnect', function() {
        let user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUsersList', users.getUserList(user.room))
            io.to(user.room).emit('newMessage', createMessage('Admin', `${user.name} tei hereglegch ${user.room} ees garlaa`))
        }
    });
});

server.listen(port, () => {
    console.log(`listening on ${port}`);
});