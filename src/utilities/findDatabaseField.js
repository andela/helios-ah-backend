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
   * @param {string} userId userId from decoded token
   *
   * @returns  {JSON} Returns a JSON object
   */
  static async UserInToken(userId) {
    try {
      const user = await FindDatabaseField.findUser(userId);
      if (user && user.dataValues.isVerified) {
        return user;
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description find if user with userId in params exists in database
   *
   * @param {string} paramUserId userId from params
   *
   * @returns  {JSON} Returns a JSON object
   */
  static async UserInParams(paramUserId) {
    try {
      const paramsUser = await FindDatabaseField.findUser(paramUserId);
      if (paramsUser && paramsUser.isVerified) {
        return paramsUser;
      }
    } catch (error) {
      throw error;
    }
  }
}
export default FindDatabaseField;
