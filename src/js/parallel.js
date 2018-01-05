import * as d3 from 'd3';

class ParallelSet {

    constructor() {
        this.createChart(); // call function to create chart
        this.observers = []; // array to store all observing events
    }

    loadData() {}

    createChart(){
    
        //this.loadData();
    
        const $svg = d3.select('svg');
    
        const left = d3.range(0, 100);
        const right = d3.shuffle(d3.range(0, 100));
    
        const leftGroups = [left.slice(0,30), left.slice(30,60), left.slice(60)];
        const rightGroups = [right.slice(0, 50), right.slice(50)];
    
        const yscale = d3.scaleLinear().domain([0, 100]).range([0, 800]);
    
        function renderGroup($g, group) {
            // TODO render group stacked on top of each other
        }
    
        renderGroup($svg.select('g.left'), leftGroups);
        renderGroup($svg.select('g.right'), rightGroups);

        // compute the intersections between to given set arrays
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
    
        const $bands = $svg.select('g.bands');
        const bands = intersections(leftGroups, rightGroups);
    
        const line = d3.line()
            .curve(d3.curveLinearClosed)
            .x((d) => d.x)
            .y((d) => yscale(d.y));

        // create four points out of a band
        const points = bands.map((band) => [
            {x: 0, y: band.left},
            {x: 760, y: band.right},
            {x: 760, y: band.right + band.intersection},
            {x: 0, y: band.left + band.intersection}
        ]);

        // TODO render points using d3.line generator
        
        
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
