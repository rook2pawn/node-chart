var ee = require('events').EventEmitter;
var nodechart = require('../../index.js');
var datasource = new ee;
$(window).ready(function() {
    var values1 = [500,492,488,440,400,390,420,390,350,200,200,100,96,94,95,92,80,81,50];
    var values2 = [1,3,2,9,9,12,15,2,2,9,30,11,1,0,0,0,0,0,4];
    var chart = new nodechart.Chart();
    chart.series(datasource);
    chart.to(document.getElementById('mycanvas'));
    chart.legend(document.getElementById('mylegend'));
    setInterval(function() {
        if ((values1.length > 0) && (values2.length > 0)) {
            var v1 = values1.shift();
            var v2 = values2.shift();
            datasource.emit('data',{higher:v1,lower:v2});
        }
    },1000);
});
