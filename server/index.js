var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(4000, function(){
    console.log("Listening to requests on port 4000");
});

app.use(express.static('public'));

var io = socket(server);

io.on('connection', function(socket){
    let id = socket.id
    console.log("Made connection with " + id);

    //JOINING FUNCTIONS
    socket.on('client-room', function(room, name) {
        if(io.sockets.adapter.rooms[room]){
            socket.join(room);
            console.log(socket.id + " has joined room " + room)
            socket.emit('inRoom');
            io.in(room).emit('new-user', {name, id: socket.id});
        } else {
            console.log(socket.id + " tried to join a room that doesn't exist!")
            socket.emit('falseCode');
        }
    });

    socket.on('server-room', function(room) {
        socket.join(room);
        console.log(socket.id + " has joined room " + room)
        io.emit("room-socket-info", io.sockets.adapter.rooms[room])
    });

    socket.on('search-for-app-id', (room) => {
        console.log("Searching for the server with roomCode" + room)
        io.in(room).emit("get-server-id", id)
    })

    socket.on('give-server-socket', (appId, phoneId) => {
        io.to(phoneId).emit("give-server-info", appId)
    })
    //END OF JOINING FUNCTIONS

    //ROOM FUNCTIONS, FROM HERE ON OUT USE io.to(serverid)
    socket.on('updateText', (serverId, text, id) => {
        io.to(serverId).emit('updateTextApp', {text, id})
    })
    //END OF ROOM FUNCTIONS

    //FOR DISCONNECTS, FIND A BETTER WAY TO DO THIS LATER
    socket.on('disconnect', function() {
        //Maybe fix this later
        io.emit('disconnection', {id})
    })
    //END OF DISCONNECTS
});