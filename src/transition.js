
class Transition{

    constructor(source, destination, canvas)
    {
        this.source = source;
        this.destination = destination;
        this.name = this.name = "T" + source.name + "-" + destination.name;
        this.isSelfTransition = false;
        this.value = null;
        
        this.offsetX = Transition.calculateOffsetX(source, destination);
        this.offsetY = Transition.calculateOffsetY(source, destination);

        if(source.name == destination.name){
            this.line = this.renderLoopTransitionLine(this.source);
            this.isSelfTransition = true;
        }
        else
            this.line = this.renderTransitionLine(this.source, this.destination);

        canvas.add(this.line);
        canvas.sendToBack(this.line);

        this.adjuster = this.createCurveAdjuster(this.offsetX, this.offsetY, this.line);
        this.adjuster.name = "A" + this.name;

        this.text = new fabric.Text("edit", { 

            name: this.name,
            left: this.adjuster.left - 50,
            top: this.adjuster.top - 50,
            fill: 'black',
            selectable: true
        });

        this.directionArrow = new fabric.Triangle({
            name: "DirectionArrow",
            left: this.adjuster.left,
            top: this.adjuster.top,
            fill: 'black',
            width: 30,
            height: 30,
            selectable: true,
            angle: this.determineArrowAngle(source.left, source.top, destination.left, destination.top)
        });

        canvas.add(this.text);
        canvas.add(this.adjuster);
        canvas.add(this.directionArrow);
    }

    createCurveAdjuster(left, top, line) {
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

    determineArrowAngle(x1, y1, x2, y2) {

        var angle = 0, x, y;
    
        x = (x2 - x1);
        y = (y2 - y1);
    
        if (x === 0) {
          angle = (y === 0) ? 0 : (y > 0) ? Math.PI / 2 : Math.PI * 3 / 2;
        } else if (y === 0) {
          angle = (x > 0) ? 0 : Math.PI;
        } else {
          angle = (x < 0) ? Math.atan(y / x) + Math.PI : (y < 0) ? Math.atan(y / x) + (2 * Math.PI) : Math.atan(y / x);
        }
    
        return (angle * 180 / Math.PI + 90);
    }

    setValue(value)
    {
        this.value = value;
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

    renderLoopTransitionLine(source)
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

    updateArrowAngleAndPosition(source, destination)
    {
        this.directionArrow.set({
            left: Transition.calculateOffsetX(source, destination),
            top: Transition.calculateOffsetY(source, destination),
            angle: this.determineArrowAngle(source.left, source.top, destination.left, destination.top)
        });

        this.directionArrow.setCoords();
        this.directionArrow.selectable = true;
    }

    updateTextPosition(source, destination)
    {
        if(this.isSelfTransition)
        {
            this.text.left = this.line.left - 50;
            this.text.top = this.line.top;
        }
        else
        {
            this.text.left = Transition.calculateOffsetX(source, destination);
            this.text.top = Transition.calculateOffsetY(source, destination);
        }

        this.text.setCoords();
        this.text.selectable = true;
    }

    updateAdjusterPosition(source, destination)
    {
        if(this.isSelfTransition)
        {
            this.adjuster.left = this.line.left - 50;
            this.adjuster.top = this.line.top;
        }
        else
        {
            this.adjuster.left = Transition.calculateOffsetX(source, destination);
            this.adjuster.top = Transition.calculateOffsetY(source, destination);
        }
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
}
