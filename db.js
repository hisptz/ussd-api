const environment = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[environment];
const connection = require('knex')(config);

export const getUser = (sessionid, testConn) => {
  const conn = testConn || connection;
  return conn('users')
    .where('sessionid', sessionid)
    .first();
};

export const addUserSession = (data, testConn) => {
  const conn = testConn || connection;
  return conn('sessions').insert(data);
};

export const addSessionDatastore = (data, testConn) => {
  const conn = testConn || connection;
  return conn('datastores').insert(data);
};

export const getSessionDatastore = (sessionid, testConn) => {
  const conn = testConn || connection;
  return conn('datastores')
    .where('sessionid', sessionid)
    .first();
};

export const updateUserSession = (sessionid, data, testConn) => {
  const conn = testConn || connection;
  return conn('sessions')
    .where('sessionid', sessionid)
    .update(data);
};

export const getCurrentSession = (sessionid, testConn) => {
  const conn = testConn || connection;
  return conn('sessions')
    .where('sessionid', sessionid)
    .first();
};

export const getSessionDataValue = (sessionid, testConn) => {
  const conn = testConn || connection;
  return conn('datavalues')
    .where('sessionid', sessionid)
    .first();
};

export const updateSessionDataValues = (sessionid, data, testConn) => {
  const conn = testConn || connection;
  return conn('datavalues')
    .where('sessionid', sessionid)
    .update(data);
};

export const addSessionDatavalues = (data, testConn) => {
  const conn = testConn || connection;
  return conn('datavalues').insert(data);
};

export const getApplicationThisDate = (new_date, key, testConn) => {
  const conn = testConn || connection;
  return conn('application')
    .where({ update_date: new_date, datastore_key: key })
    .first();
};

export const getApplicationById = (id, testConn) => {
  const conn = testConn || connection;
  return conn('application')
    .where('id', '=', id)
    .first();
};

export const getLatestApplicationEntryByKey = (key, testConn) => {
  const conn = testConn || connection;
  return conn('application')
    .where('datastore_key', '=', key)
    .orderBy('id', 'desc')
    .first();
};

export const addApplicationEntry = (data, testConn) => {
  const conn = testConn || connection;
  return conn('application').insert(data);
};

export const addMenu = (data, testConn) => {
  const conn = testConn || connection;
  return conn('menu').insert(data);
};

export const getMenuJson = (menuid, appid, testConn) => {
  const conn = testConn || connection;
  return conn('menu')
    .where({ menu_id: menuid, application_id: appid })
    .first();
};

export const addSyncServer = (data, testConn) => {
  const conn = testConn || connection;
  return conn('sync_server').insert(data);
};
