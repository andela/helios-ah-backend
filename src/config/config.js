const dotenv = require('dotenv');

dotenv.config();

const databaseConfig = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DEVELOPMENT_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'postgres'
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.TEST_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'DB_URL_PRODUCTION'
  }
};

module.exports = databaseConfig;