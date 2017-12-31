import * as d3 from 'd3';

function bubbleChart() {
    
    d3.csv('/data/dataset4bubblechart.csv', function(data) {
        data = data.filter(function(row) {
            return row['Country'] === 'Austria';
        });
    
        let foo = {'children': data};
    
    
        update(foo);
        //console.log(data);
        console.log(foo);
    });
    
    
    d3.csv('/data/dataset4bubblechart.csv',function(error,rows){
        
        let foo = {'children': rows};
        // let obj = d3.map(rows, function(d){
        //
        //
        //     return d.col1;
        // });
        // obj.forEach(function(k,v){
        //     this[k] = [v.col2, v.col3, v.col4];
        // });
        //
        //console.log(foo);
    });
    
    // let data = {
    //     'children': [{'Name':'Olives','Count':4319},
    //         {'Name':'Tea','Count':4159},
    //         {'Name':'Mashed Potatoes','Count':2583},
    //         {'Name':'Boiled Potatoes','Count':2074},
    //         {'Name':'Milk','Count':1894},
    //         {'Name':'Chicken Salad','Count':1809},
    //         {'Name':'Vanilla Ice Cream','Count':1713},
    //         {'Name':'Cocoa','Count':1636},
    //         {'Name':'Lettuce Salad','Count':1566},
    //         {'Name':'Lobster Salad','Count':1511},
    //         {'Name':'Chocolate','Count':1489},
    //         {'Name':'Apple Pie','Count':1487},
    //         {'Name':'Orange Juice','Count':1423},
    //         {'Name':'American Cheese','Count':1372},
    //         {'Name':'Green Peas','Count':1341},
    //         {'Name':'Assorted Cakes','Count':1331},
    //         {'Name':'French Fried Potatoes','Count':1328},
    //         {'Name':'Potato Salad','Count':1306},
    //         {'Name':'Baked Potatoes','Count':1293},
    //         {'Name':'Roquefort','Count':1273},
    //         {'Name':'Stewed Prunes','Count':1268}]
    // };
    /*
    let data = {
        'children':
        [
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'Assembly',
                'Frequency': 1823
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'C',
                'Frequency': 6974
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'C#',
                'Frequency': 12476
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'C++',
                'Frequency': 8155
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'Clojure',
                'Frequency': 391
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'CoffeeScript',
                'Frequency': 1192
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'CommonLisp',
                'Frequency': 273
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'Dart',
                'Frequency': 145
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'Elixir',
                'Frequency': 380
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'Erlang',
                'Frequency': 281
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'F#',
                'Frequency': 457
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'Go',
                'Frequency': 1557
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'Groovy',
                'Frequency': 1193
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'Hack',
                'Frequency': 107
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'Haskell',
                'Frequency': 649
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'Java',
                'Frequency': 14524
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'JavaScript',
                'Frequency': 22875
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'Julia',
                'Frequency': 138
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'Lua',
                'Frequency': 1039
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'Matlab',
                'Frequency': 1569
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'Objective-C',
                'Frequency': 2349
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'Perl',
                'Frequency': 1585
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'PHP',
                'Frequency': 10290
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'Python',
                'Frequency': 11704
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'R',
                'Frequency': 1634
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'Ruby',
                'Frequency': 3324
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'Rust',
                'Frequency': 416
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'Scala',
                'Frequency': 1309
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'Smalltalk',
                'Frequency': 327
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'SQL',
                'Frequency': 18754
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'Swift',
                'Frequency': 2368
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'TypeScript',
                'Frequency': 3488
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'VB.NET',
                'Frequency': 2273
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'VBA',
                'Frequency': 1574
            },
            {
                'Country': 'ALL',
                'HaveWorkedLanguage': 'VisualBasic6',
                'Frequency': 1071
            }
        ]
    };
    */
    
    
    //console.log(data);
    //update(data);

    function update(dataset) {

        let diameter = 600;
        let color = d3.scaleOrdinal(d3.schemeCategory20);

        let bubble = d3.pack(dataset)
            .size([diameter, diameter])
            .padding(1.5);

        let svg = d3.select('#bubble')
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
                //console.log(d);
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
    // d3.select('#bubble-filter').on('change', function() {
    //     // This will be triggered when the user selects or unselects the checkbox
    //     const checked = d3.select(this).property('checked');
    //     if (checked === true) {
    //         // Checkbox was just checked
    //
    //         // Keep only data element whose country is US
    //         const filtered_data = dataset.filter((d) => d.location.country === 'US');
    //
    //         update(filtered_data);  // Update the chart with the filtered data
    //     } else {
    //         // Checkbox was just unchecked
    //         update(data);  // Update the chart with all the data we have
    //     }
    // });
    
    
}
export { bubbleChart };