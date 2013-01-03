var mrcolor = require('mrcolor');
var nextcolor = mrcolor();
var hat = require('hat');
var rack = hat.rack(128,10,2);

var axishash = {};
// foreach key in data add to hash axises 
// if new addition, create a color.
exports.colorToString = function(color) {
    return 'rgb('+color[0]+','+color[1]+','+color[2]+')';
};
exports.update = function(list) {
    list.forEach(function(data) {
        Object.keys(data).forEach(function(key) {
            if (axishash[key] === undefined) {
                var color = nextcolor().rgb();
                axishash[key] = {
                    color:color,
                    newarrival:true,
                    display:true
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
            $(el)
                .append('<div class="legend" id="'+legendid+'"><div class="axisname">' + axis + '</div><hr style="border:thin solid '+exports.colorToString(axishash[axis].color)+'" class="legendline" /></div>')
                .css('font-family','sans-serif');
            $('#'+legendid).click(function() {
                var legendname = rack.get(legendid.slice(1));
                axishash[legendname].display = !axishash[legendname].display; // toggle boolean
            });
        }
    },this);
};
