import followersUtil from '../utilities/followers';
import models from '../models';
import SendEmail from '../utilities/sendEmail';
import NotificationController from '../utilities/Notification';
import { helperMethods, Authentication } from '../utilities';


const { Users, sequelize, Follower } = models;
const { Op } = sequelize.Sequelize;

/**
 * Class representing the user controller
 * @class UserController
 * @description users controller
 */
class UserController {
  /**
   * This method creates a temporary token and then
   * sends an email to the user.
   * @param {object} userExist - An object containing details of the
   * user we want to send an email to.
   * @returns {boolean} isEmailSent - Tells if email was actually sent
   */
  static async createTokenAndSendEmail(userExist) {
    const tokenCreated = await
    Authentication
      .getToken(userExist.dataValues, process.env.reg_token_expiry);
    if (tokenCreated) {
      const isEmailSent = await
      SendEmail.verifyEmail(userExist.email, tokenCreated);
      return isEmailSent;
    }
  }

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
      const userExist = await Users.findOne({ where: { email, } });
      if (userExist) {
        if (userExist.isVerified === false) {
          const isEmailSent = await
          UserController.createTokenAndSendEmail(userExist);
          if (isEmailSent) {
            return helperMethods
              .requestSuccessful(res, 'You had started the registration '
              + 'process earlier. '
              + 'An email has been sent to your email address. '
              + 'Please check your email to complete your registration.');
          }
          return helperMethods
            .serverError(res, 'Your registration could not be completed.'
            + ' Please try again');
        }
        if (userExist.isVerified === true) {
          return helperMethods
            .requestSuccessful(res, 'You are a registered user on '
            + 'this platform. Please proceed to login');
        }
      }
      const userCreated = await Users.create({
        username,
        password,
        email,
        firstName,
        lastName,
        bio,
      });
      if (userCreated) {
        const isEmailSent = await
        UserController.createTokenAndSendEmail(userCreated);
        if (isEmailSent) {
          return helperMethods
            .requestSuccessful(res, 'An email has been sent to your '
            + 'email address. Please check your email to complete '
            + 'your registration');
        }
        return helperMethods
          .serverError(res, 'Your registration could not be completed.'
          + 'Please try again');
      }
    } catch (error) {
      if (error.errors) {
        return helperMethods.sequelizeValidationError(res, error);
      }
      return helperMethods.serverError(res);
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
      return res.status(400).json({
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
        const isEmailSent = await
        SendEmail.confirmRegistrationComplete(userUpdated.email);
        if (isEmailSent) {
          const tokenCreated = await Authentication.getToken(userUpdated);
          return res.status(201).json({
            success: true,
            message: `User ${userUpdated.username} created successfully`,
            id: userUpdated.id,
            username: userUpdated.username,
            token: tokenCreated,
          });
        }
      }
    }
  }


  /**
  * @description function to allow a user follow another
  *
  * @param {object} req - Request object
  * @param {object} res - Response object
  *
  * @return {res} res - Response object
  *
 */
  static async followUser(req, res) {
    const userId = await req.params.id;
    const followerId = await req.decoded.id;
    const { email } = req.paramsUser;
    const details = {
      email,
      subject: 'Author\'s Haven - Email notification',
      emailBody: `<p>You are now being followed by ${req.user.username}</p>`
    };
    try {
      const createFollower = await Follower.create({
        userId,
        followerId
      });
      const notificationText = `You are now being followed 
      by ${req.user.username}`;

      if (createFollower) {
        req.io.emit('inAppNotifications', { notificationText });
        await NotificationController
          .setSingleEmailNotification(req.paramsUser, details);

        await NotificationController
          .setSingleAppNotification(req.paramsUser, notificationText);


        res.status(200).json({
          success: true,
          message: 'You are now following this user'
        });
      }
    } catch (error) {
      return helperMethods.serverError(res);
    }
  }

  /**
  * @description function to allow a user unfollow another
  *
  * @param {object} req - Request object
  * @param {object} res - Response object
  *
  * @return {res} res - Response object
  *
 */
  static async unfollowUser(req, res) {
    const userId = await req.params.id;
    const followerId = await req.decoded.id;

    const isExistingFollowing = await
    followersUtil.queryForExistingFollowing(true, userId, followerId);

    if (isExistingFollowing) {
      await followersUtil
        .queryForUpdatingPreviousFollowing(false, userId, followerId);
      res.status(200).json({
        success: true,
        message: 'You have unfollowed this user'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'You do not follow this user'
      });
    }
  }

  /**
  * Updates user role
  * List Authors
  * Route: GET: /authors
  * Route: GET: /authors/:search
  * @param {object} req -Request object
  * @param {object} res - Response object
  * @return {res} res - Response object
  * @memberof USerController
 */
  static async getAuthors(req, res) {
    let authors;
    const options = {
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'image',
        'bio',
        'username'
      ],
      where: {
        isVerified: true,
      },
    };
    try {
      if (req.query.search) {
        options.where = {
          [Op.or]: [
            {
              username: {
                [Op.like]: `%${req.query.search}%`
              }
            },
            {
              firstName: {
                [Op.like]: `%${req.query.search}%`
              }
            },
            {
              lastName: {
                [Op.like]: `%${req.query.search}%`
              }
            },
          ],
          isVerified: true,
        };
      }
      authors = await Users.findAll(options);

      res.status(200).json({
        success: true,
        authors,
      });
    } catch (error) {
      return helperMethods.serverError(res);
    }
  }

  /**
   * User request password reset
   * Route: POST: /api/v1/user/requests/password/reset
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @returns {res} res - Response Object
   * @memberof UserController
   */
  static async requestResetPassword(req, res) {
    let resetLinkURL, token, resetLink;
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
        const isEmailSent = await SendEmail.emailSender(details);
        if (isEmailSent) {
          return res.status(200).send({
            status: 'success',
            message: 'check your mail for instructions on how to reset password'
          });
        }
        if (!isEmailSent) {
          return res.status(500).send({
            status: 'error',
            message:
            'Internal server error while sending you an email. '
            + 'Please try again.'
          });
        }
      }
      return res.status(404).send({
        status: 'error',
        error: 'User with email not found'
      });
    } catch (error) {
      return helperMethods.serverError(res);
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
        return res.status(200).json({
          message: 'User role was updated successfully',
          success: true
        });
      }
    } catch (error) {
      return helperMethods.serverError(res);
    }
  }

  /**
   * User Login
   * Route: POST: auth/login
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {res} res - Response object
   * @memberof UserController
   */
  static async userLogin(req, res) {
    const { email, password } = req.body;
    try {
      const userFound = await Users.findOne({ where: { email, } });
      if (!userFound) {
        return res.status(400).json({
          success: false,
          message: 'Email or password does not exist',
        });
      }
      if (userFound.isVerified === false) {
        return res.status(401).json({
          success: false,
          message: 'You had started the registration process already. '
          + 'Please check your email to complete your registration.'
        });
      }
      if (userFound && userFound.verifyPassword(password)) {
        const tokenCreated = await Authentication.getToken({
          id: userFound.id,
          username: userFound.username,
          role: userFound.role,
        });
        if (tokenCreated) {
          const userDetails = {
            id: userFound.id,
            username: userFound.username,
            role: userFound.roleId,
            token: tokenCreated,
          };
          return res.status(200).json({
            success: true,
            message: 'Login successful',
            userDetails,
          });
        }
        return helperMethods.serverError(res);
      }
      return res.status(400).send({
        success: false,
        message: 'Email or password does not exist',
      });
    } catch (error) {
      return helperMethods.serverError(res);
    }
  }
}

export default UserController;
