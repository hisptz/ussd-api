export const appConfig = {
    url: "http://172.18.0.1:8080",
    username: "ussd",//"ussd_api"
    password: "DHIS2013",//Pass@USSD1234",
    otherServers: [
        {
            url: 'https://dhis.moh.go.tz',
            username: "ussd",
            password: "DHIS2013"
        }
    ],
    dataStoreId: "idsr",
}

export function getAuthorizationString(username, password) {
    const authorizationValue = Buffer.from(`${username}:${password}`).toString('base64')
    return `Basic ${authorizationValue}`
}