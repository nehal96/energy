
// Load data and apply main function
d3.csv("data/CO2-PPM-Data.csv", function(d) {
  d['Year BP'] = +d['Year BP'];
  d['CO2 (ppm)'] = +d['CO2 (ppm)'];
  return d;
}, function(error, data) {
  if (error) throw error;

  // Setting margin, width, height of plot
  var co2_margin = 50,
      co2_width = 850 - co2_margin,
      co2_height = 500 - co2_margin;

  // Creating a responsive svg element for the plot
  // https://stackoverflow.com/questions/16265123/resize-svg-when-window-is-resized-in-d3-js - Responsive SVG

  var svg = d3.select('#co2-ppm-chart')
              .append('div')
              .classed('svg-container', true)
              .append('svg')
              .attr('preserveAspectRatio', 'xMinyMin meet')
              .attr('viewBox', '0 0 ' + (co2_width + co2_margin) + ' ' + (co2_height + co2_margin))
              .classed('svg-content-responsive', true);

  var g = svg.append('g')
             .attr('transform', 'translate(' + co2_margin + ',' + 20 + ')');

  // Set x- and y-axis scales
  var x = d3.scaleLinear()
            .rangeRound([co2_width, 0]);

  var y = d3.scaleLinear()
            .rangeRound([co2_height, 0]);

  // Initialize d3 line function
  var line = d3.line()
               .curve(d3.curveLinear)
               .x(function(d) {
                    return x(d['Year BP']);
               })
               .y(function(d) {
                    return y(d['CO2 (ppm)']);
               });

  // Set x- and y-domains
  var min_x = d3.min(data, function(d) {
      return d['Year BP'];
  });

  var max_x = d3.max(data, function(d) {
      return d['Year BP'];
  })

  x.domain([min_x - 10000, max_x])

  var max_co2 = 440

  y.domain([150, max_co2]);

  // Set x- and y-axes
  var x_axis = d3.axisBottom(x)

  var y_axis = d3.axisLeft(y)

  x_axis.ticks(5)
        .tickSizeOuter(0)
        .tickSizeInner(5)
        .tickPadding(4);

  y_axis.ticks(5)
        .tickSizeOuter(0)
        .tickSizeInner(-co2_width)
        .tickPadding(8);

  // Add x-axis to plot
  g.append('g')
   .attr('transform', 'translate(0,' + co2_height + ')')
   .attr('id', 'co2-x-axis')
   .call(x_axis)

  // Add y-axis to plot
  g.append('g')
   .attr('id', 'co2-y-axis')
   .call(y_axis)

  // Create line path
  g.append('path')
   .attr('d', line(data))
   .attr('fill', 'none')
   .attr('stroke', '#f67280')
   .attr('stroke-linejoin', 'round')
   .attr('stroke-linecap', 'round')
   .attr('stroke-width', 3);
})
