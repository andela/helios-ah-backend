import { cryptData, authentication } from '../utilities';
import models from '../models';
import SendEmail from '../utilities/sendEmail';
import Authentication from '../utilities/authentication';

const { Users } = models;
const { userTokens } = models;
let resetLink;

/**
 * Class representing the user controller
 * @class UserController
 * @description users controller
 */
class UserController {
  /**
  * Sign up a user
  * Route: POST: /auth/signup
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @return {res} res - Response object
  * @memberof UserController
 */
  static async userSignup(req, res) {
    const {
      username, password, email, firstName, lastName, bio
    } = req.body;
    try {
      const encryptedPassword = await cryptData.encryptData(password);
      const userCreated = await Users.create({
        username,
        password: encryptedPassword,
        email,
        firstName,
        lastName,
        bio,
      });
      if (userCreated) {
        const tokenCreated = await authentication.getToken(userCreated);
        res.status(201).send({
          message: `User ${userCreated.username} created successfully`,
          id: userCreated.id,
          username: userCreated.username,
          email: userCreated.email,
          token: tokenCreated,
        });
      }
    } catch (error) {
      res.status(500).send({
        message: 'Internal server error',
      });
    }
  }

  /**
   * User request password reset
   * Route: POST: /api/v1/user/request-password-reset
   * @param {object} req - Request Object
   * @param {object} res - Response Objec
   * @returns {res} res - Response Object
   * @memberof UserController
   */
  static async userRequestPasswordReset(req, res) {
    let resetLinkURL;
    if (process.env.NODE_ENV !== 'production') {
      resetLinkURL = process.env.LOCAL_BASE_URL;
    } else {
      resetLinkURL = process.env.BASE_URL;
    }

    const { email } = req.body;
    try {
      const { foundUser } = req;
      const payload = {
        id: foundUser.id,
        username: foundUser.username,
        role: 1
      };
      const token = await Authentication.getToken(payload, 900000);
      if (foundUser) {
        const tokenCreated = await userTokens.create({
          token,
          userId: foundUser.id
        });
        resetLink = `${resetLinkURL}${tokenCreated.token}`;
        const details = {
          emailBody: `
            Hi ${foundUser.firstName}, click ${resetLink} to reset password
          `,
          subject: 'Request to reset password',
          email
        };
        await SendEmail.emailSender(details);
        return res.status(200).send({
          status: 'success',
          message: 'check your mail for instructions on how to reset password'
        });
      }
      return res.status(404).send({
        status: 'error',
        error: 'User with email not found'
      });
    } catch (error) {
      return res.status(500).send({
        message: 'Internal Server Error',
        error
      });
    }
  }

  /**
   * User reset password
   * Route: PUT: '/api/v1/user/reset-password
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @returns {res} res - Response Object
   * @memberof UserController
   */
  static async resetPassword(req, res) {
    if (req.foundUser) {
      const tokenFromLink = req.params.token;
      const tokenFromDB = await userTokens.findOne({
        where: {
          token: tokenFromLink
        }
      });
      if (tokenFromDB) {
        if (Date.now() - Date.parse(tokenFromDB.createdAt) > 900000) {
          await tokenFromDB.update({ isExpired: true });
          return res.status(401).send({
            status: 'error',
            error: 'The link has expired'
          });
        }
        if (!tokenFromDB.isExpired) {
          const
            encryptedPassword = await cryptData.encryptData(req.body.password);
          const updatePassword = {
            password:
              encryptedPassword || req.foundUser.password
          };
          const newPassword = await req.foundUser.update(updatePassword);
          tokenFromDB.update({ isExpired: true });
          return res.status(200).send({
            message: 'Password successfully changed',
            newPassword
          });
        }
      }
      return res.status(401).send({
        status: 'error',
        error: 'Unauthorized access to reset password, invalid token'
      });
    }
    return res.status(404).send({
      status: 'error',
      error: 'email not found'
    });
  }
}

export default UserController;
