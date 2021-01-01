let socket = io();

function scrollToBottom() {
    let messages = document.querySelector('#messages').lastElementChild;
    messages.scrollIntoView();
}
socket.on('connect', () => {
    let searchQuery = window.location.search.substring(1);
    let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g, '":"') + '"}');
    console.log('Connected to server')
    socket.emit('join', params, function(err) {
        if (err) {
            alert(err)
        } else {
            console.log('No error')
        }
    })
});

socket.on('updateUsersList', function(users) {
    console.log(users);
    let ol = document.createElement('ol');
    users.forEach(function(user) {
        let li = document.createElement('li')
        li.innerHTML = user;
        ol.appendChild(li);
    })
    let userList = document.querySelector('#users');
    userList.innerHTML = "";
    userList.appendChild(ol);

})


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
    scrollToBottom()
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
    scrollToBottom()
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