
// Load data and apply main function
d3.csv("data/levelized-energy-cost.csv", function(d) {
  d['Low'] = +d['Low'];
  d['High'] = +d['High'];
  return d;
}, function(error, data) {
  if (error) throw error;

  // Setting margin, width, height of plot
  var margin = 210,
      width = 950 - margin,
      height = 675 - margin;

  // Creating a responsive svg element for the plot
  var svg = d3.select('#levelized-energy-cost-chart')
              .append('svg')
              .attr('viewBox', '0 0 ' + (width + margin) + ' ' + (height + margin));

  var g = svg.append('g')
             .attr('transform', 'translate(' + (margin - 20) + ',' + 20 + ')');

  // Set x-, y-, and color axes
  var x = d3.scaleLinear()
            .rangeRound([0, width]);

  var y = d3.scaleBand()
            .rangeRound([0, height]);

  var color = d3.scaleOrdinal(["#EF4836", "#F62459", "#BF55EC", "#663399",
                              "#446CB3", "#19B5FE", "#00B16A", "#36D7B7",
                              "#F7CA18", "#F9690E", "#F64747"]);

  // Set x- and y-axis domains
  x.domain([0, d3.max(data, function(d) {
    return Math.ceil(d["High"]/100.0) * 100;
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
    .attr('transform', 'translate(0,' + height + ')')
    .attr('id', 'levelized-cost-x-axis')
    .attr('class', 'line-chart-x-axis')
    .call(x_axis);

  // Add y-axis to plot
  g.append('g')
    .attr('id', 'levelized-cost-y-axis')
    .attr('class', 'line-chart-y-axis')
    .call(y_axis);

})
