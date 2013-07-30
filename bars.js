Bars = function (attrs) {
  var self = this;
  self.isCreated = false;
  self.svg = null;

  if (! attrs.canvasSelector) throw new Error("Need to pass a canvas element selector");
  self.canvasSelector = attrs.canvasSelector;
  self.height = attrs.height || 20;
  self.width = attrs.width || 420;

  var create = function () {
    if (self.svg) {
      return false;
    }
    self.isCreated = false;
    return self;
  }
  create();

  self.clear = function() {
    d3.select('svg').remove();
    self.svg = null;
    create();
  };

  self.draw = function(data) {
    self.clear();

    var numPlaces = 5;
    var x = d3.scale.linear()
              .domain([0, _.max(_.pluck(data, 'votes'))])
              .range([0, self.width])

    self.svg = d3.select(self.canvasSelector).append('svg')
      .attr('class', 'bars')
      .attr('width', self.width)
      .attr('height', self.height * numPlaces);

    self.svg.selectAll("rect")
        .data(data)
      .enter(data).append("rect")
        .attr('y', function (d, i) {return i * self.height})
        .attr('height', self.height)
        .attr('width', function (d) { return x(d.votes) });
  };
}
