const express = require('express');
const socketIO = require('socket.io');

const port=process.env.PORT || 3000;

const server = express()
    .use(express.static('public'))
    .listen(port, ()=> console.log('Listening'));

/*const server=express();
server.use(express.static('public'));
//server.use(express.json({limit: '1mb'}));
server.listen(port, ()=> console.log('Listening'));*/

const io =socketIO(server);

io.on('connection', newConnection);

var nrUsers=0;

var cuvantul;

function newConnection(socket)
{
    console.log("new connection: " + socket.id);
    nrUsers++;
    socket.broadcast.emit("users", nrUsers);
    socket.emit("users", nrUsers);

    socket.on('mouse', mouseMsg);
    socket.on('reset', resetIt);
    socket.on('guess', guess);
    socket.on('guessed', guessed);
    socket.on('incerc', seeIfTryIsRight);

    socket.on('thisWasTheWord', thisWasTheWord);

    function thisWasTheWord(data)
    {
        socket.broadcast.emit('theWord', data);
    }

    function seeIfTryIsRight(data)
    {
        if (data==cuvantul)
            socket.emit('howWasTheTry', true);
        else
            socket.emit('howWasTheTry', false);
        console.log("broadcasted the try"+data);
    }

    function guessed()
    {
        socket.broadcast.emit('guessedIt');
    }
    function guess(data)
    {
        cuvantul=data.cuvant;
        var aux="";
        for (var i=0; i<data.cuvant.length; i++)
        {
            if (data.cuvant[i]!=' ')
                aux+=' '+'_';
            else
                aux+="  ";
        }
        data.cuvant=aux;
        socket.broadcast.emit('guess', data);
        //console.log(data);
    }
    function resetIt(data)
    {
        socket.broadcast.emit('resetIt', data);
        //console.log(data);
    }

    function mouseMsg(data)
    {
        socket.broadcast.emit('mouse', data);
        //console.log(data);
    }

    socket.on('disconnect', ()=>{
        nrUsers--;
        socket.broadcast.emit("users", nrUsers);
        socket.emit("users", nrUsers);
        console.log('s a deconectat '+nrUsers);
        console.log("user disconnected: " + socket.id);
    });
}
/*
server.get('/word', (request, response)=>{
    data={
        cuvant: cuvantul
    }
    response.json(data);
});
*/