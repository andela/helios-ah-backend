import models from '../models';
import { helperMethods } from '../utilities';

const { Article, Users } = models;

/**
 *
 * @function checkArticleExists
 *
   *@description checks if article exists on the database

   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @param {Function} next - callback function
   *
   * @returns {object} - message from server
   */

const checkArticleExists = async (req, res, next) => {
  try {
    const { articleId } = await req.params;
    const article = await Article
      .findOne({
        where: {
          id: articleId,
          isDeleted: false,
        },
        include:
          {
            model: Users,
            attributes: ['email']
          }
      });

    if (article) {
      req.article = article;
      next();
    } else {
      return res.status(404).json({
        success: false,
        message: 'Article does not exist'
      });
    }
  } catch (error) {
    return helperMethods.serverError(res);
  }
};
export default checkArticleExists;
