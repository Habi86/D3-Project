import * as d3 from 'd3';

function bubbleChart() {
    
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
        console.log(dataALL);
        
        update(dataALL);
        updateTable(dataALL);
    });
    
    
    let width = 900, height = 700;
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
            .on('mouseover',function() {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .style('fill-opacity', 0.5);
            })
            .on('mouseout',function() {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .style('fill-opacity', 1);
            })
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
            .on('mouseover',function() {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .style('fill-opacity', 0.5);
            })
            .on('mouseout',function() {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .style('fill-opacity', 1);
            })
            .transition(t)
            .style('fill', '#3a403d')
            .attr('r', function(d){ return d.r;})
            .attr('cx', function(d){ return d.x; })
            .attr('cy', function(d){ return d.y; });
    
        title
            .text(function(d) {
                return d.data.HaveWorkedLanguage + ': ' + d.data.Frequency;
            });
    
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
            .style('fill', 'orange')
            .transition(t)
            .attr('r', 1e-6)
            .remove();
        
        text.exit()
            .transition(t)
            .attr('opacity', 1e-6)
            .remove();
        
    }
    
    
    //table
    var table = d3.select('#bubbleTable').append('table');
    var thead = table.append('thead');
    var tbody = table.append('tbody');

    // append header row
    thead.append('tr')
        .selectAll('th')
        .data(['Country', 'HaveWorkedLanguage', 'Frequency']).enter()
        .append('th')
        .text(function(colNames) {
            return colNames;
        });

    // update function
    function updateTable(data) {
        // update data to display
        //data = newdata();
        
        // remove existing rows
        // this basically resets the table element
        // but is not the right way
        //tbody.selectAll('tr').remove();
        
        // join new data with old elements, if any
        var rows = tbody.selectAll('tr')
            .data(data);
        
        var rowsEnter = rows.enter()
            .append('tr');
        
        rowsEnter.append('td')
            .attr('class', 'countryColumn')
            .text(function(d) {
                return d.id;
            });
        rowsEnter.append('td')
            .attr('class', 'languageColumn')
            .text(function(d) {
                return d.val;
            });
        rowsEnter.append('td')
            .attr('class', 'frequencyColumn')
            .text(function(d) {
                return d.val;
            });
        
        d3.selectAll('.countryColumn').data(data).text(function(d) {
            return d.Country;
        });
        d3.selectAll('.languageColumn').data(data).text(function(d) {
            return d.HaveWorkedLanguage;
        });
        d3.selectAll('.frequencyColumn').data(data).text(function(d) {
            return d.Frequency;
        });
        rows.exit().remove();
        
    }
    
    
    //interactivity
    d3.select('#bubbleDropdown').on('change', function() {
        const pickedCategory = d3.select(this).property('value');
        let filteredData = dataset.filter((row) => row['Country'] === pickedCategory);
        update(filteredData);  // Update the chart with the filtered data
        console.log(filteredData);
        updateTable(filteredData);  // Update the table with the filtered data
    });
    

}
export { bubbleChart };
