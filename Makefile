all:
	browserify ./examples/simple/example1.js -o ./examples/simple/example1-bundle.js
	browserify ./examples/simple2/example2.js -o ./examples/simple2/example2-bundle.js
	browserify ./examples/legend/legend.js -o ./examples/legend/legend-bundle.js
	browserify ./examples/scaling/scaling.js -o ./examples/scaling/scaling-bundle.js
