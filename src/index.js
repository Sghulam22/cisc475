
var canvas = new FSMCanvas('canvas');
fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

var transitionArray = [];
var isShiftDown = false;
var isCtrlDown = false;

canvas.on({'selection:created': onObjectSelected,
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

function onBeforeSelectionCleared(e, selectionUpdated)
{
    var activeObject = e.target;
    var nextObject = e.target;

    if(selectionUpdated) { activeObject = e.deselected[0]; }

    if (activeObject.name[0] == "Q" && nextObject.name[0] != "A") {

      activeObject.hideTransitionAdjusters();
    }
    else if (activeObject.name[0] == "A" && nextObject.name[0] != "A") {

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

    if (isState && !isNewTransition && !isShiftDown && !isCtrlDown){ 
      
      activeObject.showTransitionAdjusters(); 
    }

}

function onObjectMoving(e) {

  if (e.target.name[0] == "Q" || e.target.name[0] == "Q") {
    var p = e.target;

    p.sourceTransitions.forEach(transition => {

      transition.updatePathSource(p.left, p.top);
    });

    p.destinationTransitions.forEach(transition => {

      transition.updatePathDestination(p.left, p.top);
    });
  }

  if(e.target.name[0] == "A")
  {
    var a = e.target;
    a.line.path[1][1] = a.left;
    a.line.path[1][2] = a.top;
  }
}

function getMouseCoords(event)
{
    var pointer = canvas.getPointer(event.e);
    var posX = pointer.x;
    var posY = pointer.y;

    return [posX,posY];
}

function clear_canvas()
{
    transitionArray = []; //array that stores transition informations
    canvas.stateMap = new Map();
    canvas.stateIndexMap = new Map();
    canvas.transitionMap = new Map();
    canvas.remove(...canvas.getObjects());
}

//#endregion
