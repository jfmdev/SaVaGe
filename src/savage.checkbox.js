/*
 * Copyright (C) 2015 Jose F. Maldonado
 * This library is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
 * This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public License along with this library; If not, see <http://www.gnu.org/licenses/>.
 */

// Verify if the namespace is not already defined.
if(typeof SaVaGe !== 'object') SaVaGe = {};

/**
 * Creates a SVG element representing a bheckbox.
 * 
 * The parameter must be an object with the following attributes:
 * 'container' (a selector of the element where the element must be appended),
 * 'size' (the widht and height, in pixels, of the checkbox, by default 25),
 * 'value' (a number between 0 and 2, indicating the initial state of the checkbox),
 * 'border' (an object with the numerical attributes 'width' and 'radius' indicating the width of the checkbox's border and the radius of his corners,
 * 'tristate' (a boolean indicating if the chechbox must have three states [unchecked, checked and cancelled], instead of only two [checked and unchecked]),
 * 'marks' (an object with the attributes 'unchecked', 'checked' and 'cancelled', which indicates which kind of mark must be used for represent each state, their possible values are 'empty', 'tick', 'cross' and 'fill'),
 * 'colors' (an object with the attributes 'border', 'back', 'tick', 'cross' and 'fill' indicating the different colors used in the checkbox),
 * 
 * The object returned by this function contains the methods:
 * 'svg', and instance of the SVG object created with D3.js,
 * 'getValue()', for get the current state of the checkbox (a number between 0 and 2),
 * 'serValue(newVal)', for change the state of the checkbox and
 * 'remove()', for remove the element from the document.
 * 
 * @param {object} params An collection of values for customize the element.
 * @returns {object} An object with methods for manipulate the element.
 */
SaVaGe.CheckBox = function(params) {
    // Verify parameters.
    if(typeof params !== 'object') params = {};
    if(typeof params.container !== 'string') params.container = "body";
    if(typeof params.size !== 'number') params.size = 25;
    if(typeof params.value !== 'number') params.value = 0;
    if(typeof params.border !== 'object') params.border = {};
    if(typeof params.border.radius !== 'number') params.border.radius = 0;
    if(typeof params.border.width !== 'number') params.border.width = 1;
    if(typeof params.tristate !== 'boolean') params.tristate = false;
    if(typeof params.marks !== 'object') params.marks = {};
    if(typeof params.marks.unchecked !== "string") params.marks.unchecked = "empty";
    if(typeof params.marks.checked !== "string") params.marks.checked = "tick";
    if(typeof params.marks.cancelled !== "string") params.marks.cancelled = "cross";
    if(typeof params.colors !== 'object') params.colors = {};
    if(typeof params.colors.back === "undefined") params.colors.back = "white";
    if(typeof params.colors.border === "undefined") params.colors.border = "black";
    if(typeof params.colors.tick === "undefined") params.colors.tick = "black";
    if(typeof params.colors.cross === "undefined") params.colors.cross = "black";
    if(typeof params.colors.fill === "undefined") params.colors.fill = "black";
    
    // Define internal variables.
    var state = 0;
    
    // Create widget.
    var svg = d3.select(params.container).append("svg")
            .attr("width", params.size + params.border.width*2)
            .attr("height", params.size + params.border.width*2)
            .style("cursor", "pointer");
    var rect = svg.append("rect")
            .attr("x", params.border.width)
            .attr("y", params.border.width)
            .attr("rx", params.border.radius)
            .attr("ry", params.border.radius)
            .style("fill", params.colors.back)
            .style("stroke", params.colors.border)
            .style("stroke-width", params.border.width)
            .attr("width", params.size)
            .attr("height", params.size);
    var mark = null;

    // Define internal functions.
    var setState = function(newState) {
        // Set new state.
        state = params.tristate? newState%3 : newState%2;
        
        // Remove old mark.
        if(mark !== null) mark.remove();
        
        // Find the symbol of the new mark.
        var symbol = null;
        if(state === 0) symbol = params.marks.unchecked;
        else if(state === 1) symbol = params.marks.checked;
        else symbol = params.marks.cancelled; // state = 2
        
        // Add new mark.
        if(symbol === "empty") {
            mark = null;
        } else if(symbol === "tick") {
            // Draw two lines.
            var width = parseInt(params.size/5, 10);
            if(width < 2) width = 2;

            var lineFunction = d3.svg.line().x(function(d) { return d.x; }).y(function(d) { return d.y; }).interpolate("linear");
            var lineData = [ { "x": params.border.width + params.size - width/2,    "y": params.border.width + width/2},  
                             { "x": params.border.width + parseInt(params.size/3),  "y": params.border.width + params.size - width/1.4},
                             { "x": params.border.width + width/2,                  "y": params.border.width + parseInt(2*params.size/3)} ];   
            mark = svg.append("path")
                .attr("d", lineFunction(lineData))
                .attr("stroke", params.colors.tick)
                .attr("stroke-width", width)
                .attr("fill", "none");             

        } else if(symbol === "cross") {
            // Draw two crossed lines.
            var width = parseInt(params.size/5, 10);
            if(width < 2) width = 2;
            
            mark = svg.append("g");
            mark.append("line")
                .attr("x1", params.border.width + width/2)
                .attr("y1", params.border.width + width/2)
                .attr("x2", params.border.width + params.size - width/2)
                .attr("y2", params.border.width + params.size - width/2)
                .style("stroke", params.colors.cross)
                .style("stroke-width", width);
            mark.append("line")
                .attr("x1", params.border.width + params.size - width/2)
                .attr("y1", params.border.width + width/2)
                .attr("x2", params.border.width + width/2)
                .attr("y2", params.border.width + params.size - width/2)
                .style("stroke", params.colors.cross)
                .style("stroke-width", width);
        } else if(symbol === "fill") {
            // Draw an smaller rectable.
            var space = parseInt(params.size/10, 10);
            if(space < 1) space = 1;
            
            mark = svg.append("rect")
                .attr("x", params.border.width + space)
                .attr("y", params.border.width + space)
                .attr("rx", params.border.radius)
                .attr("ry", params.border.radius)
                .style("fill", params.colors.fill)
                .attr("width", params.size - space*2)
                .attr("height", params.size - space*2);            
        }
    };
    
    // Set initial state.
    setState(params.value);
    
    // Define result's object.
    var res = {
        'svg' : svg,
        'getValue': function() { return state; },
        'setValue': setState,
        'remove': function() { svg.remove(); }
    };

    // Define click listener.
    svg.on('click', function(data, index){
        setState(state + 1);
        if(typeof params.onChange === 'function') params.onChange(res);
    });    
    
    return res;
};
