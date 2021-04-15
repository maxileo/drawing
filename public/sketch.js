var socket;

function setup()
{
    createCanvas(900, 900);
    background(200);

    socket=io();
    socket.on('mouse', newDrawing);
}
function newDrawing(data)
{
    noStroke();
    fill(255);
    circle(data.x, data.y, 10, 10);
}

function draw()
{
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
    circle(mouseX, mouseY, 10, 10);
}