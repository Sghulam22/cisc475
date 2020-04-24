var stateimgURL = 'circle2.svg';
var canvas = new fabric.Canvas('canvas');


var arrowimgURL = "arrow1.png";
var arrow = new Image();
//var state = new Image();
var statenum = 0;

var states = [];
var transitions = [];



function addState()
{
    document.getElementById("addState").disabled = true;
    document.getElementById("addAcceptState").disabled = true;
    document.body.style.cursor = "pointer";

    canvas.on('mouse:down', function(options) {
        drawState(options); 
        
    });
    document.body.style.cursor = "pointer";

}

function addAcceptState()
{
    document.getElementById("addState").disabled = true;
    document.getElementById("addAcceptState").disabled = true;
    document.body.style.cursor = "pointer";

    canvas.on('mouse:down', function(options) {
        drawAcceptState(options); 
        
    });
    document.body.style.cursor = "pointer";

}

function drawAcceptState(event)
{
    let x = event.e.clientX; 
    let y = event.e.clientY;

    console.log(x,y)
    canvas.off();

    var c1 = new fabric.Circle({
       
       strokeWidth: 5,
       radius: 40,
       fill: '#fff',
       stroke: 'black',
       left: x-60,
       top: y-120,
       
   });

   var c2 = new fabric.Circle({
       
       strokeWidth: 3,
       radius: 50,
       fill: '#fff',
       stroke: 'black',
       left: x-69,
       top: y-128,
       
   });

   var text = new fabric.Text('Q'+statenum, { 
        left: c1.left+20,
        top: c1.top+20, 
        fill: 'black'
    });

    var group = new fabric.Group([ c2, c1, text ], {
        left: c1.left,
        top: c1.top,
    })

    var state = {
        "x": c1.left,
        "y": c1.top,
        "statenum": statenum,
        "acceptState": true
        
    }

    statenum++;

    states.push(state);
    canvas.add(group);

    for(i in states)
    {
        console.log(states[i]);
    }
   
    document.getElementById("addState").disabled = false;
    document.getElementById("addAcceptState").disabled = false;

}


function drawState(event)
{ 
    
    let x = event.e.clientX; 
    let y = event.e.clientY;
    console.log(x,y)
    canvas.off();

    var state = {
        
    }
    
    var temp = new fabric.Circle({
       
        strokeWidth: 5,
        radius: 40,
        fill: '#fff',
        stroke: 'black',
        left: x-60,
        top: y-120,
        
    });

    var state = {
        "x": temp.left,
        "y": temp.top,
        "statenum": statenum,
        "acceptState": false
        
    }

    states.push(state);
                  
    var text = new fabric.Text('Q'+statenum, { 
        left: temp.left+20,
        top: temp.top+20, 
        fill: 'black'
    });

    var group = new fabric.Group([ temp, text ], {
        left: temp.left,
        top: temp.top,
    });
 
    canvas.add(group);

    statenum++;
    document.body.style.cursor = "default";

    document.getElementById("addState").disabled = false;
    document.getElementById("addAcceptState").disabled = false;

    for(i in states)
    {
        console.log(states[i]);
    }

};

function addArrow()
{ 
    //var input = window.prompt("enter their relation","");
    var SS = document.getElementById("start").value;
    var ES = document.getElementById("end").value;
    var input = document.getElementById("input").value;

    var t = {
        "from":SS,
        "to":ES,
        "input":input
    }

    transitions.push(t);
    
    for(var i=0; i<transitions.length; i++)
    {
        console.log(transitions[i]);
    }

    document.getElementById("modal-create").style.display=("none");

    console.log(SS,ES,input);
    var temp = new fabric.Image(arrow, {
        angle: 0,
        width: 1280,
        height: 640,
        left: 50,
        top: 70,
        scaleX: .2,
        scaleY: .2,
      
    });

    var text = new fabric.Text(input,{
        left: temp.left+100,
        top: temp.top+10,
    });

    var group = new fabric.Group([ temp, text ],{
        top:100,
        left: 100
    });

    canvas.add(group);

};

function run()
{
    var input = window.prompt("enter string","");
    var result = true; 
    var currentState=0;
    var lastState;

    for(var i=0; i<input.length; i++)
    {
        var found = 0;

        for(var k in transitions)
        {
            // console.log(k);
            // console.log(input.charAt(i));
            // console.log(transitions[i].input); 

            if(transitions[k].from === currentState)
            {
                if(input.charAt(i) === transitions[k].input)
                {
                    found = 1;
                    currentState = transitions[k].to;

                    if(i === input.length-1)
                    {
                        for(j in states)
                        {
                            if(states[j].statenum === currentState)
                            {
                                if( states[j].acceptState === false)
                                    result = false;
                            }
                        }
                    }
                }

            }
        }

        if(found === 0)
        {
            result = false;
        }
    }

    if(result === false)
        alert("false");
    else if(result === true)
        alert("true");
}


arrow.src = arrowimgURL;
// state.src = stateimgURL;
