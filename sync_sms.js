import {
  getUnsynced,
  getSessionDataValue,
  getSyncServerById,
  updateSync,
  getUnsentSms,
  updateSms,
  getUnsyncedBySession,
  getCurrentSession,
  getMenuJson,
} from './db';
import { updateEventData, postEventData } from './endpoints/eventData';
import { postTrackerData } from './endpoints/trackerData';
import { postAggregateData } from './endpoints/dataValueSets';
import { sendSMS } from './endpoints/sms';
import { complete } from './endpoints/dataSet';
import { appConfig } from './config/app.config';

const nodemailer = require('nodemailer');
const http_status = ['OK', 'SUCCESS'];

const startSync = async () => {
  console.log('************************ SYNC & FEEDBACK STARTED ********************');

  while (true) {
    //process data syncs
    await sync();

    //process feedback
    await feedback();
  }
};

const sync = async () => {

  // console.log("nimeitwa")
  //get all unsynced entries
  const unsyncedEntries = await getUnsynced();
  //loop through the unsynced entries
   console.log("unsynced entries :: ",unsyncedEntries);

  let unsyncedEntry;
  for (unsyncedEntry of unsyncedEntries) {
    //get session + its data values

    // console.log("unsynceed entry :: ",unsyncedEntry)
    let dataValues = await getSessionDataValue(unsyncedEntry.session_id);
    let serverDetails = await getSyncServerById(unsyncedEntry.syncserver_id);
    let session = await getCurrentSession(unsyncedEntry.session_id);

    console.log('data valies :: ', dataValues);
    console.log('server details :: ', serverDetails);

    //check if session related to sync was done
    if (session.done) {
      if (unsyncedEntry.retries <= 4) {
        console.log('unsynced entry :: ', unsyncedEntry);
        //do the sync
        if (dataValues.datatype === 'event') {
          // console.log('event ?????');
          if (dataValues.event) {
            //update the event
            let response;
            try {
              response = await updateEventData(dataValues.dataValues, dataValues.event, serverDetails);
            } catch (error) {
              console.log(error);
            }
            if (response && response.httpStatus && http_status.includes(response.httpStatus)) {
              //update sync boolean to true
              await updateSync(
                {
                  syncserver_id: unsyncedEntry.syncserver_id,
                  session_id: unsyncedEntry.session_id,
                  synced: true,
                  retries: unsyncedEntry.retries + 1,
                },
                unsyncedEntry.id
              );

              console.log('synced entry :::', unsyncedEntry.id);
            } else {
              await updateSync({ retries: unsyncedEntry.retries + 1 }, unsyncedEntry.id);
            }
          } else {
            //send event data
            let response;

            try {
              console.log('data to send :: ', JSON.stringify(dataValues.dataValues, null, 4));
              response = await postEventData(dataValues.dataValues, serverDetails);
              console.log('response ::: ', response);
            } catch (e) {
              console.log('error', e);
            }
            if (response && response.httpStatus && http_status.includes(response.httpStatus)) {
              //update sync boolean to true
              await updateSync(
                {
                  syncserver_id: unsyncedEntry.syncserver_id,
                  session_id: unsyncedEntry.session_id,
                  synced: true,
                  retries: unsyncedEntry.retries + 1,
                },
                unsyncedEntry.id
              );

              console.log('synced entry :::', unsyncedEntry.id);
            } else {
              await updateSync({ retries: unsyncedEntry.retries + 1 }, unsyncedEntry.id);
            }
          }
        } else if (dataValues.datatype === 'aggregate') {
          //send or update aggregate data
          let response;
          const session = await getCurrentSession(unsyncedEntry.session_id);

          const payload = {
            period: dataValues.year + '' + dataValues.period,
            orgUnit: session.orgUnit,
            dataValues: dataValues.dataValues,
          };
          try {
            //console.log('data values ::: ', payload);
            response = await postAggregateData(payload, serverDetails);
            //console.log('post aggregate response :::', response);
          } catch (error) {
            console.log(error);
          }

          if (response && response.status && http_status.includes(response.status)) {
            //complete dataset

            //const datavalues = await getSessionDataValue(unsyncedEntry.session_id);

            //const complete_form = await complete(datavalues.data_set, datavalues.year + '' + datavalues.period, session.orgUnit);
            //console.log('form complete response :: ', complete_form);
            //update sync boolean to true

            //if (complete_form && complete_form.status && http_status.includes(complete_form.status)) {
            await updateSync(
              {
                syncserver_id: unsyncedEntry.syncserver_id,
                session_id: unsyncedEntry.session_id,
                synced: true,
                retries: unsyncedEntry.retries + 1,
              },
              unsyncedEntry.id
            );

            console.log('synced entry :::', unsyncedEntry.id);
            //} else {
            //}
          } else {
            await updateSync({ retries: unsyncedEntry.retries + 1 }, unsyncedEntry.id);
          }
        } else if (dataValues.datatype === 'tracker') {
          // console.log('tracker ?????');
          //post the event
          let response;
          // try {
            response = await postTrackerData(dataValues.dataValues, serverDetails);

            console.log("response from posttrackereeeee :: ", response)
          // } catch (error) {
            // console.log(error);
          // }

          console.log('responce form post tracker :::', JSON.stringify(response.response.importSummaries, null, 4));
          if (response && response.httpStatus && http_status.includes(response.httpStatus)) {
            //update sync boolean to true
            await updateSync(
              {
                syncserver_id: unsyncedEntry.syncserver_id,
                session_id: unsyncedEntry.session_id,
                synced: true,
                retries: unsyncedEntry.retries + 1,
              },
              unsyncedEntry.id
            );

            console.log('synced entry :::', unsyncedEntry.id);
          } else {
            await updateSync(
              {
                syncserver_id: unsyncedEntry.syncserver_id,
                session_id: unsyncedEntry.session_id,
                synced: false,
                retries: unsyncedEntry.retries + 1
              },
              unsyncedEntry.id
            );

          }
        } else {
        }
      } else {
        //send email to server admin

        if (!unsyncedEntry.notified) {
          const mail_options = {
            from: appConfig.mail.auth.user,
            to: serverDetails.admin_email,
            subject: 'Sync failed',
            text: 'Could not sync data for session : ' + unsyncedEntry.session_id + ' to server: ' + serverDetails.url + '<br/>',
          };

          const transporter = nodemailer.createTransport(appConfig.mail);

          let mail_response;
          try {
            mail_response = await transporter.sendMail(mail_options);
          } catch (e) {
            // console.log('error from mail send ::: ', e);
          }

          if (mail_response) {
            //email sent
            await updateSync({ ...unsyncedEntry, notified: true }, unsyncedEntry.id);
          }
        }
      }
    }
  }
};

const feedback = async () => {
  const unsent_sms = await getUnsentSms();

  let sms;

  for (sms of unsent_sms) {
    //check if all syncs for the sessionid are synced
    const unsynced_for_this_session = await getUnsyncedBySession(sms.session_id);
    //console.log('unsynced entries ::: ', unsynced_for_this_session.length);

    if (unsynced_for_this_session.length == 0) {
      let response;
      try {
        response = await sendSMS(sms.phone_numbers, sms.text);
      } catch (e) {}

      if (response && response.statusMessage && response.statusMessage == 'Success') {
        //update the sms entry

        console.log('sms sent response ::::', response);
        await updateSms({ status: 'SENT' }, sms.sms_id);
      }
    }
  }
};

//syncs entry point
startSync();
