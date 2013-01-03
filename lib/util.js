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
exports.drawHorizontalGrid = function(width,height,ctx ){
    var heightchunks = Math.floor(height / 10);
    for (var i = 0; i < heightchunks; i++) {
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath();
        ctx.moveTo(0,i*heightchunks);
        ctx.lineTo(width,i*heightchunks);
        ctx.stroke();
    }
}
var getDateString = function(date) {
    var pad = function(str) {
        if (str.length == 1) 
            return '0'.concat(str)
        if (str.length === 0) 
            return '00'
        else 
            return str
    };  
    var seconds = pad(date.getSeconds());
    var minutes = pad(date.getMinutes());
    
    return date.getHours() % 12 + ':' + minutes + ':' + seconds; 
};
exports.rangeY = function(list) {
    var minY = undefined;
    var maxY = undefined;
    for (var i = 0; i < list.length; i++) {
        Hash(list[i]).filter(function(val,key) { return (key !== 'date') }).forEach(function(val,key) {
            if (minY == undefined) 
                minY = val;
            if (maxY == undefined)
                maxY = val;
            if (val < minY)
                minY = val;
            if (val > maxY)
                maxY = val;
        });
    }
    var spread = undefined;
    if ((minY!== undefined) && (maxY !== undefined)) {
        spread = maxY - minY;
    }
    // shift is the amount any value in the interval needs to be shifted by to fall with the interval [0,spread]
    var shift = undefined;
    if ((minY < 0) && (maxY >= 0)) {
        shift = Math.abs(minY);
    }
    if ((minY < 0) && (maxY < 0)) {
        shift = Math.abs(maxY) + Math.abs(minY);
    }
    if (minY > 0) {
        shift = -minY;
    }
    if (minY == 0) 
        shift = 0;
    return {min:minY,max:maxY,spread:spread,shift:shift}
};
exports.drawVerticalGrid = function(datatodisplay,ctx,spacing,startx,height) {
    // draw vertical grid
    ctx.fillStyle = '#FFF';
    for (var i = 0; i < datatodisplay.length;i++) {
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.moveTo(startx+i*spacing,0);
        ctx.lineTo(startx+i*spacing,height);
        ctx.stroke();
        var datestring = getDateString(datatodisplay[i].date);
        ctx.fillText(datestring,startx+i*spacing,height);
    }
};
var lastsavedparams = {};
exports.draw = function (params) {
    lastsavedparams = params;
    var datatodisplay = params.datatodisplay;
    var startx = params.startx;
    var spacing = params.spacing;
    var buffer = params.buffer;
    var bufferctx = params.bufferctx;
    var yaxises = params.yaxises;

    bufferctx.clearRect(0,0,buffer.width,buffer.height);    
    var range = exports.rangeY(datatodisplay);
    Hash(yaxises)
        .filter(function(obj) {
            return (obj.display && obj.display === true)
        })
        .forEach(function(yaxis,key) {
            // draw lines
            bufferctx.strokeStyle = colorToString(yaxis.color);
            datatodisplay.forEach(function(data,idx) {
                var yval = 0;
                var ratio = (data[key] + range.shift) / range.spread;
                if (range.spread !== 0) {
                    yval = ratio * buffer.height;
                }
                if (idx === 0) {
                    bufferctx.beginPath();
                    bufferctx.moveTo(startx+idx*spacing,buffer.height - yval);
                } else {
                    bufferctx.lineTo(startx+(idx*spacing),buffer.height - yval);
                }
                if (idx == (datatodisplay.length -1)) {
                    bufferctx.stroke();
                }
            },this); 
            // draw dots
            datatodisplay.forEach(function(data,idx) {
                var yval = 0;
                if (range.spread !== 0) {
                    yval = ((data[key] + range.shift) / range.spread) * buffer.height;
                }
                drawDot({
                    x:startx+(idx*spacing),
                    y:buffer.height - yval, 
                    radius:3,
                    ctx:bufferctx,
                    color:yaxis.color
                });
            },this);
        })
    ;
};
exports.redraw = function(params) {
    lastsavedparams.yaxises = params.yaxises;
    exports.draw(lastsavedparams);
};
