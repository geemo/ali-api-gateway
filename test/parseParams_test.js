'use strict';

const test = require('ava');
const apiGateWay = require('../');
const GateWay = apiGateWay.GateWay;
const middlewares = apiGateWay.middlewares;

test.cb('parse params success', t => {
  const apiGateWay = new GateWay();
  apiGateWay.use(middlewares.parseParams);
  apiGateWay.use(function *() {
    this.body = 'test';
    t.true(this.req.test === 'test');
    t.true(this.context.haha === 'haha');
  });
  apiGateWay.wrap()(new Buffer('{"test": "test"}'), {haha: 'haha'}, function(err, res) {
    t.true(res.statusCode === 200);
    t.true(res.body === 'test');
    t.end();
  });
});

test.cb('parse params success', t => {
  const apiGateWay = new GateWay();
  apiGateWay.use(middlewares.parseParams);
  apiGateWay.use(function *() {
    throw this.newError(400, 'error params');
  });
  apiGateWay.wrap()(new Buffer('{}'), {}, function(err, res) {
    t.true(res.statusCode === 400);
    t.true(res.body.error === 'error params');
    t.end();
  });
});
