const express = require('express');
import {
  returnAuthenticationResponse
} from './helpers/authentication';
import {
  repeatingRequest
} from './helpers/repeatingRequest';
import {
  sendEGASMS
} from '../endpoints/sms'

const db = require('../db');

const router = express.Router();

const format = (response) => {

  return {
    ...response,
    header_type: response.response_type === 1?"3":"" + response.response_type
  }
}


const smsSending = async () => {
  let res = await sendEGASMS();
  console.log('res:', res);
};
//smsSending();
const requestHandler = async (req, res) => {
  const {
    sessionid,
    telco,
    input,
    msisdn,
    USSDType
  } = req.query;
  const isNewRequest = USSDType === 'NR';
  let response = await repeatingRequest(sessionid, input, msisdn);
  /*if (isNewRequest) {
    response = await returnAuthenticationResponse(msisdn, sessionid);
  } else {
    response = await repeatingRequest(sessionid, USSDRequest, msisdn);
  }*/
  res.send(format(response));
};

router.get('/', requestHandler);

module.exports = router;