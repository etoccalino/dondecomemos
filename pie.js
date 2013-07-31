Pie = function (attrs) {
  var self = this;
  self.isCreated = false;

  if (! attrs.canvasSelector) throw new Error("Need to pass a canvas element selector");
  self.canvasSelector = attrs.canvasSelector;
  self.size = attrs.size || 300;
  self.radius = attrs.radius || self.size / 3;

  var create = function () {
    self.isCreated = false;
    return self;
  }
  create();

  self.clear = function() {
    d3.select('svg').remove();
  };

  self.draw = function(data) {
    self.clear();

    var width = 960,
        height = 500,
        radius = Math.min(width, height) / 2;

    var colors = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"];
    var colorMap = _.chain(data).sortBy('name').pluck('name').zip(colors).object().value();

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 70);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.votes; });

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return colorMap[d.data.name]; });

    g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.votes ? d.data.name : null; });

  };
}
