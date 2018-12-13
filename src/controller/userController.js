import { authentication } from '../utilities';
import models from '../models';
import SendEmail from '../utilities/sendEmail';
import Authentication from '../utilities/authentication';

const { Users } = models;
let resetLink, token;

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
      const userCreated = await Users.create({
        username,
        password,
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
   * Route: POST: /api/v1/user/requests/password/reset
   * @param {object} req - Request Object
   * @param {object} res - Response Objec
   * @returns {res} res - Response Object
   * @memberof UserController
   */
  static async requestResetPassword(req, res) {
    let resetLinkURL;
    if (process.env.NODE_ENV !== 'production') {
      resetLinkURL = process.env.LOCAL_BASE_URL;
    } else {
      resetLinkURL = process.env.BASE_URL;
    }

    try {
      const { foundUser } = req;
      const payload = {
        id: foundUser.id,
        username: foundUser.username,
        role: 1
      };
      token = await Authentication.getToken(payload, 900000);
      if (foundUser) {
        resetLink = `${resetLinkURL}/change/password?token=${token}`;
        const details = {
          emailBody: `
            Hi ${foundUser.firstName}, click ${resetLink} to reset password
          `,
          subject: 'Request to reset password',
          email: req.body.email
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
        status: 'error',
        error: 'Internal Server Error'
      });
    }
  }

  /**
   * User reset password
   * Route: PUT: '/api/v1/change/password
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @returns {res} res - Response Object
   * @memberof UserController
   */
  static async resetPassword(req, res) {
    if (req.foundUser) {
      const payload = await Authentication.verifyToken(req.query.token);
      if (payload.success) {
        const user = await Users.findByPk(payload.id);
        if (!req.body.password) {
          return res.status(400).send({
            success: 'false',
            error: 'password field is required'
          });
        }
        await user.update({
          password: req.body.password
        });
        return res.status(200).send({
          success: true,
          message: 'password reset successful'
        });
      }
      return res.status(401).send({
        success: false,
        error: 'invalid token'
      });
    }
    return res.status(404).send({
      status: 'error',
      error: 'email not found'
    });
  }

  /**
   * Updates user role
   * Route: PUT: users/role/:userId
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {res} res - Response object
   * @memberof UserController
   */
  static async userRole(req, res) {
    try {
      const userUpdated = await Users.update(
        {
          roleId: req.body.roleId,
        },
        {
          where:
          {
            id: req.params.userId
          }
        }
      );
      if (userUpdated[0] === 1) {
        res.status(200).send({
          message: 'User role was updated successfully',
          success: true
        });
      }
    } catch (error) {
      res.status(500).send({
        message: 'Internal server error',
        success: false
      });
    }
  }
}

export default UserController;
