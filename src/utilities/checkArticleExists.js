import models from '../models';
import helperMethods from './helperMethods';

const { Article, Users } = models;

/**
 *
 * @function checkArticleExists
 *
   *@description checks if article exists on the database

   * @param {string} articleId - id of article
   * @param {string} res - Http response
   *
   * @returns {object} - Http response
   */

const checkArticleExists = async (articleId, res) => {
  try {
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
    if (!article) {
      res.status(404).json({
        success: false,
        message: 'Article does not exist'
      });
    }
    return article;
  } catch (error) {
    helperMethods.serverError(res);
  }
};
export default checkArticleExists;
