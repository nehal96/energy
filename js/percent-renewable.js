
d3.json('data/percent-renewable.json', function(error, data) {
  if (error) throw error;

  for (i = 0; i < data.length; i++) {
    var country_info = data[i],
        country_name = country_info.name,
        region = country_info.region,
        percent_renewable = country_info.percent;

    var table_row = d3.select('#percent-renewable-table tbody')
                      .append('tr');

    table_row.append('td')
             .text('');

    table_row.append('td')
             .text(country_name);

    table_row.append('td')
             .text('')
  };
})
