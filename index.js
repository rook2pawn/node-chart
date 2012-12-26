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
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);    
            this.ctx.fillText(data,0,100);
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
    this.sources = [];
    this.to = to;
    this.toDiv = todiv;
    this.series = series;
};
exports.Chart = chart;
