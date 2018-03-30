
const REGIONS = ['East Asia & Pacific', 'Europe & Central Asia',
                 'Latin America & Caribbean', 'Middle East & North Africa',
                 'North America', 'South Asia', 'Sub-Saharan Africa'];

d3.json('data/percent-renewable.json', function(error, data) {
  if (error) throw error;

  const region_controls = d3.select('.region-controls');

  region_controls.append('a')
                 .classed('region-button', true)
                 .classed('first-button-curve', true)
                 .text('All Regions')
                 .on('click', function(o) {
                   var region = d3.select(this).text();

                   sortByRegion(ordered_data, region);
                 });;

  // Populate region control buttons
  for (i = 0; i < REGIONS.length; i++) {
    var region_button = region_controls.append('a')
                                       .classed('region-button', true)
                                       .style('width', 100/(REGIONS.length + 1) + '%')
                                       .text(REGIONS[i])
                                       .on('click', function(o) {
                                         var region = d3.select(this).text();

                                         sortByRegion(ordered_data, region);
                                       });

    if (i == REGIONS.length - 1) {
      region_button.classed('last-button-curve', true);
    } else {
      region_button;
    }
  }
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

  function sortByRegion(ordered_data, region) {
    // Remove all existing rows in table
    d3.selectAll('#percent-renewable-table tbody tr').remove();

    if (region != 'All Regions') {
      for (i = 0; i < ordered_data.length; i++) {
        if (region == ordered_data[i].region) {
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
        }
      }
    } else {
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
      }
    }
  }
})
