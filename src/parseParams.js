const emptyReq = {
  path: '',
  httpMehtod: '',
  headers: {},
  queryParameters: {},
  pathParameters: {},
  body: {},
  isBase64Encoded: false
};

module.exports = function *(next) {
  const self = this
  const event = JSON.parse(this.event.toString() || JSON.stringify(emptyReq));
  if (event.body && event.isBase64Encoded) {
    event.body = JSON.parse(new Buffer(event.body, 'base64').toString());
  }
  this.req = event;
  this.body = {};
  this.res = {
    headers: {},
    statusCode: 200,
  }

  this.result = co(function * () {
    yield next();
    self.res.body = self.body;
    return self.res;
  }).catch(err => {
    return wrapError(err)
  })
};

var wrapError = function(err) {
  return {
    statusCode: err.code || 500,
    body: {'error': err.message || 'server error'}
  };
};
