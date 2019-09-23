const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const Filter = require('bad-words');
const {
    generateMessage,
    generateLocationMessage
} = require('../src/utils/messages');

const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
} = require('../src/utils/users')

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


    socket.on('join', ({
        username,
        room
    }, callback) => {

        const {
            error,
            user
        } = addUser({
            id: socket.id,
            username,
            room
        })
        if (error) {
            return callback(error);
        }

        socket.join(user.room);
        socket.emit('message', generateMessage('Admin', mesg)); // particular connection
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`));

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })


        callback();

    })



    socket.on('sendMessage', (mesg, callback) => {

        const user = getUser(socket.id);
        if (user) {
            const filter = new Filter();
            if (filter.isProfane(mesg)) {
                return callback('Profanity is not allowed!');
            }
            io.to(user.room).emit('message', generateMessage(user.username, mesg)); // to send everyone
            callback();
        }
    })

    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${location.lat},${location.long}`));
        callback();
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})


server.listen(port, () => {
    console.log('Your app is listening on port', port);
});