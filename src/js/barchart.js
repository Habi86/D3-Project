import * as d3 from 'd3';
//import * as _ from 'underscore';
var surveyResults;
let devsPerCountry;
let clicked = false;


function barChart() {

    d3.csv('/data/survey_results_public.csv', (error, csv) => {
        if (error) {
            console.error(error);
        }
        else {
            surveyResults = csv;
            // group devs by country
            devsPerCountry = d3.nest()
                .key(function(d) {
                    return d.Country;
                })
                .entries(surveyResults);
            // filter only data over  a certain amount of devs 
            devsPerCountry = devsPerCountry.filter(greaterThanEdgeValue);
            console.log(devsPerCountry);
        }
        updateChart(devsPerCountry);
    });

    const margin = {
        top: 40,
        bottom: 40,
        left: 200,
        right: 20
    };

    const width = 800 - margin.left - margin.right;
    const height = 1500 - margin.top - margin.bottom;

    // Creates sources <svg> element
    const svg = d3.select('body').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    // Group used to enforce margin
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // setup for the scales
    const xscale = d3.scaleLinear().range([0, width]);
    const yscale = d3.scaleBand().rangeRound([0, height]).paddingInner(0.5).paddingOuter(0.2);

    // setup for the axis
    const xaxis = d3.axisTop().scale(xscale);
    const gXaxis = g.append('g').attr('class', 'x axis');
    const yaxis = d3.axisLeft().scale(yscale);
    const gYaxis = g.append('g').attr('class', 'y axis');

    // add label for x-axis
    svg.append('text')
        .attr('x', 400)
        .attr('y', 10)
        .attr('class', 'x-axis')
        .text('Amount of developers');     

    // add label for y-axis
    svg.append('text')
        .attr('x', -500)
        .attr('y', 60)
        .attr('transform', 'rotate(-90)')
        .attr('class', 'y-axis') 
        .text('Countries');     

    // update the chart
    function updateChart(devsPerCountry) {
    
        //update the scales
        xscale.domain([0, 14000]); // to amount of devs (length of survey arr)
        yscale.domain(devsPerCountry.map((d) => d.key));
        
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
    
        rect.merge(rectEnter).select('title').text((d) => `${d.values.length} developers in ${d.key}`);
        
        if (clicked) {
            // ENTER + UPDATE
            // only if filter is set
            rect.merge(rectEnter)
                .transition()
                .duration(3000)
                .style('fill', 'red')
                .attr('height', yscale.bandwidth())
                .attr('width', (d) => xscale(d.values.length)) // amount of devs per country 
                .attr('y', (d) => yscale(d.key));
        }
        else {
            // ENTER + UPDATE
            // only if filter is not set
            rect.merge(rectEnter)
                .attr('height', yscale.bandwidth())
                .attr('width', (d) => xscale(d.values.length)) // amount of devs per country 
                .attr('y', (d) => yscale(d.key));

        }
        // EXIT
        // elements that aren't associated with data
        rect.exit().remove();
    }

    // filter possibility
    // filter for highest amount of devs
    d3.select('#filter-highest').on('change', function() {
        clicked = true;
        const checked = d3.select(this).property('checked');
        if (checked === true) {
            filterData(true); // update with highest amount of devs
            clicked = false;
        }
        else {
            updateChart(devsPerCountry);  // Update with all data
        }
    });

    // filter for lowest amount of devsl
    d3.select('#filter-lowest').on('change', function() {
        clicked = true;
        const checked = d3.select(this).property('checked');
        if (checked === true) {
            filterData(false); // update with lowest amount of devs
            clicked = false;
        }
        else {
            updateChart(devsPerCountry);  // Update with all data
        }
    });

    function filterData(max) {
        const filterLengths = devsPerCountry.map((d) => d.values.length);
        let edgeVal = (max) ? Math.max(...filterLengths) : Math.min(...filterLengths);
        const filterData = devsPerCountry.filter(d => d.values.length === edgeVal);
        updateChart(filterData);
    }

    function greaterThanEdgeValue(data) {
        return data.values.length > 140; 
        // used 140 as edgevalue (10% of maximum) as we have 14.000 as the maximum 
        // amount of devs in a country 
        // we had more than 200 countries which was not really useful in 
        // the diagram to show so we reduced it 
    }
    
}
export { barChart };

