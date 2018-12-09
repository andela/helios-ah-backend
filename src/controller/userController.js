import { cryptData, authentication } from '../utilities';
import followersUtil from '../utilities/followers';
import models from '../models';

const { Users, Follower } = models;

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

    try {
      const createFollower = await Follower.create({
        userId,
        followerId
      });
      if (createFollower) {
        res.status(200).json({
          message: 'You are now following this user'
        });
      }
    } catch (error) {
      res.status(500).send(error);
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
      await followersUtil.queryForUpdatingPreviousFollowing(false, userId, followerId);
      res.status(200).json({
        message: 'You have unfollowed this user'
      });
    } else {
      res.status(400).json({
        message: 'You do not follow this user'
      });
    }
  }
}

export default UserController;
