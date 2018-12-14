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
    const token = await jwt.sign(
      {
        id: data.id,
        role: data.role,
        username: data.username
      },
      process.env.SECRET, {
        expiresIn: time || 86400 // expires in 1 day
      }
    );
    const output = reverseToken(token);
    return output;
  }

  /**
   * verify a token validity
   * @param {*} input - token input
   * @returns {req} - populate the request with the decrypted content
   */
  static verifyToken(input) {
    const token = reverseToken(input);
    let output = {};
    if (!token) {
      output = {
        error: 'No token supplied',
        success: false
      };
      return output;
    }
    try {
      jwt.verify(token, process.env.SECRET, (err, decoded) => {
        // update req with the decrypted token
        if (err) {
          output = {
            error: 'Failed to authenticate token',
            success: false
          };
        }
        output = {
          id: decoded.id,
          role: decoded.role,
          username: decoded.username,
        };
      });
    } catch (error) {
      output = {
        error: 'Invalid Token',
        success: false
      };
      return output;
    }
    return output;
  }
}

export default Authentication;
