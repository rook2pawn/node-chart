exports.mousemove = function(ev) {
    var offset = $('#chartWrappingDiv').offset();
    var x = ev.pageX - offset.left;
    var y = ev.pageY - offset.top;
    this.interactionctx.strokeStyle = '#FFF';
    this.interactionctx.clearRect(0,0,this.interaction.width,this.interaction.height);
    this.interactionctx.beginPath();
    this.interactionctx.moveTo(x,this.canvas.height);
    this.interactionctx.lineTo(x,0);
    this.interactionctx.stroke();
};
