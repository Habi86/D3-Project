import * as d3 from 'd3';

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
                this.nestedData = d3.nest()
                    .key((d) => d.Overpaid)
                    .key((d) => d.FormalEducation)
                    .key((d) => d.Country)
                    .entries(this.surveyResults);
                
                this.nestedData = this.nestedData.filter((d) => d.key !== 'NA'); // filter only responds without NA
                this.groupedByPaymentAndEducation = this.nestedData;
                console.log(this.groupedByPaymentAndEducation);
            }
            this.updateChart(); // update chart with data
        });
    }

    createChart(){
        this.loadData();
    }

    filterNA(data){
        return data.key !== 'NA';
    }

    updateChart(){}

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
