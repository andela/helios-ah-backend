import { Op } from 'sequelize';
import models from '../models';

const { Follower, Users } = models;

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
