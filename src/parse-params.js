'use strict';
const co = require('co');

var newError = function(code, message) {
  var err = new Error(message);
  err.code = code;
  return err;
};

module.exports = function *(next) {
  const self = this;
  const event = JSON.parse(this.event.toString());
  if (event.body && event.isBase64Encoded) {
    event.body = JSON.parse(new Buffer(event.body, 'base64').toString());
  }

  if (!event.body) event.body = {};
  this.newError = newError;
  this.req = event;
  this.body = {};
  this.res = {
    headers: {},
    statusCode: 200
  };

  this.result = yield co(function *() {
    yield next();
    self.res.body = self.body;
    return self.res;
  }).catch(err => {
    return wrapError(err);
  });
};

var wrapError = function(err) {
  return {
    statusCode: err.code || 500,
    body: {'error': err.message || 'server error'}
  };
};
