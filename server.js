const express = require('express');
const socketIO = require('socket.io');

const port=process.env.PORT || 3000;

const server = express()
    .use(express.static('public'))
    .listen(port, ()=> console.log('Listening'));

const io =socketIO(server);

io.on('connection', newConnection);

function newConnection(socket)
{
    console.log("new connection: " + socket.id);

    socket.on('mouse', mouseMsg);
    socket.on('reset', resetIt);
    socket.on('guess', guess);
    socket.on('guessed', guessed);

    function guessed()
    {
        socket.broadcast.emit('guessedIt');
    }
    function guess(data)
    {
        socket.broadcast.emit('guess', data);
        console.log(data);
    }
    function resetIt(data)
    {
        socket.broadcast.emit('resetIt', data);
        console.log(data);
    }

    function mouseMsg(data)
    {
        socket.broadcast.emit('mouse', data);
        console.log(data);
    }

    socket.on('disconnect', ()=>{
        console.log("user disconnected: " + socket.id);
    });
}
