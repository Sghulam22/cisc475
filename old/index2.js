var json; //var to hold the json object
var canvas = new fabric.Canvas('canvas');  //canvas variable
var arrowimgURL = "arrow1.png";  //transition image
var arrow = new Image();
var statenum = 0;  //holds the statnumber

var states = [];   //array that stores state information
var transitions = []; //array that stores transition informations

canvas.setHeight(window.innerHeight -75);
canvas.setWidth(window.innerWidth);

var f1 = new fabric.Circle({
        
        strokeWidth: 5,
        radius: 40,
        fill: '#fff',
        stroke: 'black',
        left: 60,
        top: 120,
        
    });

    canvas.add(f1);

    canvas.on('object:moving', function(e) {
        var p = e.target;
        console.log(p,"moving");
        canvas.renderAll();
    });

    
//function returns mouse click coordinates 
function getMouseCoords(event)
{
    var pointer = canvas.getPointer(event.e);
    var posX = pointer.x;
    var posY = pointer.y;
    
    return [posX,posY];
}

//function that gets called when save machine gets clicked
//saves the machine as an image as well as json object
function saveImage()
{
    var link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = "machine.png";
    link.click();

    //call function to save the machine as a json
    exportToJsonFile(json)
}


//function saves the canvas as a json object and saves it to a file.
function exportToJsonFile(json)
{
    let str = JSON.stringify(json);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(str);
    let exportFileDefaultName = 'machine.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

//function renders the canvas to a previous saved machine
//this function should be used to reopen file
function reload()
{
    canvas.clear();
    canvas.loadFromJSON(json, canvas.renderAll.bind(canvas));
}

function clear_canvas()
{
    states = [];   //array that stores state information
    transitions = []; //array that stores transition informations
    alphabet = [];
    statenum = 0;
    canvas.remove(...canvas.getObjects());
}


//function enables a click listener to add state to the canvas
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


//enables an event listener that calls "drawAcceptState"
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

    //function draws an accept state on the canvas
function drawAcceptState(event)
{
    //get mouse click x and y
    let arr = getMouseCoords(event);
    let x = arr[0]; 
    let y = arr[1];

    canvas.off();

    var c1 = new fabric.Circle({

        strokeWidth: 5,
        radius: 40,
        fill: '#fff',
        stroke: 'black',
        left: x-40,
        top: y-40,
        
    });

    var c2 = new fabric.Circle({

        strokeWidth: 3,
        radius: 50,
        fill: '#fff',
        stroke: 'black',
        left: x-49,
        top: y-49,
        
    });

    var text = new fabric.Text('Q'+statenum, {
        left: c1.left+20,
        top: c1.top+20,
        fill: 'black'
    });

    //groups the text and the state together such that they move together
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
    json = canvas.toJSON();

    for(i in states)
    {
        console.log(states[i]);
    }

    document.getElementById("addState").disabled = false;
    document.getElementById("addAcceptState").disabled = false;
}

//function that draws the state to the canvas
function drawState(event)
{ 

    //get mouse click x and y
    let arr = getMouseCoords(event);
    let x = arr[0]; 
    let y = arr[1];
    
    canvas.off();
    
    
    var temp = new fabric.Circle({

        strokeWidth: 5,
        radius: 40,
        fill: '#fff',
        stroke: 'black',
        left: x-40,
        top: y-40,
        
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

    //groups the state and text so they can be moved together
    var group = new fabric.Group([ temp, text ], {
        left: temp.left,
        top: temp.top,
    });

    canvas.add(group);

    statenum++;
    document.body.style.cursor = "default";

    document.getElementById("addState").disabled = false;
    document.getElementById("addAcceptState").disabled = false;


    json = canvas.toJSON();
    console.log(json);

};

function makeLine(coords) {
    return new fabric.Line(coords, {
    fill: 'red',
    stroke: 'red',
    strokeWidth: 5,
    selectable: true,
    });
}

//function that draws an arrow on the canvas with a text attached to it
function addArrow()
{
    //var input = window.prompt("enter their relation","");
    var startState = document.getElementById("start").value;
    var endState = document.getElementById("end").value;
    var input = document.getElementById("input").value;
    var x1,x2,y1,y2;

    var t = {
        "from":startState,
        "to":endState,
        "input":input
    }

    transitions.push(t);

    if (alphabet.indexOf(input) ==-1){  //if input not in the alphabet, put into the alphabet
        alphabet.push(input);
    }

    for(var i=0; i<transitions.length; i++)
    {
        console.log(transitions[i]);
    }


    for(var i=0; i<states.length; i++){

        if(states[i].statenum == startState){
            x1=states[i].x + 40;
            y1=states[i].y + 40;
        }

        if(states[i].statenum == endState){
            x2=states[i].x + 40;
            y2=states[i].y + 40;
        }
    }

    var line = makeLine([x1,y1,x2,y2]);
    //canvas.add(line);
    json = canvas.toJSON();

    //hides the modal
    document.getElementById("modal-create").style.display=("none");

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
        left: line.left+00,
        top: line.top+10,
    });

    var group = new fabric.Group([ line, text ],{
        top: line.top,
        left: line.left
    });

    canvas.add(group);

};


/*
this function does not work properly, but when it is complete, it should
run the automata based on an input that the user enters. It runs through
the set of transitions and sees if the language is acceptable.
*/
function run()
{
    var input = window.prompt("enter string","");
    var result = false; 
    var currentState = 0;
    var lastState;

    for(var i=0; i<input.length; i++)
    {
        var found = 0;

        for(var k=0; k < transitions.length; k++)
        {

            if( transitions[k].from == currentState )
            {
                if( input.charAt(i) == transitions[k].input )
                {
                    currentState = transitions[k].to;
                    console.log("moved to: "+transitions[k].to + ", from: "+ transitions[k].from+", on: "+ transitions[k].input);
                }
            }

        
        }
    }

    for(i in states)
    {
        if(currentState == states[i].statenum && states[i].acceptState == true)
            result = true;
    }

    if(result == false)
        alert("false");
    else if(result == true)
        alert("true");
}

arrow.src = arrowimgURL;
arrow.crossOrigin = "anonymous";