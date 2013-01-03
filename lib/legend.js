var mrcolor = require('mrcolor');
var Hash = require('hashish');
var hat = require('hat');
var nextcolor = mrcolor();
var rack = hat.rack(128,10,2);

var util = undefined;
var axishash = {};
// foreach key in data add to hash axises 
// if new addition, create a color.
var colorToString = function(color) {
    return 'rgb('+color[0]+','+color[1]+','+color[2]+')';
};
var update = function(list) {
    list.forEach(function(data) {
        Hash(data)
            .filter(function(obj,key) {
                return key !== 'date'
            })
            .forEach(function(value,key) {
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
            })
        ;
    });
    return axishash;
};
var updateHTML = function(params) {
    if (params.el === undefined) {
        return;
    }
    var el = params.el;
    $(this.legend).css('height',Object.keys(axishash).length * 30);
    Object.keys(axishash).forEach(function(axis) {
        if (axishash[axis].newarrival === true) {
            var legendid = '_'+rack(axis);
            $(el)
                .append('<div class="legend" id="'+legendid+'"><div class="axisname">' + axis + '</div><hr style="border:thin solid '+colorToString(axishash[axis].color)+'" class="legendline" /></div>')
                .css('font-family','sans-serif');
            $('#'+legendid).click(function() {
                var legendname = rack.get(legendid.slice(1));
                axishash[legendname].display = !axishash[legendname].display; // toggle boolean
                util.redraw({yaxises:axishash});  
            });
        }
    },this);
};
exports = module.exports = function(params) {
    if (params !== undefined) 
        util = params.util;
    var self = {}
    self.update = update;
    self.updateHTML = updateHTML;
    return self;
};
