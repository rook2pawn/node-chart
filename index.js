var lib = require('./lib');
var hat = require('hat');
var rack = hat.rack();

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
    // wrap canvas in a div, set this.canvas and this.ctx
    lib.setCanvas(el,this)
    this.sources.forEach(lib.setSource.bind(this));
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
var legend = function(el) {
    this.legend_el = el; 
    var jq_el = $(el);
    jq_el.css('width','300px');
    jq_el.css('background-color','black');
    jq_el.css('cursor','pointer');
    jq_el.css('color','#FFF');
};
var chart = function() {
    this.buffer = {};
    this.bufferctx = {};
    this.sources = [];
    this.to = to;
    this.toDiv = todiv;
    this.series = series;
    this.legend = legend;
};
exports.Chart = chart;
