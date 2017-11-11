
d3.json('data/fuel-flow-chart.json', function(error, energy) {
    if (error) throw error;

    const FUELS = ["Biomass", "Coal", "Geothermal", "Hydro", "Natural Gas",
                 "Nuclear", "Petroleum", "Solar", "Wind"];

    const SECTORS = ["Electricity Generation", "Residential", "Commercial",
                     "Industrial", "Transportation"];

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

              performCalculatorMagic(d3.select(this), total_energy_dict, path_energies_dict, sector_breakdown_dict);
            }
        })
        .on('mouseout', function() {
            if (d3.select(this).classed('clicked') != true) {
              defaultColor('.' + d3.select(this).attr('class'))

              defaultCalculator();
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

                defaultCalculator();
            } else {
                var path_class = d3.select(this).attr('class')
                colorPaths('.' + d3.select(this).attr('class'), '#' + d3.select(this).attr('class'))

                d3.selectAll('.' + path_class)
                  .classed('clicked', true);

                performCalculatorMagic(d3.select(this), total_energy_dict, path_energies_dict, sector_breakdown_dict);
            };
        });


    // Fuel flowchart section navigation.

    const section_explanations = [
        "Click the right arrow to begin...",

        "The United States uses a variety of fuels to feed its enormous energy \
        appetite, creating a whopping 28,422 terawatt hours of energy (most of \
        this will end up as waste, as you'll soon see). The logistics of this \
        operation is probably exemplified by how confusing this graph looks \
        right now, but it will all be clear in a second.",

        "Petroleum, light up! Petroleum is the most popular fuel in the US. It \
        is used primarly for transportation, which uses nearly 72% of all \
        petroleum in the country. The rest is mostly gobbled up mostly by \
        the industrial sector, with residential, commercial, and electricity \
        generation taking the crumbs.",

        "Natural Gas and Coal are next in the pecking order, making up 29.3% \
        and 14.7% of total fuel energy, respectively. Most of coal (little \
        more than 90%) is used for electricity generation, whereas natural gas \
        is roughly split between all industries. Along with Petroleum, the \
        fossil fuels make up 81.1% of all primary energy production.",

        "Clean and/or renewable energy sources like Nuclear and Solar make up \
        the remaining 18.9%. In fact, renewable energy sources, which doesn't \
        include Nuclear, accounts for just above 10% of all of United States' \
        primary energy production today. Solar accounts for just 0.4%!"
    ]

    // Number that keeps track of which section we're currently on
    var section_number = 0

    d3.select('#fuel-flow-prose p')
      .text(section_explanations[section_number]);

    // Functionality when clicking the right (next) arrow
    d3.select('#fuel-right-arrow')
      .on('click', function() {
          if (section_number < section_explanations.length - 1) {
            section_number += 1;

            navigation();
          }
      });

    // Functionality when clicking the left (previous) arrow
    d3.select('#fuel-left-arrow')
      .on('click', function(d) {
          if (section_number > 0) {
            section_number -= 1;

            navigation();
          }
      });

    // Function that changes elements in the flowchart to match section
    // narrative (ex: highlighted sections, numbers.)
    function navigation(energy) {
        // Change text to particular section
        d3.select('#fuel-flow-prose p')
          .text(section_explanations[section_number]);

        if (section_number == 0) {
            // If we're in the first section, make all path colours the default
            // grey colour (for now, only does fuel paths).
            for (i = 0; i < FUELS.length; i ++) {
              fuel_classed = '.' + FUELS[i].replace(/ /g,'');
              defaultColor(fuel_classed);
            };

            // Remove any info in calculator
            defaultCalculator();
        }

        if (section_number == 1) {
            // In the first section, we're going to highlight all the fuel paths
            for (i = 0; i < FUELS.length; i++) {
              fuels_classed = '.' + FUELS[i].replace(/ /g,'');
              fuels_ided = '#' + FUELS[i].replace(/ /g,'');

              colorPaths(fuels_classed, fuels_ided);
            };

            // Remove any info in calculator
            defaultCalculator();
        }

        if (section_number == 2) {
            // Second section focuses on Petroleum.

            // Un-highlight all paths.
            for (i = 0; i < FUELS.length; i++) {
              fuels_classed = '.' + FUELS[i].replace(/ /g,'');
              defaultColor(fuels_classed);
            }

            // Highlight Petroleum
            colorPaths('.Petroleum', '#Petroleum')

            // Remove any info in calculator
            defaultCalculator();

            // Insert Petroleum calc info
            performCalculatorMagic(d3.select('#Petroleum2Transportation'), total_energy_dict, path_energies_dict, sector_breakdown_dict);
        }

        if (section_number == 3) {
            // Third section is on Coal and Natural Gas

            // Un-highlight all paths.
            for (i = 0; i < FUELS.length; i++) {
              fuels_classed = '.' + FUELS[i].replace(/ /g,'');
              defaultColor(fuels_classed);
            }

            // Highlight Coal and Natural Gas
            colorPaths('.Coal', '#Coal')
            colorPaths('.NaturalGas', '#NaturalGas')

            // Remove any info in calculator
            defaultCalculator();

            // Insert Natural Gas calc info (placeholder - want to do total for
            // Coal and NG).
            performCalculatorMagic(d3.select('#NaturalGas2ElectricityGeneration'), total_energy_dict, path_energies_dict, sector_breakdown_dict);
        }

        if (section_number == 4) {
            // Fourth section is on clean/renewable energy sources.

            // Un-highlight all paths.
            for (i = 0; i < FUELS.length; i++) {
              fuels_classed = '.' + FUELS[i].replace(/ /g,'');
              defaultColor(fuels_classed);
            }

            // Highlight Nuclear, Hydro, Wind, Solar, Biomass, and Geothermal
            colorPaths('.Nuclear', '#Nuclear')
            colorPaths('.Hydro', '#Hydro')
            colorPaths('.Wind', '#Wind')
            colorPaths('.Solar', '#Solar')
            colorPaths('.Biomass', '#Biomass')
            colorPaths('.Geothermal', '#Geothermal')

            // Remove any info in calculator
            defaultCalculator();

            // Insert Nuclear calc info (placeholder - want to do All Renewable
            // Energy)
            performCalculatorMagic(d3.select('#Nuclear2ElectricityGeneration'), total_energy_dict, path_energies_dict, sector_breakdown_dict);
        }
    }

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

    // Creates a dictionary object with a energy path/flow as the key (Ex:
    // "Solar to Electricity Generation") and energy amount as the value.
    function createPathEnergyDict(energy) {
      var path_list = energy["links"];

      var path_energies_dict = {};

      for (i = 0; i < path_list.length; i++) {
          var source = path_list[i]["source"]["name"];
          var target = path_list[i]["target"]["name"];
          var name = source + " to " + target;
          var value = path_list[i]["value"];

          path_energies_dict[name] = value;
      }

      return path_energies_dict;
    }

    // Creates a dictionary that has sources as the keys, with the values being
    // a dictionary of targets with its respective values.
    function createSectorBreakdownDict(energy) {
        var path_list = energy["links"];

        var sector_breakdown_dict = {};

        for (i = 0; i < path_list.length; i++) {
            var source = path_list[i]["source"]["name"];
            var target = path_list[i]["target"]["name"];
            var value = path_list[i]["value"];

            if (!(source in sector_breakdown_dict)) {
                sector_breakdown_dict[source] = [];
                sector_breakdown_dict[source].push({"target": target, "value": value});
            } else {
                sector_breakdown_dict[source].push({"target": target, "value": value});
            }
        };

        // For each source, sort targets by descending order of energy usage.
        for (var source in sector_breakdown_dict) {
            for (i = 0; i < sector_breakdown_dict[source].length; i++) {
              sector_breakdown_dict[source].sort(function(x, y) {
                  return d3.descending(x.value, y.value)
              })
            }
        }

        return sector_breakdown_dict;
    };

    // Create dictionary objects
    let total_energy_dict = createTotalEnergyDict(energy);
    let path_energies_dict = createPathEnergyDict(energy);
    let sector_breakdown_dict = createSectorBreakdownDict(energy);

    // Gets total energy for the particular energy source/target from
    // dictionary created above.
    function getEnergyProduced(node, total_energy_dict, path_energies_dict) {
        var exception_list = ["Transportation", "Industrial", "Commercial", "Residential"];

        if (exception_list.includes(node)) {
            var energy_w_elec_gen = total_energy_dict[node];
            var path_name = "Electricity Generation to " + node;
            var path_value = path_energies_dict[path_name];
            var net_energy = energy_w_elec_gen - path_value;

            return net_energy;
        } else {
            return total_energy_dict[node];
        }

    }

    // Calculates total energy produced by fuels by adding energy production
    // from each individual fuel
    function totalFuelEnergy(total_energy_dict) {

        var total_fuel_energy = 0;

        for (i = 0; i < FUELS.length; i++) {
            var fuel = FUELS[i];
            total_fuel_energy += total_energy_dict[fuel];
        }

        return total_fuel_energy;
    };

    // Calculates total energy produced for sectors by adding energy consumption
    // for each individual sector
    function totalSectorEnergy(total_energy_dict, path_energies_dict) {
        var total_sector_energy = 0;

        for (i = 0; i < SECTORS.length; i++) {
            var sector = SECTORS[i];
            if (sector == "Electricity Generation") {
                total_sector_energy += total_energy_dict[sector];
            } else {
                // Remove energy amount that comes from Electricity Generation
                var path_name = "Electricity Generation to " + sector;
                var path_value = path_energies_dict[path_name];
                total_sector_energy += (total_energy_dict[sector] - path_value);
            }
        };

        return total_sector_energy;
    };

    // Calculates the percentage of energy that flows to each sector/next stage
    // for a particular fuel or sector. Then appends a row for each fuel/sector
    // in the Breakdown by Sector table.
    function getBreakdownBySector(node, sector_breakdown_dict) {
        var targets_array = sector_breakdown_dict[node];
        var total_energy = 0;

        for (i = 0; i < targets_array.length; i++) {
            target_dict = targets_array[i];
            total_energy += target_dict["value"];
        }

        // Check if the table body is empty; if yes, append rows and data. This
        // prevents the double addition of info if you hover and then click.
        if (d3.select('#fuel-sector-breakdown-table tbody').selectAll('tr').empty()) {
            for (i = 0; i < targets_array.length; i++) {
                target_dict = targets_array[i];
                target = target_dict["target"];
                var percent_by_sector = ((target_dict["value"] / total_energy) * 100).toFixed(1);

                var table_row = d3.select('#fuel-sector-breakdown-table tbody')
                                  .append('tr')

                table_row.append('td')
                          .text(target)

                table_row.append('td')
                          .text(percent_by_sector + "%");
            }
        }
    };

    // Removes the Breakdown by Sector information (for mouseout and unclicking)
    function removeBreakdownBySector() {
        // Remove all table rows
        d3.select('#fuel-sector-breakdown-table')
          .selectAll('tr')
          .remove();
    };

    // Main function that performs all the tasks required to fill the Energy
    // Calculator section with information.
    function performCalculatorMagic(DOM_elem, total_energy_dict,
                  path_energies_dict, sector_breakdown_dict) {
      // Add fuel name as title in calculator section
      //console.log(DOM_elem);
      var node_g_id = "#" + DOM_elem.attr('class').split(" ")[0] + "-g";
      //console.log(node_g_id)
      var fuel_name = d3.select(node_g_id)
                        .select("text") // Gets Title Cased text
                        .text()

      d3.select('#fuel-name')
        .text(fuel_name);

      // Add energy produced values in calculator section
      var energy_produced = format(getEnergyProduced(fuel_name, total_energy_dict, path_energies_dict));

      d3.select('#fuel-total-energy-value')
        .text(energy_produced);

      if (FUELS.includes(fuel_name)) {
          // Add % total energy values (for just fuels) in calculator
          // section
          var percent_total_energy_fuel = ((getEnergyProduced(fuel_name, total_energy_dict, path_energies_dict) / totalFuelEnergy(total_energy_dict)) * 100).toFixed(1);

          d3.select('#fuel-percent-total-field')
            .text('% Total Energy (Fuels):')

          d3.select('#fuel-percent-total-value')
            .text(percent_total_energy_fuel + "%");
      } else {
          // Add % total energy values (for just sectors) in
          // calculator section
          var percent_total_energy_sector = ((getEnergyProduced(fuel_name, total_energy_dict, path_energies_dict) / totalSectorEnergy(total_energy_dict, path_energies_dict)) * 100).toFixed(1);

          d3.select('#fuel-percent-total-field')
            .text('% Total Energy (Sectors):')
          d3.select('#fuel-percent-total-value')
            .text(percent_total_energy_sector + "%");
      };

      getBreakdownBySector(fuel_name, sector_breakdown_dict);

    };

    // Removes all the information from the Energy Calculator section for
    // mouseout or when unclicked
    function defaultCalculator() {
      // When unclicked, remove title from calculator section
      d3.select('#fuel-name')
        .text('Fuel/Sector');

      // When unclicked, remove energy produced value
      d3.select('#fuel-total-energy-value')
        .text('');

      // When unclicked, remove % total energy value and reset field
      d3.select('#fuel-percent-total-value')
        .text('');

      d3.select('#fuel-percent-total-field')
        .text('% Total Energy:');

      removeBreakdownBySector();
    };
});
