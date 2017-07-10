
// Setting margin, width, height of plot
var margin = 50,
    width = 950 - margin,
    height = 550 - margin;

// Creating svg element for the plot
var svg = d3.select('#energy-chart')
            .append('svg')
            .attr('width', (width + margin))
            .attr('height', (height + margin));

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
             .x(function(d) {
                  return x(d['Year']);
             })
             .y(function(d) {
                  return y(d['World (TWh)'])
             });

// Load data and apply main function
d3.csv("data/Sample-Energy-Data.csv", function(d) {
  d['Year'] = parseYear(d['Year']);
  d['World (TWh)'] = +d['World (TWh)'];
  return d;
}, function(error, data) {
  if (error) throw error;

  // Set x- and y-axis domains
  x.domain(d3.extent(data, function(d) { return d['Year']; }));
  y.domain(d3.extent(data, function(d) { return d['World (TWh)']; }));

  // Add x-axis to plot
  g.append('g')
    .attr('transform', 'translate(0,' + 500 + ')')
    .call(d3.axisBottom(x))
   //.select(".domain")
  //  .remove();

  // Add y-axis to plot
  g.append('g')
    .call(d3.axisLeft(y))
   .append('text')
    .attr('fill', '#000')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '0.71em')
    .attr('text-anchor', 'end')
    .text("World Energy Consumption (TWh)");

  // Add line graph to plot
  g.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', 1.5)
    .attr('d', line);
});
