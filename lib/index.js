var mrcolor = require('mrcolor');
var Hash = require('hashish');
var nextcolor = mrcolor();

exports.cropData = function(list,windowsize) {
    if (list.length < windowsize)
        return list
    else return list.slice(list.length - windowsize)
};
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
exports.drawDot = function(params) {
    params.ctx.beginPath();
    params.ctx.strokeStyle='rgb('+params.color[0]+','+params.color[1]+','+params.color[2]+')';
    params.ctx.arc(params.x, params.y, params.radius, 0, Math.PI*2, false);
    params.ctx.stroke();
};
exports.drawLine = function(params) {
    params.ctx.beginPath();
    params.ctx.arc(params.x, params.y, params.radius, 0, Math.PI*2, false);
    params.ctx.stroke();
};

exports.setCanvas = function(el,that) {
    that.canvas = el;
    var wrappingDiv = document.createElement('div');
    wrappingDiv.height = that.canvas.height;
    $(that.canvas).wrap(wrappingDiv);
    that.ctx = el.getContext('2d');
    that.ctx.fillStyle = '#000';
    that.ctx.fillRect(0,0,that.canvas.width,that.canvas.height);
};
exports.legendGetKeys = function(list,legend) {
    list.forEach(function(data) {
        Object.keys(data).forEach(function(key) {
            if (legend[key] === undefined) {
                legend[key] = {
                    color:nextcolor().rgb()
                };
            }
        });
    });
};
exports.setSource = function(source) {
    var id = source.id;    
    this.buffer[id].width = this.canvas.width;
    this.buffer[id].height = this.canvas.height;
    $(this.buffer[id]).css('position','absolute');
    $(this.canvas).before(this.buffer[id]);
    this.legend = {};
    var onDataGraph = function(data) {
        if (source.count === undefined)
            source.count = 0;
        source.count++;
        if (source.dataset === undefined)
            source.dataset = [];
        source.dataset.push(data); 
         
       // to work on : legends, time grids, mouseover data / interactivity, y-axis scaling,
        // animation 
        var windowsize = source.windowsize || data.windowsize || 10;
        var datatodisplay = exports.cropData(source.dataset,windowsize);
        var x = exports.getStartX(datatodisplay.length,windowsize,this.canvas.width); 
        var spacing = exports.getSpacing(windowsize,this.canvas.width);

        this.bufferctx[id].clearRect(0,0,this.buffer[id].width,this.buffer[id].height);    

        // draw vertical grid
        datatodisplay.forEach(function(data,idx) {
            this.bufferctx[id].strokeStyle = 'rgba(255,255,255,0.5)';
            this.bufferctx[id].beginPath();
            this.bufferctx[id].moveTo(x+idx*spacing,0);
            this.bufferctx[id].lineTo(x+idx*spacing,this.buffer[id].height);
            this.bufferctx[id].stroke();
        },this);

        exports.legendGetKeys(datatodisplay,this.legend); 

        Object.keys(this.legend).forEach(function(yaxis) {

      
            // draw lines
            this.bufferctx[id].strokeStyle='rgb('+this.legend[yaxis].color[0]+','+this.legend[yaxis].color[1]+','+this.legend[yaxis].color[2]+')';
            datatodisplay.forEach(function(data,idx) {
                if (idx === 0) {
                    this.bufferctx[id].beginPath();
                    this.bufferctx[id].moveTo(x+idx*spacing,this.buffer[id].height - data[yaxis]);
                } 
                this.bufferctx[id].lineTo(x+(idx*spacing),this.buffer[id].height - data[yaxis]);
                if (idx == (datatodisplay.length -1)) {
                    this.bufferctx[id].stroke();
                }
            },this); 

            // draw dots
            datatodisplay.forEach(function(data,idx) {
                exports.drawDot({
                    x:x+(idx*spacing),
                    y:this.buffer[id].height - data[yaxis], 
                    radius:3,
                    ctx:this.bufferctx[id],
                    color:this.legend[yaxis].color
                });
            },this);

        },this);
    
    };
    source.on('data',onDataGraph.bind(this));
};
