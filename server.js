const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mssdnRoutes = require('./routes/mssdn');
const morgan = require('morgan');
const dotenv = require('dotenv');
const fs = require('fs');
const r2 = require('r2');
import { sendSMS } from './endpoints/sms';
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
  var results = await sendSMS(phoneNumbers.split(','),text);
  if(results.error){
    res.status(500);
    res.send(results);
    fs.writeFileSync('sms-error.log',`${JSON.stringify(req.query)}:${JSON.stringify(results)}`);
  }else{
    res.send(results);
  }
});

server.use('/dhisProxy', async (req, res) => {
  const baseUrl = appConfig.url;
  const url = `${baseUrl}${req.url.split('/dhisProxy').join('')}`;
  const Authorization = getAuthorizationString(appConfig.username, appConfig.password);
  console.log(url);
  if(req.method == 'GET'){
    res.send(await r2.get(url, {
      headers: {
          Authorization
      },
  }).json);
  }else if(req.method == 'POST'){
    res.send(await r2.post(url, {
      headers: {
          Authorization
      },
  }).json);
  }
  
    return;
});

module.exports = server;
