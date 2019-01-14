const dotenv = require('dotenv');

dotenv.config();

const databaseConfig = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DEVELOPMENT_DATABASE,
    logging: false,
    host: process.env.DB_HOST,
    operatorsAliases: false,
    dialect: 'postgres',
    protocol: 'postgres'
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.TEST_DATABASE,
    logging: false,
    host: process.env.DB_HOST,
    operatorsAliases: false,
    dialect: 'postgres',
    protocol: 'postgres'
  },
  production: {
    use_env_variable: 'DATABASE_URL'
  }
};

module.exports = databaseConfig;
