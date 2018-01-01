import * as d3 from 'd3';
import * as _ from 'underscore';
import { bubbleChart, onChangeBubbleChart } from './bubbleChart';
import { barChart } from './barchart';

// call charts
bubbleChart();
barChart();

onChangeBubbleChart( (newValue) => console.log('onChange',newValue) );

