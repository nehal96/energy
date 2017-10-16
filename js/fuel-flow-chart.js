
d3.json('data/fuel-flow-chart.json', function(error, energy) {
    if (error) throw error;

    var margin = 100,
        width = 900 - margin,
        height = 450 - margin;

    var svg = d3.select('#fuel-flow-chart')
                .append('svg')
                .attr('viewBox', '0 0 ' + (width + margin) + ' ' + (height + margin))

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
                    .attr('stroke-opacity', 0.1)
                  .selectAll('path');

    var node = svg.append('g')
                    .attr('class', 'nodes')
                    .attr('font-family', 'Merriweather, serif')
                    .attr('font-size', 10)
                  .selectAll('g');

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
                });

    link.append('title')
        .text(function(d) {
            return d.source.name + " → " + d.target.name + "\n" + format(d.value);
        });

    node = node.data(energy.nodes)
               .enter()
               .append('g')
               .attr('id', function(d) {
                 return d.name.replace(/ /g,'') + "-g";
               });

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

    link.on('mouseover', function() {
            if (d3.select(this).classed('clicked') != true) {
              colorPaths('.' + d3.select(this).attr('class'), '#' + d3.select(this).attr('class'))
            }
        })
        .on('mouseout', function() {
            if (d3.select(this).classed('clicked') != true) {
              defaultColor('.' + d3.select(this).attr('class'))
            }
        })
        .on('click', function(d) {
            if (d3.select(this).classed('clicked')) {
                // When 'clicked' class is active, calling for the class attributes
                // gives "<Name of fuel> clicked". .split(" ") will split this into
                // two words, so that all the paths in that fuel class can be 'unclicked'
                var path_class = d3.select(this).attr('class').split(" ")
                defaultColor('.' + path_class[0])

                d3.selectAll('.' + path_class)
                  .classed('clicked', false);

                // When unclicked, remove title from calculator section
                d3.select('#fuel-name')
                  .text('Fuel');

                d3.select('#fuel-total-energy')
                  .text('Energy Produced: ');
            } else {
                var path_class = d3.select(this).attr('class')
                colorPaths('.' + d3.select(this).attr('class'), '#' + d3.select(this).attr('class'))

                d3.selectAll('.' + path_class)
                  .classed('clicked', true);

                // Add fuel name as title in calculator section
                var node_g_id = "#" + d3.select(this).attr('class').split(" ")[0] + "-g";
                var fuel_name = d3.select(node_g_id)
                                  .select("text")
                                  .text()

                d3.select('#fuel-name')
                  .text(fuel_name);

                var total_energy = getEnergyProduced(total_energy_dict, fuel_name);

                d3.select('#fuel-total-energy')
                  .text("Energy Produced: " + total_energy);
            }
        });

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

    // Returns path stroke to default grey color.
    function defaultColor(pathClass) {
        return d3.selectAll(pathClass)
                 .attr('stroke', '#000')
                 // Set opacity back to default value
                 .attr('stroke-opacity', 0.1);
    };

    // Takes the color of the rectangle (through nodeID), and changes the path
    // stroke to that color.
    function colorPaths(pathClass, nodeID) {
        var color = d3.select(nodeID)
                      .attr('fill');

        return d3.selectAll(pathClass)
                 .attr('stroke', color)
                 // Increases opacity so coloured path stands out
                 .attr('stroke-opacity', 0.3)
                 .style('cursor', 'pointer')
    };

    // Creates a dictionary object with energy source/target as the key and total
    // energy consumed as the value. Creating a dictionary will make it easy to
    // access the numbers required for calculations.
    // (Also not sure if putting this in JSON is better; too afraid to make
    // changes to JSON data)
    function createTotalEnergyDict(energy) {
        var energy_list = energy["nodes"];

        var total_energy_dict = {};

        for (i = 0; i < energy_list.length; i++) {
          var name = energy_list[i]["name"];
          var value = energy_list[i]["value"];

          total_energy_dict[name] = value;
        };

        return total_energy_dict;
    };

    // Create dictionary object
    let total_energy_dict = createTotalEnergyDict(energy);

    // Gets total energy for the particular energy source/target from
    // dictionary created above.
    function getEnergyProduced(total_energy_dict, node) {
        return format(total_energy_dict[node]);
    }
});
