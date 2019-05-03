// Javascript that is inline. Should be used for anything that needs to be immediate
import jquery from 'jquery';
window.$ = jquery;

import share from './modules/share.js';
import map from './modules/map.js';
import chart from './modules/chart.js';
import scroll from './modules/scroll.js';

map.init();
chart.init();
share.init();
scroll.init();
