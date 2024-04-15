const express = require('express');
const apiNetwork = require('../components/network');
const rootRouter = require('./constants');

const routes = (server) => {
    server.use(rootRouter.v1, apiNetwork);
  };

module.exports = routes