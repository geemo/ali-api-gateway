const req = {
  'body': '',
  'headers': {
    'X-Ca-Api-Gateway': 'CEA8A060-69CF-49AB-AC16-B7F4F1A15FB8',
    'X-Forwarded-For': '140.205.144.235'
  },
  'httpMethod': 'GET',
  'isBase64Encoded': false,
  'path': '/test',
  'pathParameters': {},
  'queryParameters': {}
};
const context = {
  'requestId': 'CEA8A060-69CF-49AB-AC16-B7F4F1A15FB8',
  'credentials': {
    'accessKeyId': '',
    'accessKeySecret': '',
    'securityToken': ''
  },
  'function': {
    'name': 'world',
    'handler': 'test.handler',
    'memory': 128,
    'timeout': 30
  }
};

const success = Math.random() >= 0.5;
const duration = 300;

const coutInfo = {
  'id': 'https://serverless.ele.me',
  'appName': 'serverless',
  'type': 'serverless-count',
  'd': {
    'method': req.httpMethod,
    'path': req.path,
    'functionName': context.function.name,
    'success': success,
    'duration': duration
  },
  'time': (new Date()).getTime()
};

const durationInfo = {
  'id': 'https://serverless.ele.me',
  'appName': 'serverless',
  'type': 'serverless-duration',
  'd': {
    'method': req.httpMethod,
    'path': req.path,
    'functionName': context.function.name,
    'success': success,
    'duration': duration
  },
  'time': (new Date()).getTime()
};

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
      'referer': 'https://serverless.ele.me',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    }
  });
};
const run = function() {
  log(coutInfo).then(res => console.log(res.status)).catch(err => console.log('err', err));
  log(durationInfo).then(res =>console.log(res.status)).catch(err => console.log('err', err));
  setTimeout(run, 10);
};

run();
