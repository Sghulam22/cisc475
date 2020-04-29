
var canvas = new FSMCanvas('canvas');
fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

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

function clear_canvas()
{
    transitionArray = []; //array that stores transition informations
    canvas.stateMap = new Map();
    canvas.stateIndexMap = new Map();
    canvas.transitionMap = new Map();
    canvas.remove(...canvas.getObjects());
}

//handles deletion of single objects
function handle_delete(){
  var selection = canvas.getActiveObject();
  if (selection.name[0]=="Q"){   //if a state is selected, delete it and its transitions
    deleteState(selection);
  }
  else if (selection.name[0]=="T"){ //if selected the text of the transition
    var transition = canvas.transitionMap.get(selection.name.slice(1))  //key string after first T
    deleteTransition(transition); //delete the transition visual and update logic
  }
}

//deletes the transmision and updates the program logic related to it
function deleteTransition(transition){
    transition.source.sourceTransitions.delete(transition.destination.name);
    transition.destination.destinationTransitions.delete(transition.source.name);
    canvas.transitionMap.delete(transition.source.name + "-" + transition.destination.name)
    canvas.remove(transition.line);
    canvas.remove(transition.adjuster);
    canvas.remove(transition.text);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
}

  function deleteState(state){
    //remove the state visual
    if (state.type === 'activeSelection') {
        state.forEachObject(function(element) {
            canvas.remove(element);
        });
    }
    else{
        canvas.remove(state);
    }
    canvas.discardActiveObject();
    canvas.requestRenderAll();

    //remove the connected transitions, logic updated in deleteTransition()
    sources = state.sourceTransitions.values();
    destinations = state.destinationTransitions.values();

    let t = sources.next();
    while(!t.done){
      deleteTransition(t.value);
      t = sources.next();
    }

    t = destinations.next();
    while(!t.done){
      deleteTransition(t.value);
      t = destinations.next();
    }

    //update canvas map logic
    canvas.stateIndexMap.remove(state.statenum)
    canvas.stateMap.remove(state.name);
  }



//#endregion
