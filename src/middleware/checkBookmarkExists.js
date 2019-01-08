import { Op } from 'sequelize';
import models from '../models';
import { helperMethods } from '../utilities';

const { Bookmark } = models;

/**
 *
 * @function checkBookmarkExists
 *
   *@description checks if bookmark exists on the database

   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @param {Function} next - callback function
   *
   * @returns {object} - message from server
   */

const checkBookmarkExists = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const bookmark = await Bookmark.findOne({
      where: {
        [Op.and]: [{ isActive: true },
          { userId: req.decoded.id },
          { articleId }
        ]
      }
    });

    if (bookmark) {
      res.status(409).json({
        message: 'Bookmark already exists'
      });
    } else {
      next();
    }
  } catch (error) {
    return helperMethods.serverError(res);
  }
};
export default checkBookmarkExists;
