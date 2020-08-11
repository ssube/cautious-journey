// mocha loader for es6 modules
const { jsdom } = require('./mocha-preload');

require('../out/test');
console.log('tests loaded');
