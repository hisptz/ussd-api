import {
  getUserFromDHIS2
} from '../../endpoints/users';
import {
  getDataStoreFromDHIS2
} from '../../endpoints/dataStore';
import {
  addUserSession
} from '../../db';
const {
  generateCode
} = require('dhis2-uid');

export const returnAuthenticationResponse = async (mssdn, sessionid) => {
  let response;
  const {
    users
  } = await getUserFromDHIS2(mssdn);
  const dataStore = await getDataStoreFromDHIS2();
  const {
    settings,
    menus
  } = dataStore;
  response = `C;${sessionid};${settings.no_user_message}`;
  if (users.length) {
    const starting_menu = menus[settings.starting_menu];
    const name = users[0].displayName;
    const orgUnits = users[0].organisationUnits;
    response = `P;${sessionid};${`Welcome ${name} to Afya Reporting -- Enter PIN`}`;
    if (users.length > 1) {
      response = `C;${sessionid};This phone number is associated with more than one user`;
    } else {
      const id = generateCode();
      const session_data = {
        id,
        name,
        mssdn,
        sessionid,
        orgUnit: orgUnits[0].id,
        currentmenu: starting_menu.id,
        started: new Date(),
        done: false,
        retries: 0
      };
      await addUserSession({
        ...session_data,
        //datastore: JSON.stringify(dataStore)
        datastore: dataStore
      });
    }
  }
  return response;
};