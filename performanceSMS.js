const r2 = require('r2');
import { appConfig, getAuthorizationString } from './config/app.config';
import { sendSMS } from './endpoints/sms';
const legendSet = {
  created: '2018-10-15T05:15:47.506',
  lastUpdated: '2018-10-15T05:19:31.722',
  name: 'Legend 2',
  href: 'http://154.118.230.229/api/legendSets/pAtZWUyG6mw',
  id: 'pAtZWUyG6mw',
  displayName: 'Legend 2',
  publicAccess: 'rw------',
  externalAccess: false,
  favorite: false,
  lastUpdatedBy: { id: 'M5zQapPyTZI' },
  access: { read: true, update: true, externalize: true, delete: true, write: true, manage: true },
  user: { id: 'M5zQapPyTZI' },
  favorites: [],
  userGroupAccesses: [],
  attributeValues: [],
  legends: [
    {
      lastUpdated: '2018-10-15T05:19:31.723',
      id: 'BRGJJBdawSe',
      created: '2018-10-15T05:19:31.723',
      name: '0 - 20',
      endValue: 20.0,
      color: '#1a9641',
      displayName: '0 - 20',
      externalAccess: false,
      startValue: 0.0,
      favorite: false,
      access: { read: true, update: true, externalize: true, delete: true, write: true, manage: true },
      favorites: [],
      translations: [],
      userGroupAccesses: [],
      attributeValues: [],
      userAccesses: [],
    },
    {
      lastUpdated: '2018-10-15T05:19:31.723',
      id: 'VnDKBTKGizy',
      created: '2018-10-15T05:19:31.723',
      name: '20 - 40',
      endValue: 40.0,
      color: '#a6d96a',
      displayName: '20 - 40',
      externalAccess: false,
      startValue: 20.0,
      favorite: false,
      access: { read: true, update: true, externalize: true, delete: true, write: true, manage: true },
      favorites: [],
      translations: [],
      userGroupAccesses: [],
      attributeValues: [],
      userAccesses: [],
    },
    {
      lastUpdated: '2018-10-15T05:19:31.724',
      id: 'yFvwGue43EQ',
      created: '2018-10-15T05:19:31.724',
      name: '80-101',
      endValue: 101.0,
      color: '#fdae61',
      displayName: '80-101',
      externalAccess: false,
      startValue: 80.0,
      favorite: false,
      access: { read: true, update: true, externalize: true, delete: true, write: true, manage: true },
      favorites: [],
      translations: [],
      userGroupAccesses: [],
      attributeValues: [],
      userAccesses: [],
    },
    {
      lastUpdated: '2018-10-15T05:19:31.723',
      id: 'C0m3Tnw9rDu',
      created: '2018-10-15T05:19:31.723',
      name: '40 - 80',
      endValue: 80.0,
      color: '#ffffbf',
      displayName: '40 - 80',
      externalAccess: false,
      startValue: 40.0,
      favorite: false,
      access: { read: true, update: true, externalize: true, delete: true, write: true, manage: true },
      favorites: [],
      translations: [],
      userGroupAccesses: [],
      attributeValues: [],
      userAccesses: [],
    },
    {
      lastUpdated: '2018-10-15T05:19:31.724',
      id: 'z7yljE98jsl',
      created: '2018-10-15T05:19:31.724',
      name: '101+',
      endValue: 100000.0,
      color: '#d7191c',
      displayName: '101+',
      externalAccess: false,
      startValue: 101.0,
      favorite: false,
      access: { read: true, update: true, externalize: true, delete: true, write: true, manage: true },
      favorites: [],
      translations: [],
      userGroupAccesses: [],
      attributeValues: [],
      userAccesses: [],
    },
  ],
  translations: [],
  userAccesses: [],
};
arrayToObject;
const indicators = [
  'H9KUB8rcui9',
  //"WAcctgdT8lc",
  'orCL6SVj4Ia',
  'ZbAecP9kMrx',
  'tWTENPrPRQJ',
  'tjIEQUUM2Ti',
  //"lReUCP20Cz2"
];
const configurations = require('./sms-config').configurations;
const baseUrl = appConfig.url;

const Authorization = getAuthorizationString(appConfig.username, appConfig.password);

function getLegend() {
  const url = `${baseUrl}/api/legendSets.json?fields=legends[id,startValue,endValue,color]`;
  return r2.get(url, {
    headers: {
      Authorization,
    },
  }).json;
}
function getOrganisationUnits(page = 1) {
  const url = `${baseUrl}/api/29/organisationUnits.json?page=${page}&order=name:asc&filter=organisationUnitGroups.id:eq:QWHGAtRYcr0&filter=organisationUnitGroups.id:eq:v2yuaIqu4tZ&rootJunction=OR&fields=id,name,code,phoneNumber,attributeValues`;
  //const url = `${baseUrl}/api/29/organisationUnits.json?page=${page}&filter=id:eq:EjxCAxGdiZ8&fields=id,name,phoneNumber,attributeValues`;
  console.log('Org Unit:', url);
  return r2.get(url, {
    headers: {
      Authorization,
    },
  }).json;
}
function getPeriod() {
  let year = new Date().getFullYear().toString();
  let month = new Date().getMonth();
  let monthStr;
  if (month === 0) {
    monthStr = '12';
  } else if (month < 10) {
    monthStr = '0' + month;
  } else {
    monthStr = '' + month;
  }
  return year + monthStr;
}
function getAnalytics(ou) {
  const url = `${baseUrl}/api/analytics?dimension=dx:${indicators.join(';')}&dimension=pe:${getPeriod()}&dimension=ou:${ou.join(
    ';'
  )}&displayProperty=NAME&hierarchyMeta=true`;
  console.log('Url:', url);
  return r2.get(url, {
    headers: {
      Authorization,
    },
  }).json;
}
var sentSMS;
async function getSentSMS() {
  const url = `${baseUrl}/api/dataStore/performance_sms_sent/${getPeriod()}`;
  try {
    let results = await r2.get(url, {
      headers: {
        Authorization,
      },
    }).json;
    if (results.httpStatusCode === 404) {
      sentSMS = {};
    } else {
      sentSMS = { ...results };
    }
  } catch (e) {
    console.error(e.code);
    throw e;
  }
}
async function saveSentSMS() {
  const url = `${baseUrl}/api/dataStore/performance_sms_sent/${getPeriod()}`;
  try {
    let results = await r2.put(url, {
      headers: {
        Authorization,
      },
      json: sentSMS,
    }).json;
    if (results.httpStatusCode === 404) {
      try {
        results = await r2.post(url, {
          headers: {
            Authorization,
          },
          json: sentSMS,
        }).json;
      } catch (e) {
        console.error(e.code);
        throw e;
      }
    }
  } catch (e) {
    console.error(e.code);
    throw e;
  }
}
const arrayToObject = (array) =>
  array.reduce((obj, item) => {
    obj[item.id] = item;
    return obj;
  }, {});
const legend = {};
async function start() {
  try {
    let legendSetsResults = await getLegend();
    legendSetsResults.legendSets.forEach((legendSet) => {
      legendSet.legends.forEach((leg) => {
        legend[leg.id] = leg;
      });
    });
    await load(1);
  } catch (e) {
    await sendSMS(['0657142395'], 'Network error fetching legends.');
    console.error(e.code);
    throw e;
  }
}
var typesSent = {
  performance: 0,
  reminders: 0,
  noPhoneNumbers: 0,
  failed: 0,
};
async function load(page) {
  console.log('Started Page:', page);
  const ouResults = await getOrganisationUnits(page);
  //ouResults.organisationUnits = ouResults.organisationUnits.filter((ou) => ou.id === "PLLbHn8QAbN")
  const ouMapping = {};
  const initialIndicatorValues = {};
  indicators.forEach((indicator) => {
    initialIndicatorValues[indicator] = 'blank';
  });
  const data = await getAnalytics(
    ouResults.organisationUnits.map((ou) => {
      ouMapping[ou.id] = {
        details: ou,
        indicators: {
          ...initialIndicatorValues,
        },
      };
      return ou.id;
    })
  );
  const period = data.metaData.items[data.metaData.dimensions.pe[0]].name;
  await getSentSMS();
  data.rows.forEach((row) => {
    ouMapping[row[2]].indicators[row[0]] = row[3];
  });
  for (let ou of ouResults.organisationUnits) {
    if (sentSMS[ou.id] && sentSMS[ou.id].done) {
      continue;
    }
    let message = '';
    Object.keys(ouMapping[ou.id].indicators).some((key) => {
      if (ouMapping[ou.id].indicators[key] === 'blank') {
        message = `{orgUnit.name} {orgUnit.code}, unakumbushwa kutuma taarifa mwezi {period}. Tafadhali tuma ripoti hiyo kwa manufaa ya wizara ya afya. Asante.`;
      }
    });
    if (message === '') {
      configurations.forEach((conf) => {
        let conditionMmap = {};
        Object.keys(ouMapping[ou.id].indicators).some((key) => {
          conditionMmap[key] = false;
          conf.conditions.forEach((condition) => {
            if (
              !conf.otherConditions[key] &&
              legend[condition].startValue <= parseFloat(ouMapping[ou.id].indicators[key]) &&
              legend[condition].endValue >= parseFloat(ouMapping[ou.id].indicators[key])
            ) {
              conditionMmap[key] = true;
            }
          });
          if (conf.otherConditions[key]) {
            conf.otherConditions[key].forEach((con) => {
              if (con.length === 11) {
                if (
                  legend[con].startValue <= parseFloat(ouMapping[ou.id].indicators[key]) &&
                  legend[con].endValue >= parseFloat(ouMapping[ou.id].indicators[key])
                ) {
                  conditionMmap[key] = true;
                }
              } else {
                try {
                  if (eval(con.split('{' + key + '}').join(ouMapping[ou.id].indicators[key]))) {
                    conditionMmap[key] = true;
                  }
                } catch (e) {}
              }
            });
          }
        });
        let satisfiesCondition = true;
        Object.keys(conf.otherConditions).forEach((key) => {
          if (!conditionMmap[key]) {
            satisfiesCondition = false;
          }
        });
        if (satisfiesCondition) {
          message = conf.message;
        }
      });
    }
    message = message.split('{period}').join(period);
    message = message.split('{orgUnit.name}').join(ou.name);
    message = message.split('{orgUnit.code}').join(ou.code);
    if (message !== '' && message.indexOf('Ndugu mtoa dawa, hujatuma ripoti ya mwezi') === -1) {
      var arr = [];
      Object.keys(ouMapping[ou.id].indicators).forEach((key) => {
        arr.push({
          id: key,
          indicator: data.metaData.items[key].name,
          value: ouMapping[ou.id].indicators[key],
        });
      });
      let phoneNumbers = [];
      if (ou.phoneNumber && ou.phoneNumber !== '') {
        phoneNumbers.push(ou.phoneNumber);
      }
      let foundInAttribute = false;
      ou.attributeValues.forEach((attributeValue) => {
        if (
          attributeValue.attribute.id === 'NgmZX27k7gf' &&
          attributeValue.value !== '' &&
          phoneNumbers.indexOf(attributeValue.value) === -1 &&
          !foundInAttribute
        ) {
          foundInAttribute = false;
          phoneNumbers.push(attributeValue.value);
        }
      });
      if (phoneNumbers.length > 0) {
        try {
          //await sendSMS(phoneNumbers, message);
          console.log(phoneNumbers, message);
          if (!sentSMS[ou.id]) {
            sentSMS[ou.id] = {};
          }
          if (message.indexOf('Tafadhali tuma ripoti hiyo kwa manufaa ya wizara ya afya') === -1) {
            sentSMS[ou.id].done = true;
            typesSent.performance++;
          } else {
            typesSent.reminders++;
          }
        } catch (e) {
          typesSent.failed++;
          console.log('SMS Error:', e);
        }
      } else {
        typesSent.noPhoneNumbers++;
      }
    } else {
      console.log('No Data');
    }
  }
  await saveSentSMS();
  //process.exit(0);
  if (ouResults.pager.page !== ouResults.pager.pageCount) {
    await load(page + 1);
  } else {
    //await sendSMS(['0657142395', '0713238387', '0754710020'], `Performance, reminders and educational SMS have been Successful sent addos`);
    console.log('Done sending reminders and sms.');
    console.table(typesSent);
  }
}
start();
//sendSMS(["0713311946","0757847423"],"Amani DLDM 0407131, unakumbushwa kutuma taarifa mwezi February 2020. Tafadhali tuma ripoti hiyo kwa manufaa ya wizara ya afya. Asante.")
