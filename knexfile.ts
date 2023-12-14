// Update with your config settings.
import * as dotenv from 'dotenv';
import { DotenvParseOutput } from 'dotenv';

const config = dotenv.config().parsed as DotenvParseOutput;

module.exports = {
  development: {
    client: 'pg',
    version: '15',
    connection:
      process.env.APP_CONTEXT === 'develop' ? process.env.TEST_DB_CONNECTION_STRING : process.env.DB_CONNECTION_STRING,
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
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
