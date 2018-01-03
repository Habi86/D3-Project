import * as d3 from 'd3';


class BubbleChart {

    constructor() {
        this.observers = [];
        this.createChart();
    }
    
    loadData() {
        d3.csv('/data/dataset4bubblechart.csv', (data) => {
            this.dataset = data;
            this.filteredDataset = data.filter((row) => row['Country'] === 'ALL');
        
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
            console.log(this.dataALL);
        
            this.update();
            this.updateTable(this.filteredDataset);
        });
    }
    
    createChart() {
        this.loadData();
    
        this.width = 900;
        this.height = 700;
        this.svg = d3.select('#bubbleChart').append('svg').attr('width', this.width).attr('height', this.height);
        this.pack = d3.pack()
            .size([this.width, this.height])
            .padding(2.5);
    
        this.createTable();
        
        const filterData = (pickedCountry) => this.filterData(pickedCountry);
        const observers = this.observers;
        //interactivity
        d3.select('#bubbleDropdown').on('change', function() {
            const pickedCountry = d3.select(this).property('value');
            observers.forEach((callback) => callback((pickedCountry === 'ALL') ? null : pickedCountry));
            filterData(pickedCountry);
        });
    }

    filterData(pickedCountry){
        this.filteredDataset = this.dataset.filter((row) => row['Country'] === pickedCountry);
        this.update();
        this.updateTable();  // Update the table with the filtered data
    }
    
    update(){
        // transition
        let t = d3.transition()
            .duration(2500);
        
        // hierarchy
        let h = d3.hierarchy({children: this.filteredDataset})
            .sum((d) => d.Frequency);
        
        //JOIN
        let circle = this.svg.selectAll('circle')
            .data(this.pack(h).leaves(), (d) => d.data.HaveWorkedLanguage);
    
        let title = this.svg.selectAll('title')
            .data(this.pack(h).leaves(), (d) => d.data.HaveWorkedLanguage);
        
        let text = this.svg.selectAll('text')
            .data(this.pack(h).leaves(), (d) => d.data.HaveWorkedLanguage);
    
    
        //ENTER
        circle.enter().append('circle')
            .attr('r', 1e-6)
            .attr('cx', (d) => d.x)
            .attr('cy', (d) =>  d.y)
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
            .attr('r', (d) => d.r)
            .each(function(d) {
                d3.select(this).append('title')
                    .text(d.data.HaveWorkedLanguage + ': ' + d.data.Frequency);
            });
        
        text.enter().append('text')
            .attr('opacity', 1)
            .attr('x', (d) => d.x)
            .attr('y', (d) => d.y)
            .text((d) => d.data.HaveWorkedLanguage.substring(0, d.r / 3))
            .attr('font-family', 'sans-serif')
            .attr('font-size', (d) => d.r / 4)
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
            .attr('r', (d) => d.r)
            .attr('cx', (d) => d.x)
            .attr('cy', (d) => d.y);
    
        title
            .text((d) => d.data.HaveWorkedLanguage + ': ' + d.data.Frequency);
    
        text
            .text((d) => d.data.HaveWorkedLanguage.substring(0, d.r / 3))
            .attr('font-family', 'sans-serif')
            .attr('font-size', (d) => d.r / 4)
            .transition(t)
            .attr('x', (d) =>  d.x)
            .attr('y', (d) => d.y);
    
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
    
    createTable(){
        //table
        this.table = d3.select('#bubbleTable').append('table');
        this.thead = this.table.append('thead');
        this.tbody = this.table.append('tbody');

        // append header row
        this.thead.append('tr')
            .selectAll('th')
            .data(['Country', 'HaveWorkedLanguage', 'Frequency']).enter()
            .append('th')
            .text((colNames) => colNames);
        // this.updateTable(this.data);
    }

    // update function
    updateTable() {
        const data  = this.filteredDataset;
        // const data =  this.filterData;
        // update data to display
        //data = newdata();
        
        // remove existing rows
        // this basically resets the table element
        // but is not the right way
        //tbody.selectAll('tr').remove();
        
        // join new data with old elements, if any
        this.rows = this.tbody.selectAll('tr')
            .data(data);
        
        this.rowsEnter = this.rows.enter()
            .append('tr');
        
        this.rowsEnter.append('td')
            .attr('class', 'countryColumn')
            .text((d) => d.id);
        this.rowsEnter.append('td')
            .attr('class', 'languageColumn')
            .text((d) => d.val);
        this.rowsEnter.append('td')
            .attr('class', 'frequencyColumn')
            .text((d) => d.val);
        
        d3.selectAll('.countryColumn').data(data).text((d) => d.Country);
        d3.selectAll('.languageColumn').data(data).text((d) => d.HaveWorkedLanguage);
        d3.selectAll('.frequencyColumn').data(data).text((d) => d.Frequency);
        this.rows.exit().remove();
    }

    // function to set country in dropdown if triggered externally
    setCountry(country) {
        d3.select('#bubbleDropdown').selectAll('option').select(function() {
            const d = d3.select(this);
            if ( this.value === country){
                d.property('selected',true);
            } 
            else {
                d.property('selected',false);
            }
        });
        if  (country){
            this.filterData(country);
        } 
        else {
            this.filterData('ALL');
        }
    }

    // function to trigger observers
    onChange(callback) {
        this.observers.push(callback);
    }
}

export default new BubbleChart();
