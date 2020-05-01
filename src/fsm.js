
class FSM {

    constructor(transitionMap)
    {
        this.transitionMap = transitionMap;
        this.resultDisplay = document.getElementById("resultDisplay");
    }

    
    //function checks whether is deterministic or non deterministic
    startMachine(input)
    {
        console.log(input);
        var currentState = this.getStartState();
        var isNDFSM = false;

        for(var i=0; i<input.length; i++)
        {
            this.transitionMap.forEach(e => {
                var arr = e.value.split(",");

                if( currentState.stateNum == e.source.stateNum && arr.includes(input.charAt(i)) )
                {
                    if(this.hasMultiplePaths(currentState, input.charAt(i)) != 0)
                        isNDFSM = true;
                    
                    currentState = e.destination; 
                }
            })
        }

        if(isNDFSM == true)
            this.runNDFSM(input);
        else if(isNDFSM == false)
            this.runDFSM(input);
    }

    runDFSM(input)
    {          
        console.log("deterministic");
        var isStuck = false; //flag to see if transition is stuck
        var currentState = this.getStartState(); //get Q0
       
        for(var i=0; i<input.length; i++)
        {
            var flag = 0;

            this.transitionMap.forEach(e => {
                var arr = e.value.split(",");

                if( currentState.stateNum == e.source.stateNum && arr.includes(input.charAt(i)) )
                {                    
                    flag = 1;
                    console.log("moved to: "+e.destination.stateNum+ ", from: "+ e.source.stateNum +", on: "+ e.value);
                    currentState = e.destination; 
                }
            });

            if(flag == 0)
                isStuck = true;
        }

        if(currentState.isAcceptState && isStuck == false)
            this.showSuccess();
        else if(!currentState.isAcceptState || isStuck == true)    
            this.showFailure();
    }
    

    runNDFSM(input)
    {
        var stack = new Stack();
        var indexStack = new Stack();
        var visitedMap = new Map();
        var currentState = this.getStartState();
        var accepted = false;
        var isStuck = false;

        for(var i=0; i<input.length; i++)
        {
            var flag = false; 
            
            this.transitionMap.forEach(e => {
                var arr = e.value.split(',');
            
                if( currentState.stateNum == e.source.stateNum && arr.includes(input.charAt(i)) ){

                    flag = true;
                    //has no alternative paths, move to next state
                    if(this.hasMultiplePaths(currentState, input.charAt(i)) == 0){
                        console.log("moved to: "+e.destination.stateNum+ ", from: "+ e.source.stateNum +", on: "+ e.value);
                        currentState = e.destination;
                    }
                    
                    //has an alternative path, choose a state and add state to visited
                    else{
                        var paths = this.hasMultiplePaths(currentState, input.charAt(i));
                        stack.push(e);
                        indexStack.push(i);
                        
                        //if state has not been visited, add it to map
                        if(visitedMap.get(e.source.stateNum) == undefined)
                        {
                            var temp = [];
                            temp.push(e.destination.stateNum);
                            visitedMap.set(e.source.stateNum, temp) 

                            currentState = e.destination;
                            console.log("moved to: "+e.destination.stateNum+ ", from: "+ e.source.stateNum +", on: "+ e.value);
                          
                        }
                        
                        //if state has been visited, then get the visited states, and go to state that is not visited.
                        else
                        {
                            var temp = visitedMap.get(e.source.stateNum);

                            this.transitionMap.forEach(t => {
                                var arr2 = t.value.split(',');

                                if(currentState.stateNum == t.source.stateNum && arr2.includes(input.charAt(i)) && temp.includes(t.source.stateNum) != true) 
                                {
                                    currentState = t.destination;
                                    console.log("moved to: "+t.destination.stateNum+ ", from: "+ t.source.stateNum +", on: "+ t.value);
                                    temp.push(currentState.stateNum);
                                    visitedMap.set(t.source.stateNum, temp)                                           
                                }
                            })
                        } 
                    }
                }
            })

            //make sure it has read the whole string
            if(flag == false)
                isStuck = true;
            
        }

        if(currentState.isAcceptState == true && isStuck == false)
        {
            accepted = true;
        }

        //if language is not acepted on the first run, the loop through it again
        if(accepted == false)
        {      
            while(stack.isEmpty() == false && accepted == false)
            {
                var state = stack.peek();
                var index = indexStack.peek();
                accepted = this.backtrack(state, index, visitedMap, input, stack, indexStack);
            }
        }
        
        if(accepted == true)
            this.showSuccess();
        else if(accepted == false)
            this.showFailure();
    }

    //loops through the machine to find previous state that has alternative paths and explores them.
    backtrack(state, index, visitedMap, input, stack, indexStack)
    {
        var currentState = state.source;
        var pathsLeft = false;
        var isStuck = false;


        for(var i = index; i<input.length; i++)
        {
            this.transitionMap.forEach(e => {
                var arr = e.value.split(',');

                if( currentState.stateNum == e.source.stateNum && arr.includes(input.charAt(i)) )
                {
            
                    if(this.hasMultiplePaths(currentState, input.charAt(i) != 0 && state.source.stateNum  != currentState.stateNum ))
                    {
                        stack.push(e);
                        indexStack.push(i);

                        pathsLeft = true;
                    }

                    if(visitedMap.get(e.source.stateNum) == undefined)
                        {
                            var temp = [];
                            temp.push(e.destination.stateNum);
                            visitedMap.set(e.source.stateNum, temp);
                            currentState = e.destination;
                            console.log("moved to: "+e.destination.stateNum+ ", from: "+ e.source.stateNum +", on: "+ e.value);
                            console.log(i);
                        }
                        
                        else
                        {
                            var visited = visitedMap.get(e.source.stateNum);
                            var found = false;
                            this.transitionMap.forEach(t => {
                                var arr2 = t.value.split(',');

                                if(currentState.stateNum == t.source.stateNum && arr2.includes(input.charAt(i)) && visited.includes(t.destination.stateNum) != true) 
                                {
                                    found = true; 
                                    currentState = t.destination;
                                    console.log("moved to: "+t.destination.stateNum+ ", from: "+ t.source.stateNum +", on: "+ t.value);

                                    visited.push(currentState.stateNum);
                                    visitedMap.set(t.source.stateNum, visited) 
                                }
                            
                            })

                            //exhausted all of the search on that state
                            if(found == false )
                                isStuck = true                             
                            
                            if(pathsLeft == false)
                            {
                                stack.pop();
                                stack.pop();
                            }

                        }     

                }
            })
        }

        if(currentState.isAcceptState == true && isStuck == false)
            return true;
        else
            return false;

    }

    //check if machine is nondeterministic
    hasMultiplePaths(currentState, input)
    {
        var found = 0;
        var paths = [];
        this.transitionMap.forEach(e => {
            var arr = e.value.split(",");

            if( currentState.stateNum == e.source.stateNum && arr.includes(input))
            {
                paths.push(e.destination.stateNum);    
                found++;    
            }
        });


        if(found > 1)
             return 1;  
        else 
            return 0;   
    }

    getStartState()
    {
        var startState;
        this.transitionMap.forEach(e => {
            
            var temp = e.source;
            
            if(temp.stateNum == 0)
                startState = temp;  
        });

        return startState;
    }

    showSuccess()
    {
        $("#"+this.resultDisplay.id).stop().fadeIn();
        this.resultDisplay.innerHTML = "The language was accepted";
        this.resultDisplay.style.fontWeight = "bold";
        this.resultDisplay.style.color = "#00cc66";
        $("#"+this.resultDisplay.id).fadeIn(100);
        $("#"+this.resultDisplay.id).delay(5000).fadeOut("fast");
    }


    showFailure()
    {
        $("#"+this.resultDisplay.id).stop().fadeIn();
        this.resultDisplay.innerHTML = "The language was NOT accepted";
        this.resultDisplay.style.fontWeight = "bold";
        this.resultDisplay.style.color = "#d92638";
        $("#"+this.resultDisplay.id).fadeIn(100);
        $("#"+this.resultDisplay.id).delay(5000).fadeOut("fast");;
    }
}