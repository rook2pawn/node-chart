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
