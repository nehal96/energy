
// Load data and apply main function
d3.csv('data/renewable-energy-investment.csv', function(d) {
  d['2005'] = +d['2005'];
  d['2015'] = +d['2015'];
  return d;
}, function(error, data) {
  if (error) throw error;

  // Setting margin, width, height of plot
  var margin = 70,
      width = 950 - margin,
      height = 425 - margin;

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
    .call(x_axis)
   .selectAll('.tick text')
    .call(wrap, x0.bandwidth());

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
     //.attr('y', function(d) { return y(d.value); })
     .attr('y', function(d) { return height; })
     .attr('width', x1.bandwidth())
     .attr('height', function(d) {
       //return height - y(d.value);
       return 0;
     })
     .attr('fill', function(d) { return z(d.key); })
     .transition()
      .duration(1000)
      .delay(500)
      .attr('y', function(d) {
        return y(d.value);
      })
      .attr('height', function(d) {
        return height - y(d.value);
      })

  var legend = g.append('g')
                 .attr('class', 'legend')
                 .attr('transform', 'translate(0, 22)')
                 .selectAll('g')
                  .data(keys.slice().reverse())
                  .enter()
                 .append('g')
                  .attr('transform', function(d, i) {
                    return "translate(0," + i * 28 + ")";
                  });

  legend.append('rect')
         .attr('x', width - 25)
         .attr('width', 25)
         .attr('height', 25)
         .attr('fill', z);

  legend.append('text')
         .attr('x', width - 30)
         .attr('y', 12.5)
         .attr('dy', '0.35em')
         .text(function(d) { return d; })

})

// https://bl.ocks.org/ericsoco/647db6ebadd4f4756cae (v3 didn't work)
// https://gist.github.com/guypursey/f47d8cd11a8ff24854305505dbbd8c07
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em")
    while (word = words.pop()) {
      line.push(word)
      tspan.text(line.join(" "))
      if (tspan.node().getComputedTextLength() > width) {
        line.pop()
        tspan.text(line.join(" "))
        line = [word]
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy}em`).text(word)
      }
    }
  })
}
