
class Transition{

    constructor(source, destination, canvas)
    {
        this.source = source;
        this.destination = destination;
        this.name = source.name + "-" + destination.name;
        
        this.offsetX = Transition.calculateOffsetX(source, destination);
        this.offsetY = Transition.calculateOffsetY(source, destination);

        this.line = this.renderTransitionLine(this.source, this.destination);
        canvas.add(this.line);
        canvas.sendToBack(this.line);

        this.adjuster = this.makeCurvePoint(this.offsetX, this.offsetY, this.line);
        this.adjuster.name = "A" + this.name;
        canvas.add(this.adjuster);
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

    updatePathSource(x, y)
    {
        this.line.path[0][1] = x;
        this.line.path[0][2] = y;
    }

    updatePathDestination(x, y)
    {
        this.line.path[1][3] = x;
        this.line.path[1][4] = y;
    }

    static calculateOffsetX(source, destination)
    {
        return (destination.x + source.x)/2;
    }

    static calculateOffsetY(source, destination)
    {
        return (destination.y + source.y)/2;
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