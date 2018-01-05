import BubbleChart from './bubbleChart';
import Barchart from './barChart';
import ParallelSet from './parallel';


// call charts and listen for change events
ParallelSet.onChange((newValue) => {
    console.log('onChangeParallelSet',newValue);
});

Barchart.onChange((newValue) => {
    BubbleChart.setCountry(newValue);
    console.log('onChangeBarchart',newValue);
});

BubbleChart.onChange((newValue) => {
    Barchart.setCountry(newValue);
    console.log('onChangeBubblechart',newValue);
});