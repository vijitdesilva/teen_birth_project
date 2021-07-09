
(function (d3) {
    'use strict';
  
    const colorLegend = (selection, props) => {
      const {
        colorScale,
        circleRadius,
        spacing,
        textOffset
      } = props;
  
      const groups = selection.selectAll('g')
        .data(colorScale.domain());
      const groupsEnter = groups
        .enter().append('g')
          .attr('class', 'tick');
      groupsEnter
        .merge(groups)
          .attr('transform', (d, i) =>
            `translate(0, ${i * spacing})`
          );
      groups.exit().remove();
  
      groupsEnter.append('circle')
        .merge(groups.select('circle'))
          .attr('r', circleRadius)
          .attr('fill', colorScale);
  
      groupsEnter.append('text')
        .merge(groups.select('text'))
          .text(d => d)
          .attr('dy', '0.32em')
          .attr('x', textOffset);
    };
  
    const svg = d3.select('svg');
  
    const width = +svg.attr('width');
    const height = +svg.attr('height');
  
    const render = data => {
      const title = 'Teen Birth Rate from 2005 to 2019';
      
      const xValue = d => d.YEAR;
      const xAxisLabel = 'Year';
      
      const yValue = d => d.RATE;
      const yAxisLabel = 'Teen Birth Rate';
      
      const colorValue = d => d.STATE;
      
      const margin = { top: 60, right: 150, bottom: 300, left: 150 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      
      const xScale = d3.scaleTime()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice();
      
      const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yValue))
        .range([innerHeight, 0])
        .nice();
      
      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
      
      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
      
      const xAxis = d3.axisBottom(xScale)
        .tickSize(-innerHeight)
        .tickPadding(15);
      
      const yAxis = d3.axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickPadding(10);
      
      const yAxisG = g.append('g').call(yAxis);
      yAxisG.selectAll('.domain').remove();
      
      yAxisG.append('text')
          .attr('class', 'axis-label')
          .attr('y', -60)
          .attr('x', -innerHeight / 2)
          .attr('fill', 'black')
          .attr('transform', `rotate(-90)`)
          .attr('text-anchor', 'middle')
          .text(yAxisLabel);
      
      const xAxisG = g.append('g').call(xAxis)
        .attr('transform', `translate(0,${innerHeight})`);
      
      xAxisG.select('.domain').remove();
      
      xAxisG.append('text')
          .attr('class', 'axis-label')
          .attr('y', 80)
          .attr('x', innerWidth / 2)
          .attr('fill', 'black')
          .text(xAxisLabel);
      
      const lineGenerator = d3.line()
        .x(d => xScale(xValue(d)))
        .y(d => yScale(yValue(d)))
        .curve(d3.curveBasis);
      
      const lastYValue = d =>
        yValue(d.values[d.values.length - 1]);
      
      const nested = d3.nest()
        .key(colorValue)
        .entries(data)
        .sort((a, b) =>
          d3.descending(lastYValue(a), lastYValue(b))
        );
      
      console.log(nested);
      
      colorScale.domain(nested.map(d => d.key));
      
      g.selectAll('.line-path').data(nested)
        .enter().append('path')
          .attr('class', 'line-path')
          .attr('d', d => lineGenerator(d.values))
          .attr('stroke', d => colorScale(d.key));
      
      g.append('text')
          .attr('class', 'title')
          .attr('y', -10)
          .text(title);
      
      svg.append('g')
        .attr('transform', `translate(790,121)`)
        .call(colorLegend, {
          colorScale,
          circleRadius: 5,
          spacing: 20,
          textOffset: 8
        });
    };
  
    d3.csv('Teen_Birth_rate.csv')
      .then(data => {
        data.forEach(d => {
          d.RATE = +d.RATE;
          d.YEAR = +d.YEAR;
        });
        render(data);
      });
  
  }(d3));
  