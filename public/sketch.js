var socket;

const reset=document.getElementById('reset');
reset.addEventListener('click', function(){resetIt();}, false);
//window.addEventListener('resize', function(){resized();}, false);

const info=document.getElementById("info");

const choose=document.getElementById('choose');
choose.addEventListener('click', function(){chooseWord();}, false);   // alegi un cuvant pe care sa-l desenezi

function setup()
{
    createCanvas(800, 500);
    background(200);

    socket=io();
    socket.on('mouse', newDrawing);
    socket.on('resetIt', resetIt2);
    socket.on('guess', guess);
    socket.on('guessedIt', guessedIt);
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
    if (timeIsDone==true)
        loadStrings('cuvinte.txt', pickString);
}
var cuvant;
var cuvantToBeGuessed;
var drawing=false;
var guessing=false;
function pickString(sir)
{
    background(180);
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
    background(180);
    socket.emit('reset', true);
}
function resetIt2()
{
    background(180);
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
    background(180);
}


function newDrawing(data) // cand iti deseneaza dupa altcineva
{
    noStroke();
    fill(255);
    circle(data.x, data.y, 10);
}
function mouseDragged() // cand desenezi tu 
{
    if (drawing==true)
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