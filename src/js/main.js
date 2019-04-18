// Javascript that is inline. Should be used for anything that needs to be immediate
import jquery from 'jquery';
window.$ = jquery;

import share from './modules/share.js';
import scroll from './modules/scroll.js';
import map from './modules/map.js';
import chart from './modules/chart.js';

share.init();
scroll.init();
map.init();
chart.init();
