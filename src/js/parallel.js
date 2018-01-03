import * as d3 from 'd3';

class ParallelSet {

    constructor() {
        this.createChart(); // call function to create chart
        this.observers = []; // array to store all observing events
    }

    loadData() {}

    createChart(){}

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
