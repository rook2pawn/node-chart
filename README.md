node-chart
==========

Time Series Charting Canvas API 

Use
===

    var chart = new nodeChart();
    var ee = require('events').EventEmitter;
    var datasource = new ee;

    chart.series(datasource);
    chart.to(document.getElementById('mychart'));

    setInterval(function() {
        var random = Math.floor(Math.random()*100);
        datasource.emit('data',{y:random});
    },1000);

Multiple Data sources
=====================

    var d1 = new ee;
    var d2 = new ee;

    chart.series(d1);
    chart.series(d2);
    
    // or
    chart.series([d1,d2])
        
    // or
    chart.series(d1,d2);

chart.series
============

Event types that chart.series responds to are 

'data' - provides data for timeseries and optional labels
'stop' - stops the timeseries for that datastream

You can supply a label
----------------------

    datasorce.emit('data',{y:9.2,label:"Units Sold"})

You can supply multiple labels
------------------------------

    datasorce1.emit('data',{y:9.2,label:"Units Sold"})
    datasorce2.emit('data',{y:30,label:"Current Energy consumption"})


You can supply multiple labels across the same datasource
---------------------------------------------------------

    datasorce.emit('data',{y:9.2,label:"Units Sold"})
    datasorce.emit('data',{y:30,label:"Current Energy consumption"})
