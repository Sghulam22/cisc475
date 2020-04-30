
class FSM {

    constructor(transitionMap)
    {
        this.transitionMap = transitionMap;
        this.resultDisplay = document.getElementById("resultDisplay");
    }

    runAutomata(input)
    {  
        var isStuck = false;
        var currentState;
        this.transitionMap.forEach(e => {
            
            var temp = e.source;
            
            if(temp.stateNum == 0)
                currentState = temp;  
        });

        for(var i=0; i<input.length; i++)
        {
            var flag = 0;
            this.transitionMap.forEach(e => {

                var arr = e.value.split(",");

                if( currentState.stateNum == e.source.stateNum && arr.includes(input.charAt(i)) )
                {
                    flag = 1;
                    console.log("moved to: "+e.destination.stateNum + ", from: "+ e.source.stateNum +", on: "+ e.value);
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