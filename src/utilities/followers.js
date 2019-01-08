import { Op } from 'sequelize';
import models from '../models';
import helperMethods from './helperMethods';

const { Follower, Users } = models;

/**
 * @class Followers
 */
class Followers {
  // /**
  //  * @description function that return an invalid unfollow request message
  //  *
  //  * @param {object} res Http response
  //  *
  //  * @returns {object} Http response
  //  */
  // static invalidFollowMessage(res) {

  // }

  /**
   * @description query database to see if follower already follows user
   *
   * @param {boolean} bool isActive value of true or false
   * @param {boolean} isFollowRoute finds out if route is follow user or not
   * @param {string} id1 userId
   * @param {string} id2 followerId
   * @param {object} res Http response
   *
   * @returns {JSON} Returns a JSON object
   */
  static async queryForExistingFollowing(bool, isFollowRoute, id1, id2, res) {
    try {
      const isExistingFollowing = await Follower.findOne({
        where: {
          [Op.and]: [{ isActive: bool },
            { userId: id1 },
            { followerId: id2 }
          ]
        }
      });
      if (bool === true && isFollowRoute === true && isExistingFollowing) {
        return res.status(409).json({
          success: false,
          message: 'You are already following this user'
        });
      }
      if (bool === true && isFollowRoute === false && isExistingFollowing) {
        return true;
      }

      if (bool === false && isFollowRoute === true && isExistingFollowing) {
        return true;
      }
      if (bool === true && isFollowRoute === false && !isExistingFollowing) {
        return res.status(400).json({
          success: false,
          message: 'You do not follow this user'
        });
      }
      return false;
    } catch (error) {
      helperMethods.serverError(res);
    }
  }

  /**
   * @description query database to update isActive status
   *
   * @param {boolean} bool isActive value of true or false
   * @param {string} id1 userId
   * @param {string} id2 followerId
   * @param {object} res Http response
   *
   * @returns {JSON} Returns a JSON object
   */
  static async queryForUpdatingPreviousFollowing(bool, id1, id2, res) {
    try {
      const query = await Follower.update(
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
      if (query && bool === true) {
        return res.status(200).json({
          success: true,
          message: 'You are now following this user'
        });
      }
      if (query && bool === false) {
        return true;
      }
      return false;
    } catch (error) {
      helperMethods.serverError(res);
    }
  }


  /**
   * @description find all followers of a particular user
   *
   * @param {function} id the id of the user being followed
   *
   * @returns  {JSON} Returns a JSON object
   */
  static async getFollowers(id) {
    try {
      return await Users.findAll({
        where: {
          id
        },
        include: [
          {
            model: Users,
            as: 'followers',
          }
        ]
      });
    } catch (error) {
      throw error;
    }
  }
}


export default Followers;
