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
                this.groupedByCountry = d3.nest()
                    .key((d) => d.Country)
                    .sortKeys(d3.ascending)
                    .entries(this.surveyResults)
                    .filter(this.greaterThanEdgeValue); // .filter((d) => d.key === 'Australia' || d.key === 'Canada' || d.key === 'France' || d.key === 'Germany' || d.key === 'India' || d.key === 'Netherlands' || d.key === 'Poland' || d.key === 'Russian Federation' || d.key === 'Spain' || d.key === 'United Kingdom' || d.key === 'United States');
    
    
                this.groupedByEducation = d3.nest()
                    .key((d) => d.FormalEducation)
                    .sortKeys(d3.ascending)
                    .entries(this.surveyResults)
                    .filter((d) => d.key !== 'NA');
    
                // Filter groupedByEducation with greaterThanEdgeValue - check
                this.filteredGroupedByEducation = [];
                
                for (var i = 0; i < this.groupedByEducation.length; i++ ){
                    this.filteredGroupedByEducation[i] = {
                        key: this.groupedByEducation[i].key,
                        values: this.groupedByEducation[i].values
                            .filter((d) => d.Country === 'Australia' || d.Country === 'Canada' || d.Country === 'France' || d.Country === 'Germany' || d.Country === 'India' || d.Country === 'Netherlands' || d.Country === 'Poland' || d.Country === 'Russian Federation' || d.Country === 'Spain' || d.Country === 'United Kingdom' || d.Country === 'United States')
                    };
                }
                
                // console.log("groupedByCountry");
                // console.log(this.groupedByCountry);
                // onsole.log("groupedByEducation");
                // console.log(this.groupedByEducation);
                // console.log("filteredGroupedByEducation");
                // console.log(this.filteredGroupedByEducation);
    
                
                //TODO: remove me: am just here to check if groupedByCountry and groupedByEducation have a correct connection
                // this.groupedByCountryNEducation = d3.nest()
                //     .key((d) => d.Country)
                //     .sortKeys(d3.ascending)
                //     .key((d) => d.FormalEducation)
                //     .sortKeys(d3.ascending)
                //     .entries(this.surveyResults)
                //     .filter((d) => d.key === 'Australia' || d.key === 'Canada' || d.key === 'France' || d.key === 'Germany' || d.key === 'India' || d.key === 'Netherlands' || d.key === 'Poland' || d.key === 'Russian Federation' || d.key === 'Spain' || d.key === 'United Kingdom' || d.key === 'United States');
                
            }
            this.updateChart(); // update chart with data
        });
    }

    createChart(){
        this.loadData();
        // define height and width of svg element
        this.width = 560;
        this.height = 360;

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
            .attr('transform', 'translate(540,0)');

        // append bands class to later bind the rendered bands to
        d3.select('svg')
            .append('g')
            .attr('class', 'bands')
            .attr('transform', 'translate(20,0)'); 
    }
    

    updateChart(){
        const left = this.groupedByCountry;
        const right = this.filteredGroupedByEducation;
        
        // get all the categories about payment
        let leftGroups = [];
        const categoryNamesLeft = [];
        for (var category in left) {
            categoryNamesLeft.push(left[category].key);
            leftGroups.push(left[category].values);
        }
        
        // get all the categories about educations
        let rightGroups = [];
        const categoryNamesRight = [];
        for (var category2 in right) {
            categoryNamesRight.push(right[category2].key);
            rightGroups.push(right[category2].values);
        }

        // save the category partitions to create the intersections afterwards
        let leftGroupsPartitioned = [];
        leftGroups.forEach((item) => leftGroupsPartitioned.push(item));
        
        let rightGroupsPartitioned = [];
        rightGroups.forEach((item) => rightGroupsPartitioned.push(item));

        //setup scale
        this.yscale = d3.scaleLinear()
            .domain([0, 50000])
            .range([0, 520]);
        //this.yscale = d3.scaleLinear().domain([0, 10000]).range([0, 100]);
    
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
            {x: 520, y: b.right},
            {x: 520, y: b.right + b.intersection},
            {x: 0, y: b.left + b.intersection}
        ]);
    
        this.selectBands = d3.select('g.bands');
    
        // TODO render points using d3.line generator
        this.linePaths = this.selectBands
            .selectAll('path')
            .data(this.points, this.categoryNamesLeft);
        this.linePaths.enter()
            .append('path')
            .on('click', this.clicked)
            .attr('d', this.line);
    }
    
    
    renderGroup($g, group) {
        // TODO: render group on top of each other
        const rects = $g.selectAll('rect');
        
        // ENTER & UPDATE
        rects.data(group);

        const enterRects = rects.data(group)
            .enter()
            .append('rect');
        
        // add labels for rect
        // enterRects.append('text')
        //     .attr('class', 'bartext')
        //     .attr('text-anchor', 'middle')
        //     .attr('fill', 'blue')
        //     .attr('transform', 'rotate(-90)')
        //     .attr('y', 100)
        //     .attr('x', -400)
        //     .attr('dy', '1em')
        //     .text(this.categoryNamesLeft.map((d) => d));
        
        // styling for rects in enter phase
        
        if ($g._groups[0][0].classList.value === 'left') { //TODO: Refactor me; ugly solution to only add the onClick Event on the Countries (left div)
            enterRects
                .attr('width', 20)
                .style('fill', this.colorSchema)
                .on('click', this.clickedRec);

        }
        else {
            enterRects
                .attr('width', 20)
                .style('fill', this.colorSchema);
        }
    
        // MERGE
        rects.data(group)
            .merge(enterRects)
            .attr('height', (d) => this.yscale(d.length))
            .attr('transform', (d) => `translate(0,${d.height})`);

        // EXIT
        rects.data(group)
            .exit()
            .remove();
    }
    
    clickedRec(d, i) {
        switch (i) {
        case 0:
            setNewCountry('Australia');
            break;
        case 1:
            setNewCountry('Canada');
            break;
        case 2:
            setNewCountry('France');
            break;
        case 3:
            setNewCountry('Germany');
            break;
        case 4:
            setNewCountry('India');
            break;
        case 5:
            setNewCountry('Netherlands');
            break;
        case 6:
            setNewCountry('Poland');
            break;
        case 7:
            setNewCountry('Russian Federation');
            break;
        case 8:
            setNewCountry('Spain');
            break;
        case 9:
            setNewCountry('United Kingdom');
            break;
        case 10:
            setNewCountry('United States');
            break;
        default:
            console.log('switch case - default');
        }
    
        function setNewCountry(value){
            const dropdown = d3.select('#bubbleDropdown').node();
            for (var i = 0; i < dropdown.length; i++) {
                if (dropdown[i].value === value) {
                    dropdown.selectedIndex = i;
                    var evt = new MouseEvent('change');
                    // way to dispatch the event using d3
                    d3.select('#bubbleDropdown').node().dispatchEvent(evt);
                }
            }
        }
    }
    
    //TODO: Clicking a band triggers the setNewCountry() (just like rectancle-click)
    clicked(d, i) {
        console.log('band got clicked ^^');
    }
    
    
    greaterThanEdgeValue(data) {
        return data.values.length > 800;
        // we had more than 200 countries which was not really useful in
        // the diagram to show so we reduced it
    }
    
    
    // function to trigger observers
    onChange(callback) {
        this.observers.push(callback); // store callbacks in observers array
    }
    
}

export default new ParallelSet();
