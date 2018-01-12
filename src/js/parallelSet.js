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
    
    
                this.filteredGroupedByEducation = d3.nest()
                    .key((d) => d.FormalEducation)
                    .sortKeys(d3.ascending)
                    .entries([].concat(...this.groupedByCountry.map((d) => d.values)))
                    .filter((d) => d.key !== 'NA');

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
        const labelWidth = 15 0;
        this.width = 560 + labelWidth * 2; // 50 per side for label
        this.height = 360;

        // define color schema for ordinal scale (colors of different categories)
        // adjust to more appropriate colors
        this.colorSchema = d3.scaleOrdinal()  // ordinal because of categorical data 
            .range(d3.schemeCategory10);
        // used predefined color schema 
        // from https://github.com/d3/d3/blob/master/API.md#ordinal-scales
        
        // create source <svg> element and display it in the #parallelSet div
        const svg = d3.select('#parallelSet')
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .append('g').attr('transform', `translate(${labelWidth},0)`);
        
        // append left and right classes to display the axis
        svg
            .append('g')
            .attr('class' ,'left');
        
        svg
            .append('g')
            .attr('class', 'right')
            .attr('transform', 'translate(540,0)');

        // append bands class to later bind the rendered bands to
        svg
            .append('g')
            .attr('class', 'bands')
            .attr('transform', 'translate(20,0)'); 
    }
    

    updateChart(){
        const left = this.groupedByCountry;
        const right = this.filteredGroupedByEducation;
        
        // get all the countries
        const leftGroups = left.map((d) => d.values);
        const categoryNamesLeft = left.map((d) => d.key);
        
        // get all the categories about educations
        const rightGroups = right.map((d) => d.values);
        const categoryNamesRight = right.map((d) => d.key);

        //setup scale
        this.yscale = d3.scaleLinear()
            .domain([0, 50000])
            .range([0, 520]);
    
        // call the function to render the data
        const leftDiv = d3.select('svg').select('g.left');
        const rightDiv = d3.select('svg').select('g.right');
        this.renderGroup(leftDiv, leftGroups, categoryNamesLeft, true);
        this.renderGroup(rightDiv, rightGroups, categoryNamesRight, false);

        // compute the intersections between to given set arrays 
        // (code taken from Samuel Gratzl, he gave us hints about the parallelset)
        const intersections = (left, leftLabels, right, rightLabels) => {
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
                        title: `${leftLabels[i]} ∩ ${rightLabels[j]}`,
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
        
        // generate intersections of the two groups to display in the parallelset
        this.bands = intersections(leftGroups, categoryNamesLeft, rightGroups, categoryNamesRight);

        // render the lines for the bands
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
            .data(this.points);
        this.linePaths.enter()
            .append('path')
            .on('click', this.clicked)
            .attr('d', this.line)
            .append('title').text((d) => d.title);
    }
    
    
    renderGroup($g, group, labels, isLeft) {
        // TODO: render group on top of each other
        // We got some hints from a stackoverflow Post : https://stackoverflow.com/questions/18151455/d3-js-create-objects-on-top-of-each-other
        const rects = $g.selectAll('g').data(group);
        
        // ENTER & UPDATE
        // get all the groups and append a rectangle block for every one
        const enterRects = rects.enter().append('g');
        enterRects.append('rect').attr('width', 20);
        enterRects.append('text').attr('x', -2);


        
        // add labels for rect 
        // somehow they are not showing
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

        if (isLeft) {
            enterRects.on('click', this.clickedRec);
        } else {
            enterRects.select('text').attr('x', 22); // shift to the right side
        }
    
        // MERGE enterRects group and add attributes to scale the axis
        // 
        const updateRects = rects.merge(enterRects);
        let acc = 0;
        updateRects.select('rect')
            .style('fill', this.colorSchema)
            .attr('y', (d) => {
                const r = acc;
                acc += d.length;
                return this.yscale(r);
            })
            .attr('height', (d) => this.yscale(d.length))
        acc = 0;
        updateRects.select('text')
            .attr('y', (d) => {
                const r = acc;
                acc += d.length;
                return this.yscale(r + d.length / 2);
            })
            .text((d, i) => labels[i]);

        // EXIT remove all groups which are not needed anymore
        rects.exit()
            .remove();
    }
    
    clickedRec(d, i) {  // function to set the right country, based on the index
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
        
        // set the new country triggered through a click on a rectangle
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
