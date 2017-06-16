'use strict';
const test = require('ava');
const ApiGateWay = require('../src/apiGateWay');

test.cb('middlewares run right', t => {
  const apiGateWay = new ApiGateWay();
  apiGateWay.use(function *(next) {
    this.result = [];
    this.result.push(1);
    yield next();
    this.result.push(5);
  });

  apiGateWay.use(function *(next) {
    this.result.push(2);
    yield next();
    this.result.push(4);
  });

  apiGateWay.use(function *() {
    this.result.push(3);
  });

  apiGateWay.wrap()(new Buffer('{}'), {}, function(err, result) {
    t.true(result.join('') === '12345');
    t.end();
  });
});

test.cb('raw params in context and return result', t => {
  const apiGateWay = new ApiGateWay();
  apiGateWay.use(function *() {
    this.result = {
      event: this.event.toString(),
      context: this.context
    };
  });

  const event = '123';
  const context = {test: 'test'};
  apiGateWay.wrap()(new Buffer(event), context, function(err, result) {
    t.true(result.event === event);
    t.true(result.context.test === context.test);
    t.end();
  });
});

test.cb('throw error', t => {
  const apiGateWay = new ApiGateWay();
  apiGateWay.use(function *() {
    throw new Error('test');
  });

  apiGateWay.wrap()(new Buffer('{}'), {}, function(err) {
    t.true(err.message === 'test');
    t.end();
  });
});
