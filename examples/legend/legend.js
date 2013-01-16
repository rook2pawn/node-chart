var ee = require('events').EventEmitter;
var nodechart = require('../../index.js');
var datasource = new ee;
$(window).ready(function() {
    var chart = new nodechart;
    chart.series(datasource);
    chart.legend(document.getElementById('mylegend'));
    chart.to(document.getElementById('mycanvas'));
    var height = 100;
    setInterval(function() {
        var a = Math.floor(Math.random()*height);
        var b = Math.floor(Math.random()*height);
        var c = Math.floor(Math.random()*height);
        datasource.emit('data',{'andale mono':a,bauhaus:b,c:c});
    },1000);
});
