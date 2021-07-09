(function (d3) {
  'use strict';

  const titleText = 'Teen Births in United States';
  const xAxisLabelText = 'Teen Births per year ';

  const svg = d3.select('svg');

  const width = +svg.attr('width');
  const height = +svg.attr('height');

  const render = data => {
    const xValue = d => d.AverageBirth;
    const yValue = d => d.Location;
    const margin = { top: 50, right: 40, bottom: 77, left: 180 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, xValue)])
      .range([0, innerWidth]);
    
    const yScale = d3.scaleBand()
      .domain(data.map(yValue))
      .range([0, innerHeight])
      .padding(0.1);
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const xAxisTickFormat = number =>
      d3.format('.3s')(number)
        .replace('G', 'B');
    
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(xAxisTickFormat)
      .tickSize(-innerHeight);
    
    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('.domain, .tick line')
        .remove();
    
    const xAxisG = g.append('g').call(xAxis)
      .attr('transform', `translate(0,${innerHeight})`);
    
    xAxisG.select('.domain').remove();
    
    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 50)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .text(xAxisLabelText);
    
    g.selectAll('rect').data(data)
      .enter().append('rect')
        .attr('y', d => yScale(yValue(d)))
        .attr('width', d => xScale(xValue(d)))
        .attr("fill", "darkblue")
        .attr('height', yScale.bandwidth());
    
    g.append('text')
        .attr('class', 'title')
        .attr('y', -15)
        .text(titleText);
  };

  d3.csv('Average_Birth_Education_Drug_byState.csv').then(data => {
    data.forEach(d => {
      d.AverageBirth = +d.AverageBirth;
    });
    render(data);
  });

}(d3));





// // Define SVG area dimensions
// var svgWidth = 960;
// var svgHeight = 660;

// // Define the chart's margins as an object
// var chartMargin = {
//   top: 30,
//   right: 30,
//   bottom: 30,
//   left: 30
// };

// // Define dimensions of the chart area
// var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
// var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// // Select body, append SVG area to it, and set the dimensions
// var svg = d3.select("body")
//   .append("svg")
//   .attr("height", svgHeight)
//   .attr("width", svgWidth);

// // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
// var chartGroup = svg.append("g")
//   .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// // Load data from hours-of-tv-watched.csv
// d3.csv("Average_Birth_Education_Drug_byState.csv").then(function(tvData) {

//   console.log(tvData);

//   // Cast the hours value to a number for each piece of tvData
//   tvData.forEach(function(d) {
//     d.Location;
//     d.AverageBirth = +d.AverageBirth;
//     d.AverageEducation= +d.AverageEducation;
//     d.AverageDrug = +d.AverageDrug;
//     d.Population = +d.Population;
//   });

//   // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
//   var xBandScale = d3.scaleBand()
//     .domain(tvData.map(d => d.Location))
//     .range([0, chartWidth])
//     .padding(0.1);

// //            
//   // Create a linear scale for the vertical axis.
//   var yLinearScale = d3.scaleLinear()
//     .domain([0, d3.max(tvData, d => d.AverageBirth)])
//     .range([chartHeight, 0]);

//   // Create two new functions passing our scales in as arguments
//   // These will be used to create the chart's axes
//   var bottomAxis = d3.axisBottom(xBandScale);
//   var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

//   // Append two SVG group elements to the chartGroup area,
//   // and create the bottom and left axes inside of them
//   chartGroup.append("g")
//     .call(leftAxis);

//   chartGroup.append("g")
//     .attr("transform", `translate(0, ${chartHeight})`)
//     .call(bottomAxis);

//   // Create one SVG rectangle per piece of tvData
//   // Use the linear and band scales to position each rectangle within the chart
//   chartGroup.selectAll (".bar")
//     .data(tvData)
//     .enter()
//     .append("rect")
//     .attr("class", "bar")
//     .attr("x", d => xBandScale(d.Location))
//     .attr("y", d => yLinearScale(d.AverageBirth))
//     .attr("width", xBandScale.bandwidth())
//     .attr("height", d => chartHeight - yLinearScale(d.AverageBirth));

// }).catch(function(error) {
//   console.log(error);
// });