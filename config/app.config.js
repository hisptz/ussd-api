export const appConfig = {
    url: "https://play.dhis2.org/2.28",
    username: "admin",
    password: "district"
}

export function getAuthorizationString(username, password) {
    const authorizationValue = Buffer.from(`${username}:${password}`).toString('base64')
    return `Basic ${authorizationValue}`
}