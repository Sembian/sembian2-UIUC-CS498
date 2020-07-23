// Type conversion.
const parseDate = string => d3.utcParse('%Y-%m-%d')(string);
const parseNA = string => (string === 'NA' ? undefined : string);
var dataLoaded = {};
function type(d) {
  return {
    cause: d['Cause of death'],
    category: d['Category'],
    year: +d.Year,
    rate: +d.Rate,
    label:d['Category'] +"-"+d['Cause of death'],
    labelkey: d['Category'] +"-"+d['Cause of death']+d.Year+d.Rate
  };
}
var navigation = 1;

// Data utilities,
function filterData(data) {
  return data.filter(d => {
    return (
      d.cause != "All causes" 

    );
  });
}
// Tooltip handler.
function mouseover() {
  // Get data.
  const barData = d3.select(this).data()[0];
  //debugger;
  const bodyData = [
    ['Cause', barData.cause],
    ['Adjusted Rate of Death', barData.rate],
    ['Year', barData.year],

  ];

  // Build tip.
  const tip = d3.select('.tooltip');

  tip
    .style('left', `${d3.event.clientX + 15}px`)
    .style('top', `${d3.event.clientY}px`)
    .transition()
    .style('opacity', 0.98);

  tip.select('h3').html(`YEAR: ${barData.year}, ${barData.category}`);
  tip.select('h4').html(`${barData.cause}, ${barData.rate}`);

  d3.select('.tip-body')
    .selectAll('p')
    .data(bodyData)
    .join('p')
    .attr('class', 'tip-info')
    .html(d => `${d[0]}: ${d[1]}`);
}

function mousemove() {
  d3.select('.tooltip')
    .style('left', `${d3.event.clientX + 15}px`)
    .style('top', `${d3.event.clientY}px`);
}

function mouseout() {
  d3.select('.tooltip')
    .transition()
    .style('opacity', 0);
}
function prepareLineChartData(data, scene) {
  // Group by year and extract revenue and budget.
  // Group by year and extract revenue and budget.
  
  chartGroup.selectAll('.line-series')
  var filterData = {};
  var categoryFilter = {};
  var originFilter = {}
  var focus = {"Alzheimer's disease": true};
  if (scene == "SCENE-1") {
    filterData = {}
    categoryFilter ={}
    filterData = { "Alzheimer's disease": true, "Diseases of heart": true, "Malignant neoplasms": true, "Unintentional injuries": true, "Chronic lower respiratory diseases": true };
    data = data.filter(function (d,i) {
      return d.category == "All" &&
        d.cause != "All causes"
        && filterData[d.cause] == true && 
        i > 5
      
        
    });
  }
  else {
    if (scene == "SCENE-2") {
      filterData = {}
      categoryFilter ={}
      filterData = {"Alzheimer's disease": true};

      categoryFilter = { "Female": true, "Male": true }

      data = data.filter(function (d) {

        return d.cause != "All causes" &&

          filterData[d.cause] == true &&
          categoryFilter[d.category] == true 
        
      });
    }
    else {
      if (scene == "SCENE-3") {
        filterData = {}
        originFilter = {}
        filterData = { "Alzheimer's disease": true };
        originFilter = {"White":true, "Black or African American":true,"Asian or Pacific Islander":true,"Hispanic or Latino":true}
  
        data = data.filter(function (d) {
  
          return d.cause != "All causes" &&
  
            filterData[d.cause] == true &&
            originFilter[d.category] == true
          
        });
      }
      else {
        if (scene == "SCENE-4") {
          filterData = {}
          categoryFilter ={}
          filterData = { "Alzheimer's disease": true, "Diseases of heart": true, "Malignant neoplasms": true, "Unintentional injuries": true, "Chronic lower respiratory diseases": true };
          data = data.filter(function (d) {
            return d.category == "All" &&
              d.cause != "All causes"
              && filterData[d.cause] == true
            
            
           


            
          });
        }
      }
    }
  }
  
debugger;
  var nested = d3.nest()
    .key(function (d) { return d.label; })
    .entries(data);
  console.log('Local CSV in ready!:', nested);
  var allYears = d3.nest()
    .key(function (d) { return d.year; })
    .entries(data);
  console.log('Local CSV in ready!:', allYears);
  var allRates = d3.nest()
    .key(function (d) { return d.rate; })
    .entries(data);
  console.log('Local CSV in ready!:', allRates);

  const dates = allYears.map(d => +d.key)
  const xMax = d3.max(dates);
  const xMin = d3.min(dates);
  const rates = allRates.map(d => +d.key)
  const yMax = d3.max(rates);
  const yMin = d3.min(rates);

  var lineData = {}
  // Produce final data object.
   lineData = {
    focus:focus,
    filterData : filterData,
    categoryFilter: categoryFilter,
    originFilter : originFilter,
     scene:scene,
    data: data,
    series: nested,
    dates: dates,
    yMax: yMax,
    xMax: xMax,
    xMin: xMin,
    yMin: yMin
  };

  return lineData;



}


function ready(lineChartData) {

  // Draw base.





  

 // Listen to click events.
 d3.selectAll('button').on('click', navigateTo);
 yAxisG.append('text')
 .attr('y', -40)
 .attr('x', -innerHeight / 2)
 .attr('fill', 'black')
 .attr('transform', `rotate(-90)`)
 .attr('text-anchor', 'middle')
 .text("Age-Adjusted Death Rate per 100,000 population");
 
 



xAxisG.append('text')

 .attr('y', 40)
 .attr('x', innerWidth / 2)
 .attr('fill', 'black')
 .text("Year");
  update(lineChartData);

  /*g.append('text')
      .attr('class', 'title')
      .attr('y', -10)
      .text("Rate");*/


  

    function navigateTo() {
      chartGroup.selectAll('.series-label')
          .transition().duration(100)
          .remove();
      metric = this.dataset.name;
      navigation = metric;
      sceneData = prepareLineChartData(dataLoaded, "SCENE-" + metric );
      update(sceneData);
    
    
    }
  function update(scenedata) {

    xScale.domain([d3.min(scenedata.dates), d3.max(scenedata.dates)])
    .rangeRound([0, innerWidth])


  yScale.domain([scenedata.yMin, scenedata.yMax])
    .range([innerHeight, 0])
    .nice();
      // Update Axes.
      
  
  
  // Line generator.
    const nestedmap = d3.nest()
      .key(colorValue)
      .entries(scenedata.series)
    
    colorScale.domain(nestedmap.map(d => d.key));
    var res = scenedata.series.map(function (d) { return d.key }) // list of group names
    var color = d3.scaleOrdinal()
      .domain(res)
      .range(d3.schemeDark2)
   
    var path = chartGroup.selectAll(".path")
      .data(scenedata.series, d=>navigation+d.key)
      .join(
        enter => { enter 
          .append("path")
          .attr('class','path')
          .style("fill", "none")
          .style("mix-blend-mode", "multiply")
          .style("stroke", function (d) { 
            return color(d.key) })
          .attr('d', d => lineGenerator(d.values))
          .attr("stroke-width", 1)
          
          
        },

        update => { update
          .transition().duration(750)
          .delay((d, i) => i * 20)
          .style("fill", "none")
          .attr("stroke-width", 1)
          .attr("fill", "none")
          .style("stroke", function (d) { return color(d.key) })
          .attr('d', d => lineGenerator(d.values))
          
          
        },
        exit => { exit.remove();
        }

      )
      

    chartGroup.selectAll(".circle")
      .data(scenedata.data, d=>d.labelkey)
      .join(
        enter => { enter 
          .append("circle")
          .attr('class', 'circle')
          .attr("cx", function (d) { return xScale(+d.year); })
          .attr("cy", function (d) { return yScale(+d.rate); })
          .attr("r", 3)
          .style("fill", "gray") 
          .filter(function(d) { return d.cause === "Alzheimer's disease" && +d.year >= 2013})  // <== This line
          .attr("r", 0)  
          .transition().duration(1000)
          .style("fill", "red")   
          .attr("r", 5)                                        // <== Add these
          // Tooltip interaction.

          
        },

        update => { update
          .transition().duration(750)
          .delay(function(i){return(i*10)})
          .attr("cx", function (d) { return xScale(+d.year); })
          .attr("cy", function (d) { return yScale(+d.rate); })
          .attr('class', 'circle')
          .attr("r", 3)
          .style("fill", "gray") 
          .filter(function(d) { return d.cause === "Alzheimer's disease" && +d.year >= 2013})  // <== This line
          .attr("r", 0)  
          .transition().duration(1000)
          .style("fill", "red")   
          .attr("r", 5)                   
        },
        exit => { exit.remove();
        }

      )                               // <== Add these


      ;
      
          

          chartGroup.append('g')
          .attr('class', 'series-labels')
          .selectAll('.series-label')
          .data(scenedata.series, d=>d.labelkey)
          .join(
            enter => { enter 
              .append('text')
              .attr('class','series-label')
              .attr('x', d => xScale(d.values[d.values.length - 1].year) + 5)
              .attr('y', d => yScale(d.values[d.values.length - 1].rate))

              .text(function (d,i) { return d.values[i].label})
              .style('dominant-baseline', 'central')
              .style('font-size', '0.7em')
              .style('fill', d => d.color)
              .filter(function(d,i) { return d.values[i].cause == "Alzheimer's disease" && +d.values[i].year >= 2013})  // <== This line
              .attr('class','series-label')
              .style('font-size', '0.9em')
              
              
            },

            update => { update
              .transition().duration(1000)
              
              .attr('x', d => xScale(d.values[d.values.length - 1].year) + 5)
              .attr('y', d => yScale(d.values[d.values.length - 1].rate))
              .text(function (d,i) { return d.values[i].label})
              .attr('class','series-label')
              .style('font-size', '0.7em')
        
              .style('dominant-baseline', 'central')
              .style('fill', d => d.color);

            },
            exit => { exit.remove();
            }

          )   
      
       
    yAxisG.transition().duration(1000).call(yAxis)
    xAxisG.call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`)
     if(scenedata.scene === "SCENE-4") {
      /*chartGroup.selectAll('.series-label')
      .transition().duration(100)
      .remove();*/
      d3.selectAll('.circle')
      .style('cursor', 'pointer')
      .on('mouseover', mouseover)
      .on('mousemove', mousemove)
      .on('mouseout', mouseout);

     }      
      // Tooltip interaction.

      
  }
  

   
}

// Dimensions.
const margin = { top: 120, right: 90, bottom: 30, left: 80 };
const width = 1000 - margin.right - margin.left;
const height = 600 - margin.top - margin.bottom;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.bottom 
// Scale data.
const xScale = d3.scaleLinear()
const yScale = d3.scaleLinear()

const svg = d3.select('.line-chart-container')
  .append('svg')
  .attr('width', width + margin.right + margin.left)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Draw header.
const header = svg
  .append('g')
  .attr('class', 'line-chart-header')
  .attr('transform', `translate(0,${-margin.top * 0.6})`)
  .append('text');

header.append('tspan').text('Death rate for Alzeimer\'s Disease is on the Rise in United States');

header
  .append('tspan')
  .attr('x', 0)
  .attr('dy', '1.5em')
  .style('font-size', '0.8em')
  .style('fill', '#555')
  .text('Age-adjusted death rates for selected causes of death, by sex, race, and Hispanic origin: United States, 2000–2017');

header
  .append('tspan')
  .attr('x', 0)
  .attr('dy', '1.5em')
  .style('font-size', '0.7em')
  .style('fill', '#555')
  .text('Data Source Centers for Disease Control and Prevention - National Center for Health Statistics - Table 005');

const xValue = d => +d.year;

const yValue = d => +d.rate;

const colorValue = d => d.label;
const colorScale = d3.scaleOrdinal(colorValue);
const g = svg.append('g')
const chartGroup = svg.append('g').attr('class', 'line-chart');
const lineGenerator = d3.line()
  .x(d => xScale(xValue(d)))
  .y(d => yScale(yValue(d)))
  .curve(d3.curveLinear);


const yAxisG = svg.append('g')
// Main function.
const xAxisG = svg.append('g')
const yAxis = d3.axisLeft(yScale)
const xAxis = d3.axisBottom(xScale).ticks(18).tickSizeOuter(0).tickFormat(d3.format("d"));
// Load data.
d3.csv('data/cdc-table5.csv', type).then(res => {
  dataLoaded = res;
  // Data prep .
  const lineChartData = prepareLineChartData(dataLoaded, "SCENE-1");
  ready(lineChartData)
});