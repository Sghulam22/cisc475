//assign a canvas variable
var canvas = document.querySelector("canvas");
console.log(canvas);

//set the height and width of the canvas
canvas.width = window.innerWidth*.999;
canvas.height=window.innerHeight*.8;

//array to hold all the states
var states=[];

 
var context = canvas.getContext('2d');

//to creat a path, you do:
// context.beginPath();
// context.moveTo(100,100);
// context.lineTo(300,300);
// context.stroke();

function addState()
{
    console.log("button clicked");
    var x=0;

    function clickPosition(canvas, event) { 
        let rect = canvas.getBoundingClientRect(); 
        let x = event.clientX - rect.left; 
        let y = event.clientY - rect.top;
        var c= canvas.getContext('2d'); 
    
        c.beginPath();
        c.arc(x,y,30,0,360,false);
        c.stroke();

        c.beginPath();
        c.arc(x,y,30,0,360,false);
        c.stroke();
    
        console.log("Coordinate x: " + x, "Coordinate y: " + y); 
    } 

    canvas.addEventListener("mousedown", function(e) 
    { 
        clickPosition(canvas, e); 
        //document.addEventListener("mouseup",mouseUp);
    }); 

}



function addLine()
{
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.moveTo(0, 0);
    ctx.lineTo(500, 400);
    ctx.stroke();
    console.log("clicked");
}


