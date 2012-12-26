var series = function() {
    var args = [].slice.call(arguments,0);
    for (var i = 0;i < args.length; i++) {
        this.sources.push(args[i]);
    }
};
var to = function(el) {
    this.canvas = el;
    this.ctx = el.getContext('2d');
};
var todiv = function(el) {
    this.div = el;
    for (var i = 0; i < this.sources.length; i++) {
        var source = this.sources[i];
        var put = function(data) {
            this.div.innerHTML = data;
        };
        source.on('data',put.bind(this));
    }
};
var chart = function() {
    this.sources = [];
    this.to = to;
    this.toDiv = todiv;
    this.series = series;
};
exports.Chart = chart;
