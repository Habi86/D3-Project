import * as d3 from 'd3';

function bubbleChart() {
    
    // Global letiable for all data
    let dataset;
    let dataALL;
    
    d3.csv('/data/dataset4bubblechart.csv', function(data) {
        dataset = data;
        dataALL = data.filter(function(row) {
            return row['Country'] === 'ALL';
        });
        update(dataALL);
    });
    
    
    let width = 600, height = 600;
    let svg = d3.select('body').append('svg').attr('width', width).attr('height', height);
    let pack = d3.pack()
        .size([width, height])
        .padding(1.5);
    
    
    function update(classes){
        
        // transition
        let t = d3.transition()
            .duration(750);
        
        // hierarchy
        let h = d3.hierarchy({children: classes})
            .sum(function(d) { return d.Frequency; });
        
        //JOIN
        let circle = svg.selectAll('circle')
            .data(pack(h).leaves(), function(d){ return d.data.HaveWorkedLanguage + '?'; });
        
        let text = svg.selectAll('text')
            .data(pack(h).leaves(), function(d){ return d.data.HaveWorkedLanguage + 'test'; });
        
        //EXIT
        circle.exit()
            .style('fill', '#b26745')
            .transition(t)
            .attr('r', 1e-6)
            .remove();
        
        text.exit()
            .transition(t)
            .attr('opacity', 1e-6)
            .remove();
        
        //UPDATE
        circle
            .transition(t)
            .style('fill', '#3a403d')
            .attr('r', function(d){ return d.r;})
            .attr('cx', function(d){ return d.x; })
            .attr('cy', function(d){ return d.y; });
        
        text
            .text(function(d){ return d.data.HaveWorkedLanguage + '' + d.data.Frequency; })
            .transition(t)
            .attr('x', function(d){ return d.x; })
            .attr('y', function(d){ return d.y; });
        
        //ENTER
        circle.enter().append('circle')
            .attr('r', 1e-6)
            .attr('cx', function(d){ return d.x; })
            .attr('cy', function(d){ return d.y; })
            .style('fill', '#fff')
            .transition(t)
            .style('fill', '#45b29d')
            .attr('r', function(d){ return d.r;});
        
        text.enter().append('text')
            .attr('opacity', 1e-6)
            .attr('x', function(d){ return d.x; })
            .attr('y', function(d){ return d.y; })
            .text(function(d){ return d.data.HaveWorkedLanguage + '' + d.data.Frequency; })
            .transition(t)
            .attr('opacity', 1);
        
    }
    
    
    
    //interactivity
    d3.select('#bubble-filter').on('change', function() {
        // This will be triggered when the user selects or unselects the checkbox
        const checked = d3.select(this).property('checked');
        if (checked === true) { // Checkbox was just checked
            // Keep only data element whose country is US
            let filteredData = dataset.filter((row) => row['Country'] === 'Andorra');
            //filteredData = {'children': filteredData};
            update(filteredData);  // Update the chart with the filtered data
            console.log(filteredData);
            console.log(dataALL);
        }
        else { // Checkbox was just unchecked
            update(dataALL);  // Update the chart with all the data we have
        }
    });


}
export { bubbleChart };