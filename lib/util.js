var Hash = require('hashish');

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
    var datatodisplay = params.datatodisplay;
    var startx = params.startx;
    var spacing = params.spacing;
    var canvas = params.canvas;
    var buffer = params.buffer;
    var bufferctx = params.bufferctx;
    var yaxises = params.yaxises;

    bufferctx.clearRect(0,0,buffer.width,buffer.height);    

    var heightchunks = Math.floor(canvas.height / 10);
    for (var i = 0; i < heightchunks; i++) {
        bufferctx.strokeStyle = 'rgba(255,255,255,0.2)';
        bufferctx.beginPath();
        bufferctx.moveTo(0,i*heightchunks);
        bufferctx.lineTo(canvas.width,i*heightchunks);
        bufferctx.stroke();
    }
    exports.drawVerticalGrid(datatodisplay,bufferctx,spacing,startx,buffer.height);
   
    Hash(yaxises)
        .filter(function(obj) {
            return (obj.display && obj.display === true)
        })
        .forEach(function(yaxis,key) {
            // draw lines
            bufferctx.strokeStyle = colorToString(yaxis.color);
            datatodisplay.forEach(function(data,idx) {
                if (idx === 0) {
                    bufferctx.beginPath();
                    bufferctx.moveTo(startx+idx*spacing,buffer.height - data[key]);
                } 
                bufferctx.lineTo(startx+(idx*spacing),buffer.height - data[key]);
                if (idx == (datatodisplay.length -1)) {
                    bufferctx.stroke();
                }
            },this); 
            // draw dots
            datatodisplay.forEach(function(data,idx) {
                drawDot({
                    x:startx+(idx*spacing),
                    y:buffer.height - data[key], 
                    radius:3,
                    ctx:bufferctx,
                    color:yaxis.color
                });
            },this);
        });
   
}
