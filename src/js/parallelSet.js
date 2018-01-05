import * as d3 from 'd3';
import _ from 'underscore';

class ParallelSet {

    constructor() {
        this.createChart(); // call function to create chart
        this.observers = []; // array to store all observing events
    }

    loadData() {
        d3.csv('/data/survey_results_public.csv', (error, csv) => {
            if (error) {
                console.error(error);
            }
            else {
                this.surveyResults = csv;
                // group devs by payment, formal education and country
                // to get the necessary categorical data levels to display in the parallelset
                this.groupedByEducation = d3.nest()
                    //.key((d) => d.Overpaid)
                    .key((d) => d.FormalEducation)
                    //.key((d) => d.Country)
                    .entries(this.surveyResults);
                
                this.groupedByPayment = d3.nest()
                    .key((d) => d.Overpaid)
                    //.key((d) => d.FormalEducation)
                    //.key((d) => d.Country)
                    .entries(this.surveyResults);
                
                this.groupedByEducation = this.groupedByEducation.filter((d) => d.key !== 'NA'); // filter only responds without NA
                this.groupedByPayment = this.groupedByPayment.filter((d) => d.key !== 'NA');
                //this.groupedByPaymentAndEducation = this.groupedByEducation;
                //console.log(this.groupedByPaymentAndEducation);
            }
            this.updateChart(); // update chart with data
        });
    }

    createChart(){
        this.loadData();
        // define height and width of svg element
        this.width = 800;
        this.height = 800;

        // define color schema for ordinal scale (colors of different categories)
        // adjust to more appropriate colors
        this.colorSchema = d3.scaleOrdinal()  // ordinal because of categorical data 
            .range(d3.schemeCategory20);
        // used predefined color schema 
        // from https://github.com/d3/d3/blob/master/API.md#ordinal-scales
        
        // create source <svg> element and display it in the #parallelSet div
        d3.select('#parallelSet')
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);
        
        // append left and right classes to display the axis
        d3.select('svg')
            .append('g')
            .attr('class' ,'left');
        
        d3.select('svg')
            .append('g')
            .attr('class', 'right')
            .attr('transform', 'translate(780,0)');

        // append bands class to later bind the rendered bands to
        d3.select('svg')
            .append('g')
            .attr('class', 'bands')
            .attr('transform', 'translate(20,0)'); 
        
        // setup scale
        this.yscale = d3.scaleLinear()
            .domain([0, 50000])
            .range([0, 800]);

    }

    filterNA(data){
        return data.key !== 'NA'; // filter all values with NA as value
    }

    updateChart(){
        const right = this.groupedByEducation;
        const left = this.groupedByPayment;
        //console.log(right);
        
        // get all the categories about payment
        let leftGroups = [];
        const categoryNamesLeft = [];
        for (var category in left) {
            categoryNamesLeft.push(left[category].key);
            leftGroups.push(left[category].values);
            //console.log(categoryNamesLeft);
        }
        
        // get all the categories about educations
        let rightGroups = [];
        const categoryNamesRight = [];
        for (var category2 in right) {
            categoryNamesRight.push(right[category2].key);
            rightGroups.push(right[category2].values);
        }
        
        let leftGroupsPartitioned = [];
        leftGroups.forEach((item)  => leftGroupsPartitioned.push(item));

        // save the category partitions to create the intersections afterwards
        let rightGroupsPartitioned = [];
        rightGroups.forEach((item) => rightGroupsPartitioned.push(item));

        // call the function to render the data
        const leftDiv = d3.select('svg').select('g.left');
        const rightDiv = d3.select('svg').select('g.right');
        this.renderGroup(leftDiv, leftGroupsPartitioned);
        this.renderGroup(rightDiv, rightGroupsPartitioned);

        // compute the intersections between to given set arrays 
        // (code taken from Samuel Gratzl, he gave us hints about the parallelset)
        const intersections = (left, right) => {
            const result = [];
            // work on copy such that it can be manipulated to keep track of the right one
            let rightOffset = 0;
            let rightOffsets = right.map((d) => {
                rightOffset += d.length;
                return rightOffset - d.length; // prefix sum, i.e starting with 0
            });
            let leftOffset = 0;
            let leftOffsets = left.map((d) => {
                leftOffset += d.length;
                return leftOffset - d.length; // prefix sum, i.e starting with 0
            });
            // console.log(left);
            // console.log(right);

            left.forEach((l, i) => {
                const lset = new Set(l); // faster lookup
                let offset = leftOffsets[i];
                right.forEach((r, j) => {
                    const intersection = r.reduce((acc, d) => acc + (lset.has(d) ? 1 : 0), 0);
                    result.push({
                        intersection, // number of intersecting items
                        left: offset, // start left side
                        right: rightOffsets[j] // start right side
                    });
                    // shift next bands
                    offset += intersection;
                    rightOffsets[j] += intersection;
                });
            });
            return result;
        };
        
        // generate intersections of the two groups
        this.bands = intersections(leftGroupsPartitioned, rightGroupsPartitioned);

        this.line = d3.line()
            .curve(d3.curveLinearClosed)
            .x((d) => d.x)
            .y((d) => this.yscale(d.y));

        // create four points out of a band
        this.points = this.bands.map((b) => [
            {x: 0, y: b.left},
            {x: 760, y: b.right},
            {x: 760, y: b.right + b.intersection},
            {x: 0, y: b.left + b.intersection}
        ]);
        // TODO render points using d3.line generator
    }

    renderGroup($g, group) {
        $g.selectAll('rect').data(group);
        // ENTER + MERGE + UPDATE + EXIT missing
        // TODO render group stacked on top of each other
    }

    filterData(val, triggedByExternal) {
        (!triggedByExternal) && this.observers.forEach((callback)=> callback(this)); // trigger observer only if it is not triggered by an external chart
        this.updateChart();
    }

    // function to trigger observers
    onChange(callback) {
        this.observers.push(callback); // store callbacks in observers array
    }
    
}

export default new ParallelSet();
