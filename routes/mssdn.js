const express = require('express');
import {
  returnAuthenticationResponse
} from './helpers/authentication';
import {
  repeatingRequest
} from './helpers/repeatingRequest';

import {
  updateUserSession
} from './helpers/dataCollection';

const db = require('../db');

const router = express.Router();

const requestHandler = async (req, res) => {
  console.log(req.query);
  let {
    sessionid,
    telco,
    USSDRequest,
    msisdn,
    USSDType
  } = req.query;
  //const isNewRequest = USSDType === 'NR';
  let response;
  const session = await db.getCurrentSessionByPhoneNumber(msisdn,2);
  if (session){
    sessionid = session.sessionid;
    response = await repeatingRequest(sessionid, USSDRequest, msisdn);
  } else {
    response = await returnAuthenticationResponse(msisdn, sessionid);
  }
  if (response.indexOf('C;') > -1){
    await db.updateUserSession(sessionid, {
      done: true
    });
  }
  res.send(response);
};

router.get('/', requestHandler);

module.exports = router;