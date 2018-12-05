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
 * creates a user token
 * @param {object} data - contains id, role username and hashedPassword
 * @param {interger} time - Time in seconds
 * @returns {output} - returns a jwt token
 */
async function getToken(data, time) {
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
 * @returns {req} - populate the request with the decypted content
 */
async function verifyToken(input) {
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

export {
  getToken,
  verifyToken
};
