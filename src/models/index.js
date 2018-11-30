import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import databaseConfig from '../config/config';

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const configEnv = databaseConfig[env];
const db = {};

let sequelize;
if (configEnv.use_env_variable) {
  sequelize = new Sequelize(process.env[configEnv.use_env_variable], configEnv);
} else {
  sequelize = new Sequelize(
    configEnv.database,
    configEnv.username,
    configEnv.password,
    configEnv
  );
}

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0)
  && (file !== basename)
  && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;