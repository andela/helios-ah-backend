import models from '../models';

const { Article } = models;

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
    const article = await Article.findByPk(articleId);

    if (article) {
      req.article = article;
      next();
    } else {
      res.status(404).json({
        message: 'Article does not exist'
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error'
    });
  }
};
export default checkArticleExists;
