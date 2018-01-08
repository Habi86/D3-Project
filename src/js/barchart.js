import * as d3 from 'd3';

class BarChart {

    constructor() {
        this.createChart(); // call function to create chart
        this.observers = []; // array to store all observing events
    }
    // load data for barchart and group it by countries 
    // with their amount of devs to better display the data
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
                // filter only data over a certain amount of devs 
                // this.devsPerCountry = this.devsPerCountry.filter(this.greaterThanEdgeValue);
                this.filteredDevsPerCountry = this.devsPerCountry;
                //console.log(this.devsPerCountry);
            }
            this.updateChart(); // update chart
        });
    }

    // draw the chart
    createChart() {
        this.loadData();
        // margin best practices
        this.margin = {
            top: 40,
            bottom: 40,
            left: 200,
            right: 20
        };
        // define height and width of svg element
        this.width = 800 - this.margin.left - this.margin.right;
        this.height = 2500 - this.margin.top - this.margin.bottom;
        
        // create source <svg> element and display it in the #barchart div
        this.svg = d3.select('#barChart').append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom);

        // group used to enforce the margin set
        this.g = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
        
        // function call to setup axes and scales
        this.setupScalesAndAxes();
        
        // bind the functions (filterData, unfilterData) for filtering to bind this to the right scope
        // as in the d3.select the this is bound to the callback (wrong scope for our use case)
        const filterData = (max) => this.filterData(max);
        const unfilterData = () => this.unfilterData();
       
        // filter for highest amount of devs
        // listen for change events on the #filter-highest checkbox and either filter the data to the country with the highest amount
        d3.select('#filter-highest').on('change', function() {
            const checked = d3.select(this).property('checked');
            if (checked === true) {
                filterData(true); // update with country with highest amount of devs
                d3.select('#lowest-label')
                    .style('display', 'none'); // hide other filteroption

            }
            else {
                unfilterData(); // unfilter the data (display all)
                d3.select('#lowest-label')
                    .style('display', 'inline-block'); // show other filteroption           
            }
        });

        d3.select('#filter-lowest').on('change', function() {
            const checked = d3.select(this).property('checked');
            if (checked === true) {
                filterData(false); // update with country with lowest amount of devs
                d3.select('#highest-label')
                    .style('display', 'none'); // hide other filteroption
            }
            else {
                unfilterData(); // unfilter the data (display all)
                d3.select('#highest-label')
                    .style('display', 'inline-block'); // show other filteroption      
            }
        });
    }

    // function to setup the axes and the scales
    setupScalesAndAxes() {
        // setup for the x/y scales
        this.xscale = d3.scaleLinear().range([0, this.width]);
        this.yscale = d3.scaleBand().rangeRound([0, this.height]).paddingInner(0.7).paddingOuter(0.5);

        // setup for the x/y axis
        this.xaxis = d3.axisTop().scale(this.xscale);
        this.gXaxis = this.g.append('g').attr('class', 'x axis');
        this.yaxis = d3.axisLeft().scale(this.yscale);
        this.gYaxis = this.g.append('g').attr('class', 'y axis');

        // add label for x-axis, add class and position
        this.svg.append('text')
            .attr('x', 400)
            .attr('y', 10)
            .attr('class', 'x-axis')
            .text('Amount of developers');     

        // add label for y-axis, add class and position
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
        //console.log(this.devsPerCountry);
        //console.log(this.filteredDevsPerCountry);
        this.xscale.domain([0, 14000]); // to amount of devs (length of survey arr)
        this.yscale.domain(this.filteredDevsPerCountry.map((d) => d.key));
        
        //render the axis
        this.gXaxis.call(this.xaxis);
        this.gYaxis.call(this.yaxis);  

        // render the chart with new data
        const rect = this.g.selectAll('rect')
            .data(this.filteredDevsPerCountry, (d) => d);
        
        // ENTER
        // create new elements
        const rectEnter = rect.enter()
            .append('rect')
            .attr('x', 0);

        // append a title tag to display a tooltip if one hovers over a bar
        rectEnter.append('title');
        rect.merge(rectEnter)
            .select('title')
            .text((d) => `${d.values.length} developers in ${d.key}`);
        
        // ENTER + UPDATE
        rect.merge(rectEnter)
            .transition()
            .duration(3000)
            .style('fill', 'rgb(86, 178, 86)')
            .attr('height', this.yscale.bandwidth())
            .attr('width', (d) => this.xscale(d.values.length)) // amount of devs per country 
            .attr('y', (d) => this.yscale(d.key)); // country names
        
        // EXIT
        // remove elements that aren't associated with data
        rect.exit().remove();
    }

    // filter function to either filter for max or min amount of devs per country
    filterData(max) {
        const filterLengths = this.devsPerCountry.map((d) => d.values.length); // get all lengths
        let edgeVal = (max) ? Math.max(...filterLengths) : Math.min(...filterLengths); // compute edgeVal either max or min
        this.filteredDevsPerCountry = this.devsPerCountry.filter(d => d.values.length === edgeVal); // filter only country with this amount of devs
        this.observers.forEach((callback)=> callback(this.filteredDevsPerCountry[0].key)); // send this country dataset to the callback
        this.updateChart();
    }

    // filter the data by the country chosen in another chart
    // triggeredByExternal : boolean value to prevent race conditions
    filterDataByCountry(country, triggedByExternal) {
        this.filteredDevsPerCountry = this.devsPerCountry.filter(d => d.key === country);
        (!triggedByExternal) && this.observers.forEach((callback)=> callback(this.filteredDevsPerCountry[0].key)); // trigger observer only if it is not triggered by an external chart
        this.updateChart();
    }

    // reset data to all countries to display all after filter is removed
    unfilterData(){
        this.filteredDevsPerCountry = this.devsPerCountry;
        this.observers.forEach((callback) => callback(null)); // send a null value to the callback
        this.updateChart();
    }

    greaterThanEdgeValue(data) {
        return data.values.length > 140; 
        // used 140 as edgevalue (10% of maximum) as we have 14.000 as the maximum 
        // amount of devs in a country 
        // we had more than 200 countries which was not really useful in 
        // the diagram to show so we reduced it 
    }

    // function to set country in barchart if triggered externally
    setCountry(country) {
        if (country) {
            this.filterDataByCountry(country, true); // filter the data by the country chosen in another chart
        } 
        else {
            this.unfilterData(); // display all countries
        }
    }

    // function to trigger observers
    onChange(callback) {
        this.observers.push(callback); // store callbacks in observers array
    }
    
}
export default new BarChart();
