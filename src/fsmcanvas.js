class FSMCanvas extends fabric.Canvas{

    constructor(id)
    {
        super(id);
        this.selection = false;
        this.setHeight(window.innerHeight / 1.1);
        this.setWidth(window.innerWidth);
        this.backgroundColor = "#ffffff";

        this.stateMap = new Map();
        this.stateIndexMap = new Map();
        this.transitionMap = new Map();
        this.MAX_STATES = 12;

        this.on('mouse:dblclick', function(event) {
            this.drawState(event);
        });
    }

    findOpenIndex()
    {
        for(var i = 0; i < this.MAX_STATES; i++)
        {
            if(!this.stateIndexMap.has(i))
                return i;
        }
        return -1;
    }

    drawState(event)
    { 
        if(isObjectSelected == true || isCtrlDown == true || isShiftDown == true){ return; }

        var stateNum = this.findOpenIndex();

        if(stateNum == -1)
        {
            alert("you may only draw " +  this.MAX_STATES + " states");
            return;
        }

        let arr = getMouseCoords(event);
        let x = arr[0]; 
        let y = arr[1];

        var state = new State(stateNum, x, y);
        this.stateIndexMap.set(stateNum, state);
        this.stateMap.set(state.name, state);

        this.add(state);
    }

    createTransition(source, destination)
    {
        var transitionKey = source.name + "-" + destination.name;

        if(!this.transitionMap.has(transitionKey))
        {
            //var input = window.prompt("please enter transition", "");
            var transition = new Transition(source, destination, canvas);
            this.transitionMap.set(transitionKey, transition);
            source.storeAsSourceTransition(destination, transition);
            destination.storeAsDestinationTransition(source, transition);
        }
        else  
            alert("cannot add duplicate transition");
    }

    updateTransitionValue(key, value)
    {
        var transition = this.transitionMap.get(key.slice(1));
        transition.setValue(value);
    }
    
    refresh()
    {
        this.stateMap.forEach(state => {
           state.hideTransitionAdjusters(); 
        });
    }

    clear()
    {
        this.stateMap = new Map();
        this.stateIndexMap = new Map();
        this.transitionMap = new Map();
        this.remove(...this.getObjects());
    }

    //handles deletion of single objects
    handleDelete(){
        var selection = this.getActiveObject();

        if (selection.name[0]=="Q"){   //if a state is selected, delete it and its transitions
            this.deleteState(selection);
        }
        else if (selection.name[0]=="T"){ //if selected the text of the transition
            var transition = this.transitionMap.get(selection.name.slice(1))  //key string after first T
            this.deleteTransition(transition); //delete the transition visual and update logic
        }
    }
  
     //deletes the transmision and updates the program logic related to it
    deleteTransition(transition){

      transition.source.sourceTransitions.delete(transition.destination.name);
      transition.destination.destinationTransitions.delete(transition.source.name);
      this.transitionMap.delete(transition.source.name + "-" + transition.destination.name)
      this.remove(transition.line);
      this.remove(transition.adjuster);
      this.remove(transition.text);
      this.remove(transition.directionArrow);
      this.discardActiveObject();
      this.requestRenderAll();
    }
  
    deleteState(state){
      //remove the state visual
      if (state.type === 'activeSelection') 
      {
          state.forEachObject(function(element){
              this.remove(element);
          });
      }
      else{
          this.remove(state);
      }

      this.discardActiveObject();
      this.requestRenderAll();
  
      //remove the connected transitions, logic updated in deleteTransition()
      var sources = state.sourceTransitions.values();
      var destinations = state.destinationTransitions.values();
  
      let t = sources.next();
      while(!t.done){
        this.deleteTransition(t.value);
        t = sources.next();
      }
  
      t = destinations.next();
      while(!t.done){
        this.deleteTransition(t.value);
        t = destinations.next();
      }
  
      //update canvas map logic
      this.stateIndexMap.delete(state.stateNum);
      this.stateMap.delete(state.name);
    }
}