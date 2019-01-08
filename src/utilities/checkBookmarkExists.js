import { Op } from 'sequelize';
import models from '../models';
import helperMethods from './helperMethods';

const { Bookmark } = models;

/**
 *
 * @function checkBookmarkExists
 *
   *@description checks if bookmark exists on the database

   * @param {string} userId - id of user trying to bookmark
   * @param {string} articleId - Response Object
   *
   * @returns {object} - message from server
   */

const checkBookmarkExists = async (userId, articleId, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      where: {
        [Op.and]: [{ isActive: true },
          { userId },
          { articleId }
        ]
      }
    });
    if (bookmark) {
      return res.status(409).json({
        message: 'Bookmark already exists'
      });
    }
    return false;
  } catch (error) {
    helperMethods.serverError(res);
  }
};
export default checkBookmarkExists;
