export const appConfig = {
    url: "http://41.217.202.50/dhis",
    username: "admin",
    password: "district"
}

export function getAuthorizationString(username, password) {
    const authorizationValue = Buffer.from(`${username}:${password}`).toString('base64')
    return `Basic ${authorizationValue}`
}