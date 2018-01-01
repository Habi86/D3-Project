import * as d3 from 'd3';

function bubbleChart() {
    
    // Global variable for all data
    let dataset;
    let dataALL;
    
    d3.csv('/data/dataset4bubblechart.csv', function(data) {
        dataset = data;
        let dataDefault = data.filter(function(row) {
            return row['Country'] === 'ALL';
        });
        dataALL = {'children': dataDefault};
        update(dataALL);
    });
    
    
    function update(dataset) {

        let diameter = 600;
        let color = d3.scaleOrdinal(d3.schemeCategory20);

        let bubble = d3.pack(dataset)
            .size([diameter, diameter])
            .padding(1.5);

        let svg = d3.select('#bubblechart')
            .append('svg')
            .attr('width', diameter)
            .attr('height', diameter)
            .attr('class', 'bubble');

        let nodes = d3.hierarchy(dataset)
            .sum(function(d) { return d.Frequency; });

        let node = svg.selectAll('.node')
            .data(bubble(nodes).descendants())
            .enter()
            .filter(function(d){
                return  !d.children;
            })
            .append('g')
            .attr('class', 'node')
            .attr('transform', function(d) {
                return 'translate(' + d.x + ',' + d.y + ')';
            });

        node.append('title')
            .text(function(d) {
                return d.data.HaveWorkedLanguage + ': ' + d.data.Frequency;
            });

        node.append('circle')
            .attr('r', function(d) {
                return d.r;
            })
            .style('fill', function(d,i) {
                return color(i);
            });

        node.append('text')
            .attr('dy', '.2em')
            .style('text-anchor', 'middle')
            .text(function(d) {
                return d.data.HaveWorkedLanguage.substring(0, d.r / 3);
            })
            .attr('font-family', 'sans-serif')
            .attr('font-size', function(d){
                return d.r / 5;
            })
            .attr('fill', 'white');

        node.append('text')
            .attr('dy', '1.3em')
            .style('text-anchor', 'middle')
            .text(function(d) {
                return d.data.Frequency;
            })
            .attr('font-family',  'Gill Sans', 'Gill Sans MT')
            .attr('font-size', function(d){
                return d.r / 5;
            })
            .attr('fill', 'white');

        d3.select(self.frameElement)
            .style('height', diameter + 'px');

    }
    
    
    
    //official d3 bubble code
    //
    // let svg = d3.select('svg'),
    //     width = +svg.attr('width'),
    //     height = +svg.attr('height');
    //
    // let format = d3.format(',d');
    //
    // let color = d3.scaleOrdinal(d3.schemeCategory20c);
    //
    // let pack = d3.pack()
    //     .size([width, height])
    //     .padding(1.5);
    //
    // d3.csv('/data/flare.csv', function(d) {
    //     d.value = +d.value;
    //     if (d.value) return d;
    // }, function(error, classes) {
    //     if (error) throw error;
    //
    //     let root = d3.hierarchy({children: classes})
    //         .sum(function(d) { return d.value; })
    //         .each(function(d) {
    //             if (id = d.data.id) {
    //                 let id, i = id.lastIndexOf('.');
    //                 d.id = id;
    //                 d.package = id.slice(0, i);
    //                 d.class = id.slice(i + 1);
    //             }
    //         });
    //
    //     let node = svg.selectAll('.node')
    //         .data(pack(root).leaves())
    //         .enter().append('g')
    //         .attr('class', 'node')
    //         .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
    //
    //     node.append('circle')
    //         .attr('id', function(d) { return d.id; })
    //         .attr('r', function(d) { return d.r; })
    //         .style('fill', function(d) { return color(d.package); });
    //
    //     node.append('clipPath')
    //         .attr('id', function(d) { return 'clip-' + d.id; })
    //         .append('use')
    //         .attr('xlink:href', function(d) { return '#' + d.id; });
    //
    //     node.append('text')
    //         .attr('clip-path', function(d) { return 'url(#clip-' + d.id + ')'; })
    //         .selectAll('tspan')
    //         .data(function(d) { return d.class.split(/(?=[A-Z][^A-Z])/g); })
    //         .enter().append('tspan')
    //         .attr('x', 0)
    //         .attr('y', function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
    //         .text(function(d) { return d; });
    //
    //     node.append('title')
    //         .text(function(d) { return d.id + '\n' + format(d.value); });
    // });
    //
    //
    //
    //
    
    
    
    
    
    
    //interactivity
    d3.select('#bubble-filter').on('change', function() {
        // This will be triggered when the user selects or unselects the checkbox
        const checked = d3.select(this).property('checked');
        if (checked === true) { // Checkbox was just checked
            // Keep only data element whose country is US
            let filteredData = dataset.filter((row) => row['Country'] === 'Austria');
            filteredData = {'children': filteredData};
            update(filteredData);  // Update the chart with the filtered data
        }
        else { // Checkbox was just unchecked
            update(dataALL);  // Update the chart with all the data we have
        }
    });
    
    
}
export { bubbleChart };