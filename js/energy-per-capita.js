
d3.csv("data/energy-consumption-per-capita.csv", function(d) {
  d['1960'] = +d['1960'];
  d['1965'] = +d['1965'];
  d['1970'] = +d['1970'];
  d['1975'] = +d['1975'];
  d['1980'] = +d['1980'];
  d['1985'] = +d['1985'];
  d['1990'] = +d['1990'];
  d['1995'] = +d['1995'];
  d['2000'] = +d['2000'];
  d['2005'] = +d['2005'];
  d['2010'] = +d['2010'];
  d['2011'] = +d['2011'];
  d['2012'] = +d['2012'];
  d['2013'] = +d['2013'];
  d['2014'] = +d['2014'];
  return d;
}, function(error, data) {
  if (error) throw error;

  // Setting margin, width, height of plot
  var margin = 50,
      width = 850 - margin,
      height = 500 - margin;

  // Creating a responsive svg element for the plot
  var svg = d3.select('#energy-per-capita-chart')
              .append('svg')
              .attr('viewBox', '0 0 ' + (width + margin) + ' ' + (height + margin))

  var g = svg.append('g')
             .attr('transform', 'translate(' + margin + ',' + 20 + ')');

  var x = d3.scaleTime()
            .rangeRound([0, width]);

  var y = d3.scaleLinear()
            .rangeRound([height, 0]);
});
