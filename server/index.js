var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(4000, function(){
    console.log("Listening to requests on port 4000");
});

app.use(express.static('public'));

var io = socket(server);

io.on('connection', function(socket){
    console.log("Made connection with " + socket.id);

    socket.on('room', function(room) {
        socket.join(room);
    });

    socket.on('chat',function(data){
        io.in(data.room).emit('chat', data);
    });

    socket.on('typing',function(data){
        socket.to(data.room).emit('typing', data);
    });

    socket.on('notTyping',function(data){
        socket.to(data.room).emit('notTyping');
    });
});