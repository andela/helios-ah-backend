import models from '../models';
import SendEmail from '../utilities/sendEmail';
import Authentication from '../utilities/authentication';

const { Users, Authorize } = models;
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
        const tokenCreated = await
        Authentication.getToken(
          userCreated.dataValues, process.env.reg_token_expiry
        );
        const waitingToAuthorize = await Authorize.create({
          token: tokenCreated,
          userId: userCreated.id,
        });
        if (waitingToAuthorize) {
          const isEmailSent = await SendEmail.verifyEmail(email, tokenCreated);
          if (isEmailSent) {
            return res.status(200).send({
              success: true,
              message: `An email has been sent to your email address.
                Please check your email to complete your registration`,
            });
          }
          return res.status(500).send({
            success: false,
            message:
              'Your registration could not be completed. Please try again',
          });
        }
      }
    } catch (error) {
      if (error.errors) {
        return res.status(400).send({
          success: false,
          message: error.errors[0].message,
        });
      }
      return res.status(500).send({
        success: false,
        message: 'Internal server error',
        myError: error.message,
        error,
      });
    }
  }

  /**
  * Complete user registration
  * Route: GET: /auth/complete_reg/
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @return {res} res - Response object
  * @memberof UserController
 */
  static async completeRegistration(req, res) {
    const verifiedToken = await Authentication.verifyToken(req.query.token);
    if (!verifiedToken) {
      return res.status(400).send({
        success: false,
        message: 'Could not complete your registration. Please re-register.'
      });
    }
    const foundUser = await Users.findByPk(verifiedToken.id);
    if (foundUser) {
      const userUpdated = await foundUser.update({
        isVerified: true || foundUser.isVerified,
      });
      if (userUpdated) {
        const tokenCreated = await Authentication.getToken(userUpdated);
        return res.status(201).send({
          success: true,
          message: `User ${userUpdated.username} created successfully`,
          id: userUpdated.id,
          username: userUpdated.username,
          email: userUpdated.email,
          token: tokenCreated,
        });
      }
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
      if (payload) {
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
        return res.status(200).send({
          message: 'User role was updated successfully',
          success: true
        });
      }
    } catch (error) {
      res.status(500).send({
        message: 'Internal server error',
        success: false,
      });
    }
  }
}

export default UserController;
