var ee = require('events').EventEmitter;
var nodechart = require('../../index.js');
var datasource = new ee;
var datasource2 = new ee;
$(window).ready(function() {
    var chart = new nodechart.Chart();
    chart.series(datasource);
    chart.series(datasource2);
    chart.to(document.getElementById('mycanvas'));
    setInterval(function() {
        var val = Math.floor(Math.random()*100);
        datasource.emit('data',{y:val});
    },1000);
    setInterval(function() {
        var val = Math.floor(Math.random()*40+60);
        datasource2.emit('data',{y2:val});
    },3000);
});
