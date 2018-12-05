import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * scrambles string data
 * @param {*} token - input string data
 * @returns {output} - scrambled data
 */
function reverseToken(token) {
  return token.split('').reverse().join('');
}

/**
 * Class representing the Authentication methods
 * @class Authentication
 * @description Authentication class methods
 */
class Authentication {
  /**
   * creates a user token
   * @param {object} data - contains id, role username and hashedPassword
   * @param {integer} time - Time in seconds
   * @returns {output} - returns a jwt token
   */
  static async getToken(data, time) {
    const token = await jwt.sign({
      id: data.id,
      role: data.role,
      userName: data.userName
    }, process.env.SECRET, {
      expiresIn: time || 86400 // expires in 1 day
    });
    const output = reverseToken(token);
    return output;
  }

  /**
   * verify a token validity
   * @param {*} input - token input
   * @returns {req} - populate the request with the decrypted content
   */
  static async verifyToken(input) {
    const token = reverseToken(input);
    let output = {};
    try {
      await jwt.verify(token, process.env.SECRET, (err, decoded) => {
        // update req with the decrypted token
        output = {
          id: decoded.id,
          role: decoded.role,
          userName: decoded.userName,
        };
      });
      return output;
    } catch (err) {
      output = {
        Error: 'Failed to authenticate token'
      };
      return output;
    }
  }

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
        code: 401,
        message: 'User not authorized',
      });
    } else {
      try {
        const tokenVerified = Authentication.verifyToken(token);
        req.decoded = tokenVerified;
        next();
      } catch (error) {
        res.status(401).send({
          code: 401,
          message: 'Authentication failed',
          error,
        });
      }
    }
  }
}

export default Authentication;