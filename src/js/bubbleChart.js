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
        
        let foo = [];
        data.forEach( function(v) {
            foo.push(v.Country);
        });
        
        let getCountries = [...new Set(foo)];
        getCountries = getCountries.sort();
        getCountries.forEach( function(c) {
            let option = document.createElement('option');
            option.text = c;
            option.value = c;
            let select = document.getElementById('bubbleDropdown');
            select.appendChild(option);
        });
        
        update(dataALL);
    });
    
    
    let width = 1000, height = 700;
    let svg = d3.select('#bubbleChart').append('svg').attr('width', width).attr('height', height);
    let pack = d3.pack()
        .size([width, height])
        .padding(2.5);
    
    function update(classes){
        
        // transition
        let t = d3.transition()
            .duration(2500);
        
        // hierarchy
        let h = d3.hierarchy({children: classes})
            .sum(function(d) { return d.Frequency; });
        
        //JOIN
        let circle = svg.selectAll('circle')
            .data(pack(h).leaves(), function(d){ return d.data.HaveWorkedLanguage; });
    
        let title = svg.selectAll('title')
            .data(pack(h).leaves(), function(d){ return d.data.HaveWorkedLanguage; });
        
        let text = svg.selectAll('text')
            .data(pack(h).leaves(), function(d){ return d.data.HaveWorkedLanguage; });
    
    
        //ENTER
        
        circle.enter().append('circle')
            .attr('r', 1e-6)
            .attr('cx', function(d){ return d.x; })
            .attr('cy', function(d){ return d.y; })
            .style('fill', '#fff')
            .transition(t)
            .style('fill', '#56b256')
            .attr('r', function(d){ return d.r;})
            .each(function(d) {
                d3.select(this).append('title')
                    .text(d.data.HaveWorkedLanguage + ': ' + d.data.Frequency);
            });
    
    
        text.enter().append('text')
            .attr('opacity', 1e-6)
            .attr('x', function(d){ return d.x; })
            .attr('y', function(d){ return d.y; })
            .text(function(d) {
                return d.data.HaveWorkedLanguage.substring(0, d.r / 3);
            })
            .attr('font-family', 'sans-serif')
            .attr('font-size', function(d){
                return d.r / 4;
            })
            .transition(t)
            .attr('opacity', 1);
    
        //UPDATE
        circle
            .transition(t)
            .style('fill', '#3a403d')
            .attr('r', function(d){ return d.r;})
            .attr('cx', function(d){ return d.x; })
            .attr('cy', function(d){ return d.y; });
        
    
        text
            .text(function(d) {
                return d.data.HaveWorkedLanguage.substring(0, d.r / 3);
            })
            .attr('font-family', 'sans-serif')
            .attr('font-size', function(d){
                return d.r / 4;
            })
            .transition(t)
            .attr('x', function(d){ return d.x; })
            .attr('y', function(d){ return d.y; });
    
    
        //EXIT
        circle.exit()
            .style('fill', '#b25230')
            .transition(t)
            .attr('r', 1e-6)
            .remove();
        
        text.exit()
            .transition(t)
            .attr('opacity', 1e-6)
            .remove();
        
        
        
        
        
        
        
    }
    
    
    
    //interactivity
    d3.select('#bubbleDropdown').on('change', function() {
        const pickedCategory = d3.select(this).property('value');
        let filteredData = dataset.filter((row) => row['Country'] === pickedCategory);
        update(filteredData);  // Update the chart with the filtered data
    });


}
export { bubbleChart };