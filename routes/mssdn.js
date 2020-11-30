var express = require('express')
var bodyParser = require('body-parser');


import { returnAuthenticationResponse } from './helpers/authentication';
import { repeatingRequest } from './helpers/repeatingRequest';

import { updateUserSession } from './helpers/dataCollection';
import { appConfig } from '../config/app.config';


var router = express();

router.use(bodyParser.json());

const db = require('../db');


const format = (response) => {
  console.log('respose :::> ', response);
  return {
    ...response,
    header_type: response.response_type === 1 ? '3' : '' + response.response_type,
  };
};

const requestHandler = async (req, res) => {
  //console.log("process :",process)
  console.log('Called Port:', process.env.PORT);
  if (appConfig.setSessionTimeout) {
    try {
      // let {
      //   sessionid,
      //   telco,
      //   USSDRequest,
      //   msisdn,
      //   USSDType
      // } = req.query;
      // console.log("req body :: ",req.body)

      let { sessionid, input, msisdn } = req.body;

      //let sessionid = transaction_id;
      let USSDRequest = input;
      // let telco = mno;

      //const isNewRequest = USSDType === 'NR';
      let response;
      const session = await db.getCurrentSessionByPhoneNumber(msisdn, appConfig.setSessionTimeout);
      if (session) {
        await db.updateUserSession(session.sessionid, {
          sessionid: sessionid,
        });
        response = await repeatingRequest(sessionid, USSDRequest, msisdn);
      } else {
        response = await returnAuthenticationResponse(msisdn, sessionid);
      }
      if (response.response_type == 1) {
        await db.updateUserSession(sessionid, {
          done: true,
        });
      }
      res.send(format(response));
    } catch (e) {
      response = {
        response_type: 1,
        text: 'Server Error. Please try again.',
      };

      console.log(e.stack);
    }
  } else {
    //try{}
    // const {
    //   sessionid,
    //   telco,
    //   USSDRequest,
    //   msisdn,
    //   USSDType
    // } = req.query;

    // console.log("req body :: ",req.body)

    let { sessionid, input, msisdn } = req.body;

    let USSDRequest = input;
    //console.log('session :: ', sessionid, "req :: " ,USSDRequest,"trans_id :: ", transaction_id);
    let session = await db.getCurrentSession(sessionid);

    //console.log("the sess: ", session)

    const isNewRequest = session? false: true;

    console.log("newReq :: ", isNewRequest)

    let response;
    if (isNewRequest) {
      response = await returnAuthenticationResponse(msisdn, sessionid);
    } else {
      response = await repeatingRequest(sessionid, USSDRequest, msisdn);
    }

    res.send(format(response));
  }
};

const getRequestHandler = async(req, res) => {


  //console.log("process :",process)
  console.log('Called Port:', process.env.PORT);
  if (appConfig.setSessionTimeout) {
    try {
      let {
        sessionid,
        input,
        msisdn
      } = req.query;

      let USSDRequest = input;
      

      //const isNewRequest = USSDType === 'NR';
      let response;
      const session = await db.getCurrentSessionByPhoneNumber(msisdn, appConfig.setSessionTimeout);
      if (session) {
        await db.updateUserSession(session.sessionid, {
          sessionid: sessionid,
        });
        response = await repeatingRequest(sessionid, USSDRequest, msisdn);
      } else {
        response = await returnAuthenticationResponse(msisdn, sessionid);
      }
      if (response.response_type == 1) {
        await db.updateUserSession(sessionid, {
          done: true,
        });
      }
      res.send(format(response));
    } catch (e) {
      response = {
        response_type: 1,
        text: 'Server Error. Please try again.',
      };

      console.log(e.stack);
    }
  } else {
    
    try{
      const {
        sessionid,
        input,
        msisdn,
      } = req.query;
  
      let USSDRequest = input;
  
  
      //console.log('session :: ', sessionid, "req :: " ,USSDRequest,"trans_id :: ", transaction_id);
      let session = await db.getCurrentSession(sessionid);
  
      //console.log("the sess: ", session)
  
      const isNewRequest = session? false: true;
  
      console.log("newReq :: ", isNewRequest)
  
      let response;
      if (isNewRequest) {
        response = await returnAuthenticationResponse(msisdn, sessionid);
      } else {
        response = await repeatingRequest(sessionid, USSDRequest, msisdn);
      }
  
      res.send(format(response));

    }catch(e){}
 
    
  }

}

console.log(requestHandler);

router.post('/', requestHandler);

router.get('/', getRequestHandler);

module.exports = router;
