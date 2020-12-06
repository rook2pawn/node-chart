# node-chart

SVG Time Series Charting API

# Use

    const Chart = require('chart');
    const chart = new Chart;

    const points = [
    { x: -2, y: -3 },
    { x: -1, y: -1 },
    { x: 1, y: 2 },
    { x: 4, y: 3 },
    ];

    chart.set('data', points)

# TODO

Scale data based on what's visible (minY, maxY)
Do sample data and then a random stream that's much smaller in y-values to test that scaling data works based on what's visible.
Zoom in, which rescales the graphs, should hold on data update.
