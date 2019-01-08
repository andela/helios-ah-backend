import models from '../models';

const { Users } = models;

/**
 * @class FindDatabaseField
 */
class FindDatabaseField {
  /**
   * @description query for user in database
   *
   * @param {object} id userId
   * @param {function} next callback
   *
   * @returns  {JSON} Returns a JSON object
   */
  static async findUser(id) {
    try {
      const queryUserResult = await Users.findByPk(id);
      return queryUserResult;
    } catch (error) {
      throw error;
    }
  }

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

    const user = await FindDatabaseField.findUser(userId);
    if (user && user.dataValues.isVerified) {
      req.user = user;
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
    const paramsUser = await FindDatabaseField.findUser(id);
    if (paramsUser && paramsUser.isVerified) {
      req.paramsUser = paramsUser;
      return next();
    }
    res.status(404).json({ message: 'User does not exist' });
  }
}
export default FindDatabaseField;
