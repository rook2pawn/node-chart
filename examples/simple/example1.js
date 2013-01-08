var ee = require('events').EventEmitter;
var nodechart = require('../../index.js');
var datasource = new ee;
$(window).ready(function() {
    var chart = new nodechart.Chart();
    chart.series(datasource);
    chart.to(document.getElementById('mycanvas'));
    setInterval(function() {
        var val = Math.floor(Math.random()*100);
        datasource.emit('data',{y:val});
    },2500);
});
