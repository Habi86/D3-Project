import * as d3 from 'd3';
import * as _ from 'underscore';
//import Barchart from './barchart';

// variable to store date
var surveyResults;

d3.csv('/data/survey_results_public.csv', (error, csv) => {
    if (error) {
        console.error(error);
    }
    else {
        surveyResults = csv.splice(0, 10);
    }
    updateChart(surveyResults);
});

const margin = {
    top: 40,
    bottom: 10,
    left: 120,
    right: 20
};
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// Creates sources <svg> element
const svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

// Group used to enforce margin
const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

// Scales setup
const xscale = d3.scaleLinear().range([0, width]);
const yscale = d3.scaleBand().rangeRound([0, height]).paddingInner(0.5).paddingOuter(0.2);

// Axis setup
const xaxis = d3.axisTop().scale(xscale);
const gXaxis = g.append('g').attr('class', 'x axis');
const yaxis = d3.axisLeft().scale(yscale);
const gYaxis = g.append('g').attr('class', 'y axis');

// update the chart
function updateChart(surveyResults) {

    // group devs by country
    var devsPerCountry = d3.nest()
        .key(function(d) {
            return d.Country;
        })
        .entries(surveyResults);
    console.log(devsPerCountry);
   
    //update the scales
    xscale.domain([0, surveyResults.length]); // to amount of devs (length of survey arr)
    yscale.domain(surveyResults.map((d) => d.Country));
    
    //render the axis
    gXaxis.call(xaxis);
    gYaxis.call(yaxis);

    // Render the chart with new data
    const rect = g.selectAll('rect').data(devsPerCountry, (d) => d);

    // ENTER
    // new elements
    const rectEnter = rect.enter()
        .append('rect')
        .attr('x', 0);
    rectEnter.append('title');
    
    // ENTER + UPDATE
    // both old and new elements
    rect.merge(rectEnter)
        .attr('height', yscale.bandwidth())
        .attr('width', (d) => xscale(d.values.length)) // amount of devs per country 
        .attr('y', (d) => yscale(d.key));

    rect.merge(rectEnter).select('title').text((d) => d.values.length);
    
    // EXIT
    // elements that aren't associated with data
    rect.exit().remove();

    // filter possibility
    // d3.select('#filter-highest').on('change', function() {
    //     const checked = d3.select(this).property('checked');
    //     if (checked === true) {
    //         const filteredData = devsPerCountry.filter((d) => d.values.length === 3);

    //         updateChart(filteredData);  // Update the chart with the filtered data
    //     }
    //     else {
    //         updateChart(devsPerCountry);  // Update the chart with all the data we have
    //     }
    // });
}

