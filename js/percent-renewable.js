
// Convert Year column into date format
var parseYear = d3.timeParse("%Y")

var color = d3.scaleOrdinal(["#EF4836", "#F62459", "#BF55EC", "#663399",
                         "#446CB3", "#19B5FE", "#00B16A", "#36D7B7",
                         "#F7CA18", "#F9690E", "#F64747"])

d3.csv("data/percentage-renewables.csv", type, function(error, data) {
  if (error) throw error;

  // Setting margin, width, height of plot
  var margin = 130,
      width = 850 - margin,
      height = 550 - margin;

  var svg = d3.select('percent-renewable-chart')
              .append('svg')
              .attr('viewBox', '0 0 ' + (width + margin) + ' ' + (height + margin));

  var g = svg.append('g')
             .attr('transform', 'translate(' + 50 + ',' + 20 + ')');
})
