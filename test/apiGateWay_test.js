'use strict';
const apiGateWap = require('./apiGateWay');

apiGateWap.use(function *(next) {
  console.log('1');
  yield next();
  console.log('5');
});

apiGateWap.use(function *(next) {
  console.log('2');
  yield next();
  console.log('4');
});

apiGateWap.use(function *() {
  console.log('3');
  this.body = 'hello';
});

apiGateWap.wrap()(new Buffer('{}'), {}, function(err, result) {
  console.log(err, result);
});

exports.handler = apiGateWap.wrap();
