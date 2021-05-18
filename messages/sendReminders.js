const axios = require('axios');
import { sendSMS } from '../endpoints/sms';

import { appConfig } from '../config/app.config';
sendSMS(['0754710020', '0657142395'], 'Reminder And Educational messages going out');
const monthName = new Date(`${new Date().getUTCFullYear() + '-' + new Date().getMonth() + '-' + 10}`).toLocaleString('default', {
  month: 'long',
  year: 'numeric',
});
const month = new Date().getUTCMonth().toString();
const period = new Date().getUTCFullYear() + (month.length === 1 ? '0' + month : month);
const authLink = `http://${appConfig.username}:${appConfig.password}@${appConfig.stripped}/api/`;
const valuesUrl = `${authLink}dataValueSets.json?dataSet=t6N3L1IElxb&period=${period}&orgUnit=`;
const orgsUrl = `${authLink}organisationUnits.json?filter=level:eq:6&paging=false&fields=id,name,code,phoneNumber,attributeValues,parent[name,leve,parent[name,level,parent[name,level]]]`;
(async () => {
  try {
    let ous = (
      await axios.get(orgsUrl, {
        auth: { username: appConfig.username, password: appConfig.password },
      })
    ).data.organisationUnits;
    getDataValues({ ous });
  } catch (e) {
    console.log(e);
  }
})();

async function getDataValues({ ous }) {
  for (const addo of ous) {
    let dispenser = (addo.attributeValues[0] ? addo.attributeValues[0].value.split('/') : []).map((value) => value.replace(/ +/g, ''));
    dispenser = dispenser.length > 0 ? [...dispenser] : [];
    const phoneNumbers = [addo.phoneNumber ? addo.phoneNumber.replace(/ +/g, '') : 0, ...dispenser]
      .filter((phone) => phone.length > 9)
      .map((phones) => phones.split('+255').join('0'))
      .filter((phone) => phone);
    try {
      if (phoneNumbers.length > 0) {
        const dataValues = (
          await axios.get(valuesUrl + addo.id, {
            auth: { username: appConfig.username, password: appConfig.password },
          })
        ).data;
        sendMessages({ addo, dataValues, phoneNumbers });
      }
    } catch (e) {
      console.log(e);
    }
  }
}

const sendMessages = ({ addo, dataValues, phoneNumbers }) => {
  if (dataValues.dataValues && dataValues.dataValues.length > 0) {
    let message = `Mradi wa Afya ya Uzazi: ${addo.name} , yenye namba ya kurepoti ${addo.code}. Unakumbushwa kwamba dawa za uzazi wa mpango zinapatikana katika maeneo uliyopo/ili kuweza kujua zinapatikana wapi, tafadhali wasiliana na mfamasia wa Halmashauri ya ${addo.parent.parent.parent.name}`;
    sendSMS(phoneNumbers, message);

    message = `Mradi wa Afya ya Uzazi: ${addo.name} , yenye namba ya kurepoti ${addo.code}. Unakumbushwa kuendelea kutumia miongozo iliyoainishwa na wizara ya afya kutoa rufaa kwa mteja anayehitaji huduma ya ziada ya uzazi wa mpango kuelekea kwenye kituo cha kutolea huduma za afya  ya uzazi kilichopo karibu na mteja.`;
    sendSMS(phoneNumbers, message);

    message = `Mradi wa Afya ya Uzazi: ${addo.name} , yenye namba ya kurepoti ${addo.code}. Unakumbushwa kuendelea kutoa elimu ya matumizi sahihi ya kondomu kwa wateja kwenye huduma za uzazi wa mpango na kujikinga na ukimwi`;
    sendSMS(phoneNumbers, message);

    message = `Mradi wa Afya ya Uzazi: ${addo.name} , yenye namba ya kurepoti ${addo.code}. Unakumbushwa kutoa rufuaa kuhusu upatikanaji wa huduma ya afya ya uzazi kwa vijana katika vituo vya kutolea huduma rafiki kwa vijana vilivyopo karibu nao`;
    sendSMS(phoneNumbers, message);
  }
  if (!dataValues.dataValues || dataValues.dataValues.length === 0) {
    const message = `${addo.name} | ${addo.code}, unakumbushwa kutuma taarifa mwezi ${monthName}. Tafadhali tuma ripoti hiyo kwa manufaa ya wizara ya afya. Asante.`;
    sendSMS(phoneNumbers, message);
  }
};
