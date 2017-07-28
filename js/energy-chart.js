
// Setting margin, width, height of plot
var margin = 50,
    width = 850 - margin,
    height = 500 - margin;

const STAGES = [2000, 2009, 2016];

// Creating a responsive svg element for the plot
// https://stackoverflow.com/questions/16265123/resize-svg-when-window-is-resized-in-d3-js - Responsive SVG
var svg = d3.select('#energy-chart')
            .append('div')
            .classed('svg-container', true)
            .append('svg')
            .attr('preserveAspectRatio', 'xMinyMin meet')
            .attr('viewBox', '0 0 ' + (width + margin) + ' ' + (height + margin))
            .classed('svg-content-responsive', true);

var g = svg.append('g')
           .attr('transform', 'translate(' + margin + ',' + 20 + ')');

// Convert Year column into date format
var parseYear = d3.timeParse("%Y")

// Set x- and y-axis scales
var x = d3.scaleTime()
          .rangeRound([0, width]);

var y = d3.scaleLinear()
          .rangeRound([height, 0]);


// Initialize d3 line function
var line = d3.line()
             .curve(d3.curveLinear)
             .x(function(d) {
                  return x(d['Year']);
             })
             .y(function(d) {
                  return y(d['World (TWh)'])
             });

// Initialize area chart
//var area = d3.area()
//             .x(function(d) { return x(d['Year']) })
//             .y0(y(0))
//             .y1(function(d) { return y(d['World (TWh)']) });

// Load data and apply main function
d3.csv("data/Sample-Energy-Data.csv", function(d) {
  d['Year'] = parseYear(d['Year']);
  d['World (TWh)'] = +d['World (TWh)'];
  return d;
}, function(error, data) {
  if (error) throw error;

  // Set x- and y-axis domains
  x.domain(d3.extent(data, function(d) { return d['Year']; }));

  var min_energy = d3.min(data, function(d) {
        return d['World (TWh)'];
  })

  y.domain([min_energy, 160000]);
  //y.domain(d3.extent(data, function(d) { return d['World (TWh)']; }));

  // Set x- and y-axes
  var x_axis = d3.axisBottom(x)

  var y_axis = d3.axisLeft(y)

  x_axis.ticks(5)
        .tickSizeOuter(0)
        .tickSizeInner(5)
        .tickPadding(4);

  y_axis.ticks(5)
        .tickSizeInner(-width)
        .tickSizeOuter(0)
        .tickPadding(8);


  // Add x-axis to plot
  g.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .attr('id', 'energy-x-axis')
    .call(x_axis)

  // Add y-axis to plot
  g.append('g')
    .attr('id', 'energy-y-axis')
    .call(y_axis)

  // Add line graph to plot
  var path = g.append('path')
              //.datum(data)
              .attr('d', line(data))
              .attr('fill', 'none')
              .attr('stroke', '#f67280')
              .attr('stroke-linejoin', 'round')
              .attr('stroke-linecap', 'round')
              .attr('stroke-width', 3);
              //.attr('d', line);

  var totalLength = path.node().getTotalLength();

  // Animate path
  path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
        .duration(1500)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);

  // Add area to line graph
  //g.append('path')
  // .datum(data)
  // .attr('fill', '#f67280')
  // .attr('opacity', 0.1)
  // .attr('d', area);

});
