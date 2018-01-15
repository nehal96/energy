
// Convert Year column into date format
var parseYear = d3.timeParse("%Y")

d3.csv("data/test-energy-consumption-per-capita.csv", type, function(error, data) {
  if (error) throw error;

  // Setting margin, width, height of plot
  var margin = 130,
      width = 850 - margin,
      height = 550 - margin;

  // Creating a responsive svg element for the plot
  var svg = d3.select('#energy-per-capita-chart')
              .append('svg')
              .attr('viewBox', '0 0 ' + (width + margin) + ' ' + (height + margin))

  var g = svg.append('g')
             .attr('transform', 'translate(' + 50 + ',' + 20 + ')');

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
    0, 20000
  ]);

  z.domain(countries.map(function(c) {
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
  var country = g.selectAll('.country')
                  .data(countries)
                  .enter()
                  .append('g')
                  .attr('class', 'country')
                  .attr('id', function(d) { return d.id.replace(/ /g,''); });

  // Draw path for each country
  country.append('path')
         .attr('d', function(d) { return line(d.values); })
         .attr('fill', 'none')
         .attr('stroke', '#ccc')
         .attr('stroke-linejoin', 'round')
         .attr('stroke-linecap', 'round')
         //.attr('stroke', function(d) { return z(d.id); })
         .attr('stroke-width', 3);

  country.append('text')
         .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
         .attr('transform', function(d) { return 'translate(' + x(d.value.Year) + "," + y(d.value.Energy) + ")"; })
         .attr('x', 3)
         .attr('dy', '0.35em')
         .attr('class', 'tk-atlas')
         .style('font-size', '10px')
         .text(function(d) { return d.id; });

  // Colouring the paths of select countries
  d3.select('#Canada path')
    .attr('stroke', '#f67280');

  d3.select('#UnitedStates path')
    .attr('stroke', '#446cb3')

  d3.select('#India path')
    .attr('stroke', '#f9690e')

  d3.select('#China path')
    .attr('stroke', '#f7ca18')
});


function type(d, _, columns) {
  d['Year'] = parseYear(d['Year']);
  for (var i = 1, n = columns.length, c; i < n; ++i) {
    d[c = columns[i]] = +d[c];
    return d;
  }
}
