import {
  getUnsynced,
  getSessionDataValue,
  getSyncServerById,
  updateSync,
  getUnsentSms,
  updateSms,
  getUnsyncedBySession,
  getCurrentSession,
  getMenuJson
} from './db';
import { updateEventData, postEventData } from './endpoints/eventData';
import { postAggregateData } from './endpoints/dataValueSets';
import { sendSMS } from './endpoints/sms';
import { complete } from './endpoints/dataSet';

const http_status = ['OK', 'SUCCESS'];
const startSync = async () => {
  while (true) {
    //process data syncs
    await sync();

    //process feedback
    await feedback();
  }
};

const sync = async () => {
  //get all unsynced entries
  const unsyncedEntries = await getUnsynced();
  console.log('all entries ::: ', unsyncedEntries);
  //loop through the unsynced entries
  let unsyncedEntry;

  for (unsyncedEntry of unsyncedEntries) {
    //get session + its data values
    let dataValues = await getSessionDataValue(unsyncedEntry.session_id);
    let serverDetails = await getSyncServerById(unsyncedEntry.syncserver_id);

    if (dataValues.datatype === 'event') {
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
              retries: unsyncedEntry.retries + 1
            },
            unsyncedEntry.id
          );
        } else {
          await updateSync({ retries: unsyncedEntry.retries + 1 }, unsyncedEntry.id);
        }
      } else {
        //send event data
        let response;

        try {
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
              retries: unsyncedEntry.retries + 1
            },
            unsyncedEntry.id
          );
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
        dataValues: dataValues.dataValues
      };
      try {
        console.log('data values ::: ', payload);
        response = await postAggregateData(payload, serverDetails);
        console.log('post aggregate response :::', response);
      } catch (error) {
        console.log(error);
      }

      if (response && response.status && http_status.includes(response.status)) {
        //complete dataset

        const datavalues = await getSessionDataValue(unsyncedEntry.session_id);

        const complete_form = await complete(datavalues.data_set, datavalues.year + '' + datavalues.period, session.orgUnit);
        console.log('form complete response :: ', complete_form);
        //update sync boolean to true

        if (complete_form && complete_form.status && complete_form.includes(response.status)) {
          await updateSync(
            {
              syncserver_id: unsyncedEntry.syncserver_id,
              session_id: unsyncedEntry.session_id,
              synced: true,
              retries: unsyncedEntry.retries + 1
            },
            unsyncedEntry.id
          );
        } else {
        }
      } else {
        await updateSync({ retries: unsyncedEntry.retries + 1 }, unsyncedEntry.id);
      }
    } else {
    }
  }
};

const feedback = async () => {
  const unsent_sms = await getUnsentSms();

  let sms;

  for (sms of unsent_sms) {
    //check if all syncs for the sessionid are synced
    const unsynced_for_this_session = await getUnsyncedBySession(sms.session_id);
    console.log('unsynced entries ::: ', unsynced_for_this_session.length);

    if (unsynced_for_this_session.length == 0) {
      let response;
      try {
        response = await sendSMS(sms.phone_numbers, sms.text);
        console.log('sms send response', response);
      } catch (e) {}

      if (response && response.statusMessage && response.statusMessage == 'Success') {
        //update the sms entry

        await updateSms({ status: 'SENT' }, sms.sms_id);
      }
    }
  }
};

//syncs entry point
startSync();
