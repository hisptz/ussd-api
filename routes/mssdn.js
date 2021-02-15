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
  console.log('Called Port:', process.env.PORT);

  console.log(1)
  if (appConfig.setSessionTimeout){
    console.log(2)
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
        console.log(3)
        await db.updateUserSession(session.sessionid, {
          sessionid: sessionid
        });
        response = await repeatingRequest(sessionid, USSDRequest, msisdn);
      } else {
        console.log(4)
        console.log("kule")
        response = await returnAuthenticationResponse(msisdn, sessionid);
      }
      if (response.indexOf('C;') > -1) {
        console.log(5)
        await db.updateUserSession(sessionid, {
          done: true
        });
      }
      res.send(response);
    } catch (e) {
      console.log(6)
      res.send('C;${sessionid};Server Error. Please try again.');
      console.log(e.stack);

    }
  }else{
    console.log(7)
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
      console.log(8)
      console.log("huku")

      response = await returnAuthenticationResponse(msisdn, sessionid);
      console.log("resp :: ", response)
    } else {
      console.log(9)
      response = await repeatingRequest(sessionid, USSDRequest, msisdn);
    }

    console.log(10)
    res.send(response);
  }  
};

router.get('/', requestHandler);

module.exports = router;