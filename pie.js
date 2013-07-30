Pie = function (attrs) {
  var self = this;
  self.isCreated = false;

  if (! attrs.canvasSelector) throw new Error("Need to pass a canvas element selector");
  self.canvasSelector = attrs.canvasSelector;

  var create = function () {
    self.svg = d3.select(self.canvasSelector).append('svg')
      .attr('width', '100%')
      .attr('height', '100%');
    self.isCreated = false;
    return self;
  }
  create();

  self.clear = function() {
    d3.select('svg').remove();
    create();
  };

  self.draw = function(data) {
    console.log('DRAW()');
  };
}
