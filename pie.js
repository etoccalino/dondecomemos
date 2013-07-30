Pie = function (attrs) {
  var self = this;
  self.isCreated = false;

  if (! attrs.canvasSelector) throw new Error("Need to pass a canvas element selector");
  self.canvasSelector = attrs.canvasSelector;
  self.size = attrs.size || 300;
  self.radius = attrs.radius || self.size / 3;

  var create = function () {
    // self.svg = d3.select(self.canvasSelector).append('svg')
    //   .attr('width', '100%')
    //   .attr('height', '100%');

    // builtin range of colors
    self.color = d3.scale.category20c();

    self.isCreated = false;
    return self;
  }
  create();

  self.clear = function() {
    d3.select('svg').remove();
    create();
  };

  self.draw = function(data) {
    self.clear();

    var w = self.size, h = self.size, r = self.radius;

    var vis = d3.select(self.canvasSelector)
        .append("svg:svg")              //create the SVG element inside the <body>
        .data([data])                   //associate our data with the document
            .attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
            .attr("height", h)
        .append("svg:g")                //make a group to hold our pie chart
            .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius

    var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
        .outerRadius(r);

    var pie = d3.layout.pie()           //this will create arc data for us given a list of values
        .value(function(d) { return d.votes; });    //we must tell it out to access the value of each element in our data array

    var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
        .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
        .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
            .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                .attr("class", "slice");    //allow us to style things in the slices (like text)

        arcs.append("svg:path")
                .attr("fill", function(d, i) { return self.color(i); } ) //set the color for each slice to be chosen from the color function defined above
                .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

        arcs.append("svg:text")                                     //add a label to each slice
                .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                //we have to make sure to set these before calling arc.centroid
                d.innerRadius = 0;
                d.outerRadius = r;
                return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
            })
            .attr("text-anchor", "middle")                          //center the text on it's origin
            .text(function(d, i) {
              if (data[i].votes) {
                return data[i].name;
              }
              return null;
            });
  };
}
