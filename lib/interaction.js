//var Hash = require('hashish');


var colorToString = function(color) {
    return 'rgb('+color[0]+','+color[1]+','+color[2]+')';
};
// get left and right neighbors of x
var getNeighbors = function(x,list) {
    var left = undefined;
    var right = undefined;
    for (var i = 0; i < list.length; i++) {
        var point = list[i];
        if (point.x <= x) 
            left = list[i];
        if (point.x > x)
            right = list[i];
        if (right !== undefined) 
            break;
    }
    
    return {left:left,right:right}
};
var equationY = function(point1,point2,x) {
    var m = (point2.y - point1.y) / (point2.x - point1.x);
    return (m * (x - point1.x)) + point1.y
}
var drawVerticalLine = function(params) {
    var ctx = params.ctx;
    ctx.strokeStyle = '#FFF';
    ctx.clearRect(0,0,params.width,params.height);
    ctx.beginPath();
    ctx.moveTo(params.x,params.height);
    ctx.lineTo(params.x,0);
    ctx.stroke();
};
var drawIntersections = function(params) {
    var sources = params.sources;
    var ctx = params.ctx;
    var x = params.x;
    sources.forEach(function(source) {
        var datahash = source.displayData;
        if (datahash !== undefined) {
            Object.keys(datahash).forEach(function(key) {
                var val = datahash[key];
                var neighbors = getNeighbors(x,val.list);
                if ((neighbors.left !== undefined) && (neighbors.right !== undefined)) {
                    var intersectY = equationY(neighbors.left,neighbors.right,x); 
                    ctx.beginPath();
                    ctx.fillStyle = '#FFFF00';
                    ctx.strokeStyle = '#FF0000';
//                  ctx.strokeStyle = colorToString(val.yaxis.color);
                    ctx.arc(x, intersectY,6, 0, Math.PI*2, false);
                    ctx.fill();
                    ctx.stroke();
                }
            });
        }
    });
};
var mousemove = function(ev) {
    var offset = $('#chartWrappingDiv').offset();
    var x = ev.pageX - offset.left;
    var y = ev.pageY - offset.top;
    
    this.lastx = x; 
    drawVerticalLine({ctx:this.ctx,height:this.canvas.height,width:this.canvas.width,x:x});
    drawIntersections({ctx:this.ctx,sources:this.sources,x:x});
};

var redraw = function() {
    if (this.lastx !== undefined) {
        var x = this.lastx;
        drawVerticalLine({ctx:this.ctx,height:this.canvas.height,width:this.canvas.width,x:x});
        drawIntersections({ctx:this.ctx,sources:this.sources,x:x});
    } 
};
var interaction = function (params) {

    this.lastx = undefined;
   
    // these are exported to this for the test scripts
    this.getNeighbors = getNeighbors;
    this.equationY = equationY;

    this.drawVerticalLine = drawVerticalLine;
    this.drawIntersections = drawIntersections;
    this.mousemove = mousemove.bind(this);

    this.ctx = params.ctx;
    this.canvas = params.canvas;    
    this.sources = params.sources;

    this.redraw = redraw.bind(this);
};
exports = module.exports = interaction;
