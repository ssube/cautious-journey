require('jsdom-global')();

const sourceMapSupport = require('source-map-support');
sourceMapSupport.install({
  environment: 'node',
  handleUncaughtExceptions: true,
  hookRequire: true,
});

const chai = require('chai');
const chaiPromise = require('chai-as-promised');
const chaiSinon = require('sinon-chai');

chai.use(chaiPromise);
chai.use(chaiSinon);

window.URL.createObjectURL = function () { };
