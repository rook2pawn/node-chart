var mrcolor = require('mrcolor');
var Hash = require('hashish');
var hat = require('hat');
var nextcolor = mrcolor();
var rack = hat.rack(128,10,2);

var util = undefined;
var axishash = {};
// foreach key in data add to hash axises 
// if new addition, create a color.
var colorToString = function(colorobj) {
    var color = colorobj.rgb();
    return 'rgb('+color[0]+','+color[1]+','+color[2]+')';
};
var update = function(list,linecolors) {
    list.forEach(function(data) {
        var idx = 0;
        Hash(data)
            .filter(function(obj,key) {
                return key !== 'date'
            })
            .forEach(function(value,key) {
                if (axishash[key] === undefined) {
                    var color = undefined;
                    if ((linecolors !== undefined) && (linecolors[idx] !== undefined)) 
                        color = mrcolor.rgbhexToColorObj(linecolors[idx]);
                    else 
                        color = nextcolor();
                    idx++;
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
var clear = function(legend_el) {
    axishash = {};
    $(legend_el).empty();   
};
var updateHTML = function(params) {
    if (params.el === undefined) {
        return;
    }
    var el = params.el;
//    $(this.legend).css('height',Object.keys(axishash).length * 30);
    Object.keys(axishash).forEach(function(axis) {
        if (axishash[axis].newarrival === true) {
            var legendlinestring = 'vertical-align:middle;display:inline-block;width:20px;border:thin solid '+colorToString(axishash[axis].color);
            var axisstring = 'padding:0;line-height:10px;font-size:10px;display:inline-block;margin-right:5px;';
            var legendid = '_'+rack(axis);
            $(el)
                .append('<div class="legend" id="'+legendid+'"><input type=checkbox checked></input><div style="'+axisstring+'" class="axisname">' + axis + '</div><hr style="'+ legendlinestring+'" class="legendline" /></div>')
                .css('font-family','sans-serif');
            $('#'+legendid).click(function() {
                var legendname = rack.get(legendid.slice(1));
                axishash[legendname].display = !axishash[legendname].display; // toggle boolean
                $(this).find('input[type="checkbox"]').attr('checked',axishash[legendname].display);
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
    self.clear = clear;
    return self;
};
