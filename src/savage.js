/*
 * Copyright (C) 2015 Jose F. Maldonado
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Verify if the namespace is not already defined.
if(typeof SaVaGe !== 'object') SaVaGe = {};

/**
 * Creates a SVG element representing a toggle switch.
 * 
 * The parameter must be an object with the following attributes:
 * 'container' (a selector of the element where the element must be appended),
 * 'value' (a boolean indicating the initial value of the switch, by default 'false'),
 * 'height' (a number indicating the height, in pixels, of the element, by default 50),
 * 'width' (a number indicating the width, in pixels, of the element, by default 80),
 * 'radius' (a number indicating the radius of the lever),
 * 'border' (a number indicating the width, in pixels, the distance between the element background and the switch's button, by default 5),
 * 'duration' (a number indicating the number of milliseconds that the toggle animation must last, by default 250),
 * 'colors' (an object with the attributes 'backLeft', 'foreLeft', 'backRight' and 'foreRight' indicating the colors of the element in each state) and
 * 'onChange' (a callback function which is invoked every time that the element is clicked).
 * 
 * The object returned by this function contains the methods:
 * 'svg', and instance of the SVG object created with D3.js,
 * 'getValue()', for get the current state of the switch,
 * 'serValue(newVal)', for change the state of the switch and
 * 'remove()', for remove the element from the document.
 * 
 * @param {object} params An collection of values for customize the element.
 * @returns {object} An object with methods for manipulate the element.
 */
SaVaGe.ToggleSwitch = function(params) {
    // Verify parameters.
    if(typeof params !== 'object') params = {};
    if(typeof params.container !== 'string') params.container = "body";
    if(typeof params.value !== 'boolean') params.value = false;
    if(typeof params.height !== 'number') params.height = 50;
    if(typeof params.width !== 'number' || params.width < params.height) params.width = parseInt(params.height*1.6, 10);
    if(typeof params.radius !== 'number') params.radius = params.height/2 - 4;
    if(typeof params.duration !== 'number') params.duration = 250;
    if(typeof params.colors !== 'object') params.colors = {};
    if(params.colors.backLeft === undefined) params.colors.backLeft = "lightgray";
    if(params.colors.foreLeft === undefined) params.colors.foreLeft = "white";
    if(params.colors.backRight === undefined) params.colors.backRight = "#88f";
    if(params.colors.foreRight === undefined) params.colors.foreRight = "white";
    
    // Define internal variables.
    var atRight = params.value;
    
    // Calculate SVG dimensions and position offset.
    var svgHeight = params.height;
    var svgWidth = params.width;
    var offsetX = 0;
    var offsetY = 0;
    if(params.radius*2 > params.height) {
        svgHeight = params.radius*2;
        svgWidth = parseInt(params.width + (params.radius*2 - params.height), 10);
        offsetX = parseInt((svgWidth - params.width)/2, 10);
        offsetY = parseInt((svgWidth - params.width)/2, 10);
    }
    
    // Create widget.
    var svg = d3.select(params.container).append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .style("cursor", "pointer");
    var rect = svg.append("rect")
            .attr("x", offsetX)
            .attr("y", offsetY)
            .attr("rx", params.height/2)
            .attr("ry", params.height/2)
            .style("fill", atRight? params.colors.backRight : params.colors.backLeft)
            .attr("width", params.width)
            .attr("height", params.height);
    var circle = svg.append("circle")
            .attr("cx", (atRight? (params.width-params.height/2) : (params.height/2)) + offsetX)
            .attr("cy", params.height/2 + offsetY)
            .attr("r", params.radius)
            .style("fill", atRight? params.colors.foreRight : params.colors.foreLeft);

    // Define internal functions.
    var setAtRight = function(newValue) {
        atRight = newValue;
        circle.transition().duration(params.duration)
                .attr("cx", (atRight? (params.width-params.height/2) : (params.height/2)) + offsetX)
                .style("fill", atRight? params.colors.foreRight : params.colors.foreLeft);
        rect.transition().duration(params.duration).style("fill", atRight? params.colors.backRight : params.colors.backLeft);
        
    };
    
    // Define result's object.
    var res = {
        'svg' : svg,
        'getValue': function() { return atRight; },
        'setValue': setAtRight,
        'remove': function() { svg.remove(); }
    };

    // Define click listener.
    svg.on('click', function(data, index){
        setAtRight(!atRight);
        if(typeof params.onChange === 'function') params.onChange(res);
    });    
    
    return res;
};

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

/**
 * Creates a SVG element representing a checkbox.
 * 
 * The parameter must be an object with the following attributes:
 * 'container' (a selector of the element where the element must be appended),
 * 'size' (the widht and height, in pixels, of the checkbox, by default 25),
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
