import dotenv from 'dotenv';

dotenv.config();

let dbConfiguration = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
  operatorsAliases: false,
  logging: false,
};

if (process.env.NODE_ENV === 'test') {
  dbConfiguration.database = process.env.TEST_DATABASE;
} else if (process.env.NODE_ENV === 'production') {
  dbConfiguration = process.env.DB_URL_PRODUCTION;
} else {
  dbConfiguration.database = process.env.DEVELOPMENT_DATABASE;
}
