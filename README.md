node-chart
==========

Time Series Charting Canvas API 

Use
===

    var Chart = require('chart');
    var chart = new Chart;
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

Multiple Y-Axises
=================

To have the data you emit treated as separate y-axises with different scaling, simply
pass a second object {multiple:true} in your emit

    datasource.emit('data',{stockPrice:235,temperature:88},{multiple:true});


chart.series
============

Event types that chart.series responds to are 

'data' - provides data for timeseries and optional labels

'stop' - stops the timeseries for that datastream

chart.legend
============

    <div id='legend'></div>
    chart.legend(document.getElementById('legend'));

Legend is automatically created with the data that is sent. 
To visualize and interact with a legend, use the .legend callback


legend.css
==========

    <link type='text/css' rel='stylesheet' href='legend.css' />

Also in the root directory of this package is a file called legend.css that you should include.


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
