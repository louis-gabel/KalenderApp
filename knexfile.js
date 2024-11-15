// file for test-database with mock.data configuration
require('dotenv').config();

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: '127.0.0.1', // oder der Docker-Host
      user: 'root',
      password: 'insert-password-here',
      database: 'test_db',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
};
