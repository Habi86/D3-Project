import BubbleChart from './bubbleChart';
import Barchart from './barchart';
import ParallelSet from './parallel';


// call charts and listen for change events
Barchart.onChange((newValue) => {
    BubbleChart.setCountry(newValue);
    console.log('onChangeBarchart',newValue);
});

BubbleChart.onChange((newValue) => {
    Barchart.setCountry(newValue);
    console.log('onChangeBubblechart',newValue);
});

ParallelSet.onChange((newValue) => {
    console.log('onChangeParallelSet',newValue);
});

