var socket;

const reset=document.getElementById('reset');
reset.addEventListener('click', function(){resetIt();}, false);
//window.addEventListener('resize', function(){resized();}, false);

const send=document.getElementById('send');
send.addEventListener('click', function(){tryWord()}, false);
function tryWord()
{
    butonPressed(send);
}
var culoareBG=230;
var sizeBrush=10;

const info=document.getElementById("info");

const choose=document.getElementById('choose');
choose.addEventListener('click', function(){chooseWord();}, false);   // alegi un cuvant pe care sa-l desenezi
var canvas;
var culori=[];
var culorile=[0, 242, 95, 73, 166, 126, 85, 250, 158, 82, 255, 252, 59, 172, 255, 56, 94, 166, 78, 136, 242, 166, 148, 247, 211, 123, 230, 237,
    97, 167, 201, 96, 116, 179, 163, 119, 209, 230, 80, 192, 255, 255, 255, 0, 0, 0 ];
var culoareActuala=new p5.Vector(255, 255, 255);

var brushes=[];
function setup()
{
    canvas=createCanvas(800, 500);
    background(culoareBG);

    socket=io();
    socket.on('mouse', newDrawing);
    socket.on('resetIt', resetIt2);
    socket.on('guess', guess);
    socket.on('guessedIt', guessedIt);
    socket.on('users', users);

    for (var i=1; i<=15; i++)
    {
        culori[i]=new culoare(30*i+i*5, 450, culorile[i*3-2], culorile[i*3-1], culorile[i*3]);
        culori[i].draw();
    }
    for (var i=1; i<=4; i++)
    {
        brushes[i]=new brush(35*(i+15)+(i+15)*5, 450, i*5, i*10);
        brushes[i].draw();
    }
    setInterval(function(){
        if (!mouseIsPressed)
            culoarePressed=false;
        for (var i=1; i<=15; i++)
        {
            if (culori[i].pressed()==true && culoarePressed==false)
            {
                culoareActuala=new p5.Vector(culori[i].r, culori[i].g, culori[i].b);
                culoarePressed=true;
                console.log(i);
            }
        }
        for (var i=1; i<=4; i++)
        {
            if (brushes[i].pressed()==true && culoarePressed==false)
            {
                sizeBrush=brushes[i].brushSize;
                culoarePressed=true;
            }
        }
    }, 1);
}

var culoarePressed=false;

function draw()
{
}
class culoare {
    constructor(x, y, r, g, b) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.g = g;
      this.b = b;
    }
    pressed()
    {
        if (mouseIsPressed && mouseX>this.x && mouseX<this.x+30 && mouseY>this.y && mouseY<this.y+30)
            return true;
        return false;
    }
    draw()
    {
        stroke(0);
        fill(this.r, this.g, this.b);
        rect(this.x, this.y, 30, 30, 5);
    }
}
class brush {
    constructor(x, y, circleSize, brushSize) {
      this.x = x;
      this.y = y;
      this.circleSize = circleSize;
      this.brushSize = brushSize;
    }
    pressed()
    {
        if (mouseIsPressed && mouseX>this.x && mouseX<this.x+30 && mouseY>this.y && mouseY<this.y+30)
            return true;
        return false;
    }
    draw()
    {
        stroke(0);
        fill(255, 255, 255);
        rect(this.x, this.y, 30, 30, 5);
        fill(10);
        circle(this.x+15, this.y+15, this.circleSize);
    }
}
function users(numar)
{
    document.getElementById('users').textContent="There are "+numar+" users.";
}


var form = document.getElementById('form');
var input = document.getElementById('input');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value && guessing==true) 
    {
      if (input.value==cuvantToBeGuessed)
      {
          info.textContent="You guessed correctly!!";
          console.log("da, ai ghicit");
          socket.emit('guessed');
          clearInterval(timerr);
          document.getElementById('timer').textContent="";
          timeIsDone=true;
      }
      else
        console.log("mai incearca");
      input.value = '';
    }
});


function chooseWord()
{
    butonPressed(choose);
    if (timeIsDone==true)
        loadStrings('cuvinte.txt', pickString);
}
var cuvant;
var cuvantToBeGuessed;
var drawing=false;
var guessing=false;

function pickString(sir)
{
    resetBG();
    socket.emit('reset', true);
    guessing=false;
    cuvant=random(sir);
    info.textContent=cuvant;
    drawing=true;
    timer();
    var guessData={
        cuvant: cuvant
    }
    socket.emit('guess', guessData);
}

function resetIt()
{
    butonPressed(reset);
    resetBG();
    socket.emit('reset', true);
}
function resetIt2()
{
    resetBG();
}

var drawPosition=false;

function guessedIt()
{
    clearInterval(timerr);
    document.getElementById('timer').textContent="";
    timeIsDone=true;
    if (drawing==true)
    {
        info.textContent="Someone guessed your word";
        drawing=false;
    }
    else
    {
        info.textContent="Someone guessed the word";
        guessing=false;
    }
}

function guess(data)
{
    drawing=false;
    timer();
    cuvantToBeGuessed=data.cuvant;
    var aux="";
    for (var i=0; i<data.cuvant.length; i++)
    {
        if (data.cuvant[i]!=' ')
            aux+=' '+'_';
        else
            aux+="  ";
    }
    info.textContent=aux;
    guessing=true;
}

function resized()
{
    resizeCanvas(window.innerWidth-100, window.innerHeight-100);
    background(culoareBG);
}


function newDrawing(data) // cand iti deseneaza dupa altcineva
{
    noStroke();
    fill(data.r, data.g, data.b);
    circle(data.x, data.y, data.size);
}
function mouseDragged() // cand desenezi tu 
{
    if (drawing==true)
    {
        if (mouseX>0 && mouseX<width && mouseY>0 && mouseY<height-70)
        {
            var data=
            {
                x:mouseX,
                y:mouseY,
                r:culoareActuala.x,
                g:culoareActuala.y,
                b:culoareActuala.z,
                size: sizeBrush
            }
            socket.emit('mouse', data);

            noStroke();
            fill(culoareActuala.x, culoareActuala.y, culoareActuala.z);
            circle(mouseX, mouseY, sizeBrush);
        }
    }
}


// timer
var timerr;
function timer()
{
    timeIsDone=false;
    var minut=new Date().getTime()+60000+30000;
    timerr=setInterval(function(){
        var acum=new Date().getTime();
        var timptrecut=minut - acum;
        var minute = Math.floor((timptrecut % (1000 * 60 * 60)) / (1000 * 60));
        var secunde = Math.floor((timptrecut % (1000 * 60)) / 1000);
        if (timptrecut>0)
        {
            if (minute<=0)
                minute=0;
            document.getElementById('timer').textContent=minute+" m"+" "+secunde+" s";
        }
        else
        {
            console.log("ended timer");
            document.getElementById('timer').textContent="Time ended";
            clearInterval(timerr);
            drawing=false;
            guessing=false;
            timeIsDone=true;
        }
    });
}

var timeIsDone=true;

function butonPressed(buton)
{
    buton.style.animation = "pulsat 0.5s infinite";
    setTimeout(function()
            {
                buton.style.animationPlayState="paused";
            }, 500);
}

function resetBG()
{
    background(culoareBG);
    for (var i=1; i<=15; i++)
    {
        culori[i].draw();
    }
    for (var i=1; i<=4; i++)
    {
        brushes[i].draw();
    }
}