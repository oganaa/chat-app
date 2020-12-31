let socket = io();
socket.on('connect', () => {
    console.log('Connected to server')
});



socket.on('disconnect', function() {
    console.log('DisConnected from server')
})

socket.on('newMessage', (message) => {
    /*   
        console.log('newMessage', message);
        let li = document.createElement('li');

        document.querySelector('body').appendChild(li) */
    const formattedTime = moment(message.createdAt).format('LT');
    const template = document.querySelector('#message-template').innerHTML;
    const html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formattedTime
    });
    const div = document.createElement('div')
    div.innerHTML = html;
    document.querySelector('#messages').append(div);
});
socket.on('newLocationMessage', (message) => {
    const formattedTime = moment(message.createdAt).format('LT');
    const template = document.querySelector('#location-message-template').innerHTML;
    const html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });
    const div = document.createElement('div')
    div.innerHTML = html;
    document.querySelector('#messages').append(div);
    // console.log('newLocationMessage', message);
    // let li = document.createElement('li');
    // let a = document.createElement('a');
    // li.innerHTML = `${message.from}:${formattedTime}`;
    // a.setAttribute('target', '_blank')
    // a.setAttribute('href', message.url)
    // a.innerHTML = `  My current location`
    // li.appendChild(a)
    // document.querySelector('body').appendChild(li)
});
socket.emit("createMessage", {
    from: "ganaa",
    text: "hello message"
}, function(message) {
    console.log(message, "Server got it")
})

document.querySelector('#submit-btn').addEventListener('click', function(e) {
    e.preventDefault();
    socket.emit("createMessage", {
        from: "User",
        text: document.querySelector('input[name="message"]').value
    }, function() {})
})

document.querySelector("#send-location").addEventListener('click', function(e) {
    if (!navigator.geolocation) {
        return alert('demjihgui baina')
    }

    navigator.geolocation.getCurrentPosition(
        function(position) {
            socket.emit('createLocationMessage', {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            })
            console.log(position)
        },
        function() {
            alert('unable to fetch location')
        }
    );
})