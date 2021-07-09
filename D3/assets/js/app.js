
// Set default x/y axis variables.
var chosenXAxis = "Population";
var chosenYAxis = "AverageBirth";
// Function used for updating x-scale var upon click on axis label.
function xScale(data, chosenXAxis, chartWidth) {
    // Create scales.
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]),
            d3.max(data, d => d[chosenXAxis])])
        .range([0, chartWidth]);
    return xLinearScale;
}
// Function used for updating xAxis var upon click on axis label.
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}
// Function used for updating y-scale var upon click on axis label.
function yScale(data, chosenYAxis, chartHeight) {
    // Create scales.
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]),
            d3.max(data, d => d[chosenYAxis])])
        .range([chartHeight, 0]);
    return yLinearScale;
}
// Function used for updating yAxis var upon click on axis label.
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
}
// Function used for updating circles group with a transition to new circles.
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
}
// Function used for updating text in circles group with a transition to new text.
function renderText(circletextGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    circletextGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));
    return circletextGroup;
}
// Function used for updating circles group with new tooltip.
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {
    // Conditional for X Axis.
    if (chosenXAxis === "Population") {
        var xlabel = "Average Population: ";
    } else if (chosenXAxis === "AverageEducation") {
        var xlabel = "Average Education: "
    } else {
        var xlabel = "Average Drug or Alcohol use: "
    }
    // Conditional for Y Axis.
    if (chosenYAxis === "AverageBirth") {
        var ylabel = "Average Birth: ";
    // } else if (chosenYAxis === "-----") {
    //     var ylabel = "----: "
    // } else {
    //     var ylabel = "----: "
    }
    // Define tooltip.
    var toolTip = d3.tip()
        .offset([120, -60])
        .attr("class", "d3-tip")
        .html(function(d) {
            if (chosenXAxis === "Population" || chosenXAxis === "AverageEducation" || chosenXAxis === "AverageDrug") {
                // All yAxis tooltip labels presented 
                // Display Location for xAxis.
                return (`${d.Location}<hr>${xlabel} ${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}`);
                } else if (chosenXAxis !== "AverageEducation" && chosenXAxis !== "Population") {
                
                return (`${d.Location}<hr>${xlabel}$${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}`);
                } else {
          
                return (`${d.Location}<hr>${xlabel}${d[chosenXAxis]}%<br>${ylabel}${d[chosenYAxis]}`);
                }      
        });
    circlesGroup.call(toolTip);
    // Create "mouseover" event listener to display tool tip.
    circlesGroup
        .on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });
    textGroup
        .on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });
    return circlesGroup;
}
function makeResponsive() {
    // Select div by id.
    var svgArea = d3.select("#scatter").select("svg");
    // Clear SVG.
    if (!svgArea.empty()) {
        svgArea.remove();
    }
    //SVG params.
    var svgHeight = window.innerHeight/1.5;
    var svgWidth = window.innerWidth/1.7;
    // Margins.
    var margin = {
        top: 20,
        right: 40,
        bottom: 150,
        left: 100
    };
    // Chart area minus margins.
    var chartHeight = svgHeight - margin.top - margin.bottom;
    var chartWidth = svgWidth - margin.left - margin.right;
    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
    // Append an SVG group
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    d3.csv("assets/data/Average_Birth_Education_Drug_byState.csv").then(function(demoData, err) {
        if (err) throw err;
        // Parse data. Location,AverageBirth,AverageEducation,AverageDrug,Latitude,Longitude,Population
        demoData.forEach(function(data) {
            data.Location;
            data.AverageBirth = +data.AverageBirth;
            data.AverageEducation= +data.AverageEducation;
            data.AverageDrug = +data.AverageDrug;
            data.Population = +data.Population;
        });
        // Create x/y linear scales.
        var xLinearScale = xScale(demoData, chosenXAxis, chartWidth);
        var yLinearScale = yScale(demoData, chosenYAxis, chartHeight);
        // Create initial axis functions.
        var bottomAxis =d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);
        // Append x axis.
        var xAxis = chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis);
        // Append y axis.
        var yAxis = chartGroup.append("g")
            .call(leftAxis);
        // Set data used for circles.
        var circlesGroup = chartGroup.selectAll("circle")
            .data(demoData);
        // Bind data.
        var elemEnter = circlesGroup.enter();
        // Create circles.
        var circle = elemEnter.append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", 15)
            .classed("stateCircle", true);
        // Create circle text.
        var circleText = elemEnter.append("text")            
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis]))
            .attr("dy", ".35em") 
            .text(d => d.abbr)
            .classed("stateText", true);
        // Update tool tip function above csv import.
        var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circle, circleText);
        // Add x label groups and labels.
        var xLabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
        var PopulationLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "Population") // value to grab for event listener
            .classed("active", true)
            .text("Average Population");
        var AverageEducationLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "AverageEducation") // value to grab for event listener
            .classed("inactive", true)
            .text("Average Education");
        var AverageDrugLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "AverageDrug") // value to grab for event listener
            .classed("inactive", true)
            .text("Average Drug or Alcohol use");
        // Add y labels group and labels.
        var yLabelsGroup = chartGroup.append("g")
            .attr("transform", "rotate(-90)");
        var AverageBirthLabel = yLabelsGroup.append("text")
            .attr("x", 0 - (chartHeight / 2))
            .attr("y", 10 - margin.left)
            .attr("dy", "1em")
            .attr("value", "AverageBirth")
            .classed("active", true)
            .text("Average Birth");
        // X labels event listener.
        xLabelsGroup.selectAll("text")
            .on("click", function() {
                // Grab selected label.
                chosenXAxis = d3.select(this).attr("value");
                // Update xLinearScale.
                xLinearScale = xScale(demoData, chosenXAxis, chartWidth);
                // Render xAxis.
                xAxis = renderXAxes(xLinearScale, xAxis);
                // Switch active/inactive labels.
                if (chosenXAxis === "Population") {
                   PopulationLabel
                        .classed("active", true)
                        .classed("inactive", false);
                   AverageEducationLabel
                        .classed("active", false)
                        .classed("inactive", true);
                   AverageDrugLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else if (chosenXAxis === "AverageEducation") {
                  PopulationLabel
                        .classed("active", false)
                        .classed("inactive", true);
                  AverageEducationLabel
                        .classed("active", true)
                        .classed("inactive", false);
                  AverageDrugLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else {
                  PopulationLabel
                        .classed("active", false)
                        .classed("inactive", true);
                  AverageDrugLabel
                        .classed("active", true)
                        .classed("inactive", false);
                  AverageEducationLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                // Update circles with new x values.
                circle = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
                // Update tool tips with new info.
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circle, circleText);
                // Update circles text with new values.
                circleText = renderText(circleText, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
            });
        // Y Labels event listener.
        yLabelsGroup.selectAll("text")
            .on("click", function() {
                // Grab selected label.
                chosenYAxis = d3.select(this).attr("value");
                // Update yLinearScale.
                yLinearScale = yScale(demoData, chosenYAxis, chartHeight);
                // Update yAxis.
                yAxis = renderYAxes(yLinearScale, yAxis);
                // Changes classes to change bold text.
                if (chosenYAxis === "AverageBirth") {
                    AverageBirthLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
                // Update circles with new y values.
                circle = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
                // Update circles text with new values.
                circleText = renderText(circleText, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
                // Update tool tips with new info.
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circle, circleText);
            });
    }).catch(function(err) {
        console.log(err);
    });
}
makeResponsive();
// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);