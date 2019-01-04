import models from '../models';

const { Article, Users } = models;

/**
 *
 * @function checkArticleExists
 *
   *@description checks if article exists on the database

   * @param {string} articleId - id of article
   *
   * @returns {object} - message from server
   */

const checkArticleExists = async (articleId) => {
  try {
    const article = await Article
      .findByPk(
        articleId,
        {
          include:
          {
            model: Users,
            attributes: ['email']
          }
        }
      );
    return article;
  } catch (error) {
    throw error;
  }
};
export default checkArticleExists;
