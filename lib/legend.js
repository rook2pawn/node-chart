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
                    color:color,
                    newarrival:true
                };
            } else {
                axishash[key].newarrival = false;
            }
        });
    });
    return axishash;
};
exports.updateHTML = function(params) {
    if (params.el === undefined) {
        return;
    }
    var el = params.el;
    // clear the this.legend html element
    // foreach axis, create a clickable object from html world to logic world
    $(this.legend).css('height',Object.keys(axishash).length * 30);
    Object.keys(axishash).forEach(function(axis) {
        if (axishash[axis].newarrival === true) {
            var legendid = '_'+rack(axis);
            console.log("added legendid: " + legendid);
            $(el)
                .append('<div class="legend" id="'+legendid+'"><div class="axisname">' + axis + '</div><div class="legendline"></div></div>')
                .css('font-family','sans-serif');
            $('#'+legendid).click(function() {
                var legendname = rack.get(legendid.slice(1));
                console.log(legendname);
            });
        }
    },this);
};
