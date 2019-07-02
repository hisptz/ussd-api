# USSD-API

PUSSD-API project with:

- Express
- Knex
- SQLite3
- Express Handlebars
- body-parser
- Jest
- nodemon
- Babel
- r2

## Requirement

- [NodeJS v8.11.1+](https://nodejs.org)
- [Npm v5.6.0+](https://www.npmjs.com/)

## Getting Started

```sh
# clone it
$git clone git@github.com:hisptz/ussd-api.git
$cd ussd-api

# Install dependencies
$npm install

# Start development live-reload server
$npm run dev or $yarn dev

# Start production server:
$npm start or $yarn start
```

## Using with PM2 in server

```sh
# Install PM2 globally using npm or yarn
$npm install -g pm2

#add database migration
$npm run knex migrate:latest

# Start and load balance 4 instances of app.js
$pm2 start npm -i 4 --name="ussd-api" --watch -- run dev

# Or load balance the maximum of applications based on the number of request sent to it
$pm2 start -i max --name="ussd-api" --watch -- run dev

# Reload app on(Same as how restart works)
$pm2 reload ussd-api

# To make the app restart on machine crashing or on rebooting up
$pm2 startup
```
