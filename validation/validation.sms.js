const async = require('async');
const https = require('http');
const r2 = require('r2');
import { appConfig, getAuthorizationString } from '../config/app.config';
import { sendSMS } from '../endpoints/sms';
(async () => {
  let count = 0;

  var monthName = new Date(`${new Date().getUTCFullYear() + '-' + new Date().getMonth() + '-' + 10}`).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });
  const month = new Date().getUTCMonth().toString();
  const period = new Date().getUTCFullYear() + (month.length === 1 ? '0' + month : month);
  const authLink = `http://${appConfig.username}:${appConfig.password}@${appConfig.stripped}/api/`;
  const baseUrl = appConfig.url;
  const Authorization = getAuthorizationString(appConfig.username, appConfig.password);
  /*
   *
   * Generate MinMax
   *
   */
  const json = { organisationUnit: 'Tanzani2018', dataSets: ['t6N3L1IElxb'] };
  const rus = await r2.post(`${baseUrl}/api/minMaxValues`, {
    headers: {
      Authorization,
    },
    json,
  }).response;
  let page = 0;
  page++;
  console.log('FETCHING DATA FOR PAGE::', page);
  const orgsUrl = `${authLink}organisationUnits.json?filter=level:eq:6&paging=false&fields=id,name,code,phoneNumber,attributeValues`;
  console.log('orgsUrl', orgsUrl);
  const validation = `http://${appConfig.username}:${appConfig.password}@${appConfig.stripped}/dhis-web-dataentry/getDataValues.action?periodId=${period}&dataSetId=t6N3L1IElxb`;
  https
    .get(orgsUrl, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () => {
        const responseData = JSON.parse(data);
        const response = responseData.organisationUnits.filter(
          (addo) =>
            (addo.phoneNumber !== undefined &&
              addo.phoneNumber !== null &&
              addo.phoneNumber !== 'null' &&
              addo.phoneNumber !== '0' &&
              addo.phoneNumber !== '00') ||
            ((addo.attributeValues ? addo.attributeValues.length > 0 : null) &&
              (addo.attributeValues[0] ? addo.attributeValues[0].value !== undefined : null) !== null &&
              (addo.attributeValues[0] ? addo.attributeValues[0].value !== null : null) !== null &&
              (addo.attributeValues[0] ? addo.attributeValues[0].value !== 'null' : null) !== null &&
              (addo.attributeValues[0] ? addo.attributeValues[0].value !== '0' : null) !== null &&
              (addo.attributeValues[0] ? addo.attributeValues[0].value !== '00' : null) !== null)
        );
        async.mapLimit(
          response,
          1,
          (addos, callback) => {
            getValidationRules(addos, (err, res) => {
              callback(err, res);
            });
          },
          (err, res) => {
            console.log('THE END', err);
          }
        );
      });
    })
    .on('error', (err) => {
      console.log(`Error: ${err.message}`);
    });

  const getValidationRules = (addo, callback) => {
    const ECPData = 'NzrqpsbTiSU-HllvX50cXC0';
    const OCPData = 'Hdxa2izxMUa-HllvX50cXC0';
    const condomData = 'wWEUiLC6336-HllvX50cXC0';
    https
      .get(`${validation}&organisationUnitId=${addo.id}&multiOrganisationUnit=false&_=1619696549844`, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });
        resp.on('end', () => {
          const minMaxData = JSON.parse(data);
          if (minMaxData.dataValues.length > 0 && minMaxData.minMaxDataElements.length > 0) {
            computeValidation(minMaxData);
          }
        });
      })
      .on('error', (err) => {
        console.error(`Errors: ${err}`);
      });
    const computeValidation = (minMaxData) => {
      if (count === 0) {
        const phoneNumbers = ['0754710020'];
        let message = `${addo.name} | ${addo.code} Hongera kwa kutuma taarifa za mwezi ${monthName}. Takwimu zako zinaonesha idadi ya ECP zilizotolewa dukani kwako ni kubwa ukilinganisha na wastani kwa miezi 6 iliyopita.`;
        sendSMS(phoneNumbers, message);
        message = `${addo.name} | ${addo.code} Hongera kwa kutuma taarifa za mwezi ${monthName}. Takwimu zako zinaonesha idadi ya ECP zilizotolewa dukani kwako ni ndogo ukilinganisha na wastani kwa miezi 6 iliyopita.`;
        sendSMS(phoneNumbers, message);
        message = `${addo.name} | ${addo.code} Hongera kwa kutuma taarifa za mwezi ${period}. Takwimu zako zinaonesha idadi ya pakiti za kondomu zilizotolewa dukani kwako ni kubwa ukilinganisha na wastani kwa miezi 6 iliyopita.Huduma rafiki kwa vijana zinapatikana.`;
        sendSMS(phoneNumbers, message);
      }
      count++;
      let dispenser = (addo.attributeValues[0] ? addo.attributeValues[0].value.split('/') : []).map((value) => value.replace(/ +/g, ''));
      dispenser = dispenser.length > 0 ? [...dispenser] : [];
      const phoneNumbers = [addo.phoneNumber ? addo.phoneNumber.replace(/ +/g, '') : 0, ...dispenser]
        .filter((phone) => phone.length > 9)
        .map((phones) => phones.split('+255').join('0'));
      minMaxData.dataValues.forEach((value) => {
        const { val } = value;
        const values = minMaxData.minMaxDataElements.filter((rules) => rules.id === value.id);
        if (values[0] !== undefined) {
          const minMaxECP = values.filter((valuesFiltered) => valuesFiltered.id === ECPData);
          if (minMaxECP.length > 0) {
            const { max, min } = minMaxECP[0];
            const parsedValue = parseFloat(val);
            const parsedMin = parseFloat(min);
            const parsedMax = parseFloat(max);
            if (parsedValue > parsedMax) {
              const message = `${addo.name} | ${addo.code} Hongera kwa kutuma taarifa za mwezi ${monthName}. Takwimu zako zinaonesha idadi ya ECP zilizotolewa dukani kwako ni kubwa ukilinganisha na wastani kwa miezi 6 iliyopita.`;
              sendSMS(phoneNumbers, message);
            }
            if (parsedValue < parsedMin) {
              const message = `${addo.name} | ${addo.code} Hongera kwa kutuma taarifa za mwezi ${monthName}. Takwimu zako zinaonesha idadi ya ECP zilizotolewa dukani kwako ni ndogo ukilinganisha na wastani kwa miezi 6 iliyopita.`;
              sendSMS(phoneNumbers, message);
            }
          }
          const minMaxOCP = values.filter((valuesFiltered) => valuesFiltered.id === OCPData);
          if (minMaxOCP.length > 0) {
            const { max, min } = minMaxOCP[0];
            const parsedValue = parseFloat(val);
            const parsedMin = parseFloat(min);
            const parsedMax = parseFloat(max);
            if (parsedValue > parsedMax) {
              const message = `${addo.name} | ${addo.code} Hongera kwa kutuma taarifa za mwezi ${monthName}. Takwimu zako zinaonesha idadi ya OCP zilizotolewa dukani kwako ni kubwa ukilinganisha na wastani kwa miezi 6 iliyopita.`;
              sendSMS(phoneNumbers, message);
            }
            if (parsedValue < parsedMin) {
              const message = `${addo.name} | ${addo.code} Hongera kwa kutuma taarifa za mwezi ${monthName}. Takwimu zako zinaonesha idadi ya OCP zilizotolewa dukani kwako ni ndogo ukilinganisha na wastani kwa miezi 6 iliyopita.`;
              sendSMS(phoneNumbers, message);
            }
          }
          const minMaxCondom = values.filter((valuesFiltered) => valuesFiltered.id === condomData);
          if (minMaxCondom.length > 0) {
            const { max, min } = minMaxCondom[0];
            const parsedValue = parseFloat(val);
            const parsedMin = parseFloat(min);
            const parsedMax = parseFloat(max);
            if (parsedValue > parsedMax) {
              const message = `${addo.name} | ${addo.code} Hongera kwa kutuma taarifa za mwezi ${period}. Takwimu zako zinaonesha idadi ya pakiti za kondomu zilizotolewa dukani kwako ni kubwa ukilinganisha na wastani kwa miezi 6 iliyopita.Huduma rafiki kwa vijana zinapatikana.`;
              sendSMS(phoneNumbers, message);
            }
            if (parsedValue < parsedMin) {
              const message = `${addo.name} | ${addo.code} Hongera kwa kutuma taarifa za mwezi ${period}. Takwimu zako zinaonesha idadi ya pakiti za kondomu zilizotolewa dukani kwako ni ndogo ukilinganisha na wastani kwa miezi 6 iliyopita.Huduma rafiki kwa vijana zinapatikana.`;
              sendSMS(phoneNumbers, message);
            }
          }
        }
      });
    };

    callback(null, null);
  };
})();
