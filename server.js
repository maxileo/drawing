var express = require('express');

var app=express();

const port=process.env.port;
var server=app.listen(port);


app.use(express.static('public'));

console.log("Hello there");

var socket = require('socket.io');

var io=socket(server);
io.sockets.on('connection', newConnection);

function newConnection(socket)
{
    console.log("new connection: " + socket.id);

    socket.on('mouse', mouseMsg);

    function mouseMsg(data)
    {
        socket.broadcast.emit('mouse', data);
        console.log(data);
    }
}
