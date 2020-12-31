let socket = io();
socket.on('connect', () => {
    console.log('Connected to server')
});

// socket.emit("createMessage", {
//     from: "ganaa",
//     text: "hello message"
// })

socket.on('disconnect', function() {
    console.log('DisConnected from server')
})

socket.on('newMessage', (message) => {
    console.log('newMessage', message);
})