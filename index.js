'use strict';
const GateWay = require('./src/gate-way.js');
const getSSOInfo = require('./src/get-sso-info.js');
const parseParams = require('./src/parse-params.js');
const allowedCrossOrigin = require('./src/allowed-cross-origin.js');

const middlewares = {
  getSSOInfo,
  parseParams,
  allowedCrossOrigin
};

module.exports = {
  GateWay,
  middlewares
};
