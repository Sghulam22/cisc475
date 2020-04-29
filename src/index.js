
var canvas = new FSMCanvas('canvas');
fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
var json;
var transitionArray = [];
var isShiftDown = false;
var isCtrlDown = false;

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

//#region: Event Handlers

function onSelectionUpdated(e)
{
  onBeforeSelectionCleared(e, true);
  onObjectSelected(e);
}

function onSelectionCleared(e)
{
  canvas.refresh();
}

function saveImage()
{
    var link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = "machine.png";
    link.click();

    //call function to save the machine as a json
    exportToJsonFile(json)
}

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

    var activeObject = e.target;
    var isNewTransition = false;

    var isState = activeObject.name[0] == "Q" ? true : false;
    var isText = activeObject.name[0] == "T" ? true : false;

    console.log(activeObject);

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
      transition.updateAdjusterPosition(activeObject, transition.destination);
      transition.updateTextPosition(activeObject, transition.destination);
    });

      activeObject.destinationTransitions.forEach(transition => {
      transition.updatePathDestination(activeObject.left, activeObject.top);
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

    return [posX,posY];
}

function handle_delete()
{
  canvas.handleDelete();
}

function clear_canvas()
{
  json = canvas.toJSON();
    transitionArray = []; //array that stores transition informations
    canvas.clear();
}

//#endregion
