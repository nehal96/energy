// All regions for countries in percent-renewable dataset
const REGIONS = ['East Asia & Pacific', 'Europe & Central Asia',
                 'Latin America & Caribbean', 'Middle East & North Africa',
                 'North America', 'South Asia', 'Sub-Saharan Africa'];

d3.json('data/percent-renewable.json', function(error, data) {
  if (error) throw error;

  const region_controls = d3.select('.region-controls');

  region_controls.append('a')
                 .classed('region-button', true)
                 .classed('first-button-curve', true)   // Rounded rectangle
                 .classed('active-button', true)
                 .style('width', 100/(REGIONS.length + 1) + '%') // Divide widths for each region equally
                 .text('All Regions')
                 .on('click', function(o) {
                   // Check if element is not the active button
                   if (!d3.select(this).classed('active-button')) {
                     // If not, remove active-button class from all region buttons first
                     d3.selectAll('.region-button').classed('active-button', false);

                     // Add active-button class to clicked element
                     d3.select(this).classed('active-button', true);
                   }

                   var region = d3.select(this).text();
                   // Call sorting function
                   sortByRegion(ordered_data, region);
                 });;

  // Populate region control buttons
  for (i = 0; i < REGIONS.length; i++) {
    var region_button = region_controls.append('a')
                                       .classed('region-button', true)
                                       .style('width', 100/(REGIONS.length + 1) + '%')
                                       .text(REGIONS[i])
                                       .on('click', function(o) {
                                         // Check if element is not the active button
                                         if (!d3.select(this).classed('active-button')) {
                                           // If not, remove active-button class from all region buttons first
                                           d3.selectAll('.region-button').classed('active-button', false);

                                           // Add active-button class to clicked element
                                           d3.select(this).classed('active-button', true);
                                         }

                                         var region = d3.select(this).text();
                                         // Call sorting function
                                         sortByRegion(ordered_data, region);
                                       });

    // If it's the last button, add the rounded rectangle curves; otherwise, normal buttons.
    if (i == REGIONS.length - 1) {
      region_button.classed('last-button-curve', true);
    } else {
      region_button;
    }
  }

  // Get width of the table
  var chartWidth = d3.select('#percent-renewable-table').node().offsetWidth,
      barWidth = Math.floor(chartWidth * .5); // CSS: Percent Renewable column is set as 50%.
      //barHeight = d3.select('#percent-renewable-column').node().offsetHeight * 0.9;

  // Create a scale for the bar charts.
  var barScale = d3.scaleLinear()
                   .domain([0, 100])
                   .range([1, barWidth]);

  // Rearrange data in descending order of percentage.
  var ordered_data = orderData(data);

  // Add table rows for each country, adding the name, region, and drawing the bar graph.
  for (i = 0; i < ordered_data.length; i++) {
    populateTable(ordered_data, i);
  };

  // Rearrange data in descending order of percentage.
  function orderData(data) {
    for (i = 0; i < data.length; i++) {
      data.sort(function(x, y) {
        return d3.descending(x.percent, y.percent);
      })
    }

    return data;
  }

  // Add table rows for each country, adding the name, region, and drawing the bar graph.
  // Also, add formatting for percentage number labels.
  function populateTable(ordered_data, index) {
    var country_info = ordered_data[i],
        country_name = country_info.name,
        region = country_info.region,
        percent_renewable = country_info.percent,
        rank = (index + 1) + '.';

    var table_row = d3.select('#percent-renewable-table tbody')
                      .append('tr');

    table_row.append('td')
             .attr('class', 'rank')
             .text(rank);

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
      // Make sure doesn't round down to zero (show two decimal places)
      if (percent_renewable < 0.05) {
        bar.append('text')
           .attr('class', 'percent-renewable-label')
            .text(percent_renewable + '%');
      } else {
        // Show to only 1 decimal place
        bar.append('text')
           .attr('class', 'percent-renewable-label')
            .text(percent_renewable.toFixed(1) + '%');
      }
    } else {
      if (Math.floor(percent_renewable) <= 4) {
        // Show in black colour because text is over white background.
        bar.append('text')
           .attr('class', 'percent-renewable-label')
            .text(Math.floor(percent_renewable) + '%');
      } else {
        // Show in white colour because text is over blue bar chart.
        bar.append('text')
           .attr('class', 'percent-renewable-label')
           .style('color', 'white')
            .text(Math.floor(percent_renewable) + '%');
      }
    }
  }

  // Sorts data to show only data for selected regions.
  function sortByRegion(ordered_data, region) {
    // Remove all existing rows in table
    d3.selectAll('#percent-renewable-table tbody tr').remove();

    if (region != 'All Regions') {
      var j = 0;
      for (i = 0; i < ordered_data.length; i++) {
        if (region == ordered_data[i].region) {
          populateTable(ordered_data, j);
          j += 1;
        }
      }
    } else {
      for (i = 0; i < ordered_data.length; i++) {
        populateTable(ordered_data, i);
      }
    }
  }

  // Input element
  const input = document.getElementById('percent-renewable-search')

  // When letters are typed into the search field, run searchTable function.
  input.onkeyup = function() {searchTable()};

  // Very simple search algo (https://www.w3schools.com/howto/howto_js_filter_table.asp).
  // (It looks for the letter typed anywhere in the string - for example, if you type 'b',
  // it will show all countries that have a b in it anywhere - which looks weird sometimes.
  // Might need to add to it later).
  function searchTable() {
    var filter = input.value.toLowerCase(),  // letters typed in search field
        table = document.getElementById('percent-renewable-table')
        tr = table.getElementsByTagName('tr');

    for (i = 1; i < tr.length; i++) {
      td = tr[i].getElementsByTagName('td')[1];

      if (td) {
        if (td.innerHTML.toLowerCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }

    }
  }

})
