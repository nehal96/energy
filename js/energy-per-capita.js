
// Convert Year column into date format
var parseYear = d3.timeParse("%Y")

// Convert Date format into year
var formatYear = d3.timeFormat("%Y");

// Format number with decimals into an integer
var formatInteger = d3.format(".0f")

// Bisect function magic
var bisectDate = d3.bisector(function(d) { return d.Year; }).left;

var color = d3.scaleOrdinal(["#EF4836", "#F62459", "#BF55EC", "#663399",
                         "#446CB3", "#19B5FE", "#00B16A", "#36D7B7",
                         "#F7CA18", "#F9690E", "#F64747"])

let LINE_GRAPHS = ['per-cap', 'percent-renewable']

d3.csv("data/test-energy-consumption-per-capita.csv", type, function(error, data) {
  if (error) throw error;

  // Setting margin, width, height of plot
  var margin = 135,
      width = 850 - margin,
      height = 550 - margin;

  // Initialise tooltip as hidden
  d3.select('#energy-per-capita-tooltip')
    .classed('hidden', true);

  // Creating a responsive svg element for the plot
  var svg = d3.select('#energy-per-capita-chart')
              .append('svg')
              .attr('viewBox', '0 0 ' + (width + margin) + ' ' + (height + margin))

  var g = svg.append('g')
             .attr('transform', 'translate(' + 55 + ',' + 20 + ')');

  var x = d3.scaleTime()
            .rangeRound([0, width]);

  var y = d3.scaleLinear()
            .rangeRound([height, 0]);

  var z = d3.scaleOrdinal(d3.schemeCategory10);

  // Initialise d3 line function
  var line = d3.line()
               .defined(function(d) { return !isNaN(d['Energy']); })
               .curve(d3.curveLinear)
               .x(function(d) {
                 return x(d['Year']);
               })
               .y(function(d) {
                 return y(d['Energy']);
               });

  var countries = data.columns.slice(1).map(function(id) {
    return {
      id: id,
      values: data.map(function(d) {
        return {Year: d['Year'], Energy: d[id]};
      })
    };
  });

  //console.log(countries);

  // Set x- and y-axis domains
  x.domain(d3.extent(data, function(d) { return d['Year']; }));

  var max_energy_per = d3.max(countries, function(c) {
          return d3.max(c.values, function(d) {
              return d['Energy'];
          });
        })

  y.domain([
    //d3.min(countries, function(c) {
    //  return d3.min(c.values, function(d) {
    //    return d['Energy'];
    //  });
    //})
    0, 100000
  ]);

  color.domain(countries.map(function(c) {
    return c.id;
  }));

  // Set x- and y-axes
  var x_axis = d3.axisBottom(x);

  var y_axis = d3.axisLeft(y);

  x_axis.ticks(6)
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
    .attr('id', 'energy-per-cap-x-axis')
    .attr('class', 'line-chart-x-axis')
    .call(x_axis);

  // Add y-axis to plot
  g.append('g')
    .attr('id', 'energy-per-cap-y-axis')
    .attr('class', 'line-chart-y-axis')
    .call(y_axis)

  // Create groups for each country
  var country_per_cap = g.selectAll('.country-per-cap')
                          .data(countries)
                          .enter()
                          .append('g')
                          .attr('class', 'country country-per-cap')
                          .attr('id', function(d) { return d.id.replace(/ /g,'') + '-per-cap'; });

  // Draw path for each country
  country_per_cap.append('path')
                 .attr('id', function(d) { return d.id.replace(/ /g,'') + "-per-cap-path" })
                 .attr('d', function(d) { return line(d.values); })
                 .attr('fill', 'none')
                 .attr('stroke', '#ccc')
                 .attr('stroke-linejoin', 'round')
                 .attr('stroke-linecap', 'round')
                 //.attr('stroke', function(d) { return z(d.id); })
                 .attr('stroke-width', 3);

  // Draw circles for each data point on the path
  country_per_cap.selectAll('.dot')
                 .data((function(d) {
                   return d.values;
                 }))
                 .enter().append('circle')
                 .attr('class', 'dot')
                 .attr('cx', line.x())
                 .attr('cy', line.y())
                 .attr('r', function(d) {
                   return d['Energy'] == ".." ? 0 : 3;
                 })
                 .attr('opacity', 0);

  // Add a text element at the end of each line path for each country.
  country_per_cap.append('text')
                 .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
                 .attr('transform', function(d) { return 'translate(' + x(d.value.Year) + "," + y(d.value.Energy) + ")"; })
                 .attr('x', 6)
                 .attr('dy', '0.35em')
                 .attr('class', 'tk-atlas')
                 .style('font-size', '10px')
                 .text(function(d) { return d.id; });


  //colourLine('United States', '#446cb3');
  //colourLine('India', '#f9690e');
  //colourLine('China', '#f7ca18');

  country_per_cap.on('mouseover', function(d) {
           if (d3.select(this).classed('clicked') != true) {
             colourLine(d.id, LINE_GRAPHS[0], color(d.id), hover=true);

             showCircles(d.id, LINE_GRAPHS[0]);
           }

           d3.select('#energy-per-capita-tooltip')
             .classed('hidden', false);
         })
         .on('mouseout', function(d) {
           if (d3.select(this).classed('clicked') != true) {
             colourLine(d.id, LINE_GRAPHS[0], '#ccc');

             hideCircles(d.id, LINE_GRAPHS[0]);
           }

           d3.select('#energy-per-capita-tooltip')
             .classed('hidden', true);
         })
         .on('click', function(d) {
           if (d3.select(this).classed('clicked')) {
             colourLine(d.id, LINE_GRAPHS[0], '#ccc');

             d3.select(this)
               .classed('clicked', false);
           } else {
             colourLine(d.id, LINE_GRAPHS[0], color(d.id))

             d3.select(this)
               .classed('clicked', true);
           }
         })
         .on('mousemove', function(d) {
           var coordinates = [0, 0];
           coordinates = d3.mouse(this);

           var xPosition = coordinates[0];
           var yPosition = coordinates[1] + 50;

           d3.select('#energy-per-capita-tooltip')
             .style('left', xPosition + 'px')
             .style('top', yPosition + 'px');

           d3.select('#energy-per-capita-tooltip-heading')
             .text(d.id);

           var x0 = x.invert(xPosition),
               i = bisectDate(d.values, x0, 1);
               d0 = d.values[i - 1],
               d1 = d.values[i],
               d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;

           d3.select('#energy-per-capita-tooltip-y')
             .text("Year: " + formatYear(d.Year));

           d3.select('#energy-per-capita-tooltip-x')
             .text("Cons. per cap.: " + formatInteger(y.invert(yPosition - 50)) + " kWh");

           d3.select('energy-per-capita-tooltip')
             .classed('hidden', false);
         })

         // Set up scrollytelling for prose and line animation

         // Create ScrollMagic controller
         var controller = new ScrollMagic.Controller();

         // Colour the path of World
         colourLine('World', LINE_GRAPHS[0], '#36d7b7');

         // Hide Qatar path and text initially
         d3.select('#Qatar-per-cap path')
           .style('visibility', 'hidden');

         d3.selectAll('#Qatar-per-cap .dot')
           .style('visibility', 'hidden')

         d3.select('#Qatar-per-cap text')
           .style('visibility', 'hidden');

         // Scene that pins the energy per capita plot when scrolled to
         new ScrollMagic.Scene({
           triggerElement: "#energy-per-capita-slide-1",
           duration: 1300
         })
         .setPin('#energy-per-capita-chart')
         .addTo(controller)

         // Scene that activates 1st slide
         new ScrollMagic.Scene({
           triggerElement: "#energy-per-capita-slide-1",
           duration: 275
         })
         .setClassToggle("#energy-per-capita-slide-1", "active")
         .on('enter', function() {
           // Colour the path of World
           colourLine('World', LINE_GRAPHS[0], '#36d7b7');
         })
         .addTo(controller)

         // Scene that activates 2nd slide
         new ScrollMagic.Scene({
           triggerElement: "#energy-per-capita-slide-2",
           duration: 275
         })
         .setClassToggle("#energy-per-capita-slide-2", "active")
         .on('enter', function() {
           // Set World back as default colour
           colourLine('World', LINE_GRAPHS[0], '#ccc');

           // Colour developed countries
           colourLine('United States', LINE_GRAPHS[0], '#00b16a');
           colourLine('Canada', LINE_GRAPHS[0], '#ef4836');
           colourLine('Sweden', LINE_GRAPHS[0], '#f9690e');
           colourLine('Japan', LINE_GRAPHS[0], '#f7ca18');
           colourLine('United Kingdom', LINE_GRAPHS[0], '#19b5fe');
         })
         .addTo(controller)

         // Scene that activates 3rd slide
         new ScrollMagic.Scene({
           triggerElement: "#energy-per-capita-slide-3",
           duration: 275
         })
         .setClassToggle("#energy-per-capita-slide-3", "active")
         .on('enter', function() {
           // Set developed countries back to default colour
           colourLine('United States', LINE_GRAPHS[0], '#ccc');
           colourLine('Canada', LINE_GRAPHS[0], '#ccc');
           colourLine('Sweden', LINE_GRAPHS[0], '#ccc');
           colourLine('Japan', LINE_GRAPHS[0], '#ccc');
           colourLine('United Kingdom', LINE_GRAPHS[0], '#ccc');

           // Colour developing countries
           colourLine('China', LINE_GRAPHS[0], '#f9690e');
           colourLine('Brazil', LINE_GRAPHS[0], '#f7ca18');
           colourLine('India', LINE_GRAPHS[0], '#663399');
         })
         .addTo(controller)

         // Scene that activates 4th slide
         new ScrollMagic.Scene({
           triggerElement: "#energy-per-capita-slide-4",
           duration: 275
         })
         .setClassToggle("#energy-per-capita-slide-4", "active")
         .on('enter', function(d) {
           // Set developing countries back to default colour
           colourLine('China', LINE_GRAPHS[0], '#ccc');
           colourLine('Brazil', LINE_GRAPHS[0], '#ccc');
           colourLine('India', LINE_GRAPHS[0], '#ccc');

           // Colour Qatar line
           colourLine('Qatar', LINE_GRAPHS[0], '#f7ca18');

           // Extend y-axis domain
           y.domain([0, 250000]);

           // Change y-axis with transition to new domain
           d3.select('#energy-per-cap-y-axis')
             .transition()
             .duration(1000)
             .call(y_axis);

           // Set transition for paths
           country_per_cap.select('path')
                          .transition()
                          .duration(1000)
                          .attr('d', function(d) { return line(d.values); })

           // Set transitions for circles
           country_per_cap.selectAll('.dot')
                          .transition()
                          .duration(1000)
                          .attr('cx', line.x())
                          .attr('cy', line.y());

           // Set transitions for country labels
           country_per_cap.select('text')
                          .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
                          .transition()
                          .duration(1000)
                          .attr('transform', function(d) { return 'translate(' + x(d.value.Year) + "," + y(d.value.Energy) + ")"; });

           // Implement line animation for Qatar path after axis transition
           setTimeout(function() {
             var totalLength = d3.select('#Qatar-per-cap path').node().getTotalLength();

             if (d3.select('#Qatar-per-cap path').style('visibility') == "hidden") {
               // Show Qatar path and text
               d3.select('#Qatar-per-cap path')
                 .style('visibility', 'visible')
                 // Implement line animation
                 .attr('stroke-dasharray', totalLength + ' ' + totalLength)
                 .attr('stroke-dashoffset', totalLength)
                 .transition()
                  .duration(1300)
                  .ease(d3.easeLinear)
                  .attr('stroke-dashoffset', 0);
             }
           }, 1000);

           // Show data points and country label after line animation
           setTimeout(function() {
             // If data point circles are hidden, show them
             if (d3.selectAll('#Qatar-per-cap .dot').style('visibility') == "hidden") {
               d3.selectAll('#Qatar-per-cap .dot')
                 .style('visibility', 'visible');
             }

             // If country label is hidden, show label
             if (d3.select('#Qatar-per-cap text').style('visibility') == "hidden") {
               d3.select('#Qatar-per-cap text')
                 .style('visibility', 'visible');
             }
           }, 2350)
         })
         .addTo(controller)


});


function type(d, _, columns) {
  d['Year'] = parseYear(d['Year']);
  for (var i = 1, n = columns.length, c; i < n; ++i) {
    d[c = columns[i]] = +d[c];
    return d;
  }
}

// Colours the line path given the name of the country and a hexadecimal colour
// code.
function colourLine(country, chart_name, colour, hover=false) {
  pathId = '#' + country.replace(/ /g,'') + '-' + chart_name + '-path'

  if (hover == false) {
    return d3.select(pathId)
             .style('cursor', 'pointer')
             .attr('stroke', colour)
             .attr('stroke-width', 3);
  } else {
    return d3.select(pathId)
             .style('cursor', 'pointer')
             .attr('stroke', colour)
             .attr('stroke-width', 5);
  }

}

// Makes circle elements on path (which show data points) visible (changes
// opacity to 1).
function showCircles(country, chart_name) {
  var circleElems = '#' + country.replace(/ /g, '') + '-' + chart_name + ' .dot';

  return d3.selectAll(circleElems)
           .attr('opacity', 1);
}

// Hides circle elements on path (changes opacity to 0).
function hideCircles(country, chart_name) {
  var circleElems = '#' + country.replace(/ /g, '') + '-' + chart_name + ' .dot';

  return d3.selectAll(circleElems)
           .attr('opacity', 0);
}
