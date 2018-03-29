
d3.json('data/percent-renewable.json', function(error, data) {
  if (error) throw error;

  var chartWidth = d3.select('#percent-renewable-table').node().offsetWidth,
      barWidth = Math.floor(chartWidth * .5);
      //barHeight = d3.select('#percent-renewable-column').node().offsetHeight * 0.9;

  var barScale = d3.scaleLinear()
                   .domain([0, 100])
                   .range([1, barWidth]);

  var ordered_data = orderData(data);

  for (i = 0; i < ordered_data.length; i++) {
    var country_info = ordered_data[i],
        country_name = country_info.name,
        region = country_info.region,
        percent_renewable = country_info.percent;

    var table_row = d3.select('#percent-renewable-table tbody')
                      .append('tr');

    table_row.append('td')
             .attr('class', 'rank')
             .text('');

    table_row.append('td')
             .attr('class', 'country-name')
             .text(country_name);

    var bar = table_row.append('td')
                .attr('class', 'country-percent-renewable')
                .append('div')
                 .classed('percent-bar', true)
                 .style('width', barScale(percent_renewable) + 'px')

    // There is probably a much better way to do this but it's late so I'm going to commit
    if (percent_renewable <= 1 && percent_renewable > 0) {
      if (percent_renewable < 0.05) {
        bar.append('text')
           .attr('class', 'percent-renewable-label')
            .text(percent_renewable + '%');
      } else {
        bar.append('text')
           .attr('class', 'percent-renewable-label')
            .text(percent_renewable.toFixed(1) + '%');
      }
    } else {
      if (Math.floor(percent_renewable) <= 4) {
        bar.append('text')
           .attr('class', 'percent-renewable-label')
            .text(Math.floor(percent_renewable) + '%');
      } else {
        bar.append('text')
           .attr('class', 'percent-renewable-label')
           .style('color', 'white')
            .text(Math.floor(percent_renewable) + '%');
      }

    }

  };

  function orderData(data) {
    for (i = 0; i < data.length; i++) {
      data.sort(function(x, y) {
        return d3.descending(x.percent, y.percent);
      })
    }

    return data;
  }
})
