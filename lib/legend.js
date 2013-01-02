var mrcolor = require('mrcolor');
var nextcolor = mrcolor();
var hat = require('hat');
var rack = hat.rack(128,10,2);

var axishash = {};
// foreach key in data add to hash axises 
// if new addition, create a color.
exports.update = function(list) {
    list.forEach(function(data) {
        Object.keys(data).forEach(function(key) {
            if (axishash[key] === undefined) {
                var color = nextcolor().rgb();
                axishash[key] = {
                    color:color
                };
            }
        });
    });
    return axishash;
};
exports.updateHTML = function(params) {
};
