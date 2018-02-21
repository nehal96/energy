
// Load data and apply main function
d3.csv("data/levelized-energy-cost.csv", function(error, d) {
  if (error) throw error;

  // Setting margin, width, height of plot
  var margin = 130,
      width = 850 - margin,
      height = 550 - margin;

  // Creating a responsive svg element for the plot
  var svg = d3.select('#levelized-energy-cost-chart')
              .append('svg')
              .attr('viewBox', '0 0 ' + (width + margin) + ' ' + (height + margin));
              
})
