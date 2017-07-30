
var margin = 100,
    width = 960 - margin,
    flow_height = 500 - margin; /* for some reason this gets confused with energy-chart's height
                                   (if named 'height') */

var svg = d3.select('#fuel-flow-chart')
            .append('div')
            .classed('svg-container', true)
            .append('svg')
            .attr('preserveAspectRatio', 'xMinyMin meet')
            .attr('viewBox', '0 0 ' + (width + margin) + ' ' + (flow_height + margin))
            .classed('svg-content-responsive', true)

var sankey = d3.sankey();
