

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
var butonulDeFill;
function setup()
{
    canvas=createCanvas(800, 500);
    background(culoareBG);

    noSmooth();

    socket=io();
    socket.on('mouse', newDrawing);
    socket.on('resetIt', resetIt2);
    socket.on('guess', guess);
    socket.on('guessedIt', guessedIt);
    socket.on('users', users);

    socket.on('howWasTheTry', tryCameBack);
    socket.on('theWord', theWord);
    socket.on('fillThisPlace', fillThisPlace);

    for (var i=1; i<=15; i++)
    {
        culori[i]=new culoare(30*i+i*5-20, 450, culorile[i*3-2], culorile[i*3-1], culorile[i*3]);
        culori[i].draw();
    }
    for (var i=1; i<=4; i++)
    {
        brushes[i]=new brush(35*(i+15)+(i+30)*3, 450, i*5, i*10);
        brushes[i].draw();
    }
    butonulDeFill=new butonFill(30*15+140, 450);
    butonulDeFill.draw();
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
        if (butonulDeFill.pressed()==true && culoarePressed==false)
        {
            culoarePressed=true;
            setTimeout(() => {
                urmamSaFill=true;
            }, 400);
        }

        if (!mouseIsPressed)
        {
            first=false;
            fillPressed=false;
        }
        if (mouseIsPressed && urmamSaFill==true && mouseY<430)
        {
            fillPressed=true;
            urmamSaFill=false;
            fillItBucket(mouseX, mouseY);
            data={
                x:parseInt(mouseX),
                y:parseInt(mouseY),
                r:culoareActuala.x,
                g:culoareActuala.y,
                b:culoareActuala.z
            };
            socket.emit('bucketFill', data);
        }
    }, 1);
}

var urmamSaFill=false;
var fillPressed=false;
var fillBU=false;

function keyReleased()
{
    fillBU=false;
}
function keyPressed()
{
    fillBU=true;
}

var first=false;
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

class butonFill {
    constructor(x, y)
    {
        this.x=x;
        this.y=y;
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
        textSize(20);
        fill(20);
        text("F", this.x+8, this.y+23);
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
        console.log("pressed try");
        seeIfRight(input.value);
        input.value = '';
    }
    if (input.value)
        input.value="";
});

var howTheTryCameBack=false;
function tryCameBack(data)
{
    howTheTryCameBack=data;
}

function seeIfRight(incercare)
{
    socket.emit('incerc', incercare);
    setTimeout(function()
    {   
        if (howTheTryCameBack==true)
        {
            info.textContent="You guessed correctly!!";
            socket.emit('guessed');
            clearInterval(timerr);
            document.getElementById('timer').textContent="";
            timeIsDone=true;
        }
    }, 200);
}

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

function resetIt()
{
    if (drawing==true)
    {
        butonPressed(reset);
        resetBG();
        socket.emit('reset', true);
    }
}
function resetIt2()
{
    resetBG();
}

var drawPosition=false;

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

function guess(data)
{
    drawing=false;
    timer();
    cuvantToBeGuessed=data.cuvant;
    info.textContent=cuvantToBeGuessed;
    guessing=true;
}

function guessedIt()
{
    clearInterval(timerr);
    document.getElementById('timer').textContent="";
    timeIsDone=true;
    if (drawing==true)
    {
        info.textContent="Someone guessed your word";
        sendWord(1);
        drawing=false;
    }
    else
    {
        info.textContent="Someone guessed the word";
        guessing=false;
    }
}

function resized()
{
    resizeCanvas(window.innerWidth-100, window.innerHeight-100);
    background(culoareBG);
}

var lastX, lastY;

function fillIt(x, y, r, g, b)
{
    fill(r, g, b);
}

function newDrawing(data) // cand iti deseneaza dupa altcineva
{
    noStroke();
    fill(data.r, data.g, data.b);
    circle(data.x, data.y, data.size);
    //rect(data.x-data.size/2, data.y-data.size/2, data.size, data.size);
}

function fillThisPlace(data)
{
    culoareActuala.x = data.r;
    culoareActuala.y = data.g;
    culoareActuala.z = data.b;
    console.log(culoareActuala);
    fillItBucket(parseInt(data.x), parseInt(data.y));
}

function mouseDragged() // cand desenezi tu 
{
    if (drawing==true)
    {
        if (mouseX>0 && mouseX<width && mouseY>0 && mouseY<height-70)
        {
            if (first==false)
            {
                lastX=mouseX;
                lastY=mouseY;
                first=true;
            }
            if (dist(mouseX, mouseY, lastX, lastY)>5)
            {
                interpolate(mouseX, mouseY, lastX, lastY);
            }
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
            //rect(mouseX-sizeBrush/2, mouseY-sizeBrush/2, sizeBrush, sizeBrush);

            lastX=mouseX;
            lastY=mouseY;
        }
    }
}
function interpolate(xA, yA, xB, yB)
{
    var t=0;
    var x, y;
    while (t<=1)
    {
        t+=0.05;
        x=abs((t-1)*xA)+t*xB;
        y=abs((t-1)*yA)+t*yB;

        var data=
        {
                x:x,
                y:y,
                r:culoareActuala.x,
                g:culoareActuala.y,
                b:culoareActuala.z,
                size: sizeBrush
        }
        socket.emit('mouse', data);

        noStroke();
        fill(culoareActuala.x, culoareActuala.y, culoareActuala.z);
        circle(x, y, sizeBrush);
        //rect (x-sizeBrush/2, y-sizeBrush/2, sizeBrush, sizeBrush);
    }
}
  
  class coada
    {
      constructor(a, b)
      {
        this.lin=a;
        this.col=b;
      }
    }
  
  var rr, gg, bb;
  function fillItBucket(a, b)
  {
    loadPixels();
    const d=2;
    
    var A=[];
    for (var ii=0; ii<width*height; ii++)
      A[ii]=0;
    
    
    var prim, ultim, k;
    var pi, pj, vi, vj;
    var vecinlin=[-1, 0, 1, 0];
    var vecincol=[0, 1, 0, -1];
      var C=[];
      var indd=ind(a, b, d);
      const [rr, gg, bb]=[pixels[indd], pixels[indd+1], pixels[indd+2]];
      prim=ultim=0;
      C[0]=new coada(a, b);
      A[b*width+a]=1;
      pixels[indd]=110;
      pixels[indd+1]=152;
      pixels[indd+2]=219;
      while (prim<=ultim)
      {
          pi=C[prim].lin; pj=C[prim].col;
          prim++;
          for (k=0; k<=3; k++)
          {
              vi=pi+vecinlin[k]; vj=pj+vecincol[k];
              if (A[vj*width+vi]==0 && vj<420 && vi<800)
              {
              if (egalPX(vi, vj, rr, gg, bb, d)==true)
              {
                  let i=ind(vi, vj, d);
                  pixels[i]=culoareActuala.x;
                  pixels[i+1]=culoareActuala.y;
                  pixels[i+2]=culoareActuala.z;
                
                  A[vj*width+vi]=1;
                  
                  ultim++;
                  C[ultim]=new coada(vi, vj);
              }
              }
          }
      }
    
    updatePixels();
    
    console.log(a, b);
  }
  var nr=0;
  function egalPX(a, b, rr, gg, bb, d)
  {
    var ind1=ind(a, b, d);
    var detail=15;
    if (( abs(pixels[ind1]-rr)<detail && 
        abs(pixels[ind1]-rr)<detail && 
        abs(pixels[ind1]-rr)<detail
    ) 
    )
      {
        return true;
      }
    return false;
  }
  
  function ind(a, b, d)
  {
    return 4*(b*width+a);
  }



// timer
var timerr;
function timer()
{
    timeIsDone=false;
    var minut=new Date().getTime()+60000+30000;
    //var minut=new Date().getTime()+20000;
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
            if (guessing==true)
            {
                document.getElementById('timer').textContent="Time ended. ";
                //document.getElementById('timer').textContent="Time ended, the word was "+cuvantToBeGuessed;
            }
            if (drawing==true)
            {
                document.getElementById('timer').textContent="You ran out of time..";
                sendWord(2);
            }

            clearInterval(timerr);
            drawing=false;
            guessing=false;
            timeIsDone=true;
        }
    });
}

function sendWord(care)
{
    data={
        cuvant: cuvant,
        care: care
    };
    socket.emit('thisWasTheWord', data);
}
function theWord(data)
{
    cuvantYouHadToGuess=data.cuvant;
    if (data.care==2)
    {
        clearInterval(timerr);
        drawing=false;
        guessing=false;
        timeIsDone=true;
        document.getElementById('timer').textContent="Time ended, the word was "+cuvantYouHadToGuess;
    }
    if (data.care==1)
    {
        clearInterval(timerr);
        drawing=false;
        guessing=false;
        timeIsDone=true;
        document.getElementById('timer').textContent="Someone guessed the word, it was "+cuvantYouHadToGuess;
    }
    console.log(cuvantYouHadToGuess);
}
var cuvantYouHadToGuess="";

function getWord()
{
    async function getData()
    {
        const response= await fetch('/word');
        const data = await response.json();
        console.log(data);

        return data.cuvant;
    }
    return getData();
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
    butonulDeFill.draw();
}