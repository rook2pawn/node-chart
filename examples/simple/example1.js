var ee = require('events').EventEmitter;
var nodechart = require('../../index.js');
var datasource = new ee;
$(window).ready(function() {
    var chart = new nodechart;
    chart.series(datasource);
    chart.to(document.getElementById('mycanvas'));
    var up = false;
    setInterval(function() {
        var val = Math.floor(Math.random()*100);
        datasource.emit('data',{y:val});
/*
        if (!up) {
            datasource.emit('data',{y:0});
            up = true;
        } else {
            datasource.emit('data',{y:100});
            up = false;
        }
*/
    },2500);
});
