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

const format = response => {
  console.log('respose :::> ', response);
  return {
    ...response,
    header_type: response.response_type === 1 ? '3' : '' + response.response_type
  };
};

const requestHandler = async (req, res) => {
  //console.log("process :",process)
  console.log('Called Port:', process.env.PORT);
  if (appConfig.setSessionTimeout){
    try {
      let {
        sessionid,
        telco,
        USSDRequest,
        msisdn,
        USSDType
      } = req.params;

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
      if (response.response_type == 1) {
        await db.updateUserSession(sessionid, {
          done: true
        });
      }
      res.send(format(response));
    } catch (e) {
      response = {
        response_type: 1,
        text: 'Server Error. Please try again.'
      };
      
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
    res.send(format(response));
  }  
};

console.log(requestHandler);

router.post('/', requestHandler);

module.exports = router;