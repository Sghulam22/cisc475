
class Transition{

    constructor(source, destination, canvas)
    {
        this.source = source;
        this.destination = destination;
        this.name = "T";
        this.isSelfTransition = false;
        
        this.offsetX = Transition.calculateOffsetX(source, destination);
        this.offsetY = Transition.calculateOffsetY(source, destination);

        if(source.name == destination.name){
            this.line = this.renderLoopTransitionLine(this.source, this.destination);
            this.isSelfTransition = true;
        }
        else
            this.line = this.renderTransitionLine(this.source, this.destination);

        canvas.add(this.line);
        canvas.sendToBack(this.line);

        this.adjuster = this.makeCurvePoint(this.offsetX, this.offsetY, this.line);
        this.adjuster.name = "A" + this.name;
        canvas.add(this.adjuster);

        this.text = new fabric.Text("edit", { 

            name: this.name,
            left: this.adjuster.left,
            top: this.adjuster.top,
            fill: 'black',
            selectable: true
        });

        canvas.add(this.text);
    }

    renderTransitionLine(source, destination)
    {
        var line = new fabric.Path('M 65 0 Q 100, 100, 200, 0', { fill: '', stroke: 'black', strokeWidth: 5, objectCaching: false });
        
        line.path[0][1] = source.x;
        line.path[0][2] = source.y;
    
        line.path[1][1] = this.offsetX;
        line.path[1][2] = this.offsetY;
    
        line.path[1][3] = destination.x;
        line.path[1][4] = destination.y;
        
        line.selectable = false;

        return line;
    }

    renderLoopTransitionLine(source, destination)
    {
        var line = new fabric.Path('M 65 0 Q 100, 100, 200, 0', { fill: '', stroke: 'black', strokeWidth: 5, objectCaching: false });

        line.path[0][1] = 100;
        line.path[0][2] = 160;
    
        line.path[1][1] = 0;
        line.path[1][2] = 0;
    
        line.path[1][3] = 160;
        line.path[1][4] = 100;
        
        line.selectable = false;

        line.left = source.left - 15;
        line.top = source.top - 110;

        return line;
    }

    maintainLoopPosition(x, y)
    {
        this.line.left = x - 15;
        this.line.top = y - 110;
    }

    updateTextPosition(source, destination)
    {
        this.text.left = Transition.calculateOffsetX(source, destination);
        this.text.top = Transition.calculateOffsetY(source, destination);
        this.text.setCoords();
        this.text.selectable = true;
    }

    updateAdjusterPosition(source, destination)
    {
        this.adjuster.left = Transition.calculateOffsetX(source, destination);
        this.adjuster.top = Transition.calculateOffsetY(source, destination);
        this.adjuster.setCoords();
        this.adjuster.selectable = true;
    }

    updatePathSource(x, y)
    {
        if(this.isSelfTransition)
        {
            this.maintainLoopPosition(x, y);
            return;
        }

        this.line.path[0][1] = x;
        this.line.path[0][2] = y;
    }

    updatePathDestination(x, y)
    {
        if(this.isSelfTransition) { return; }
        
        this.line.path[1][3] = x;
        this.line.path[1][4] = y;
    }

    static calculateOffsetX(source, destination)
    {
        return (destination.left + source.left)/2;
    }

    static calculateOffsetY(source, destination)
    {
        return (destination.top + source.top)/2;
    }

    makeCurvePoint(left, top, line) {
        var c = new fabric.Circle({
        left: left,
        top: top,
        strokeWidth: 8,
        radius: 14,
        fill: '#fff',
        stroke: '#666'
        });

        c.hasBorders = c.hasControls = false;
        c.visible = false;
        c.line = line

        return c;
    }
}