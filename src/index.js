
var canvas = new FSMCanvas('canvas');
var fsm = new FSM(canvas.transitionMap);
fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

var transitionArray = [];
var isShiftDown = false;
var isCtrlDown = false;
var isObjectSelected = false;

canvas.on({'selection:created': onObjectSelected,
            'selection:cleared': onSelectionCleared,
            'selection:updated': onSelectionUpdated,
            'object:moving': onObjectMoving,
            'before:selection:cleared': onBeforeSelectionCleared
});

document.onkeydown = function(e){

  if(e.keyCode == 16)
    isShiftDown = true;
  else if(e.keyCode == 17)
    isCtrlDown = true;
}

document.onkeyup = function(e){

  if(e.keyCode == 16)
    isShiftDown = false;
  else if(e.keyCode == 17)
    isCtrlDown = false;
}

//Event Handler for file reading
/*document.getElementById('file-input')
  .addEventListener('change', openFile, false);
*/

//#region: Event Handlers

function onSelectionUpdated(e)
{
  onBeforeSelectionCleared(e, true);
  onObjectSelected(e);
}

function onSelectionCleared(e)
{
  canvas.refresh();
  isObjectSelected = false;
}

function onBeforeSelectionCleared(e, selectionUpdated)
{
    var activeObject = e.target;
    var nextObject = e.target;

    if(selectionUpdated) { activeObject = e.deselected[0]; }

    var isState = activeObject.name[0] == "Q" ? true : false;
    var isAdjuster = activeObject.name[0] == "A" ? true : false;
    var nextIsAdjuster = nextObject.name[0] == "A" ? true : false;

    if (isState && !nextIsAdjuster) {

      activeObject.hideTransitionAdjusters();
    }
    else if (isAdjuster && !nextIsAdjuster) {

      activeObject.animate('opacity', '0', {
        duration: 200,
        onChange: canvas.renderAll.bind(canvas),
      });
      activeObject.selectable = false;
    }
}

function onObjectSelected(e) {

    isObjectSelected = true; 
    var activeObject = e.target;
    var isNewTransition = false;

    var isState = activeObject.name[0] == "Q" ? true : false;
    var isText = activeObject.name[0] == "T" ? true : false;

    if(isShiftDown && isState)
    {
      canvas.discardActiveObject();

      if(transitionArray.length < 2)
          transitionArray.push(activeObject);

      if(transitionArray.length >= 2){
          canvas.createTransition(transitionArray[0], transitionArray[1]);
          transitionArray.length = 0;
          isNewTransition = true;
      }
    }
    else if(isCtrlDown && isState)
    {
      activeObject.drawAccept();
    }
    else if(isCtrlDown && isText)
    {
      isCtrlDown = false;

      var text = prompt("Enter a comma delimited string for this transition");
      text != null ? activeObject.text = text : null;

      canvas.updateTransitionValue(activeObject.name, text);
      canvas.discardActiveObject();
    }

    if (isState && !isNewTransition && !isShiftDown && !isCtrlDown){

      activeObject.showTransitionAdjusters();
    }

}

function onObjectMoving(e) {

  var activeObject = e.target;
  var isState = activeObject.name[0] == "Q" ? true : false;
  var isAdjuster = activeObject.name[0] == "A" ? true : false;

  if (isState) {

      activeObject.sourceTransitions.forEach(transition => {
      transition.updatePathSource(activeObject.left, activeObject.top);
      transition.updateArrowAngleAndPosition(activeObject, transition.destination);
      transition.updateAdjusterPosition(activeObject, transition.destination);
      transition.updateTextPosition(activeObject, transition.destination);
    });

      activeObject.destinationTransitions.forEach(transition => {
      transition.updatePathDestination(activeObject.left, activeObject.top);
      transition.updateArrowAngleAndPosition(transition.source, activeObject);
      transition.updateAdjusterPosition(transition.source, activeObject);
      transition.updateTextPosition(transition.source, activeObject);
    });
  }

  else if(isAdjuster)
  {
    activeObject.line.path[1][1] = activeObject.left;
    activeObject.line.path[1][2] = activeObject.top;
  }
}

function getMouseCoords(event)
{
    var pointer = canvas.getPointer(event.e);
    var posX = pointer.x;
    var posY = pointer.y;

    return [posX, posY];
}

function handle_delete()
{
  canvas.handleDelete();
}

function runMachine()
{
  var input = window.prompt("enter a language", "");
  fsm.runAutomata(input);
}

function saveImage()
{
    var link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = "machine.jpg";
    link.click();

    //var json = canvas.toJSON();
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

function clear_canvas()
{

    json = canvas.toJSON();
    transitionArray = []; //array that stores transition informations
    canvas.clear();

    canvas.loadFromJSON(json, canvas.renderAll.bind(canvas));
    //console.log(json)
}

//make function to be able to open json file, read it and then be able to set the canvas to the contents of the json file

function loadJsonFile() {
  var input, file, fr;

  if (typeof window.FileReader !== 'function') {
    alert("The file API isn't supported on this browser yet.");
    return;
  }

  input = document.getElementById('fileinput');
  if (!input) {
    alert(" couldn't find the fileinput element.");
  }
  else if (!input.files) {
    alert("This browser doesn't seem to support the `files` property of file inputs.");
  }
  else if (!input.files[0]) {
    alert("Please select a file before clicking 'Load'");
  }
  else {
    file = input.files[0];
    fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsText(file);
  }

  function receivedText(e) {
    let lines = e.target.result;
    var newArr = JSON.parse(lines); 
    canvas.loadFromJSON(newArr, canvas.renderAll.bind(canvas));
  }
}//end of JSON file load function

//#endregion

