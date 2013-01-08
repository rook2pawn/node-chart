//var Hash = require('hashish');


var colorToString = function(color) {
    return 'rgb('+color[0]+','+color[1]+','+color[2]+')';
};
// get left and right neighbors of x
exports.getNeighbors = function(x,list) {
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
exports.equationY = function(point1,point2,x) {
    var m = (point2.y - point1.y) / (point2.x - point1.x);
    return (m * (x - point1.x)) + point1.y
}
exports.mousemove = function(ev) {
    var offset = $('#chartWrappingDiv').offset();
    var x = ev.pageX - offset.left;
    var y = ev.pageY - offset.top;
    this.interactionctx.strokeStyle = '#FFF';
    this.interactionctx.clearRect(0,0,this.interaction.width,this.interaction.height);
    this.interactionctx.beginPath();
    this.interactionctx.moveTo(x,this.interaction.height);
    this.interactionctx.lineTo(x,0);
    this.interactionctx.stroke();
    
    this.sources.forEach(function(source) {
        var datahash = source.displayData;
        if (datahash !== undefined) {
            var that = this;
            Object.keys(datahash).forEach(function(key) {
                var val = datahash[key];
                var neighbors = exports.getNeighbors(x,val.list);
                if ((neighbors.left !== undefined) && (neighbors.right !== undefined)) {
                    var intersectY = exports.equationY(neighbors.left,neighbors.right,x); 
                    this.interactionctx.beginPath();
                    this.interactionctx.fillStyle = '#FFFF00';

                    this.interactionctx.strokeStyle = '#FF0000';
//                    this.interactionctx.strokeStyle = colorToString(val.yaxis.color);
                    this.interactionctx.arc(x, intersectY,6, 0, Math.PI*2, false);
                    this.interactionctx.fill();
                    this.interactionctx.stroke();
                }
            },this);
        }
    },this);
};
