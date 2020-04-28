

class State extends fabric.Group{

    constructor(stateNum, x, y)
    {
        super();
        this.stateNum = stateNum;
        this.name = 'Q'+this.stateNum;
        this.left = this.x = x;
        this.top = this.y = y;
        this.circle = null;
        this.text = null;

        this.draw(x, y);
        
        this.addWithUpdate(this.circle);
        this.addWithUpdate(this.text);

        this.sourceTransitions = new Map();
        this.destinationTransitions = new Map();
    }

    draw(x, y)
    {
        this.circle = new fabric.Circle({

            strokeWidth: 5,
            radius: 50,
            fill: '#fff',
            stroke: 'black',
            left: this.left,
            top: this.top,
            
        });
        this.text = new fabric.Text(this.name, { 
            left: this.left,
            top: this.top,
            fill: 'black'
        });
    }

    storeAsSourceTransition(neighbor, transition)
    {
        this.sourceTransitions.set(neighbor.name, transition);
    }

    storeAsDestinationTransition(neighbor, transition)
    {
        this.destinationTransitions.set(neighbor.name, transition);
    }

    showTransitionAdjusters()
    {
        this.sourceTransitions.forEach(transition => {

            transition.adjuster.visible = true;

            transition.adjuster.animate('opacity', '1', {
              duration: 200,
              onChange: canvas.renderAll.bind(canvas),
            });
            transition.adjuster.selectable = true;
        });
    
        this.destinationTransitions.forEach(transition => {
  
            transition.adjuster.visible = true;
            
            transition.adjuster.animate('opacity', '1', {
              duration: 200,
              onChange: canvas.renderAll.bind(canvas),
            });
            transition.adjuster.selectable = true;
        });
    }

    hideTransitionAdjusters()
    {
        this.sourceTransitions.forEach(transition => {

            transition.adjuster.animate('opacity', '0', {
              duration: 200,
              onChange: canvas.renderAll.bind(canvas),
            });
            transition.adjuster.selectable = false;
        });
      
        this.destinationTransitions.forEach(transition => {
    
            transition.adjuster.animate('opacity', '0', {
                duration: 200,
                onChange: canvas.renderAll.bind(canvas),
            });
            transition.adjuster.selectable = false;
        });
    }
}