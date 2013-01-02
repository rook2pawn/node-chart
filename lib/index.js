var util = require('./util');

exports.setCanvas = function(el,that) {
    that.canvas = el;
    var wrappingDiv = document.createElement('div');
    wrappingDiv.height = that.canvas.height;
    $(that.canvas).wrap(wrappingDiv);
    that.ctx = el.getContext('2d');
    that.ctx.fillStyle = '#000';
    that.ctx.fillRect(0,0,that.canvas.width,that.canvas.height);
};
exports.setSource = function(source) {
    var id = source.id;    
    this.buffer[id].width = this.canvas.width;
    this.buffer[id].height = this.canvas.height;
    $(this.buffer[id]).css('position','absolute');
    $(this.canvas).before(this.buffer[id]);
    var onDataGraph = function(data) {
        if (source.count === undefined)
            source.count = 0;
        source.count++;
        if (source.dataset === undefined)
            source.dataset = [];
        source.dataset.push(data); 
        util.draw({canvas:this.canvas,source:source,data:data,buffer:this.buffer[id],bufferctx:this.bufferctx[id]});
    };
    source.on('data',onDataGraph.bind(this));
};
