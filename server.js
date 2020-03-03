const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mssdnRoutes = require('./routes/mssdn');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();

import { appConfig, getAuthorizationString } from './config/app.config';

const server = express();

// Middleware
server.use(morgan('dev'));
server.use(bodyParser.urlencoded({ extended: true }));

// This allows client applications from other domains use the API Server
server.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Routes

server.use('/' + appConfig.dataStoreId, mssdnRoutes);

module.exports = server;
