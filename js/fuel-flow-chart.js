
var margin = 100,
    width = 960 - margin,
    height = 550 - margin;

var svg = d3.select('#fuel-flow-chart')
            .append('div')
            .classed('svg-container', true)
            .append('svg')
            .attr('preserveAspectRatio', 'xMinyMin meet')
            .attr('viewBox', '0 0 ' + (width + margin) + ' ' + (height + margin))
            .classed('svg-content-responsive', true)

var sankey = d3.sankey();
