/**
 *
 *
 * @param {*} d
 * @returns
 */
function type(d) {
  return {
    cause: d['Cause of death'],
    category: d['Category'],
    year: +d.Year,
    rate: +d.Rate,
    label: d['Category'] + "-" + d['Cause of death'],
    labelkey: d['Category'] + "-" + d['Cause of death'] + d.Year + d.Rate,
    increase: 0,
    datalabelkey: "datalabel-" + d.Year + d.Rate,
  };

}
var navigation = 1;
function filterData(data) {
  return data.filter(d => {
    return (
      d.cause != "All causes"

    );
  });
}
function mouseover() {

  const barData = d3.select(this).data()[0];
  d3.select(this)
    .attr('r', 8)
    .transition().duration(500)



  const bodyData = [
    ['Cause', barData.cause],
    ['Adjusted Rate of Death', barData.rate],
    ['Year', barData.year],

  ];


  const tip = d3.select('.tooltip');

  tip
    .style('left', `${d3.event.clientX + 15}px`)
    .style('top', `${d3.event.clientY}px`)
    .transition()
    .style('opacity', 0.98);

  tip.select('h3').html(`${barData.cause}, ${barData.rate}`);
  tip.select('h4').html(`${barData.year}, ${barData.category}`);


}

function mousemove() {
  d3.select('.tooltip')
    .style('left', `${d3.event.clientX + 15}px`)
    .style('top', `${d3.event.clientY}px`);
}

function mouseout() {
  d3.select(this)
    .attr('r', 5)
    .transition().duration(1000)



  d3.select('.tooltip')
    .transition()
    .style('opacity', 0);
}
var filterData = {};
var categoryFilter = {};
var originFilter = {}
var explore = {
  cause: "All causes",
  gender: false,
  race: false
}
/**
 * This function prepares the data for the line chart by using hte loaded data and currentscene
 *
 * @param {*} data
 * @param {*} scene 
 * @returns {object} linedata object with frmatted chartdata for scene
 */
function prepareLineChartData(data, scene) {
  var selectdata = d3.nest()
    .key(function (d) { return d.cause; })
    .entries(data);

  chartGroup.selectAll('.line-series')

  var focus = { "Alzheimer's disease": true };
  if (scene == "SCENE-1") {
    filterData = {}
    categoryFilter = {}
    filterData = { "Alzheimer's disease": true, "Diseases of heart": true, "Malignant neoplasms": true, "Unintentional injuries": true, "Chronic lower respiratory diseases": true };
    data = data.filter(function (d, i) {
      return d.category == "All" &&
        d.cause != "All causes"
        && filterData[d.cause] == true &&
        i > 5


    });
  }
  else {
    if (scene == "SCENE-2") {
      filterData = {}
      categoryFilter = {}
      filterData = { "Alzheimer's disease": true };

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
        originFilter = { "White": true, "Black or African American": true, "Asian or Pacific Islander": true, "Hispanic or Latino": true }

        data = data.filter(function (d) {

          return d.cause != "All causes" &&

            filterData[d.cause] == true &&
            originFilter[d.category] == true

        });
      }
      else {
        if (scene == "SCENE-4") {

          filterData = {}
          categoryFilter = {}

          if (explore.cause === "All causes") {
            explore.gender == false;
            explore.race == false;
          }
          if (explore.gender == false && explore.race == false) {
            originFilter = { "All": true }
          }
          if (explore.gender == true) {
            originFilter = { "Female": true, "Male": true }
          }
          if (explore.race == true) {
            originFilter = { "White": true, "Black or African American": true, "Asian or Pacific Islander": true, "Hispanic or Latino": true }
          }
          data = data.filter(function (d) {
            return d.cause == explore.cause
              && originFilter[d.category] == true






          });

        }
      }
    }
  }

  var nested = d3.nest()
    .key(function (d) { return d.label; })
    .entries(data);
  console.log('Local CSV in ready!:', nested);
  var allYears = d3.nest()
    .key(function (d) { return d.year; })
    .entries(data);
  yearcount = d3.extent(allYears);

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

  lineData = {
    focus: focus,
    filterData: filterData,
    categoryFilter: categoryFilter,
    originFilter: originFilter,
    scene: scene,
    selectdata: selectdata,
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

var story1Data = {
  title: "Death rate for Alzeimer\'s Disease is on the Rise in United States since 2013",
  spotlightbefore: "Heart disease & Malignant neoplasms are the leading causes of death among all population in the US, ",
  spotlight: "Alzheimer's disease",
  spotlightafter: " has reached Its 17-year high reaching an age-adjusted death rate of 31% in 2017, with a steady increase starting 2013.",
  nexttext: "View By Gender",
  nextdataname: "2",


}

var story2Data = {
  title: "Alzeimers death rates are plummeting in Female population in recent years",
  spotlightbefore: "Age-adjusted death rates per 100,000 population related ",
  spotlight: "Alzheimer's Disease",
  spotlightafter: " are plummeting among Women population with death rates up from 25.9% in 2013 to 34.8%  when compared to Men from 19.3% in 2013 to 24.9% in 2017 in the United States ",
  nexttext: "View By Race",
  nextdataname: "3",


}

var story3Data = {
  title: "Prevelance of Alzeimers Disease is more prevelant in White race population in United States",
  spotlightbefore: "In United States, ",
  spotlight: "Alzheimer's Disease",
  spotlightafter: " is more prevalent and highest among White & Black or African American population and Asian descendants are seeing the lowest with 15% Age-adjusted death rate per 100,000 population, all race groups are seeing a steady increase in death rates are starting 2013",
  nexttext: "Explore ",
  nextdataname: "4",



}
var story4Data = {
  title: "Explore the leading causes of death in United states by gender and race",
  spotlightbefore: "Use controls to select other causes of deaths in United States and view by gender or Race. Click restart to restart the ",
  spotlight: "Alzeimer's Disease ",
  spotlightafter: "story ",
  nexttext: "Restart",
  nextdataname: "1",



}
const annotations = {
  "scene-1":
  {
    text: ["Alzeimer's Disease death rate increasing since 2013-2017"],
    textCenter: {
      year: 2013,
      rate: 23.5
    },
    aimingPoints: [
      {
        year: 2013,
        rate: 23.5
      },
      {
        year: 2017,
        rate: 31
      }
    ]
  },
  "scene-2":
  {
    text: ["Alzeimer's Disease death rate in Women up by 8.9% from 2013"],
    textCenter: {
      year: 2008,
      rate: 13
    },
    aimingPoints: [
      {
        year: 2013,
        rate: 25.9
      },
      {
        year: 2017,
        rate: 34.8
      },

    ]
  },
  "scene-3":
  {
    text: ["Alzeimers Disease highest and prevelant in White race population"],
    textCenter: {
      year: 2008,
      rate: 2
    },
    aimingPoints: [
      {
        year: 2013,
        rate: 24.4
      },
      {
        year: 2017,
        rate: 32.3
      },

    ]
  },
}

function insertAnnotation(annotationName) {
  const rectName = "annotation-rect-" + annotationName;
  const textName = "annotation-text-" + annotationName;
  const lineSetName = "annotation-lines-" + annotationName;
  const lineClass = "annotation-line-" + annotationName;
  const tspanClass = "annotation-tspan-" + annotationName;

  const annotation = annotations[annotationName];

  d3.select(".line-chart-container").select('svg')
    .append("text")
    .attr("id", textName)
    .selectAll("tspan").data(annotation.text)
    .enter()
    .append("tspan")
    .attr("class", tspanClass)
    .attr("opacity", 0)
    .attr("text-anchor", "start")
    .attr("x", 10)

    .attr("y", function (d, i) { return (i * 25) })
    .text(function (d, i) { return annotation.text[i] });


  const annotationText = document.getElementById(textName);
  const SVGRect = annotationText.getBoundingClientRect();
  const rectDimensions = {
    height: (10 + SVGRect.height + 10),
    width: (10 + SVGRect.width + 10)
  };
  const textBlockDimensions = annotationText.getBoundingClientRect();


  d3.select("#" + textName).remove();

  const textBlockTopLeft = {
    x: (margin.left + (xScale(annotation.textCenter.year)) - textBlockDimensions.width / 2),
    y: (margin.top + height - yScale(annotation.textCenter.rate) + textBlockDimensions.height / 2)
  };

  const lineStartingPoint = {
    x: (textBlockTopLeft.x + (textBlockDimensions.width / 2)),
    y: (textBlockTopLeft.y + (textBlockDimensions.height / 2))
  };

  d3.select(".line-chart-container").select('svg')
    .append("g")
    .attr("id", lineSetName)
    .selectAll("line").data(annotation.aimingPoints)
    .enter()
    .append("line")
    .attr("class", lineClass)
    .attr("opacity", 0)
    .attr("style", "stroke:rgb(0,0,0);stroke-width:0.5px")
    .attr("x1", lineStartingPoint.x + 10)
    .attr("y1", lineStartingPoint.y + 10)
    .transition().duration(500)
    .attr("x2", function (d, i) {
      var x2 = xScale(d.year)

      return x2 + 60;
    })
    .attr("y2", function (d, i) {
      return yScale(d.rate) + 20
    });

  d3.select(".line-chart-container").select('svg')
    .append("rect")
    .attr("id", rectName)
    .attr("opacity", 0)
    .attr("x", textBlockTopLeft.x - 10)
    .attr("y", textBlockTopLeft.y - 20)
    .attr("height", rectDimensions.height)
    .attr("width", rectDimensions.width)
    .attr("fill", "lightgrey");


  d3.select(".line-chart-container").select('svg')
    .append("text")
    .attr("id", textName)
    .selectAll("tspan").data(annotation.text)
    .enter()
    .append("tspan")
    .attr("class", tspanClass)
    .attr("opacity", 0)
    .attr("text-anchor", "start")
    .attr("x", textBlockTopLeft.x)
    .attr("y", function (d, i) { return (textBlockTopLeft.y + i * 15) })
    .text(function (d, i) { return annotation.text[i] });

  d3.selectAll("." + lineClass)
    .transition()
    .delay(500)
    .duration(500)
    .attr("opacity", 1);

  d3.select("#" + rectName)
    .transition()
    .duration(500)
    .attr("opacity", 1);

  d3.selectAll("." + tspanClass)
    .transition()
    .duration(500)
    .attr("opacity", 1);
}
function removeAnnotation(annotationName) {
  const rectName = "annotation-rect-" + annotationName;
  const textName = "annotation-text-" + annotationName;
  const lineSetName = "annotation-lines-" + annotationName;
  const lineClass = "annotation-line-" + annotationName;
  const tspanClass = "annotation-tspan-" + annotationName;

  d3.selectAll("." + tspanClass)
    .transition()
    .duration(300)
    .attr("opacity", 0)
    .remove();
  d3.select("#" + rectName)
    .transition()
    .duration(300)
    .attr("opacity", 0)
    .remove();
  d3.selectAll("." + lineClass)
    .transition()
    .duration(300)
    .attr("opacity", 0)
    .remove();
  d3.select("#" + textName)
    .transition()
    .delay(300)
    .duration(0)
    .attr("opacity", 0)
    .remove();
  d3.select("#" + lineSetName)
    .transition()
    .delay(300)
    .duration(0)
    .remove();
}
function ready(lineChartData) {
  d3.select('#data-info')
    .style("visibility", "hidden");
  renderStory(story1Data);

  d3.select('#a-race')
    .attr('class', 'btn btn--primary');

  d3.select("#cause-select").property("selectedIndex", 0);
  var selector = d3.select("#cause-select")
    .selectAll(".cdcOptions")
    .data(lineChartData.selectdata)
    .join(
      enter => {
        enter
          .append("option")
          .text(function (d) { return d.key; })
          .attr("value", function (d) { return d.key; }) /
          d3.select("#cause-select").on("change", function (d) {

            var selectedOption = d3.select(this).property("value")

            updateselection(selectedOption)
          },
            update => {

            },
            exit => {
              exit.remove()
            }

          );


      })
  yAxisG.append('text')
    .attr('y', -40)
    .attr('x', -innerHeight / 2)
    .attr('transform', `rotate(-90)`)
    .attr('class', 'yaxis-label-text')
    .attr('fill', 'gray')
    .attr('text-anchor', 'middle')
    .text("Age-Adjusted Death Rate per 100,000 population");

  xAxisG.append('text')
    .attr('y', 40)
    .attr('x', innerWidth / 2)
    .attr('class', 'xaxis-label-text')
    .attr('fill', 'gray')
    .text("Year");
  update(lineChartData);


  d3.selectAll('button').on('click', navigateTo)
    .attr('class', 'btn btn-outline');
  function renderStory(storydata) {
    d3.select(".info").selectAll('.section-title').remove();
    d3.select(".info").selectAll('p').remove();
    d3.select(".info").selectAll('button').remove();
    var story = d3.select(".info")
      .append("h2")
      .attr('class', 'section-title')
      .text(storydata.title)
    var txt = d3.select(".info")
      .append("p")
      .text(storydata.spotlightbefore);
    txt.append('span')
      .attr('class', 'spotlight-text')
      .text(storydata.spotlight);
    txt.append().text(storydata.spotlightafter)
    var txt = d3.select(".info")
      .append("button")
      .on('click', navigateTo)
      .attr('class', 'btn btn-outline')
      .text(storydata.nexttext)
      .attr("data-name", storydata.nextdataname)


  }
  function navigateTo() {
    d3.selectAll('button').transition().duration(500)
      .attr('class', 'btn btn-outline')
    d3.select(this).transition().attr('class', 'btn btn--primary');
    chartGroup.selectAll('.series-label')
      .transition().duration(100)
      .remove();
    removeAnnotation("scene-1");
    metric = this.dataset.name;
    if (parseInt(metric) === 1) {

      d3.select("#cause-select")
        .attr("selectedIndex", 0);
      d3.select('#data-info')
        .style("visibility", "hidden");
      renderStory(story1Data);

    }
    if (parseInt(metric) === 2) {

      d3.select('#data-info')
        .style("visibility", "hidden");
      renderStory(story2Data);

    }
    if (parseInt(metric) === 3) {
      d3.select('#data-info')
        .style("visibility", "hidden");
      renderStory(story3Data);
    }
    if (parseInt(metric) === 4) {
      d3.select('#e-all').transition().attr('class', 'btn btn--primary');
      var sel = document.getElementById('cause-select');
      sel.selectedIndex = 0;

      updateselection(sel.options[sel.selectedIndex].value);
      d3.select('#data-info')
        .style("visibility", "visible");
      renderStory(story4Data);
    }
    navigation = metric;
    if (parseInt(metric) === 4) {
      explore.race = false;
      explore.gender = false;
    }
    if (parseInt(metric) === 5) {
      explore.race = false;
      explore.gender = true;
    }
    if (parseInt(metric) === 6) {
      explore.gender = false;
      explore.race = true;
    }
    if (parseInt(metric) === 7) {
      explore.gender = false;
      explore.race = false;
    }
    if (parseInt(metric) > 4) {
      metric = 4
      navigation = metric;
    }
    sceneData = prepareLineChartData(dataLoaded, "SCENE-" + metric);
    update(sceneData);


  }

  function updateselection(selectedCause) {

    explore.cause = selectedCause;
    chartGroup.selectAll('.series-label')
      .transition().duration(100)
      .remove();

    sceneData = prepareLineChartData(dataLoaded, "SCENE-4");

    update(sceneData);

  }

  function update(scenedata) {

    var xDomain = d3.extent(scenedata.dates)
    var yDomain = d3.extent(scenedata.yMin, scenedata.yMax)

    xScale.domain([d3.min(scenedata.dates), d3.max(scenedata.dates)])
      .rangeRound([0, innerWidth])
    yScale.domain([scenedata.yMin, scenedata.yMax])
      .range([innerHeight, 0])
      .nice();

    if (scenedata.scene === "SCENE-1") {
      removeAnnotation("scene-1");
      insertAnnotation("scene-1");
    }
    if (scenedata.scene === "SCENE-2") {
      removeAnnotation("scene-1");
      insertAnnotation("scene-2");
    }
    if (scenedata.scene === "SCENE-3") {
      removeAnnotation("scene-1");
      removeAnnotation("scene-2");
      insertAnnotation("scene-3");
    }
    if (scenedata.scene === "SCENE-4") {

      removeAnnotation("scene-1");
      removeAnnotation("scene-2");
      removeAnnotation("scene-3");
    }


    const nestedmap = d3.nest()
      .key(colorValue)
      .entries(scenedata.series)

    colorScale.domain(nestedmap.map(d => d.key));
    var res = scenedata.series.map(function (d) { return d.key })
    var color = d3.scaleOrdinal()
      .domain(res)
      .range(d3.schemeDark2)

    var path = chartGroup.selectAll(".path")
      .data(scenedata.series, d => navigation + d.key)
      .join(
        enter => {
          enter
            .append("path")
          .attr('class', 'path')
          .style("fill", "none")
          .style("mix-blend-mode", "multiply")
          .style("stroke", function (d) {
            return color(d.key)
          })
          .attr('d', d => lineGenerator(d.values))
          .attr("stroke-width", 1)
          .transition()
          .duration(1500)
          .ease(d3.easeCubic)
          .attrTween("stroke-dasharray", function () {
            const length = this.getTotalLength();
            return d3.interpolate(`0,${length}`, `${length},${length}`);
          })

        },

        update => {
          update

            .style("fill", "none")
          .attr("stroke-width", 1)
          .style("mix-blend-mode", "multiply")
          .attr("fill", "none")
          .style("stroke", function (d) { return color(d.key) })
          .attr('d', d => lineGenerator(d.values))
          .transition()
          .duration(1500)
          .ease(d3.easeCubic)
          .attrTween("stroke-dasharray", function () {
            const length = this.getTotalLength();
            return d3.interpolate(`0,${length}`, `${length},${length}`);
          })

        },
        exit => {
          exit.transition().duration(100).remove();
        }

      )



    var circles = chartGroup.selectAll(".circle")
      .data(scenedata.data, d => d.label)
      .join(
        enter => {
          enter
            .append("circle")
          .attr('class', 'circle')
          .attr("cx", function (d) { return xScale(+d.year); })
          .attr("cy", function (d) { return yScale(+d.rate); })
          .transition().duration(1700)
          .attr("r", 4)
          .style("fill", function (d) { return color(d.label) })
          .filter(function (d) { return d.cause === "Alzheimer's disease" && +d.year >= 2013 })
          .attr("r", 0)
          .transition().duration(750)

          .style("fill", "blue")
          .attr("r", 5)


        },

        update => {
          update
            .transition().duration(750)
          .delay(function (i) { return (i * 10) })
          .attr("cx", function (d) { return xScale(+d.year); })
          .attr("cy", function (d) { return yScale(+d.rate); })
          .attr('class', 'circle')
          .transition().duration(1900)
          .attr("r", 4)
          .style("fill", "gray")
          .filter(function (d) { return d.cause === "Alzheimer's disease" && +d.year >= 2013 })
          .attr("r", 0)

          .transition().duration(750)
          .style("fill", "blue")
          .attr("r", 5)



        },
        exit => {
          exit.remove();
        }

      )



    d3.selectAll(".datalabel-text").remove();
    var datalabels = chartGroup.append("g").selectAll(".datalabel-text")
      .data(scenedata.data, d => d.rate)
      .join(
        enter => {
          enter
            .filter(function (d) { return d.cause === "Alzheimer's disease" && +d.year >= 2013 })
            .append("text")
            .attr("opacity", 0)
            .attr('id', function (d, i) { return d.datalabelkey })
            .attr('class', 'datalabel-text')

            .attr("x", function (d, i) {

              return xScale(+d.year) + 5
            })
            .attr("y", function (d, i) {
              return yScale(+d.rate) + 20
            })
            .text("")

            .transition().duration(1900)
            .attr("opacity", 1)

            .text(function (d, i) { return "↑ " + d.rate })
        },
        update => {
          update
            .filter(function (d) { return d.cause === "Alzheimer's disease" && +d.year >= 2013 })

            .attr('class', 'datalabel-text')
            .attr("opacity", 0)
            .attr("x", function (d, i) {

              return xScale(+d.year)
            })
            .attr("y", function (d, i) {
              return yScale(+d.rate) + 20
            })

            .text("")
            .transition().duration(1000)
            .attr("opacity", 1)

            .text(function (d, i) { return "↑ " + d.rate })
            ;
        },
        exit => {
          exit.
            remove();
        }

      )





    chartGroup.append('g')
      .attr('class', 'series-labels')
      .selectAll('.series-label')
      .data(scenedata.series, d => d.labelkey)
      .join(
        enter => {
          enter
            .append('text')

          .attr('class', 'series-label')
          .attr('x', d => xScale(d.values[d.values.length - 1].year) + 10)
          .attr('y', d => yScale(d.values[d.values.length - 1].rate))

          .text(function (d, i) { return d.values[i].label })
          .style('dominant-baseline', 'central')
          .style('font-size', '0.7em')
          .transition().duration(1000)
          .style('fill', function (d) {
            return color(d.key)
          })
          .filter(function (d, i) { return d.values[i].cause == "Alzheimer's disease" && +d.values[i].year >= 2013 })
          .attr('class', 'series-label')
          .style('font-size', '1em')

          .attr('x', d => xScale(d.values[d.values.length - 1].year) + 10)
          .attr('y', d => yScale(d.values[d.values.length - 1].rate))


        },

        update => {
          update
            .transition().duration(1200)

          .attr('x', d => xScale(d.values[d.values.length - 1].year) + 5)
          .attr('y', d => yScale(d.values[d.values.length - 1].rate))
          .text(function (d, i) { return d.values[i].label })
          .attr('class', 'series-label')
          .style('font-size', '0.7em')

          .style('dominant-baseline', 'central')
          .transition().duration(1000)
          .style('fill', function (d) {
            return color(d.key)
          });

        },
        exit => {
          exit.remove();
        }

      )




    if (scenedata.scene === "SCENE-4") {

      d3.selectAll('.circle')
        .style('cursor', 'pointer')
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout);

    }
    yAxisG.transition().duration(1000).call(yAxis)
    xAxisG.call(xAxis)
      .attr('transform', `translate(0,${innerHeight})`)



  }



}


const margin = { top: 20, right: 120, bottom: 30, left: 60 };
const width = 925 - margin.right - margin.left;
const height = 575 - margin.top - margin.bottom;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.bottom

const xScale = d3.scaleLinear()
const yScale = d3.scaleLinear()

const svg = d3.select('.line-chart-container')
  .append('svg')
  .attr('width', width + margin.right + margin.left)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const xValue = d => +d.year;

const yValue = d => +d.rate;

const colorValue = d => d.label;
const colorScale = d3.scaleOrdinal(colorValue);
const g = svg.append('g')
const chartGroup = svg.append('g').attr('class', 'line-chart');
const lineGenerator = d3.line()
  .x(d => xScale(xValue(d)))
  .y(d => yScale(yValue(d)))
  .curve(d3.curveMonotoneX);


const yAxisG = svg.append('g')

const xAxisG = svg.append('g')

const parseDate = string => d3.utcParse('%Y-%m-%d')(string);
const parseNA = string => (string === 'NA' ? undefined : string);

var yearcount;
const yAxis = d3.axisLeft(yScale)
const xAxis = d3.axisBottom(xScale).ticks(18).tickSizeOuter(0).tickFormat(d3.format("d"));

d3.csv('data/cdc-table5.csv', type).then(res => {
  dataLoaded = res;
  const lineChartData = prepareLineChartData(dataLoaded, "SCENE-1");
  ready(lineChartData)
});