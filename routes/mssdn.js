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
import {
  appConfig
} from '../config/app.config';

const db = require('../db');

const router = express.Router();

const requestHandler = async (req, res) => {

  if (appConfig.setSessionTimeout){
    try {
      let {
        sessionid,
        telco,
        USSDRequest,
        msisdn,
        USSDType
      } = req.query;
      //const isNewRequest = USSDType === 'NR';
      let response;
      const session = await db.getCurrentSessionByPhoneNumber(msisdn, appConfig.setSessionTimeout);
      if (session) {
        await db.updateUserSession(session.sessionid, {
          sessionid: sessionid
        });
        response = await repeatingRequest(sessionid, USSDRequest, msisdn);
      } else {
        response = await returnAuthenticationResponse(msisdn, sessionid);
      }
      if (response.indexOf('C;') > -1) {
        await db.updateUserSession(sessionid, {
          done: true
        });
      }
      res.send(response);
    } catch (e) {
      res.send('C;${sessionid};Server Error. Please try again.');
      console.log(e.stack);

    }
  }else{
    const {
      sessionid,
      telco,
      USSDRequest,
      msisdn,
      USSDType
    } = req.query;

    const isNewRequest = USSDType === 'NR';
    let response;
    if (isNewRequest) {
      response = await returnAuthenticationResponse(msisdn, sessionid);
    } else {
      response = await repeatingRequest(sessionid, USSDRequest, msisdn);
    }
    res.send(response);
  }  
};

router.get('/', requestHandler);

module.exports = router;