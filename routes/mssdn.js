const express = require('express');
import { returnAuthenticationResponse } from './helpers/authentication';
import { repeatingRequest } from './helpers/repeatingRequest';
import { sendEGASMS } from '../endpoints/sms';

const db = require('../db');

const router = express.Router();

const format = response => {
  //console.log('respose :::> ', response);
  return {
    ...response,
    header_type: response.response_type === 1 ? '3' : '' + response.response_type
  };
};

const requestHandler = async (req, res) => {
  let { sessionid, telco, USSDRequest, input, msisdn, USSDType } = req.query;
  if(USSDRequest && !input){
    input = USSDRequest;
  }
  //input = USSDRequest;
  //console.log('req.query:', req.query, input);
  const isNewRequest = USSDType === 'NR';

  // console.log('sessionid ::', sessionid, 'input ::', input, 'msisdn ::', msisdn);
  let response = await repeatingRequest(sessionid, input, msisdn);

  //console.log('hellooo im here ->', response);
  /*if (isNewRequest) {
    response = await returnAuthenticationResponse(msisdn, sessionid);
  } else {
    response = await repeatingRequest(sessionid, USSDRequest, msisdn);
  }*/

  res.send(format(response));
};

router.get('/', requestHandler);

module.exports = router;
