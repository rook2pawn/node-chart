var lib = require('./lib');
var hat = require('hat');
var rack = hat.rack();
var mrcolor = require('mrcolor');
var nextcolor = mrcolor();

var series = function() {
    var args = [].slice.call(arguments,0);
    for (var i = 0;i < args.length; i++) {
        var source = args[i];
        var id = rack();
        source.id = id; 
        this.buffer[id] = document.createElement('canvas');
        this.bufferctx[id] = this.buffer[id].getContext('2d');
        this.sources.push(source);
    }
};
var to = function(el) {
    this.canvas = el;
    this.ctx = el.getContext('2d');
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
    this.sources.forEach(function(source) {
        var id = source.id;    
        this.buffer[id].width = this.canvas.width;
        this.buffer[id].height = this.canvas.height;
        source.color = nextcolor().rgb();
        $(this.buffer[id]).css('position','absolute');
        $(el).before(this.buffer[id]);
        var put = function(data) {
            if (source.count === undefined)
                source.count = 0;
            source.count++;
            if (source.dataset === undefined)
                source.dataset = [];
            source.dataset.push(data); 
            
            var windowsize = source.windowsize || 10;
            var datatodisplay = lib.cropData(source.dataset,windowsize);
            var x = lib.getStartX(datatodisplay.length,windowsize,this.canvas.width); 
            var spacing = lib.getSpacing(windowsize,this.canvas.width);

            this.bufferctx[id].clearRect(0,0,this.buffer[id].width,this.buffer[id].height);    
            datatodisplay.forEach(function(data,idx) {
                lib.drawDot({
                    x:x+(idx*spacing),
                    y:this.buffer[id].height - data, 
                    radius:5,
                    ctx:this.bufferctx[id],
                    color:source.color
                });
            },this);
        };
        source.on('data',put.bind(this));
    },this);
};
var todiv = function(el) {
    this.div = el;
    this.sources.forEach(function(source) {
        var put = function(data) {
            this.div.innerHTML = data;
        };
        source.on('data',put.bind(this));
    },this);
};
var chart = function() {
    this.buffer = document.createElement('canvas');
    this.bufferctx = this.buffer.getContext('2d');
    this.sources = [];
    this.to = to;
    this.toDiv = todiv;
    this.series = series;
};
exports.Chart = chart;
