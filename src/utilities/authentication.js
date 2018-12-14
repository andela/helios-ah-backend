import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * scrambles string data
 * @param {string} token - input string data
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
      process.env.SECRET,
      {
        expiresIn: time || 86400 // expires in 1 day
      }
    );
    const output = reverseToken(token);
    return output;
  }

  /**
   * verify a token validity
   * @param {string} input - token input
   * @returns {req} - populate the request with the decrypted content
   */
  static async verifyToken(input) {
    const token = reverseToken(input);
    let data;
    try {
      await jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
          data = false;
        }
        data = decoded;
      });
    } catch (err) {
      data = false;
    }
    return data;
  }
}

export default Authentication;
