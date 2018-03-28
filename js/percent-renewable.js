
d3.json('data/percent-renewable.json', function(error, data) {
  if (error) throw error;

  var chartWidth = d3.select('#percent-renewable-table').node().offsetWidth,
      barWidth = Math.floor(chartWidth * .5);
      //barHeight = d3.select('#percent-renewable-column').node().offsetHeight * 0.9;

  var barScale = d3.scaleLinear()
                   .domain([0, 100])
                   .range([1, barWidth]);

  for (i = 0; i < data.length; i++) {
    var country_info = data[i],
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

    table_row.append('td')
             .attr('class', 'country-percent-renewable')
             .append('div')
              .classed('percent-bar', true)
              .style('width', barScale(percent_renewable) + 'px');
  };



  //d3.selectAll('.country-percent-renewable')
    //.append('div')
    //.classed('percent-bar', true);


  //var p = d3.values(data);
  //console.log(p);

  //console.log(maxPercent);
})
