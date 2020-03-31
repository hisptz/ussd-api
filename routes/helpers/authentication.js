import { getUserFromDHIS2 } from '../../endpoints/users';
import { getDataStoreFromDHIS2 } from '../../endpoints/dataStore';
import { addUserSession } from '../../db';
const { generateCode } = require('dhis2-uid');

export const returnAuthenticationResponse = async (mssdin, sessionid, appid) => {
  let response;
  const { users } = await getUserFromDHIS2(mssdin);

  console.log('users ::: ', users);

  //console.log('users ::: > ', users);
  const dataStore = await getDataStoreFromDHIS2();
  const { settings, menus } = dataStore;
  response = {
    response_type: 1,
    text: settings.no_user_message
  };
  if (users.length) {
    const starting_menu = menus[settings.starting_menu];
    const name = users[0].displayName;
    const orgUnits = users[0].organisationUnits;
    response = {
      response_type: 2,
      text: `Welcome ${name} to Afya Reporting -- Enter PIN`
    };
    if (users.length > 1) {
      response = {
        response_type: 1,
        text: `This phone number is associated with more than one user`
      };
    } else {
      const id = generateCode();
      const session_data = {
        id,
        name,
        sessionid,
        orgUnit: orgUnits[0].id,
        currentmenu: starting_menu.id,
        retries: 0,
        msisdn: mssdin,
        started: new Date(),
        done: false
      };
      await addUserSession({
        ...session_data,
        //datastore: JSON.stringify(dataStore)
        application_id: appid
      });
    }
  }
  return response;
};
