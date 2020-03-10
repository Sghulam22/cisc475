
//does not work at the moment but should get mouse position
var canvas = document.getElementById('myCanvas');
if(canvas)
    canvas.addEventListener('onlick', clickLocation, false);

function clickLocation(canvas,event)
{
    console.log("clicked");
}

//this function gets invoked when 2 states are clicked and draws a path between them
function addLine()
{
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.moveTo(0, 0);
    ctx.lineTo(500, 400);
    ctx.stroke();
    console.log("clicked");
}

//this fucntion is invoked when the add state button is clicked
//should call get mouse click position to add state those coordinates
function addState()
{
    var c= document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
}



