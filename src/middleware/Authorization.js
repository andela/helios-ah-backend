import Auth from '../utilities/authentication';
/**
 * Class representing the Authentication methods
 * @class Authenticate
 * @description Authenticate user writes
 */
class Authorization {
  /**
   *
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request
   * to the next handler
   * @returns {callback} next - The callback that passes the request
   * to the next handler
   * @returns {object} res - Response object containing an error due
   * to unauthorized access
   */
  static async checkToken(req, res, next) {
    const token = req.body.token || req.query.token
    || req.headers['x-access-token'];
    if (!token) {
      res.status(401).send({
        success: false,
        message: 'User not authorized',
      });
    } else {
      try {
        const tokenVerified = await Auth.verifyToken(token);
        console.log(tokenVerified);
        req.decoded = tokenVerified;
        next();
      } catch (error) {
        res.status(401).send({
          success: false,
          message: 'Authentication failed',
          error,
        });
      }
    }
  }
}
export default Authorization;
