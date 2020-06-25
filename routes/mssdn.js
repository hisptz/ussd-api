const express = require('express');
import { returnAuthenticationResponse } from './helpers/authentication';
import { repeatingRequest } from './helpers/repeatingRequest';
import { sendEGASMS } from '../endpoints/sms';
import * as _ from 'lodash';

const db = require('../db');

const router = express.Router();

const format = (sessionid, response) => {
  //console.log('respose :::> ', response);
  // return {
  //   ...response,
  //   header_type: response.response_type === 1 ? '3' : '' + response.response_type
  // };

  //different format

  let options = response.options;
  var optionString = '';
  let index = 0;
  _.each(options, option => {
    index++;
    optionString += index + '. ' + option + '\n';
  });
  let resToSend = response.text + '\n' + optionString;

  if (response['noinput']) {
    return `C;${sessionid};${resToSend}`;
  } else {
    return `P;${sessionid};${resToSend}`;
  }
};

const requestHandler = async (req, res) => {
  let { sessionid, telco, USSDRequest, input, msisdn, USSDType } = req.query;
  console.log(sessionid, telco, USSDRequest, input, msisdn, USSDType);
  console.log(req.body);
  console.log('Query:',req.query);
  //res.send(req.body);
  //return;
  if(!msisdn && !sessionid && req.body){
    input = req.body.input;
    msisdn = req.body.msisdn;
    sessionid = req.body.sessionid;
  }
  if (USSDRequest && !input) {
    input = USSDRequest;
  }
  //input = USSDRequest;
  //console.log('req.query:', req.query, input);
  const isNewRequest = USSDType === 'NR';

  //console.log('sessionid ::', sessionid, 'input ::', input, 'msisdn ::', msisdn);
  console.log('To Print:',sessionid, input, msisdn);
  let response = await repeatingRequest(sessionid, input, msisdn);
  console.log(response);

  //console.log('hellooo im here ->', response);
  /*if (isNewRequest) {
    response = await returnAuthenticationResponse(msisdn, sessionid);
  } else {
    response = await repeatingRequest(sessionid, USSDRequest, msisdn);
  }*/

  //res.send(format(sessionid, response));
  res.send(response);
};

router.get('/', requestHandler);
router.post('/', requestHandler);

module.exports = router;
