'use strict';

const test = require('ava');
const ApiGateWay = require('../');

const basicEvent = {
  httpMethod: 'POST',
  path: 'test/test'
};

const basicContext = {
  function: {
    name: 'test'
  }
};

test.cb('parse params success', t => {
  const apiGateWay = new ApiGateWay();
  apiGateWay.use(function *() {
    this.body = 'test';
    t.true(this.req.test === 'test');
    t.true(this.context.haha === 'haha');
  });
  apiGateWay.wrap()(new Buffer(JSON.stringify(Object.assign(basicEvent, {test: 'test'}))), Object.assign(basicContext, {haha: 'haha'}), function(err, res) {
    t.true(res.statusCode === 200);
    t.true(res.body === 'test');
    t.end();
  });
});

test.cb('parse params catch error success', t => {
  const apiGateWay = new ApiGateWay();
  apiGateWay.use(function *() {
    throw this.newError(400, 'error params');
  });
  apiGateWay.wrap()(new Buffer(JSON.stringify(Object.assign(basicEvent, {test: 'test'}))), Object.assign(basicContext, {haha: 'haha'}), function(err, res) {
    t.true(res.statusCode === 400);
    t.true(res.body.error === 'error params');
    t.end();
  });
});
