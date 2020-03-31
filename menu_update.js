import { appConfig, getAuthorizationString } from './config/app.config';
import { getApplicationThisDate, addApplicationEntry, addMenu, addSyncServer } from './db';

const fetch = require('make-fetch-happen').defaults({
  cacheManager: '../' // path where cache will be written (and read)
});

const baseUrl = appConfig.url;
const Authorization = getAuthorizationString(appConfig.username, appConfig.password);

export const getMenuMetaData = async key => {
  let data;
  const url = `${baseUrl}/api/dataStore/ussd/${key}/metaData`;

  const response = await fetch(url, {
    headers: {
      Authorization
    },
    size: 0,
    timeout: 0
  });
  // parsing
  data = await response.json();

  return data;
};

export const shouldUpdate = async (new_menu_date, menus_key) => {
  let application_entry_later_date = await getApplicationThisDate(new_menu_date, menus_key);

  return application_entry_later_date;
};

export const updateMenuForKey = async key => {
  //make a call to get menu metaData to get update
  try {
    let metadata = await getMenuMetaData(key);

    //check date on application table & compare with metadata update date to determine whether to update the menu
    let applicationMenu = await shouldUpdate(metadata.lastUpdated, metadata.key);

    if (applicationMenu === undefined) {
      let data = {};
      let menuData = JSON.parse(metadata.value);

      data['name'] = menuData.settings.name;
      data['update_date'] = metadata.lastUpdated;
      data['description'] = menuData.settings.description;
      data['session_key'] = menuData.settings.session_key;
      data['user_response'] = menuData.settings.user_response;
      data['datastore_key'] = metadata.key;
      data['key'] = menuData.settings['request_type'].key;
      data['first_request'] = menuData.settings['request_type'].first_request;
      data['continue_request'] = menuData.settings['request_type'].Continue_request;
      data['terminated_by_provider'] = menuData.settings['request_type'].terminated_by_provider;
      data['timed_out'] = menuData.settings['request_type'].timed_out;
      data['phone_number_key'] = menuData.settings.phone_number_key;
      data['no_user_message'] = menuData.settings.no_user_message;
      data['auth_based_on'] = menuData.settings.auth_based_on ? menuData.settings.auth_based_on : '';
      data['session_timeout_determinant'] = menuData.settings.session_timeout_determinant
        ? JSON.stringify(menuData.settings.session_timeout_determinant)
        : '{}';
      data['starting_menu'] = menuData.settings.starting_menu;
      data['sync_servers'] = JSON.stringify(menuData.settings.sync_servers);

      await addApplicationEntry(data);

      //get application data for future application_id use
      let application = await getApplicationThisDate(data.update_date, metadata.key);

      //loop add sync servers
      let sync_server;

      for (sync_server of menuData.settings.sync_servers) {
        let sync_server_data = {};

        sync_server_data['url'] = sync_server.url;
        sync_server_data['username'] = sync_server.username;
        sync_server_data['password'] = sync_server.password;
        sync_server_data['application_id'] = application.id;
        sync_server_data['admin_email'] = sync_server.email;
        //add individual sync serve

        await addSyncServer(sync_server_data);

        console.log('added server :::', sync_server.url);
      }

      // loop through menus and app them to table menus
      let menuid;
      for (menuid of Object.keys(menuData['menus'])) {
        let menuDetails = {};

        menuDetails['menu_id'] = menuid;
        menuDetails['title'] = menuData.menus[menuid].title ? menuData.menus[menuid].title : '';
        menuDetails['type'] = menuData.menus[menuid].type ? menuData.menus[menuid].type : '';
        menuDetails['options'] = menuData.menus[menuid].options ? JSON.stringify(menuData.menus[menuid].options) : '';
        menuDetails['previous_menu'] = menuData.menus[menuid].previous_menu ? menuData.menus[menuid].previous_menu : '';
        menuDetails['data_id'] = menuData.menus[menuid].data_id ? menuData.menus[menuid].data_id : '';
        menuDetails['next_menu'] = menuData.menus[menuid].next_menu ? menuData.menus[menuid].next_menu : '';
        menuDetails['application_id'] = application.id;
        menuDetails['data_type'] = menuData.menus[menuid].dataType ? menuData.menus[menuid].dataType : '';
        menuDetails['data_name'] = menuData.menus[menuid].data_name ? menuData.menus[menuid].data_name : '';
        menuDetails['auth_key'] = menuData.menus[menuid].auth_key ? menuData.menus[menuid].auth_key : '';
        menuDetails['fail_message'] = menuData.menus[menuid].fail_message ? menuData.menus[menuid].fail_message : '';
        menuDetails['retry_message'] = menuData.menus[menuid].retry_message ? menuData.menus[menuid].retry_message : '';
        menuDetails['number_of_retries'] = menuData.menus[menuid].number_of_retries ? menuData.menus[menuid].number_of_retries : '';
        menuDetails['submission_message'] = menuData.menus[menuid].submission_message ? menuData.menus[menuid].submission_message : '';
        menuDetails['submit_data'] = menuData.menus[menuid].submit_data ? menuData.menus[menuid].submit_data : false;
        menuDetails['p_rules'] = menuData.menus[menuid].pRules ? JSON.stringify(menuData.menus[menuid].pRules) : '';
        menuDetails['period_type'] = menuData.menus[menuid].period_type ? menuData.menus[menuid].period_type : '';
        menuDetails['maximum_value'] = menuData.menus[menuid].maximum_value ? menuData.menus[menuid].maximum_value : null;
        menuDetails['use_for_year'] = menuData.menus[menuid].use_for_year ? menuData.menus[menuid].use_for_year : false;
        menuDetails['years_back'] = menuData.menus[menuid].years_back ? menuData.menus[menuid].years_back : '';
        menuDetails['field_value_type'] = menuData.menus[menuid].field_value_type ? menuData.menus[menuid].field_value_type : '';
        menuDetails['field_short_name'] = menuData.menus[menuid].field_short_name ? menuData.menus[menuid].field_short_name : '';
        menuDetails['data_element'] = menuData.menus[menuid].data_element ? menuData.menus[menuid].data_element : '';
        menuDetails['category_combo'] = menuData.menus[menuid].category_combo ? menuData.menus[menuid].category_combo : '';
        menuDetails['data_set'] = menuData.menus[menuid].dataSet ? menuData.menus[menuid].dataSet : '';
        menuDetails['program'] = menuData.menus[menuid].program ? menuData.menus[menuid].program : '';
        menuDetails['program_stage'] = menuData.menus[menuid].program_stage ? menuData.menus[menuid].program_stage : '';
        menuDetails['mode'] = menuData.menus[menuid].mode ? menuData.menus[menuid].mode : null;

        await addMenu(menuDetails);

        console.log('added menu ::', menuid);
      }
    }
  } catch (e) {}
};

export const getDataStoreKeys = async () => {
  let data;
  const url = `${baseUrl}/api/dataStore/ussd`;

  const response = await fetch(url, {
    headers: {
      Authorization
    },
    size: 0,
    timeout: 0
  });
  // parsing
  data = await response.json();

  return data;
};

const updateMenusForAllKeys = async () => {
  console.log(' ************* STARTED MENU UPDATE SCRIPT *****************');

  const datastore_keys = await getDataStoreKeys();

  //console.log(datastore_keys);

  let datastore_key;
  for (datastore_key of datastore_keys) {
    await updateMenuForKey(datastore_key);
  }
  setTimeout(() => {
    updateMenusForAllKeys();
  }, appConfig.application_update_interval);
};

//Script's starting point
updateMenusForAllKeys();
