'use strict';
const co = require('co');

class ApiGateWay {
  constructor(options) {
    this.options = options || {};
    this.middlewares = [];
  }

  use(middleware) {
    if (typeof middleware !== 'function') {
      throw new Error('middleware must be function');
    }
    this.middlewares.push(middleware);
  }

  wrap() {
    var middlewares = this.middlewares;
    return function(event, context, callback) {
      const ctx = {
        event: event,
        context: context,
        result: {}
      };
      co(function *() {
        var index = middlewares.length;
        var prev = function *() {};
        while (index--) {
          prev = middlewares[index].bind(ctx, prev);
        }
        yield prev();
        return callback(null, ctx.result);
      }).catch(err => {
        return callback(err, {});
      });
    };
  }
}

module.exports = ApiGateWay;
