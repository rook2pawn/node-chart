var lib = require('./lib');

var series = function() {
    var args = [].slice.call(arguments,0);
    for (var i = 0;i < args.length; i++) {
        this.sources.push(args[i]);
    }
};
var to = function(el) {
    this.canvas = el;
    this.ctx = el.getContext('2d');
    this.ctx.font = '20pt Arial';
    this.ctx.fillStyle = '#000000';
    this.sources.forEach(function(source) {
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

            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);    
            datatodisplay.forEach(function(data,idx) {
                this.ctx.beginPath();
                this.ctx.arc(x + (idx*spacing), this.canvas.height - data, 5, 0, Math.PI*2, false);
                this.ctx.stroke();
            },this);
//            this.ctx.fillText(data,0,100);
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
