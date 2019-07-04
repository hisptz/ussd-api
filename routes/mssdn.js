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
  const isNewRequest = USSDType === 'NR';
  let response = await repeatingRequest(sessionid, USSDRequest, msisdn);
  /*if (isNewRequest) {
    response = await returnAuthenticationResponse(msisdn, sessionid);
  } else {
    response = await repeatingRequest(sessionid, USSDRequest, msisdn);
  }*/
  res.send(response);
};

router.get('/', requestHandler);

module.exports = router;