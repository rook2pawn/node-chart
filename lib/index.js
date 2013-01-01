var mrcolor = require('mrcolor');
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
exports.legendGetKeys = function(list,axises) {
    list.forEach(function(data) {
        Object.keys(data).forEach(function(key) {
            if (axises[key] === undefined) {
                axises[key] = {
                    color:nextcolor().rgb()
                };
            }
        });
    });
};
var colorToString = function(color) {
    return 'rgb('+color[0]+','+color[1]+','+color[2]+')';
};
exports.setSource = function(source) {
    var id = source.id;    
    this.buffer[id].width = this.canvas.width;
    this.buffer[id].height = this.canvas.height;
    $(this.buffer[id]).css('position','absolute');
    $(this.canvas).before(this.buffer[id]);
    this.yaxises = {};
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


        var heightchunks = Math.floor(this.canvas.height / 10);
        for (var i = 0; i < heightchunks; i++) {
            this.bufferctx[id].strokeStyle = 'rgba(255,255,255,0.2)';
            this.bufferctx[id].beginPath();
            this.bufferctx[id].moveTo(0,i*heightchunks);
            this.bufferctx[id].lineTo(this.canvas.width,i*heightchunks);
            this.bufferctx[id].stroke();
        }
        
        // draw vertical grid
        datatodisplay.forEach(function(data,idx) {
            this.bufferctx[id].strokeStyle = 'rgba(255,255,255,0.5)';
            this.bufferctx[id].beginPath();
            this.bufferctx[id].moveTo(x+idx*spacing,0);
            this.bufferctx[id].lineTo(x+idx*spacing,this.buffer[id].height);
            this.bufferctx[id].stroke();
        },this);

        exports.legendGetKeys(datatodisplay,this.yaxises); 

        if (this.legend !== undefined) {
            $(this.legend).css('height',Object.keys(this.yaxises).length * 30);
            $(this.legend).empty();
            Object.keys(this.yaxises).forEach(function(axis,idx) {
                $(this.legend)
                    .append('<div class="legend">' + axis + '</div>')
                    .css('font-family','sans-serif');
            },this);
/*
            Object.keys(this.yaxises).forEach(function(axis,idx) {
                this.legendctx.fillStyle = '#FFF';
                this.legendctx.font = '12px sans-serif';
                this.legendctx.fillText(axis,10,(idx*30)+15);
                this.legendctx.strokeStyle = colorToString(this.yaxises[axis].color);
                this.legendctx.beginPath();
                this.legendctx.moveTo((axis.length*7)+12,(idx*30)+13);
                this.legendctx.lineTo((axis.length*7)+30,(idx*30)+13);
                this.legendctx.stroke();
            },this);
*/
        }

        Object.keys(this.yaxises).forEach(function(yaxis) {

      
            // draw lines
            this.bufferctx[id].strokeStyle= 'rgb('+this.yaxises[yaxis].color[0]+','+this.yaxises[yaxis].color[1]+','+this.yaxises[yaxis].color[2]+')';
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
                    color:this.yaxises[yaxis].color
                });
            },this);

        },this);
    
    };
    source.on('data',onDataGraph.bind(this));
};
