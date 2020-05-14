const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mssdnRoutes = require('./routes/mssdn');
const morgan = require('morgan');
const dotenv = require('dotenv');
import { sendSMS } from './endpoints/sms';
dotenv.config();

import { appConfig } from './config/app.config';

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
server.use('/sms', async (req, res) => {
  console.log('Send SMS');
  let { phoneNumbers,text } = req.query;
  if(!phoneNumbers){
    res.send({
      status:'ERROR',
      message:'No Phone number set',
    });
    return;
  }
  if(!text){
    res.send({
      status:'ERROR',
      message:'No text message set',
    });
    return;
  }

  res.send(await sendSMS(phoneNumbers.split(','),text));
});

module.exports = server;
