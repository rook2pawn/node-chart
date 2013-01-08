var lib = require('../lib/interaction');
var test = require('tap').test;
test('getNeighbors',function(t) {
    t.plan(5);
    var list = [{x:2,y:3},{x:3,y:9},{x:6,y:15}];
    var neighbors = lib.getNeighbors(4,list);
    t.deepEquals(neighbors,{left:{x:3,y:9},right:{x:6,y:15}});
    neighbors = lib.getNeighbors(1,list);
    t.deepEquals(neighbors,{left:undefined,right:{x:2,y:3}});
    neighbors = lib.getNeighbors(2.5,list);
    t.deepEquals(neighbors,{left:{x:2,y:3},right:{x:3,y:9}});
    neighbors = lib.getNeighbors(3,list);
    t.deepEquals(neighbors,{left:{x:3,y:9},right:{x:6,y:15}});
    neighbors = lib.getNeighbors(7,list);
    t.deepEquals(neighbors,{left:{x:6,y:15},right:undefined});
});
