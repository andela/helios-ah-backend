import { Op } from 'sequelize';
import models from '../models';

const { Follower } = models;

/**
 * @class Followers
 */
class Followers {
  /**
   * @description query database to see if follower already follows user
   *
   * @param {boolean} bool isActive value of true or false
   * @param {string} id1 userId
   * @param {string} id2 followerId
   *
   * @returns {JSON} Returns a JSON object
   */
  static async queryForExistingFollowing(bool, id1, id2) {
    try {
      return Follower.findOne({
        where: {
          [Op.and]: [{ isActive: bool },
            { userId: id1 },
            { followerId: id2 }
          ]
        }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description query database to update isActive status
   *
   * @param {boolean} bool isActive value of true or false
   * @param {string} id1 userId
   * @param {string} id2 followerId
   *
   * @returns {JSON} Returns a JSON object
   */
  static async queryForUpdatingPreviousFollowing(bool, id1, id2) {
    try {
      return Follower.update(
        {
          isActive: bool
        },
        {
          where:
              {
                [Op.and]: [
                  { userId: id1 },
                  { followerId: id2 }
                ]
              },
          returning: true
        }
      );
    } catch (error) {
      return error;
    }
  }

  /**
   * @description find if follower already follows user
   *
   * @param {object} req Http request
   * @param {object} res Http response
   * @param {function} next callback
   *
   * @returns  {JSON} Returns a JSON object
   */
  static async checkForExistingFollowing(req, res, next) {
    const userId = await req.params.id;
    const followerId = await req.decoded.id;
    const isExistingFollowing = await
    Followers.queryForExistingFollowing(true, userId, followerId);

    if (isExistingFollowing) {
      return res.status(409).json({
        success: false,
        message: 'You are already following this user'
      });
    }
    next();
  }

  /**
   * @description find if user has unfollowed user in the past
   *
   * @param {object} req Http request
   * @param {object} res Http response
   * @param {function} next callback
   *
   * @returns  {JSON} Returns a JSON object
   */
  static async updatePreviousFollowing(req, res, next) {
    const userId = await req.params.id;
    const followerId = await req.decoded.id;

    const isPreviousFollowing = await
    Followers.queryForExistingFollowing(false, userId, followerId);

    if (isPreviousFollowing) {
      await Followers
        .queryForUpdatingPreviousFollowing(true, userId, followerId);
      return res.status(200).json({
        success: true,
        message: 'You are now following this user'
      });
    }
    next();
  }

  /**
   * @description checks to see if user is following self
   *
   * @param {object} req Http request
   * @param {object} res Http response
   * @param {function} next callback
   *
   * @returns  {JSON} Returns a JSON object
   */
  static async checkForSelfFollow(req, res, next) {
    const userId = await req.params.id;
    const followerId = await req.decoded.id;

    if (userId === followerId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }
    next();
  }

  /**
   * @description checks to see if user is following self
   *
   * @param {object} req Http request
   * @param {object} res Http response
   * @param {function} next callback
   *
   * @returns  {JSON} Returns a JSON object
   */
  static async checkForSelfUnfollow(req, res, next) {
    const userId = await req.params.id;
    const followerId = await req.decoded.id;

    if (userId === followerId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow or unfollow yourself'
      });
    }
    next();
  }
}


export default Followers;
