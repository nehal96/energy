
// Load data and apply main function
d3.csv("data/levelized-energy-cost.csv", function(d) {
  d['Low'] = +d['Low'];
  d['High'] = +d['High'];
  return d;
}, function(error, data) {
  if (error) throw error;

  // Setting margin, width, height of plot
  var margin_left = 210,
      margin_bottom = 50,
      width = 950 - margin_left,
      height = 450 - margin_bottom;

  // Creating a responsive svg element for the plot
  var svg = d3.select('#levelized-energy-cost-chart')
              .append('svg')
              .attr('viewBox', '0 0 ' + (width + margin_left) + ' ' + (height + margin_bottom));

  var g = svg.append('g')
             .attr('transform', 'translate(' + (margin_left - 20) + ',' + 20 + ')');

  // Set x-, y-, and color axes
  var x = d3.scaleLinear()
            .rangeRound([0, width]);

  var y = d3.scaleBand()
            .rangeRound([0, height])
            .padding(0.15);

  var colours = {'Turquoise': '#36D7B7', 'Lynch Grey': '#6C7A89'};

  // Set x- and y-axis domains
  x.domain([0, d3.max(data, function(d) {
    return d['High'] + 31; // Need to find a better way to get 350
  })]);

  y.domain(data.map(function(d) {
    return d["Energy Technology"];
  }));

  // Set x- and y-axes
  var x_axis = d3.axisBottom(x);

  var y_axis = d3.axisLeft(y);

  x_axis.ticks(5)
        .tickSizeOuter(0)
        .tickSizeInner(5)
        .tickPadding(4);

  y_axis.ticks(6)
        .tickSizeInner(-width)
        .tickSizeOuter(0)
        .tickPadding(8);

  // Add x-axis to plot
  g.append('g')
    .attr('transform', 'translate(0,' + (height) + ')')
    .attr('id', 'levelized-cost-x-axis')
    .attr('class', 'line-chart-x-axis')
    .call(x_axis);

  // Add y-axis to plot
  g.append('g')
    .attr('id', 'levelized-cost-y-axis')
    .attr('class', 'line-chart-y-axis')
    .call(y_axis);

  // Add bar element for each electricity-generating technology
   var bars = g.selectAll(".electricity-generator")
               .data(data)
               .enter()
               .append('g')
               .attr('class', 'electricity-generator')
               .attr('transform', function(d) {
                 return "translate(0, " + y(d['Energy Technology']) + ")";
               });

  // Create the bar and set position and fill.
  bars.append('rect')
      .attr('class', 'bar')
      .attr('x', function(d) {
        return x(d['Low']);
      })
      .attr('width', function(d) {
        return x(d['High']) - x(d['Low']);
      })
      .attr('height', y.bandwidth())
      .attr('fill', function(d) {
        if (d['Type'] == "Alternative Energy") {
          return colours['Turquoise']; // Turquoise
        } else {
          return colours['Lynch Grey']; // Lynch Grey
        }
      });

  // Add the left text element that shows low-end price
  bars.append('text')
      .attr('x', function(d) {
        return x(d['Low']);
      })
      .attr('y', y.bandwidth()/2)
      .attr('dy', '0.35em')
      .attr('dx', '-0.35em')
      .attr('text-anchor', 'end')
      .text(function(d) {
        return '$' + d['Low'];
      });

  // Add the right text element that shows the high-end price
  bars.append('text')
      .attr('x', function(d) {
        return x(d['High']);
      })
      .attr('y', y.bandwidth()/2)
      .attr('dy', '0.35em')
      .attr('dx', '0.35em')
      .text(function(d) {
        return '$' + d['High'];
      });

})
