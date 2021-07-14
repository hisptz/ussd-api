const r2 = require('r2');
import { appConfig, getAuthorizationString } from '../config/app.config';

export const getDataSet = (id) => {
  const baseUrl = appConfig.url;
  const url = `${baseUrl}/api/dataSets/${id}.json?fields=dataSetElements[dataElement[id,shortName,name],categoryCombo[categoryOptionCombos[id,shortName]]],dataEntryForm[id,displayName,htmlCode]`;
  const Authorization = getAuthorizationString(appConfig.username, appConfig.password);

  return r2.get(url, {
    headers: {
      Authorization,
    },
  }).json;
};

export const complete = (dataSet, period, orgUnit) => {
  const baseUrl = appConfig.url;
  const url = `${baseUrl}/api/completeDataSetRegistrations`;
  const Authorization = getAuthorizationString(appConfig.username, appConfig.password);

  return r2.post(url, {
    headers: {
      Authorization,
    },
    json: {
      completeDataSetRegistrations: [
        {
          dataSet: dataSet,
          period: period,
          organisationUnit: orgUnit,
        },
      ],
    },
  }).json;
};

export const getDataSetOutliers = (dataSetId, periodId, orgUnit) => {
  const baseUrl = appConfig.url;
  const url = `${baseUrl}/dhis-web-dataentry/getDataValues.action?periodId=${periodId}&dataSetId=${dataSetId}&organisationUnitId=${orgUnit}&multiOrganisationUnit=false`;
  const Authorization = getAuthorizationString(appConfig.username, appConfig.password);

  return r2.get(url, {
    headers: {
      Authorization,
    },
  }).json;
};

export const getDataSetValidationRules = (dataSet) => {
  const baseUrl = appConfig.url;
  const url = `${baseUrl}/api/validationRules.json?paging=false&dataSet=${dataSet}&fields=id,name,operator,leftSide,rightSide`;
  const Authorization = getAuthorizationString(appConfig.username, appConfig.password);

  return r2.get(url, {
    headers: {
      Authorization,
    },
  }).json;
};

export const validationRulesEval = (ruleId, periodId, orgUnitId) => {
  const baseUrl = appConfig.url;
  const url = `${baseUrl}/api/dataAnalysis/validationRulesExpression.json?validationRuleId=${ruleId}&periodId=${periodId}&organisationUnitId=${orgUnitId}&fields=*`;
  const Authorization = getAuthorizationString(appConfig.username, appConfig.password);

  return r2.get(url, {
    headers: {
      Authorization,
    },
  }).json;
}
