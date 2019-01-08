import models from '../models';
import helperMethods from './helperMethods';

const { Users } = models;

/**
 * @class FindDatabaseField
 */
class FindDatabaseField {
  /**
   * @description query for user in database
   *
   * @param {object} id userId
   * @param {object} res http response
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
   * @param {object} res http response
   *
   * @returns  {JSON} Returns a JSON object
   */
  static async UserInToken(userId, res) {
    try {
      const user = await FindDatabaseField.findUser(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User does not exist'
        });
      }
      return true;
    } catch (error) {
      helperMethods.serverError(res);
    }
  }

  /**
   * @description find if user with userId in params exists in database
   *
   * @param {string} paramUserId userId from params
   * @param {object} res http response

   *
   * @returns  {JSON} Returns a JSON object
   */
  static async UserInParams(paramUserId, res) {
    try {
      const paramsUser = await FindDatabaseField.findUser(paramUserId);
      if (!paramsUser) {
        res.status(404).json({
          success: false,
          message: 'User does not exist'
        });
      }
      return paramsUser;
    } catch (error) {
      helperMethods.serverError(res);
    }
  }
}
export default FindDatabaseField;
