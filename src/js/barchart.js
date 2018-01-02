import * as d3 from 'd3';

class barChart {

    constructor() {
        this.createChart();
    }

    loadData() {
        d3.csv('/data/survey_results_public.csv', (error, csv) => {
            if (error) {
                console.error(error);
            }
            else {
                this.surveyResults = csv;
                // group devs by country
                this.devsPerCountry = d3.nest()
                    .key(function(d) {
                        return d.Country;
                    })
                    .entries(this.surveyResults);
                // filter only data over  a certain amount of devs 
                this.devsPerCountry = this.devsPerCountry.filter(this.greaterThanEdgeValue);
                this.filteredDevsPerCountry = this.devsPerCountry;
                console.log(this.devsPerCountry);
            }
            this.updateChart(this.devsPerCountry);
        });
    }

    createChart() {
        this.loadData();
        
        this.margin = {
            top: 40,
            bottom: 40,
            left: 200,
            right: 20
        };

        this.width = 800 - this.margin.left - this.margin.right;
        this.height = 1500 - this.margin.top - this.margin.bottom;

        // Creates sources <svg> element
        this.svg = d3.select('#barChart').append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom);

        // Group used to enforce margin
        this.g = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
        
        this.setupScalesAndAxes();
        // this.updateChart(devsPerCountry);
        
        // filter for highest amount of devs
        const filterData = (max) => this.filterData(max);
        const unfilterData = () => this.unfilterData();

        d3.select('#filter-highest').on('change', function() {
            const checked = d3.select(this).property('checked');
            if (checked === true) {
                filterData(true); // update with highest amount of devs
            }
            else {
                unfilterData();
            }
        });

        d3.select('#filter-lowest').on('change', function() {
            const checked = d3.select(this).property('checked');
            if (checked === true) {
                filterData(false); // update with lowest amount of devs
            }
            else {
                unfilterData();
            }
        });

    }

    setupScalesAndAxes() {
        // setup for the scales
        this.xscale = d3.scaleLinear().range([0, this.width]);
        this.yscale = d3.scaleBand().rangeRound([0, this.height]).paddingInner(0.5).paddingOuter(0.2);

        // setup for the axis
        this.xaxis = d3.axisTop().scale(this.xscale);
        this.gXaxis = this.g.append('g').attr('class', 'x axis');
        this.yaxis = d3.axisLeft().scale(this.yscale);
        this.gYaxis = this.g.append('g').attr('class', 'y axis');

        // add label for x-axis
        this.svg.append('text')
            .attr('x', 400)
            .attr('y', 10)
            .attr('class', 'x-axis')
            .text('Amount of developers');     

        // add label for y-axis
        this.svg.append('text')
            .attr('x', -500)
            .attr('y', 60)
            .attr('transform', 'rotate(-90)')
            .attr('class', 'y-axis') 
            .text('Countries'); 
    }
    // update the chart
    updateChart() {
        //update the scales
        console.log(this.devsPerCountry);
        console.log(this.filteredDevsPerCountry);
        this.xscale.domain([0, 14000]); // to amount of devs (length of survey arr)
        this.yscale.domain(this.filteredDevsPerCountry.map((d) => d.key));
        
        //render the axis
        this.gXaxis.call(this.xaxis);
        this.gYaxis.call(this.yaxis);  

        // Render the chart with new data
        const rect = this.g.selectAll('rect').data(this.filteredDevsPerCountry, (d) => d);
        // ENTER
        // new elements
        const rectEnter = rect.enter()
            .append('rect')
            .attr('x', 0);
        rectEnter.append('title');
    
        rect.merge(rectEnter).select('title').text((d) => `${d.values.length} developers in ${d.key}`);
        
        // ENTER + UPDATE
        // only if filter is set
        rect.merge(rectEnter)
            .transition()
            .duration(3000)
            .style('fill', 'rgb(86, 178, 86)')
            .attr('height', this.yscale.bandwidth())
            .attr('width', (d) => this.xscale(d.values.length)) // amount of devs per country 
            .attr('y', (d) => this.yscale(d.key));
        
        // EXIT
        // elements that aren't associated with data
        rect.exit().remove();
    }

    filterData(max) {
        console.log(this.devsPerCountry);
        const filterLengths = this.devsPerCountry.map((d) => d.values.length);
        let edgeVal = (max) ? Math.max(...filterLengths) : Math.min(...filterLengths);
        this.filteredDevsPerCountry = this.devsPerCountry.filter(d => d.values.length === edgeVal);
        this.updateChart();
    }

    unfilterData(){
        this.filteredDevsPerCountry = this.devsPerCountry;
        this.updateChart();
    }

    onCountryChange(country) {
        const filterData = this.devsPerCountry.filter(d => d.key === country);
        this.updateChart(filterData);
    }

    greaterThanEdgeValue(data) {
        return data.values.length > 140; 
        // used 140 as edgevalue (10% of maximum) as we have 14.000 as the maximum 
        // amount of devs in a country 
        // we had more than 200 countries which was not really useful in 
        // the diagram to show so we reduced it 
    }
    
}
export { barChart };
