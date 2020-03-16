import { getUnsynced, getSessionDataValue, getSyncServerById } from './db';

const startSync = async () => {
  //process data syncs
  await sync();

  //process feedback
  await feedback();
};

const sync = async () => {
  //get all unsynced entries
  const unsyncedEntries = await getUnsynced();

  //loop through the unsynced entries
  let unsyncedEntry;
  for (unsyncedEntry of unsyncedEntries) {
    //get session + its data values
    //TODO: make sure any last minute data changes on data submit scripts are persisted
    let dataValues = await getSessionDataValue(unsyncedEntry.session_id);
    let serverDetails = await getSyncServerById(unsyncedEntry.syncserver_id);

    if (dataValues.datatype === 'event') {
      //send or update event data
    } else if (dataValues.datatype === 'aggregate') {
      //send or update aggregate data
    } else {
    }

    //try sms sending
  }
};

const feedback = async () => {};

//syncs entry point
startSync();
