import * as d3 from 'd3';
import BubbleChart from './bubbleChart';
import Barchart from './barchart';

// call charts and listen for change events
Barchart.onChange((newValue) => {
    BubbleChart.setCountry(newValue);
    console.log('onChangeBarchart',newValue);
});

BubbleChart.onChange((newValue) => {
    Barchart.setCountry(newValue);
    console.log('onChangeBubblechart',newValue);
});

