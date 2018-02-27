
// Load data and apply main function
d3.csv('data/renewable-energy-investment.csv', function(d) {
  d['2005'] = +d['2005'];
  d['2015'] = +d['2015'];
  return d;
}, function(error, data) {
  if (error) throw error;

  // Setting margin, width, height of plot
  var margin = 50,
      width = 950 - margin,
      height = 450 - margin;

  // Create responsive svg element for plot
  var svg = d3.select('#renewable-energy-investment-chart')
              .append('svg')
              .attr('viewBox', '0 0 ' + (width + margin) + ' ' + (height + margin));

  var g = svg.append('g')
             .attr('transform', 'translate(' + (margin - 20) + ',' + 20 + ')');

  // Set x- and y-axes
  var x0 = d3.scaleBand()
             .rangeRound([0, width])
             .paddingInner(0.2);

  var x1 = d3.scaleBand()
             .padding(0.05);

  var y = d3.scaleLinear()
            .rangeRound([height, 0]);

  var z = d3.scaleOrdinal()
    .range(["#98abc5", "#ff8c00"]);

  var keys = data.columns.slice(1);

  // Set x- and y-axis domains
  x0.domain(data.map(function(d) {
    return d['Region'];
  }));

  x1.domain(keys)
    .rangeRound([0, x0.bandwidth()]);

  y.domain([0, d3.max(data, function(d) {
    return d3.max(keys, function(key) {
      return d[key];
    });
  })]);

  // Set x- and y-axes
  var x_axis = d3.axisBottom(x0);

  var y_axis = d3.axisLeft(y);

  x_axis.ticks(5)
        .tickSizeOuter(0)
        .tickSizeInner(5)
        .tickPadding(4);

  y_axis.ticks(6)
        .tickSizeInner(-width)
        .tickSizeOuter(0)
        .tickPadding(8)
        .tickFormat(function(d) {
          return '$' + d/1000000000 + 'bn';
        });

  // Add x-axis to plot
  g.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .attr('id', 'renewable-energy-investment-x-axis')
    .attr('class', 'line-chart-x-axis')
    .call(x_axis);

  // Add y-axis to plot
  g.append('g')
    .attr('id', 'renewable-energy-investment-y-axis')
    .attr('class', 'line-chart-y-axis')
    .call(y_axis);

  // Add bars to plot
  g.append('g')
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
      .attr('transform', function(d) {
        return "translate(" + x0(d['Region']) + ",0)";
      })
    .selectAll('rect')
    .data(function(d) {
      return keys.map(function(key) {
        return {key: key, value: d[key]};
      })
    })
    .enter()
    .append('rect')
     .attr('x', function(d) { return x1(d.key); })
     .attr('y', function(d) { return y(d.value); })
     .attr('width', x1.bandwidth())
     .attr('height', function(d) {
       return height - y(d.value);
     })
     .attr('fill', function(d) { return z(d.key); });


})
