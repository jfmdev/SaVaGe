
// Verify if the namespace is not already defined.
if(typeof SaVaGe !== 'object') SaVaGe = {};

/**
 * 
 * @param {object} params
 * @returns {object}
 */
SaVaGe.ToggleSwitch = function(params) {
    // Verify parameters.
    if(typeof params !== 'object') params = {};
    if(params.container === undefined) params.container = "body";
    if(typeof params.value !== 'boolean') params.value = false;
    if(typeof params.height !== 'number') params.height = 50;
    if(typeof params.width !== 'number' || params.width < params.height) params.width = parseInt(params.height*1.6, 10);
    if(typeof params.border !== 'number') params.border = 5;
    if(typeof params.colors !== 'object') params.colors = {};
    if(params.colors.backLeft === undefined) params.colors.backLeft = "lightgray";
    if(params.colors.foreLeft === undefined) params.colors.foreLeft = "white";
    if(params.colors.backRight === undefined) params.colors.backRight = "green";
    if(params.colors.foreRight === undefined) params.colors.foreRight = "white";
    
    // Define internal variables.
    var atRight = params.value;
    var radius = params.height/2 - params.border;
    
    // Create widget.
    var svg = d3.select("body").append("svg")
            .attr("width", params.width)
            .attr("height", params.height)
            .style("cursor", "pointer");
    var rect = svg.append("rect")
            .attr("rx", params.height/2)
            .attr("ry", params.height/2)
            .style("fill", atRight? params.colors.backRight : params.colors.backLeft)
            .attr("width", params.width)
            .attr("height", params.height);
    var circle = svg.append("circle")
            .attr("cx", atRight? (params.width-radius-params.border) : (radius+params.border))
            .attr("cy", params.height/2)
            .attr("r", radius)
            .style("fill", atRight? params.colors.foreRight : params.colors.foreLeft);

    // Define internal functions.
    var setAtRight = function(newValue) {
        atRight = newValue;
        circle.transition()
                .attr("cx", atRight? (params.width-radius-params.border) : (radius+params.border))
                .style("fill", atRight? params.colors.foreRight : params.colors.foreLeft);
        rect.transition().style("fill", atRight? params.colors.backRight : params.colors.backLeft);
        
    };

    // Define click listener.
    svg.on('click', function(data, index){
        setAtRight(!atRight);
    });    
    
    // Define result's object.
    var res = {
        'getValue': function() { return atRight; },
        'setValue': setAtRight
    };
    return res;
};
