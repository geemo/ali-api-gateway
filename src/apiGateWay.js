'use strict';
const co = require('co');

var newError = function(code, message) {
  var err = new Error(message);
  err.code = code;
  return err;
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
      const ctx = {
        newError: newError,
        event: event,
        context: context,
        result: {}
      }
      co(function *() {
        var index = middlewares.length;
        var prev = function *() {};
        while (index--) {
          prev = middlewares[index].bind(ctx, prev);
        }
        yield prev();
        return callback(null, ctx.result);
      }).catch(err => {
        return callback(null, err);
      });
    };
  }
}

module.exports = ApiGateWay;
