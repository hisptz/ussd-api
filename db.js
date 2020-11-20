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
export const getCurrentSessionByPhoneNumber = (mssdn, sessionTimeout, testConn) => {
    const conn = testConn || connection;
    return conn('sessions')
        .where('mssdn', mssdn).andWhere('done', false).andWhere(conn.raw("started + (? * interval '1 minute') > now()", sessionTimeout))
        .first();
};
export const getCurrentSession = (sessionid, testConn) => {
    const conn = testConn || connection;
    let y = conn('sessions')
        .where('sessionid', sessionid)
        .first();

        console.log("the res :: ",y)
        return y;
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
