
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
  var svg = d3.select('#co2-ppm-chart')
              .append('svg')
              .attr('viewBox', '0 0 ' + (width + margin) + ' ' + (height + margin))

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

  // Set up scrollytelling with ScrollMagic

  // Create ScrollMagic controller
  var controller = new ScrollMagic.Controller();

  // Scene that pins CO2 plot
  new ScrollMagic.Scene({
    triggerElement: "#co2-slide-1",
    duration: 900
  })
  .setPin('#co2-ppm-chart')
  .addTo(controller)

  // Scenes that activates slides
  new ScrollMagic.Scene({
    triggerElement: "#co2-slide-1",
    duration: 275
  })
  .setClassToggle('#co2-slide-1', "active")
  .on('enter', function() {

    // Create line path
    this.path = g.append('path')
                 .attr('d', line(data))
                 .attr('fill', 'none')
                 .attr('stroke', '#f67280')
                 .attr('stroke-linejoin', 'round')
                 .attr('stroke-linecap', 'round')
                 .attr('stroke-width', 3);

    var totalLength = this.path.node().getTotalLength();

    // Implement line animation
    this.path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
             .attr('stroke-dashoffset', -totalLength)
             .transition()
              .duration(4500)
              .ease(d3.easeSin)
              .attr('stroke-dashoffset', 0);
  })
  .addTo(controller)

  new ScrollMagic.Scene({
    triggerElement: "#co2-slide-2",
    duration: 275
  })
  .setClassToggle('#co2-slide-2', "active")
  .addTo(controller)

  new ScrollMagic.Scene({
    triggerElement: "#co2-slide-3",
    duration: 275
  })
  .setClassToggle('#co2-slide-3', "active")
  .addTo(controller)

  new ScrollMagic.Scene({
    triggerElement: "#co2-slide-4",
    duration: 275
  })
  .setClassToggle('#co2-slide-4', "active")
  .addTo(controller)
})
