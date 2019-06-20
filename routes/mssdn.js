const express = require('express');
import {
  returnAuthenticationResponse
} from './helpers/authentication';
import {
  repeatingRequest
} from './helpers/repeatingRequest';

const db = require('../db');

const router = express.Router();

const requestHandler = async (req, res) => {
  const {
    sessionid,
    telco,
    USSDRequest,
    msisdn,
    USSDType
  } = req.query;

  console.log(JSON.stringify({
    sessionid,
    telco,
    USSDRequest,
    msisdn,
    USSDType
  }))

  const isNewRequest = USSDType === 'NR';
  let response;
  if (isNewRequest) {
    response = await returnAuthenticationResponse(msisdn, sessionid);
  } else {
    response = await repeatingRequest(sessionid, USSDRequest);
  }
  res.send(response);
};

router.get('/', requestHandler);

module.exports = router;