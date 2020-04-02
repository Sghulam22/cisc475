//assign a canvas variable
var canvas = document.querySelector("canvas");
console.log(canvas);

var Statenum = 0;

//set the height and width of the canvas
canvas.width = window.innerWidth*.999;
canvas.height=window.innerHeight*.8;

//array to hold all the states and paths
var states = [];
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



//function gets called when the button "add state gets clicked"
//calls click positition function
function addState()
{
    document.getElementById("addState").disabled = true;
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
    var result;

   

    //draws and darkens the circle by over writing it twice
    for(var i=0; i<2; i++)
    {
        if(Statenum==0)
        {
            for(var j=0; j<10; j++)
            {
                c.beginPath();
                c.arc(x,y,40,0,360,false);
                c.stroke();
            }
        }

        else
        {
            c.beginPath();
            c.arc(x,y,30,0,360,false);
            c.stroke();
        }
        
        context.font = "20px Arial";
        context.fillText("q"+Statenum, x-5, y+10);

        document.getElementById("addState").disabled = false;
    }

   

    //object to hold the attributes of each new state that later gets added on to the 
    //states array
    var temp={
        "state":Statenum,
        "xpos":x,
        "ypos":y,
        "r":30,
        "start":0,
        "start":360,
        "bool":false
    };

    //add state to the array of states
    states.push(temp);

    Statenum++;

    for(var i=0; i<states.length; i++)
    {
        console.log(states[i].xpos, states[i].ypos);
    }

} 


function saveFile()
{
     alert("save file");
}

function openFile()
{
    alert("open file");
}

//function that checks hit detection
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
            var input = window.prompt("enter their relation","");
            console.log(input);

            var path = {
                "relation":input,
                "x1": clicked[0].xpos,
                "y1": clicked[0].ypos,
                "x2": clicked[1].xpos,
                "y2": clicked[1].ypos,
            }
            
            Paths.push(path);
            ctx.moveTo(clicked[0].xpos, clicked[0].ypos);
            ctx.lineTo(clicked[1].xpos, clicked[1].ypos);
            ctx.stroke();
            console.log("clicked");
            t=0;
            

            var tempx = (clicked[0].xpos + clicked[1].xpos) / 2;
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


window.addEventListener('load', function(event) {
    hitDetection();
});