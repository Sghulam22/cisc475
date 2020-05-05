
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

    //function that checks the language in a deterministic machine
    runDFSM(input)
    {          
        console.log("deterministic");
        var isStuck = false; //flag to see if transition is stuck
        var currentState = this.getStartState(); //get Q0
        var counter = 0;
       
        while(counter < input.length)
        {
            var incremented = false;
            var flag = 0;

            this.transitionMap.forEach(e => {
                var arr = e.value.split(",");

                //make sure that a transitiion exists given the current input
                if( currentState.stateNum == e.source.stateNum && arr.includes(input.charAt(counter)) )
                {         
                    counter++;  
                    incremented = true;         
                    flag = 1;
                    console.log("moved to: "+e.destination.stateNum+ ", from: "+ e.source.stateNum +", on: "+ e.value);
                    currentState = e.destination; 
                }

                else{
                    console.log("notfound")
                }
            });

            if(incremented == false)
                counter++;

            if(flag == 0)
                isStuck = true;
        }

        console.log(currentState.isAcceptState, isStuck);

        if(currentState.isAcceptState && isStuck == false)
            this.showSuccess();
        else if(!currentState.isAcceptState || isStuck == true)    
            this.showFailure();
    }

    //function that gets called if the machine is non-deterministic
    runNDFSM(input)
    {
        var stack = new Stack(); //stack to store states that have alternative paths
        var indexStack = new Stack(); //stack that stores the index of the language at the state
        var visitedMap = new Map(); //map that keeps history of explored paths 
        var currentState = this.getStartState(); 
        var accepted = false;
        var isStuck = false;
        var counter = 0;

        while(counter < input.length)
        {
            var incremented = false;
            var flag = 0;

            this.transitionMap.forEach(e => {
                var arr = e.value.split(',');
            
                if( currentState.stateNum == e.source.stateNum && arr.includes(input.charAt(counter)) )
                {
                    flag = 1;
                    incremented = true;
    

                    //has no alternative paths, move to next state
                    if(this.hasMultiplePaths(currentState, input.charAt(counter)) == 0){
                        currentState = e.destination;
                        //console.log(this.hasMultiplePaths(currentState,input.charAt(counter)));
                        console.log("moved to: "+e.destination.stateNum+ ", from: "+ e.source.stateNum +", on: "+ e.value);
                        console.log(input.charAt(counter));
                    }
                    
                    //has an alternative path, choose a state and add state to visited
                    else{
                        var paths = this.hasMultiplePaths(currentState, input.charAt(counter));
                        stack.push(e);
                        indexStack.push(counter);
                        
                        //if state has not been visited, add it to map
                        if(visitedMap.get(e.source.stateNum) == undefined)
                        {
                            var temp = [];

                            if(e.source.stateNum != e.destination.stateNum){
                                temp.push(e.destination.stateNum);
                                visitedMap.set(e.source.stateNum, temp) 
                            }
                            currentState = e.destination;
                            console.log("moved to: "+e.destination.stateNum+ ", from: "+ e.source.stateNum +", on: "+ e.value);
                          
                        }
                        
                        //if state has been visited, then get the visited states, and go to state that is not visited.
                        else
                        {
                            var temp = visitedMap.get(e.source.stateNum);

                            this.transitionMap.forEach(t => {
                                var arr2 = t.value.split(',');

                                //check if next state has not been explored yet
                                if(currentState.stateNum == t.source.stateNum && arr2.includes(input.charAt(counter)) && temp.includes(t.source.stateNum) != true) 
                                {
                                    currentState = t.destination;
                                    console.log("moved to: "+t.destination.stateNum+ ", from: "+ t.source.stateNum +", on: "+ t.value);
                                    
                                    if(e.source.stateNum != e.destination.stateNum){
                                        temp.push(currentState.stateNum);
                                        visitedMap.set(t.source.stateNum, temp)        
                                    }                                   
                                }
                            })
                        }    
                    }
                    counter++;
                }
            })

            if(incremented == false)
                counter++;

            //make sure it has read the whole string
            if(flag == 0){
                isStuck = true;
                console.log("isstuck: ",isStuck);
            }     
        }

        console.log(currentState.isAcceptState, currentState.stateNum)

        if(currentState.isAcceptState == true && isStuck == false)
        {
            accepted = true;
        }

        stack.print();
        indexStack.print();

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
        var counter = index;
    
        while(counter < input.length)
        {
            var incremented = false;

            this.transitionMap.forEach(e => {
                var arr = e.value.split(',');

                if( currentState.stateNum == e.source.stateNum && arr.includes(input.charAt(counter)))
                { 

                    if(this.hasMultiplePaths(currentState, input.charAt(counter) != 0 && state.source.stateNum  != currentState.stateNum ))
                    {
                        stack.push(e);
                        indexStack.push(counter);
                        pathsLeft = true;
                    }

                    //if state has never been explored, then store it in the map
                    if(visitedMap.get(e.source.stateNum) == undefined)
                    {
                        if(e.source.stateNum != e.destination.stateNum)
                        {
                            var temp = [];
                            temp.push(e.destination.stateNum);
                            visitedMap.set(e.source.stateNum, temp);
                        }

                        currentState = e.destination;
                        console.log("moved from: "+ e.source.stateNum + ", to: "+ e.destination.stateNum +", on: "+ e.value);
                        console.log(counter);
                    }
                    
                    //if already visited, store the next visited state in the map and make sure next state has not been already explored
                    else
                    {
                        var visited = visitedMap.get(e.source.stateNum); //get all the states already visited from the current state
                        var found = false;

                        this.transitionMap.forEach(t => {
                            var arr2 = t.value.split(',');

                            if(currentState.stateNum == t.source.stateNum && arr2.includes(input.charAt(counter)) && visited.includes(t.destination.stateNum) != true) 
                            {
                                found = true; 
                                currentState = t.destination;
                                console.log("moved from: "+ t.source.stateNum + ", to: "+ t.destination.stateNum +", on: "+ t.value);
                                
                                if(e.source.stateNum != e.destination.stateNum)
                                {
                                    visited.push(currentState.stateNum);
                                    visitedMap.set(t.source.stateNum, visited) 
                                }
                            }
                        })

                        //exhausted all of the search on that state
                        if(found == false)
                            isStuck = true                             
                        
                        if(pathsLeft == false)
                        {
                            stack.pop();
                            stack.pop();
                        }
                    } 

                    counter++;
                    incremented = true;
                }
            });

            if(incremented == false)
                counter++;            
        }

        if(currentState.isAcceptState == true && isStuck == false)
            return true;
        else
            return false;

    }

    //check if machine has alternative paths
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
            return paths;  
        else if(found <= 1 )
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
        this.resultDisplay.innerHTML = "The language was accepted";
        this.resultDisplay.style.fontWeight = "bold";
        this.resultDisplay.style.color = "#00cc66";
        $("#"+this.resultDisplay.id).fadeIn(100).delay(2000).fadeOut("fast");
    }


    showFailure()
    {
        this.resultDisplay.innerHTML = "The language was NOT accepted";
        this.resultDisplay.style.fontWeight = "bold";
        this.resultDisplay.style.color = "#d92638";
        $("#"+this.resultDisplay.id).fadeIn(100).delay(2000).fadeOut("fast");
    }
}