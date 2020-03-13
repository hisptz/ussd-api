const express = require('express');
import { returnAuthenticationResponse } from './helpers/authentication';
import { repeatingRequest } from './helpers/repeatingRequest';
import { sendEGASMS } from '../endpoints/sms';

const db = require('../db');

const router = express.Router();

const format = response => {
  return {
    ...response,
    header_type: response.response_type === 1 ? '3' : '' + response.response_type
  };
};

const requestHandler = async (req, res) => {
  let { sessionid, telco, USSDRequest, input, msisdn, USSDType } = req.query;
  if (USSDRequest && !input) {
    input = USSDRequest;
  }
  //input = USSDRequest;
  const isNewRequest = USSDType === 'NR';

  let response = await repeatingRequest(sessionid, input, msisdn);

  res.send(format(response));
};

router.get('/', requestHandler);

module.exports = router;
