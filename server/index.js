const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('a new user just connected')

    socket.emit("newMessage", {
        from: "Admin",
        text: "Welcome to the chat app",
        createdAt: new Date().getTime()
    });

    socket.broadcast.emit("newMessage", {
        from: "Admin",
        text: "New user Joined",
        createdAt: new Date().getTime()
    });
    socket.on('createMessage', (message) => {
        console.log("createMessage", message);
        io.emit("newMessage", {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
        // socket.broadcast.emit("newMessage", {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    })

    socket.on('disconnect', function() {
        console.log('user disconnected')
    });
});


// const getVisitors = () => {
//     let clients = io.sockets.clients().connected;
//     let sockets = Object.values(clients);
//     let users = sockets.map(s => s.user)
//     return users;
// }
// const emitVisitors = () => {
//     io.emit("visitors", getVisitors());
// }



server.listen(port, () => {
    console.log(`listening on ${port}`);
});