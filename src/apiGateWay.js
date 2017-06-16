'use strict';
const co = require('co');

const emptyReq = {
  path: '',
  httpMehtod: '',
  headers: {},
  queryParameters: {},
  pathParameters: {},
  body: {},
  isBase64Encoded: false
};

class ApiGateWay {
  constructor(options) {
    options = options || {}
    this.middlewares = [];
  }

  use(middleware) {
    if (typeof middleware !== 'function') {
      throw newError(500, 'apiGateWap');
    }
    this.middlewares.push(middleware);
  }

  wrap() {
    var middlewares = this.middlewares;
    return function(event, context, callback) {
      event = JSON.parse(event.toString() || JSON.stringify(emptyReq));
      if (event.body && event.isBase64Encoded) {
        event.body = JSON.parse(new Buffer(event.body, 'base64').toString());
      }
      const ctx = context;
      ctx.req = event;
      var res = {
        headers: {},
        statusCode: 200,
        body: {}
      };
      ctx.res = res;
      ctx.body = {};
      ctx.newError = newError;

      co(function *() {
        var index = middlewares.length;
        var prev = function *() {};
        while (index--) {
          prev = middlewares[index].bind(ctx, prev);
        }
        yield prev();
        res.body = ctx.body;
        return callback(null, res);
      }).catch(err => {
        res = Object.assign(res, wrapError(err));
        return callback(null, res);
      });
    };
  }
}

var newError = function(code, message) {
  var err = new Error(message);
  err.code = code;
  return err;
};

var wrapError = function(err) {
  return {
    statusCode: err.code || 500,
    body: {'error': err.message || 'server error'}
  };
};

const apiGateWap = new ApiGateWay();

module.exports = apiGateWap;
