import models from '../models';
import { helperMethods, Authentication } from '../utilities';

const { Users } = models;

/**
 * Class representing the user controller
 * @class UserController
 * @description users controller
 */
class SocialLogin {
  /**
   * @param {String} obj - An object whose properties we use to validate.
   * @returns {object} res -
   */
  static async verifyAndLoginUser(obj) {
    const options = {};
    try {
      if (obj.socialMedia === 'twitter') {
        options.where = { username: obj.profile.username };
      } else {
        options.where = { [obj.verifyWith]: obj.profile.emails[0].value };
      }
      const userFound = await Users.findOne(options);
      if (userFound && userFound.isVerified === false) {
        return obj.res.status(400).json({
          success: false,
          message: 'You had started the registration process earlier. '
          + 'Please check your email to complete your registration.'
        });
      }
      if (userFound) {
        const token = await Authentication.getToken(userFound);
        return obj.res.status(200).json({
          success: true,
          message: `Social login via ${obj.socialMedia} was successful`,
          id: userFound.id,
          username: userFound.username,
          email: userFound.email,
          token,
        });
      }
      return obj.res.status(400).json({
        success: false,
        message: 'You are not registered on this app. Please signup.',
      });
    } catch (error) {
      return helperMethods.serverError(obj.res);
    }
  }

  /**
    * Sign up a user
    * Route: GET: auth/social_fb/callback
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @return {res} res - Response object
    * @memberof UserController
  */
  static async facebookLogin(req, res) {
    const verifyWithObjectProperties = {
      verifyWith: 'email',
      profile: req.user,
      socialMedia: 'facebook',
      res,
    };
    try {
      return SocialLogin.verifyAndLoginUser(verifyWithObjectProperties);
    } catch (error) {
      return helperMethods.serverError(res);
    }
  }

  /**
  * Sign up a user
  * Route: GET: auth/social_ggl/callback
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @return {res} res - Response object
  * @memberof UserController
  */
  static async googleLogin(req, res) {
    const verifyWithObjectProperties = {
      verifyWith: 'email',
      profile: req.user,
      socialMedia: 'google',
      res,
    };
    try {
      return SocialLogin.verifyAndLoginUser(verifyWithObjectProperties);
    } catch (error) {
      return helperMethods.serverError(res);
    }
  }

  /**
  * Sign up a user
  * Route: GET: auth/social_tw/callback
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @return {res} res - Response object
  * @memberof UserController
  */
  static async twitterLogin(req, res) {
    const verifyWithObjectProperties = {
      verifyWith: 'username',
      profile: req.user,
      socialMedia: 'twitter',
      res,
    };
    try {
      return SocialLogin.verifyAndLoginUser(verifyWithObjectProperties);
    } catch (error) {
      return helperMethods.serverError(res);
    }
  }

  /**
  * Sign up a user
  * Route: GET: auth/social_tw/callback
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @return {res} res - Response object
  * @memberof UserController
  */
  static async socialLoginFailed(req, res) {
    return res.status(400).json({
      success: false,
      message: 'The social media login failed. Please try again.'
    });
  }
}

export default SocialLogin;
