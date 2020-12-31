const moment = require('moment');
let createMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: moment().valueOf()
    }
}

let createLocationMessage = (from, lat, lng) => {
    return {
        from,
        url: `https://www.google.com/maps?q=${lat},${lng}`,
        createdAt: moment().valueOf()
    }
}
module.exports = { createMessage, createLocationMessage }