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

## Install

```
npm install
npm run knex migrate:latest

pm2 start npm --no-automation --name ussd-api -- run dev

pm2 startup
```
