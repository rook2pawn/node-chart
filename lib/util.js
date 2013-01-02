var legend = require('./legend');

var getSpacing = function(windowsize,canvaswidth) {
    return Math.floor(canvaswidth / (windowsize-1));
}
exports.getSpacing = getSpacing;
exports.getStartX = function(length,windowsize,canvaswidth) {
    var x = undefined;
    var spacing = getSpacing(windowsize,canvaswidth);
    if (length <= windowsize) {
        x = canvaswidth - (spacing * (length-1));
    } else 
        x = 0;
    return x;
};
exports.cropData = function(list,windowsize) {
    if (list.length < windowsize)
        return list
    else return list.slice(list.length - windowsize)
};
var colorToString = function(color) {
    return 'rgb('+color[0]+','+color[1]+','+color[2]+')';
};
exports.colorToString = colorToString;
var drawDot = function(params) {
    params.ctx.beginPath();
    params.ctx.strokeStyle = colorToString(params.color);
    params.ctx.arc(params.x, params.y, params.radius, 0, Math.PI*2, false);
    params.ctx.stroke();
};
exports.drawDot = drawDot;
exports.drawLine = function(params) {
    params.ctx.beginPath();
    params.ctx.arc(params.x, params.y, params.radius, 0, Math.PI*2, false);
    params.ctx.stroke();
};
exports.drawVerticalGrid = function(datatodisplay,ctx,spacing,startx,height) {
    // draw vertical grid
    datatodisplay.forEach(function(data,idx) {
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.moveTo(startx+idx*spacing,0);
        ctx.lineTo(startx+idx*spacing,height);
        ctx.stroke();
    },this);
};
exports.draw = function (params) {
    var source = params.source;
    var data = params.data;
    var canvas = params.canvas;
    var buffer = params.buffer;
    var bufferctx = params.bufferctx;


   // to work on : legends, time grids, mouseover data / interactivity, y-axis scaling,
    // animation 
    var windowsize = source.windowsize || data.windowsize || 10;
    var datatodisplay = exports.cropData(source.dataset,windowsize);
    var x = exports.getStartX(datatodisplay.length,windowsize,canvas.width); 
    var spacing = exports.getSpacing(windowsize,canvas.width);

    bufferctx.clearRect(0,0,buffer.width,buffer.height);    

    var heightchunks = Math.floor(canvas.height / 10);
    for (var i = 0; i < heightchunks; i++) {
        bufferctx.strokeStyle = 'rgba(255,255,255,0.2)';
        bufferctx.beginPath();
        bufferctx.moveTo(0,i*heightchunks);
        bufferctx.lineTo(canvas.width,i*heightchunks);
        bufferctx.stroke();
    }
    exports.drawVerticalGrid(datatodisplay,bufferctx,spacing,x,buffer.height);
    
    var yaxises = legend.update(datatodisplay);
    if (this.legend !== undefined) 
        legend.updateHTML({el:this.legend});

    Object.keys(yaxises).forEach(function(yaxis) {
        // draw lines
        bufferctx.strokeStyle = colorToString(yaxises[yaxis].color);
        datatodisplay.forEach(function(data,idx) {
            if (idx === 0) {
                bufferctx.beginPath();
                bufferctx.moveTo(x+idx*spacing,buffer.height - data[yaxis]);
            } 
            bufferctx.lineTo(x+(idx*spacing),buffer.height - data[yaxis]);
            if (idx == (datatodisplay.length -1)) {
                bufferctx.stroke();
            }
        },this); 
        // draw dots
        datatodisplay.forEach(function(data,idx) {
            drawDot({
                x:x+(idx*spacing),
                y:buffer.height - data[yaxis], 
                radius:3,
                ctx:bufferctx,
                color:yaxises[yaxis].color
            });
        },this);
    },this);
}
