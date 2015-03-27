/*
 * Copyright (C) 2015 Jose F. Maldonado
 * This library is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
 * This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public License along with this library; If not, see <http://www.gnu.org/licenses/>.
 */

// Verify if the namespace is not already defined.
if(typeof SaVaGe !== 'object') SaVaGe = {};

/**
 * Creates a SVG element representing a simple pie chart for represent a progress.
 * 
 * The parameter must be an object with the following attributes:
 * 'container' (a selector of the element where the element must be appended),
 * 'value' (an integer, between 0 and 1, indicating the progress to display),
 * 'radius' (the radius of the pie, by default 25),
 * 'innerRadius' (the radius of the hole inside the pie, in case of wanted to make a donut, by default 0),
 * 'rotate' (how many degrees the slices must be rotated, by default 0),
 * 'label' (an object with the attributes 'show', 'text', 'size', 'family' and 'color', indicating if a label must be show and his characteristics) and
 * 'colors' (an object with the attributes 'completed' and 'pending', indicating the colors of each slice of the pie).
 * 
 * The object returned by this function contains the methods:
 * 'svg', and instance of the SVG object created with D3.js,
 * 'remove()', for remove the element from the document.
 * 
 * @param {object} params An collection of values for customize the element.
 * @returns {object} An object with methods for manipulate the element.
 */
SaVaGe.ProgressPieChart = function(params) {
    // Verify parameters.
    if(typeof params !== 'object') params = {};
    if(typeof params.container !== 'string') params.container = "body";
    if(typeof params.value !== 'number') {
        params.value = 0.6;
    } else {
        if(params.value < 0) params.value = 0;
        if(params.value > 1) params.value = 1;
    }
    if(typeof params.radius !== 'number') params.radius = 25;
    if(typeof params.innerRadius !== 'number') params.innerRadius = 0;
    if(typeof params.rotate !== 'number') params.rotate = 0;
    if(typeof params.label !== 'object') params.label = {};
    if(typeof params.label.show !== 'boolean') params.label.show = false;
    if(typeof params.label.text !== 'string') params.label.text = parseInt(params.value*100, 10) + "%";
    if(typeof params.label.size !== 'string') params.label.size = "12px";
    if(typeof params.label.color !== 'string') params.label.color = "black";
    if(typeof params.label.family !== 'string') params.label.family = "Arial Black";
    if(typeof params.colors !== 'object') params.colors = {};
    if(params.colors.completed === undefined) params.colors.completed = "#080";
    if(params.colors.pending === undefined) params.colors.pending = "#E65F00";

    // Create SVG object.
    var svg = d3.select(params.container)
        .append("svg")
        .attr("width", params.radius*2)
        .attr("height", params.radius*2);

    // Define radius in arc object.
    var arc = d3.svg.arc().outerRadius(params.radius);
    if(params.innerRadius > 0) arc.innerRadius(params.innerRadius);
    
    // Define the data and create an instance of pie.
    var dataset = [100 - params.value*100, params.value*100];
    var pie = d3.layout.pie();
        
    // Create arcs.
    var arcs = svg.selectAll("g.arc")
        .data(pie(dataset))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + params.radius + ", " + params.radius + ")");
    arcs.append("path")
        .attr("fill", function(d, i) { return i === 1? params.colors.completed : params.colors.pending; })
        .attr("d", arc)
        .attr('transform', "rotate("+params.rotate+")");

    // Draw text (if need).
    if(params.label.show) {
        svg.append("text")
            .attr("x", params.radius)
            .attr("y", params.radius)
            .attr("dy", ".35em")
            .attr("font-family", params.label.family)
            .attr("font-size", params.label.size)
            .attr("fill", params.label.color)
            .style("text-anchor", "middle")
            .text(params.label.text);
    }
    
    // Define result's object.
    var res = {
        'svg' : svg,
        'remove': function() { svg.remove(); }
    };

    return res;
};
