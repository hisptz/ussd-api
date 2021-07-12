// module.exports = {
//   development: {
//     client: 'postgresql',
//     connection: {
// host: 'db-tracker',
// database: 'ussd',
//       user: 'postgres',
//       password: 'postgres'
//     },
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       tableName: 'knex_migrations'
//     }
//   },

//   test: {
//     client: 'sqlite3',
//     connection: {
//       filename: ':memory:'
//     },
//     useNullAsDefault: true
//   },

//   production: {
//   client: 'postgresql',
//     connection: {
// host: 'db-tracker',    
//   database: 'ussd',
//       user: 'postgres',
//       password: 'postgres'
//     },
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       tableName: 'knex_migrations'
//     }
//   }
// };


module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: 'localhost',
      database: 'ussd',
      user: 'postgres',
      password: 'postgres',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:',
    },
    useNullAsDefault: true,
  },

  production: {
    client: 'postgresql',
    connection: {
      host: 'localhost',
      database: 'ussd',
      user: 'postgres',
      password: 'postgres',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
