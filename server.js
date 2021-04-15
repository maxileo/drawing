const express = require('express');
const socketIO = require('socket.io');

const port=process.env.PORT || 3000;

const server = express()
    .use((req, res) => res.sendFile('public'))
    .listen(port, ()=> console.log('Listening'));

const io =socketIO(server);

io.on('connection', newConnection);

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
