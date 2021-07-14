import { type } from 'os';

const environment = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[environment];
const connection = require('knex')(config);

export const getUser = (sessionid, testConn) => {
  const conn = testConn || connection;
  return conn('users').where('sessionid', sessionid).first();
};

export const addUserSession = (data, testConn) => {
  const conn = testConn || connection;
  return conn('sessions').insert(data);
};

export const addOulier = (data, testConn) => {
  const conn = testConn || connection;
  return conn('dataset_outliers').insert(data);
};

export const getOutlierByDatasetPeriodAndOu = (dataSet, ou, pe, testConn) => {
  const conn = testConn || connection;

  return conn('dataset_outliers').where('dataset', dataSet).andWhere('period', pe).andWhere('orgUnit', ou).first();
};

export const updateOutlier = (dataSet, ou, pe, data, testConn) => {
  const conn = testConn || connection;
  return conn('dataset_outliers')
  .where('dataset', dataSet)
  .andWhere('period', pe)
  .andWhere('orgUnit', ou)
  .update(data);
};

export const getCurrentSessionByPhoneNumber = (msisdn, sessionTimeout, testConn) => {
  const conn = testConn || connection;
  return conn('sessions')
    .where('msisdn', msisdn)
    .andWhere('done', false)
    .andWhere(conn.raw("started + (? * interval '1 minute') > now()", sessionTimeout))
    .first();
};

export const addSessionDatastore = (data, testConn) => {
  const conn = testConn || connection;
  return conn('datastores').insert(data);
};

export const getSessionDatastore = (sessionid, testConn) => {
  const conn = testConn || connection;
  return conn('datastores').where('sessionid', sessionid).first();
};

export const updateUserSession = (sessionid, data, testConn) => {
  const conn = testConn || connection;
  return conn('sessions').where('sessionid', sessionid).update(data);
};

export const getCurrentSession = (sessionid, testConn) => {
  const conn = testConn || connection;
  return conn('sessions').where('sessionid', sessionid).first();
};

export const getSessionDataValue = (sessionid, testConn) => {
  const conn = testConn || connection;
  return conn('datavalues').where('sessionid', sessionid).first();
};

export const updateSessionDataValues = (sessionid, data, testConn) => {
  const conn = testConn || connection;
  return conn('datavalues').where('sessionid', sessionid).update(data);
};

export const addSessionDatavalues = (data, testConn) => {
  const conn = testConn || connection;
  return conn('datavalues').insert(data);
};

export const getApplicationThisDate = (new_date, key, testConn) => {
  const conn = testConn || connection;
  return conn('application').where({ update_date: new_date, datastore_key: key }).first();
};

export const getApplicationById = (id, testConn) => {
  const conn = testConn || connection;
  return conn('application').where('id', '=', id).first();
};

export const getLatestApplicationEntryByKey = (key, testConn) => {
  const conn = testConn || connection;
  return conn('application').where('datastore_key', '=', key).orderBy('id', 'desc').first();
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
  return conn('menu').where({ menu_id: menuid, application_id: appid }).first();
};

export const getMenusByAppId = (appid, testConn) => {
  const conn = testConn || connection;
  return conn('menu').where('application_id', appid);
};

export const addSyncServer = (data, testConn) => {
  const conn = testConn || connection;
  return conn('sync_server').insert(data);
};

export const getSyncServerByAppId = (id, testConn) => {
  const conn = testConn || connection;
  return conn('sync_server').where('application_id', id);
};

export const getSyncServerById = (server_id, testConn) => {
  const conn = testConn || connection;
  return conn('sync_server').where('id', server_id).first();
};

export const addSync = (data, testConn) => {
  const conn = testConn || connection;
  return conn('sync').insert(data);
};

export const updateSync = (data, id, testConn) => {
  const conn = testConn || connection;
  return conn('sync').where('id', id).update(data);
};

export const getUnsynced = (testConn) => {
  const conn = testConn || connection;
  return conn('sync').where('synced', false);
};

export const getUnsyncedBySession = (sessionid, testConn) => {
  const conn = testConn || connection;
  return conn('sync').where({ synced: false, session_id: sessionid });
};

export const addSms = (data, testConn) => {
  const conn = testConn || connection;
  return conn('sms').insert(data);
};

export const getUnsentSms = (testConn) => {
  const conn = testConn || connection;
  return conn('sms').where('status', 'QUEUED');
};

export const updateSms = (data, id, testConn) => {
  const conn = testConn || connection;
  return conn('sms').where('sms_id', id).update(data);
};
