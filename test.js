var canvas = document.querySelector("canvas");
console.log(canvas);

var Statenum = 0;

//set the height and width of the canvas
canvas.width = window.innerWidth*.999;
canvas.height= window.innerHeight*.8;


var stateImg = new Image();
stateImg.src = "circle2.svg";

var acceptImg = new Image();
acceptImg.src = "acceptstate.svg"

//array to hold all the states and paths
var states = [];
var acceptStates =[];
var Paths = []
var clicked=[]; //holds the click position for connecting states
var t=0; //click counter

var context = canvas.getContext('2d');

//a work in progress but should pottentially clear the canvas
function clearCanvas()
{
    states = [];
    paths = [];
    clicked =[];
    t = 0;
    Statenum=0;
    context.clearRect(0,0,canvas.width,canvas.height);  
}


//function gets called when the button "add state" gets clicked
function addState()
{
    document.getElementById("addState").disabled = true;
    document.getElementById("addAcceptState").disabled = true;
    document.body.style.cursor = "pointer";

    canvas.addEventListener("mousedown", function(e) 
    { 
        clickPosition(canvas, e, 0); 
    }, {once : true});
}

//function that gets called when the button "add accept state" gets clicked
function addAcceptState()
{
    document.getElementById("addAcceptState").disabled = true;
    document.getElementById("addState").disabled = true;
    canvas.addEventListener("mousedown", function(e) 
    { 
        clickPosition(canvas, e, 1); 
    }, {once : true});

}

//function
function drawState(x, y)
{

    var c= canvas.getContext('2d');  
    c.drawImage(stateImg,x-55,y-55);
}


function drawLine(x1,y1,x2,y2)
{
    for(var i=0; i<10; i++)
    {
        let ctx = canvas.getContext('2d');
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2-50, y2);
        ctx.stroke();
    }
}

//function needs work
function drawArrow(x2,y2)
{
    let ctx = canvas.getContext('2d');

    var tempy = y2-30;
    for(var i=0; i<10; i++)
    {
        ctx.moveTo(x2-80, y2-30);
        ctx.lineTo(x2-50,y2);
        ctx.stroke();

        ctx.moveTo(x2-80, tempy+60);
        ctx.lineTo(x2-50,y2);
        ctx.stroke();
    }
}


//function that takes parameters x,y,r and draws 2 circles: one inside the other to mimick accept state
function drawAcceptState(x, y)
{
    var c= canvas.getContext('2d');  
    c.drawImage(acceptImg,x-55,y-55);
}


function clickPosition(canvas, event, statetype) { 

    let rect = canvas.getBoundingClientRect(); 
    let x = event.clientX - rect.left; 
    let y = event.clientY - rect.top;

    var isAcceptState = false;


        if(statetype === 0)
        {
            drawState(x, y);
        }

        if(statetype === 1)
        {
            drawAcceptState(x, y);
            isAcceptState = true;
        }
        
        context.font = "20px Arial";
        context.fillText("q"+Statenum, x-5, y+10);

        document.getElementById("addState").disabled = false;
        document.getElementById("addAcceptState").disabled = false;

    


    //object to hold the attributes of each new state that later gets added on to the 
    //states array
    var temp={
        "state":Statenum,
        "xpos":x,
        "ypos":y,
        "acceptState": isAcceptState
    };

    //add state to the array of states
    states.push(temp);
   
    if (statetype === 1)
        acceptStates.push(temp);
    
    Statenum++;

    document.body.style.cursor = "default";
} 

//function that returns distance of 2 points
function distance(x1,y1,x2,y2)
{
    var dist;
    dist = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
    console.log(distance);
    return dist;
}

//needs implementation
function saveFile()
{
     alert("save file");
}

//needs implementation
function openFile()
{
    alert("open file");
}

//function that checks hit detection
function hitDetection(){
   
    var ctx = canvas.getContext('2d');
    ctx.canvas.addEventListener('mousedown', function(event) {
        var x1,x2,y1,y2;

        //gets the exact mouseclick poition
        let rect = canvas.getBoundingClientRect(); 
        let x = event.clientX - rect.left; 
        let y = event.clientY - rect.top;
        
        console.log(x, y);

        //if first click
        if(t < 2)
        {
            for(var i = 0; i < states.length; i++)
            {
                var b = states[i];
                var dx = Math.abs(x-b.xpos);
                var dy = Math.abs(y-b.ypos); 
         
                 if(dx<51 && dy<51)
                {
                    console.log("you touched"+ b.xpos, b.ypos);
                    t++;
                    clicked.push(b);
                }
            }
        }

        if(t === 2)
        {
            var input = window.prompt("enter their relation","");
            console.log(input);

            x1 = clicked[0].xpos;
            x2 = clicked[1].xpos;
            y1 = clicked[0].ypos;
            y2 = clicked[1].ypos;
            

            var path = {
                "relation":input,
                "x1": x1,
                "y1": y1,
                "x2": x2,
                "y2": y2,
            }
            
            Paths.push(path);

            //draws a line 
            drawLine(x1,y1,x2,y2);
            drawArrow(x2,y2);
           
            console.log("clicked");

            distance(x1,y1,x2,y2);
            t=0;
            

            var tempx = (clicked[0].xpos + clicked[1].xpos) / 2; // puts the text in the middle of the 2 states
            var tempy = (clicked[0].ypos + clicked[1].ypos) / 2; 
            var dx = Math.abs(clicked[0].xpos - clicked[1].xpos);
            var dy = Math.abs(clicked[0].ypos - clicked[1].ypos);

            if(dx > dy)
                tempy = tempy-20;

            if(dy > dx)
                tempx = tempx -50;

            context.font = "20px Arial";
            
            context.fillText(input, tempx, tempy);
            console.log(input);     
            clicked=[];

        }
    });
    
}

//event listener that gets activated to listen for clicks so that it can connect states
window.addEventListener('load', function(event) {
    hitDetection();
});