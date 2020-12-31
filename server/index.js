const path = require('path');
const express = require('express');
const publicPath = path.join(__dirname, '/../public');
var app = express();
app.use(express.static(publicPath));
// var http = require('http').createServer(app);
// var io = require('socket.io')(http);

const port = 3000;
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });

// const getVisitors = () => {
//     let clients = io.sockets.clients().connected;
//     let sockets = Object.values(clients);
//     let users = sockets.map(s => s.user)
//     return users;
// }
// const emitVisitors = () => {
//     io.emit("visitors", getVisitors());
// }

// io.on('connection', (socket) => {
//     console.log('a user connected')

//     socket.on("new visitor", (user) => {
//         console.log("shine hereglegch ", user);
//         socket.user = user;
//         emitVisitors();
//     })
//     socket.on('disconnect', function() {
//         console.log('user disconnected')
//     });
// });

app.listen(port, () => {
    console.log(`listening on ${port}`);
});