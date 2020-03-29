//assign a canvas variable
var canvas = document.querySelector("canvas");
console.log(canvas);

var clicked=0;

//set the height and width of the canvas
canvas.width = window.innerWidth*.999;
canvas.height=window.innerHeight*.8;

//array to hold all the states and paths
var states = [];
var Paths = []

var context = canvas.getContext('2d');

//a work in progress but should pottentially clear the canvas
function clearCanvas()
{
    console.log("in clear")
  
}

//function gets called when the button "add state gets clicked"
//calls click positition function
function addState()
{
    console.log("add state");
    canvas.addEventListener("mousedown", function(e) 
    { 
        clickPosition(canvas, e); 
    }, {once : true});

}



function clickPosition(canvas, event) { 
    let rect = canvas.getBoundingClientRect(); 
    let x = event.clientX - rect.left; 
    let y = event.clientY - rect.top;
    var c= canvas.getContext('2d'); 

  

    //draws and darkens the circle by over writing it twice
    for(var i=0; i<2; i++)
    {
        c.beginPath();
        c.arc(x,y,30,0,360,false);
        c.stroke();
    }

    

    //object to hold the attributes of each new state that later gets added on to the 
    //states array
    var temp={
        "xpos":x,
        "ypos":y,
        "r":30,
        "start":0,
        "start":360,
        "bool":false
    };

    //add state to the array of states
    states.push(temp);


    for(var i=0; i<states.length; i++)
    {
        console.log(states[i].xpos, states[i].ypos);
    }

} 


var t=0; //click counter
var clicked=[]; //holds the mouse click positions


//function that checks
function hitDetection(){
    var ctx = canvas.getContext('2d');
    ctx.canvas.addEventListener('mousedown', function(event) {
       
        let rect = canvas.getBoundingClientRect(); 
        let x1 = event.clientX - rect.left; 
        let y1 = event.clientY - rect.top;
        
        console.log(x1, y1);

        if(t<2)
        {
            for(var i = 0; i < states.length; i++)
            {
                var b = states[i];
                var dx = Math.abs(x1-b.xpos);
                var dy = Math.abs(y1-b.ypos); 
         
                 if(dx<30 && dy<30)
                {
                    console.log("you touched"+ b.xpos, b.ypos);
                    t++;
                    clicked.push(b);
                }
            }
        }

        if(t===2)
        {
            ctx.moveTo(clicked[0].xpos, clicked[0].ypos);
            ctx.lineTo(clicked[1].xpos, clicked[1].ypos);
            ctx.stroke();
            console.log("clicked");
            t=0;
            clicked=[];
        }

    });
    
}


window.addEventListener('load', function(event) {
    hitDetection();
});