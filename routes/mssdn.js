const express = require('express');
import { returnAuthenticationResponse } from './helpers/authentication';
import { repeatingRequest } from './helpers/repeatingRequest';
import { sendEGASMS } from '../endpoints/sms';
import { getCurrentSession, getApplicationById, getCurrentSessionByPhoneNumber, getLatestApplicationEntryByKey } from '../db';
import { appConfig } from '../config/app.config';

const db = require('../db');

const router = express.Router();

const format = (sessionid, response) => {
  return {
    ...response,
    header_type: response.response_type === 1 ? '3' : '' + response.response_ty$
  };

  //return `C;${sessionid};${JSON.stringify(response_to_format)}`;
};

const requestHandler = async (req, res) => {
  let { sessionid, telco, USSDRequest, input, msisdn, USSDType } = req.query;
  if (USSDRequest && !input) {
    input = USSDRequest;
  }

  //get application entry and check session determinant
  let session = await getCurrentSession(sessionid);
  let applicationEntry;

  if (!session) {
    applicationEntry = await getLatestApplicationEntryByKey(appConfig.dataStoreId);
    if (applicationEntry.session_timeout_determinant.type == 'MEDIATOR') {
      console.log('mediator');
      //get session by phone#
      session = await getCurrentSessionByPhoneNumber(msisdn, applicationEntry.session_timeout_determinant.timeout);
    } else if (applicationEntry.session_timeout_determinant.type == 'NETWORKPROVIDER') {
      //get session by session id
      //let response = await repeatingRequest(sessionid, input, msisdn);
      //res.send(format(response));
    }
    if (!session) {
      //create session
      console.log('no session entry');
      let response = await returnAuthenticationResponse(msisdn, sessionid, applicationEntry.id);
      //console.log('auth response ::: ', response);
      res.send(format(sessionid, response));
    } else {
      //console.log('there is a session entry');
      let response = await repeatingRequest(sessionid, input, msisdn);
      //console.log(format(sessionid, response));
      res.send(format(sessionid, response));
    }
  } else {
    let response = await repeatingRequest(sessionid, input, msisdn);
    console.log(format(sessionid, response));
    res.send(format(sessionid, response));
  }

  //mediator -> get session by phone number

  //input = USSDRequest;
  /*
  const isNewRequest = USSDType === 'NR';

  let response = await repeatingRequest(sessionid, input, msisdn);

  res.send(format(response));

  */
};

router.get('/', requestHandler);

module.exports = router;
