/** reference
 * https://medium.com/riipen-engineering/testing-with-sequelize-cc51dafdfcf4
 *  */

import map from 'lodash/map';
import models from '../models';

/**
 * @function truncate
 */

/**
   * @description delete all tables in authors_haven_test database
   *
   * @returns {JSON} Returns a JSON object
   */
const truncate = async () => Promise.all(
  map(Object.keys(models), (key) => {
    if (['sequelize', 'Sequelize'].includes(key)) return null;
    return models[key].destroy({ where: {}, force: true });
  })
);

export default truncate;
