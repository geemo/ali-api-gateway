module.exports = function *(next) {
  yield next();
  // todo: change access controller allow origin.
  this.res.headers = Object.assign(this.res.headers, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type,X-Shard',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  });
};
