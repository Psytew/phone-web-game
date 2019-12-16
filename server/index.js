var express = require('express');
var socket = require('socket.io');

var app = express();
// var server = app.listen(4009, function(){
//     console.log("Listening to requests on port 4009");
// });
var server = app.listen(4009, function(){
    console.log("Listening to requests on port 4009");
});

app.use(express.static('public'));

var io = socket(server);

io.on('connection', function(socket){
    let id = socket.id
    console.log("Made connection with " + id);

    //JOINING FUNCTIONS
    socket.on('client-room', function(room, name) {
        if(io.sockets.adapter.rooms[room] && io.sockets.adapter.rooms[room].length < 9){
            console.log(io.sockets.adapter.rooms[room].length)
            socket.join(room);
            console.log(socket.id + " has joined room " + room)
            socket.emit('inRoom');
            io.in(room).emit('new-user', {name, id: socket.id});
        } else if (io.sockets.adapter.rooms[room] && io.sockets.adapter.rooms[room].length >= 9){
            console.log(socket.id + " tried to join a full room!")
            socket.emit('fullRoom');
        } else {
            console.log(socket.id + " tried to join a room that doesn't exist!")
            socket.emit('falseCode');
        }
    });

    socket.on('server-room', function(room) {
        socket.join(room);
        console.log(socket.id + " has begun hosting a new room." + room)
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

    socket.on('idlePhone', (room) => {
        io.in(room).emit('setIdleState')
    })

    socket.on('roundOneServer', (id, mess1, mess2) => {
        io.to(id).emit('roundOneClient', mess1, mess2)
    })

    socket.on('roundTwoServer', (id, mess1, mess2) => {
        io.to(id).emit('roundTwoClient', mess1, mess2)
    })

    socket.on('submitResponse1', (appId, phoneId, name, response, qu) => {
        io.to(appId).emit('addRound1Res', phoneId, name, response, qu)
    })

    socket.on('submitResponse2', (appId, phoneId, name, response, qu) => {
        io.to(appId).emit('addRound2Res', phoneId, name, response, qu)
    })

    //END OF ROOM FUNCTIONS

    //FOR DISCONNECTS, FIND A BETTER WAY TO DO THIS LATER
    socket.on('disconnect', function() {
        //Maybe fix this later
        io.emit('disconnection', {id})
    })
    //END OF DISCONNECTS
});