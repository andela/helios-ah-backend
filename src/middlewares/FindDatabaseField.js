import models from '../models';

const { Users } = models;
const findUser = async (id) => {
  try {
    const queryUserResult = await Users.findByPk(id);
    return queryUserResult;
  } catch (error) {
    throw error;
  }
};
/**
 * @class FindFieldInDatabaseController
 */
class FindDatabaseField {
  /**
   * @description find if user with userId in token exists in database
   *
   * @param {object} req Http request
   * @param {object} res Http response
   * @param {function} next callback
   *
   * @returns  {JSON} Returns a JSON object
   */
  static async UserInToken(req, res, next) {
    const userId = await req.decoded.id;

    const user = await findUser(userId);
    if (user) {
      return next();
    }
    res.status(404).json({ message: 'User does not exist' });
  }

  /**
   * @description find if user with userId in params exists in database
   *
   * @param {object} req Http request
   * @param {object} res Http response
   * @param {function} next callback
   *
   * @returns  {JSON} Returns a JSON object
   */
  static async UserInParams(req, res, next) {
    const { id } = req.params;
    const paramsUser = await findUser(id);
    if (paramsUser) {
      return next();
    }
    res.status(404).json({ message: 'User does not exist' });
  }
}
export default FindDatabaseField;
