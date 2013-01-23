var ee = require('events').EventEmitter;
var nodechart = require('../../index.js');
var datasource = new ee;
$(window).ready(function() {
    var chart = new nodechart;
    chart.series(datasource);
    chart.legend(document.getElementById('mylegend'));
    chart.to(document.getElementById('mycanvas'));
//    chart.color.legendbg = "#C45AEC";
    setInterval(function() {
        var a = Math.floor(Math.random()*30);
        var b = Math.floor(Math.random()*1000);
        var c = Math.floor(Math.random()*200);
        datasource.emit('data',{'php value':a,'nodejs value':b, 'fortran value':c});
    },1000);
});
