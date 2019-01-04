import { Op } from 'sequelize';
import models from '../models';

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

const checkBookmarkExists = async (userId, articleId) => {
  try {
    const bookmark = await Bookmark.findOne({
      where: {
        [Op.and]: [{ isActive: true },
          { userId },
          { articleId }
        ]
      }
    });
    return bookmark;
  } catch (error) {
    throw error;
  }
};
export default checkBookmarkExists;
