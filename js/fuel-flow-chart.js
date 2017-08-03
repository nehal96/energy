
var margin = 100,
    width = 900 - margin,
    flow_height = 500 - margin; /* for some reason this gets confused with energy-chart's height
                                   if named 'height' */

var svg = d3.select('#fuel-flow-chart')
            .append('div')
            .classed('svg-container', true)
            .append('svg')
            .attr('preserveAspectRatio', 'xMinyMin meet')
            .attr('viewBox', '0 0 ' + (width + margin) + ' ' + (flow_height + margin))
            .classed('svg-content-responsive', true)

var formatNumber = d3.format(",.0f"),
    format = function(d) {
        return formatNumber(d) + " TWh";
    },
    // Colours picked from http://www.flatuicolorpicker.com/:
    // In order: Flamingo, Radical Red, Medium Purple, Rebecca Purple, San Marino,
    // Dodger Blue, Jade, Turquoise, Ripe Lemon, Ecstasy, Sunset Orange
    color = d3.scaleOrdinal(["#EF4836", "#F62459", "#BF55EC", "#663399",
                             "#446CB3", "#19B5FE", "#00B16A", "#36D7B7",
                             "#F7CA18", "#F9690E", "#F64747"])

var sankey = d3.sankey()
               .nodeId(function(d) {
                  return d.name;
               })
               .nodeWidth(15)
               .nodePadding(10)
               .extent([[1, 1], [width + margin, height - 6]]);

var link = svg.append('g')
                .attr('class', 'links')
                .attr('fill', 'none')
                .attr('stroke', '#000')
                .attr('stroke-opacity', 0.2)
              .selectAll('path');

var node = svg.append('g')
                .attr('class', 'nodes')
                .attr('font-family', 'Merriweather, serif')
                .attr('font-size', 10)
              .selectAll('g');

d3.json('data/fuel-flow-chart.json', function(error, energy) {
    if (error) throw error;

    sankey(energy);

    link = link.data(energy.links)
               .enter()
               .append('path')
                .attr('d', d3.sankeyLinkHorizontal())
                .attr('class', function(d) {
                    return d.source.name.replace(/ /g,'');
                })
                .attr('id', function(d) {
                    return (d.source.name + "2" + d.target.name).replace(/ /g,'');
                })
                .attr('stroke-width', function(d) {
                    return Math.max(2, d.width);
                })
                .on('mouseover', function() {
                    if (d3.select(this).classed('clicked') != true) {
                      colorPaths('.' + d3.select(this).attr('class'), '#' + d3.select(this).attr('class'))
                    }
                })
                .on('mouseout', function() {
                    if (d3.select(this).classed('clicked') != true) {
                      defaultColor('.' + d3.select(this).attr('class'))
                    }
                })
                .on('click', function() {
                    if (d3.select(this).classed('clicked')) {
                        // When 'clicked' class is active, calling for the class attributes
                        // gives "<Name of fuel> clicked". .split(" ") will split this into
                        // two words, so that all the paths in that fuel class can be 'unclicked'
                        var path_class = d3.select(this).attr('class').split(" ")
                        defaultColor('.' + path_class[0])

                        d3.selectAll('.' + path_class)
                          .classed('clicked', false);
                    } else {
                        var path_class = d3.select(this).attr('class')
                        colorPaths('.' + d3.select(this).attr('class'), '#' + d3.select(this).attr('class'))

                        d3.selectAll('.' + path_class)
                          .classed('clicked', true);
                    }
                });

    link.append('title')
          .text(function(d) {
              return d.source.name + " → " + d.target.name + "\n" + format(d.value);
          });

    node = node.data(energy.nodes)
               .enter()
               .append('g');

    node.append('rect')
          .attr('id', function(d) {
              return d.name.replace(/ /g,'');
          })
          .attr('x', function(d) {
              return d.x0;
          })
          .attr('y', function(d) {
              return d.y0;
          })
          .attr('height', function(d) {
              return d.y1 - d.y0;
          })
          .attr('width', function(d) {
              return d.x1 - d.x0;
          })
          .attr('fill', function(d) {
              return color(d.name.replace(/ .*/, ""));
          })
          .attr('stroke', '#000');

    node.append('text')
          .attr('x', function(d) {
              return d.x0 - 6;
          })
          .attr('y', function(d) {
              return (d.y1 + d.y0) / 2;
          })
          .attr('dy', '0.35em')
          .attr('text-anchor', 'end')
          .text(function(d) {
              return d.name;
          })
          .filter(function(d) {
              return d.x0 < width / 2;
          })
          .attr('x', function(d) {
              return d.x1 + 6;
          })
          .attr('text-anchor', 'start');

    node.append('title')
        .text(function(d) {
            return d.name + "\n" + format(d.value);
        })

    customNodeColors();

    // Custom colours for particular nodes
    function customNodeColors() {
        // Rejected Energy:
        d3.select('#RejectedEnergy')
          .attr('fill', '#f67280');

        // Energy Services:
        d3.select('#EnergyServices')
          .attr('fill', '#00B16A');

        // Industrial:
        d3.select('#Industrial')
          .attr('fill', '#4B77BE');

        // Commercial:
        d3.select('#Commercial')
          .attr('fill', '#F7CA18');

        // Residential:
        d3.select('#Residential')
          .attr('fill', '#19B5FE');
    };

    function defaultColor(pathClass) {
        return d3.selectAll(pathClass)
                 .attr('stroke', '#000');
    };

    // Takes the color of the rectangle (through nodeID), and changes the path
    // stroke to that color.
    function colorPaths(pathClass, nodeID) {
        var color = d3.select(nodeID)
                      .attr('fill');

        return d3.selectAll(pathClass)
                 .attr('stroke', color)
                 .style('cursor', 'pointer')
    };
});
