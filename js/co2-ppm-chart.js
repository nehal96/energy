
// Load data and apply main function
d3.csv("data/CO2-PPM-Data.csv", function(d) {
  d['Year BP'] = +d['Year BP'];
  d['CO2 (ppm)'] = +d['CO2 (ppm)'];
  return d;
}, function(error, data) {
  if (error) throw error;

  // Setting margin, width, height of plot
  var margin = 50,
      width = 850 - margin,
      height = 500 - margin;

  // Creating a responsive svg element for the plot
  // https://stackoverflow.com/questions/16265123/resize-svg-when-window-is-resized-in-d3-js - Responsive SVG

  var svg = d3.select('#co2-ppm-chart')
              //.append('div')
              //.classed('svg-container', true)
              .append('svg')
              //.attr('preserveAspectRatio', 'xMinyMin meet')
              .attr('viewBox', '0 0 ' + (width + margin) + ' ' + (height + margin))
              //.classed('svg-content-responsive', true);

  var g = svg.append('g')
             .attr('transform', 'translate(' + margin + ',' + 20 + ')');

  // Set x- and y-axis scales
  var x = d3.scaleLinear()
            .rangeRound([width, 0]);

  var y = d3.scaleLinear()
            .rangeRound([height, 0]);

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

  // The subtraction is to make space for the axis label [0].
  x.domain([min_x - 5000, max_x])

  var max_co2 = 450

  y.domain([125, max_co2]);

  // Set x- and y-axes
  var x_axis = d3.axisBottom(x)

  var y_axis = d3.axisLeft(y)

  x_axis.ticks(5)
        .tickSizeOuter(0)
        .tickSizeInner(5)
        .tickPadding(4);

  y_axis.ticks(5)
        .tickSizeOuter(0)
        .tickSizeInner(-width)
        .tickPadding(8);

  // Add x-axis to plot
  g.append('g')
   .attr('transform', 'translate(0,' + height + ')')
   .attr('id', 'co2-x-axis')
   .attr('class', 'line-chart-x-axis')
   .call(x_axis)

  // Add y-axis to plot
  g.append('g')
   .attr('id', 'co2-y-axis')
   .attr('class', 'line-chart-y-axis')
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
