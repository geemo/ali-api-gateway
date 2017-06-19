'use strict';

var axios = require('axios');

const getUserInfo = function(cookies) {
  return axios('https://httpizza.ele.me/common/coffee/user', {
    headers: {
      'Cookie': cookies
    },
    timeout: 1000
  }).then(res => res.data);
};

module.exports = function *(next) {
  const cookies = this.req.headers.Cookie;
  if (!cookies) {
    throw this.newError(400, 'lack of cookies to get sso info');
  }

  this.SSOUserInfo = yield getUserInfo(cookies);
  return next();
};
