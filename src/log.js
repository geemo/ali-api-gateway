'use strict';

const axios = require('axios');
const querystring = require('querystring');

const log = function(info) {
  const str = querystring.stringify(info);
  const url = `https://perf.ele.me/_.gif?${str}`;
  return axios(url);
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
    const basicInfo = {
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
