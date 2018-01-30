
// Convert Year column into date format
var parseYear = d3.timeParse("%Y")

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
    0, 250000
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

  // Colour the paths of select countries
  colourLine('Canada', LINE_GRAPHS[0], '#f67280');
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

           d3.select('energy-per-capita-tooltip')
             .classed('hiiden', false);
         })


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
