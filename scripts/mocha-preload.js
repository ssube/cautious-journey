export const jsdom = require('jsdom-global')();
const sourceMapSupport = require('source-map-support');

sourceMapSupport.install({
  environment: 'node',
  handleUncaughtExceptions: true,
  hookRequire: true,
});

window.URL.createObjectURL = function () { };
