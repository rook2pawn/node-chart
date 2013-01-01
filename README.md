node-chart
==========

Time Series Charting Canvas API 

Use
===

    var chart = new Chart();
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

chart.legend
============

    <canvas id='legend'></canvas>
    chart.legend(document.getElementById('legend'));

Legend is automatically created with the data that is sent. 
To visualize and interact with a legend, use the .legend callback


Labels go with the value
------------------------

    datasorce.emit('data',{'units sold':9.2})

You can supply multiple labels
------------------------------

    datasorce1.emit('data',{'units sold':9.2})
    datasorce2.emit('data',{'current energy consumption':30})

Tests
=====

    // to install tap, simply npm install tap
    
    tap ./test


MISC
====

Author: David Wee <rook2pawn@gmail.com>
License: MIT
Developed At : Malhar, Inc. <david@malhar-inc.com>
