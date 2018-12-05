import models from '../models';

const { Users } = models;


/**
 * Class containing methods that helps keep code DRY
 * @class HelpersClass
 * @description class containing helper methods
 */
class GetUser {
  /**
   * @description - This middleware finds a user where email corressponds
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @param {Function} next - passes control to next controller/middleware
   * @returns {object} - message from server
   */
  static async getUserByMail(req, res, next) {
    try {
      const foundUser = await Users.findOne({
        where: {
          email: req.body.email
        }
      });
      if (foundUser) {
        req.foundUser = foundUser;
        return next();
      }
      return res.status(404).send({
        status: 'error',
        error: 'user not found'
      });
    } catch (error) {
      return res.status(500).send({
        message: 'Internal Server Error',
        error
      });
    }
  }
}
export default GetUser;
