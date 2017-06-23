'use strict';

const axios = require('axios');

const serialize = function(obj, prefix) {
  var str = [];
  var p;
  for (p in obj) {
    var v = obj[p]; // but dont show undefined keys
    if (obj.hasOwnProperty(p) && v != null) {
      var k = prefix ? prefix + '[' + p + ']' : p;
      str.push(
        v !== null && typeof v === 'object'
          ? serialize(v, k)
          : encodeURIComponent(k) + '=' + encodeURIComponent(v)
      );
    }
  }
  return str.join('&');
};

const log = function(info) {
  const str = serialize(info);
  const url = `https://perf.ele.me/_.gif?${str}`;
  return axios(url, {
    headers: {
      'referer': info.ref,
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    }
  });
};

module.exports = function *(next) {
  let success = true;
  const start = new Date();

  try {
    yield next();
  } catch (e) {
    success = false;
    throw e;
  } finally {
    const end = new Date();
    const duration = end - start;
    const req = this.req;
    const context = this.context;
    const ref = `https://serverless.ele.me/${req.path}`;
    const basicInfo = {
      'id': ref,
      'referer': ref,
      'appName': 'serverless',
      'd': {
        'method': req.httpMethod,
        'path': req.path,
        'functionName': context.function.name,
        'success': success,
        'duration': duration
      },
      'time': (new Date()).getTime()
    };
    const countInfo = Object.assign(basicInfo, {
      'type': 'serverless-count'
    });
    const durationInfo = Object.assign(basicInfo, {
      'type': 'serverless-duration'
    });
    log(countInfo);
    log(durationInfo);
  }
};
