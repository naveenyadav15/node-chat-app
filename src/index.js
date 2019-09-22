const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const Filter = require('bad-words');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const pathToDir = path.join(__dirname, '../public');



app.use(express.json());
app.use(express.static(pathToDir))


// app.get('', (req, res) => {
//     res.render('index')
// })

let mesg = 'Welcome!';
io.on('connection', (socket) => {
    console.log('New websocket connection!');

    socket.emit('message', mesg); // particular connection
    socket.broadcast.emit('message', "A New user connected!");

    socket.on('sendMessage', (mesg, callback) => {
        const filter = new Filter();
        if (filter.isProfane(mesg)) {
            return callback('Profanity is not allowed!');
        }
        io.emit('message', mesg); // to send everyone
        callback();
    })

    socket.on('sendLocation', (location, callback) => {
        io.emit('message', `https://google.com/maps?q=${location.lat},${location.long} `);
        callback();
    })

    socket.on('disconnect', () => {
        io.emit('message', 'User has been disconnectted!');
    })
})


server.listen(port, () => {
    console.log('Your app is listening on port', port);
});