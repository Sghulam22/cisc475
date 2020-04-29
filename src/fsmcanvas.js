
class FSMCanvas extends fabric.Canvas{

    constructor(id)
    {
        super(id);
        this.selection = false;
        this.setHeight(window.innerHeight / 1.1);
        this.setWidth(window.innerWidth);

        this.stateMap = new Map();
        this.stateIndexMap = new Map();
        this.transitionMap = new Map();
        this.MAX_STATES = 20;

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
        if(source.name == destination.name)
            return;
        
        var transitionKey = source.name + "-" + destination.name;

        if(!this.transitionMap.has(transitionKey))
        {
            var transition = new Transition(source, destination, canvas);
            this.transitionMap.set(transitionKey, transition);
            source.storeAsSourceTransition(destination, transition);
            destination.storeAsDestinationTransition(source, transition);
        }
        else  
            alert("cannot add duplicate transition");
    }

    refresh()
    {
        this.stateMap.forEach(state => {
           state.hideTransitionAdjusters(); 
        });
    }
}