
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

  d3.select('#energy-per-capita h2')
    .text('Energy Consumption per capita');

  console.log('Loaded function!');
});
