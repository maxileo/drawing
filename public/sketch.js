var socket;

const reset=document.getElementById('reset');
reset.addEventListener('click', function(){resetIt();}, false);
window.addEventListener('resize', function(){resized();}, false);

function resetIt()
{
    background(200);
    socket.emit('reset', true);
}
function resetIt2()
{
    background(200);
}

var drawPosition=false;

function setup()
{
    createCanvas(window.innerWidth-100, window.innerHeight-100);
    background(200);

    socket=io();
    socket.on('mouse', newDrawing);
    socket.on('resetIt', resetIt2);
}

function resized()
{
    resizeCanvas(window.innerWidth-100, window.innerHeight-100);
    background(200);
}


function newDrawing(data)
{
    noStroke();
    fill(255);
    circle(data.x, data.y, 10);
}

function draw()
{

}
function mousePressed()
{
    noStroke();
    fill(255);
    circle(mouseX, mouseY, 10);
}
function mouseDragged()
{
    var data=
    {
        x:mouseX,
        y:mouseY
    }
    socket.emit('mouse', data);

    noStroke();
    fill(255);
    circle(mouseX, mouseY, 10);
}