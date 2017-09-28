
// Convert Year column into date format
var parseYear = d3.timeParse("%Y")

// Load data and apply main function
d3.csv("data/Sample-Energy-Data.csv", function(d) {
  d['Year'] = parseYear(d['Year']);
  d['World (TWh)'] = +d['World (TWh)'];
  return d;
}, function(error, data) {
  if (error) throw error;

  // Setting margin, width, height of plot
  var margin = 50,
      width = 850 - margin,
      height = 500 - margin;

  const STAGES = [{maxyear:1980}, {maxyear:2000}, {maxyear:2009}, {maxyear:2016}];

  // Creating a responsive svg element for the plot
  // https://stackoverflow.com/questions/16265123/resize-svg-when-window-is-resized-in-d3-js - Responsive SVG
  var svg = d3.select('#energy-chart')
              //.append('div')
              //.classed('svg-container', true)
              .append('svg')
              //.attr('preserveAspectRatio', 'xMinyMin meet')
              .attr('viewBox', '0 0 ' + (width + margin) + ' ' + (height + margin))
              //.classed('svg-content-responsive', true);

  var g = svg.append('g')
             .attr('transform', 'translate(' + margin + ',' + 20 + ')');

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

  // Set x- and y-axis domains
  x.domain(d3.extent(data, function(d) { return d['Year']; }));

  var min_energy = d3.min(data, function(d) {
        return d['World (TWh)'];
  })

  y.domain([min_energy, 160000]);

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
    .attr('class', 'line-chart-x-axis')
    .call(x_axis)

  // Add y-axis to plot
  g.append('g')
    .attr('id', 'energy-y-axis')
    .attr('class', 'line-chart-y-axis')
    .call(y_axis)

  // Set up scrollytelling for prose and line animation
  /*
    TO-DO: Would be better if I could make this into a function.
    Also, it would look better if the trigger were halfway through the plot,
    or a third of the browser window, instead of half the browser window.
  */

  // Create ScrollMagic controller
  var controller = new ScrollMagic.Controller();

  // Scene that pins the energy plot when scrolled to
  //new ScrollMagic.Scene({
  //      offset: window.innerHeight, // start scene after scrolling length of browser height
  //      duration: 700 // pin the element for a total of 400 px
  //})
  //.setPin('#energy-chart', {pushFollowers: false})
  //.addTo(controller)


  // Scene that activates 1st slide and performs line aninmation (full line for now).
  new ScrollMagic.Scene({
      triggerElement: "#energy-slide-1",
      duration: 125
  })
  .setClassToggle("#energy-slide-1", "active")
  .on('enter', function() {

    //d3.select('#energy-chart')
      //.classed('is-fixed', true)

    // Create line path
    this.path = g.append('path')
                .attr('d', line(data))
                .attr('fill', 'none')
                .attr('stroke', '#f67280')
                .attr('stroke-linejoin', 'round')
                .attr('stroke-linecap', 'round')
                .attr('stroke-width', 3);

    var totalLength = this.path.node().getTotalLength();

    // Implement path animation
    this.path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
             .attr('stroke-dashoffset', totalLength)
             .transition()
              .duration(1500)
              .ease(d3.easeLinear)
              .attr('stroke-dashoffset', 0);
  })
  .addTo(controller)

  new ScrollMagic.Scene({
      triggerElement: "#energy-slide-2",
      duration: 125
  })
  .setClassToggle("#energy-slide-2", "active")
  .addTo(controller)

  new ScrollMagic.Scene({
      triggerElement: "#energy-slide-3",
      duration: 125
  })
  .setClassToggle("#energy-slide-3", "active")
  .addTo(controller)

  new ScrollMagic.Scene({
      triggerElement: "#energy-slide-4",
      duration: 125
  })
  .setClassToggle("#energy-slide-4", "active")
  .addTo(controller)
});
