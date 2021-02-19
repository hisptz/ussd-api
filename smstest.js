import { sendSMS } from './endpoints/sms';

const testSMS = async () => {
  let smsResponse1 = await sendSMS(['0738238564'], 'Message to send');
  let smsResponse2 = await sendSMS(['255738238564'], 'Message to send');

  console.log('response :: ', smsResponse1, ' :: ', smsResponse2, ' :: ');
};

testSMS();
