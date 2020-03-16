import { getCurrentSessionDataValue } from './dataCollection';
import { getMenusByAppId } from '../../db';
import * as _ from 'lodash';

export const getConfirmationSummarySummary = async (sessionid, appid) => {
  const data_id_short_name_obj = {};
  const summary = [];
  const { dataValues, datatype } = await getCurrentSessionDataValue(sessionid);

  const menus = await getMenusByAppId(appid);

  _.each(menus, menuJson => {
    const { type, data_id, field_short_name } = menuJson;
    if (type && data_id && field_short_name && type === 'data') {
      data_id_short_name_obj[data_id] = field_short_name.trim();
    }
  });

  // Object.keys(menus).map(key => {
  //   const menu = menus[key];
  //   const { type, data_id, field_short_name } = menu;
  //   if (type && data_id && field_short_name && type === 'data') {
  //     data_id_short_name_obj[data_id] = field_short_name.trim();
  //   }
  // });

  dataValues.map(dataValue => {
    const { dataElement, categoryOptionCombo, value } = dataValue;
    const data_id = datatype === 'aggregate' ? `${dataElement}.${categoryOptionCombo}`.trim() : `${dataElement}`;
    const shorn_name = data_id_short_name_obj[data_id];
    if (data_id && shorn_name) {
      summary.push(`${shorn_name}:${value}`);
    }
  });
  return summary.join(`\n`);
};
