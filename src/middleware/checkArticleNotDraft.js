import models from '../models';

const {
  Article
} = models;

/**
 * @class checkArticleIsDraft
 * @description class containing logic to check if
 * article exist and is NOT draft
 */
class ValidateArticle {
  /**
   * @description - This middleware Validate if article is NOT draft
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @param {Function} next - passes control to next controller/middleware
   * @returns {object} - message from server
   */
  static async checkArticleNotDraft(req, res, next) {
    const {
      articleId
    } = req.params;
    try {
      const article = await Article.findOne({
        where: {
          id: articleId,
          isDraft: 'false'
        }
      });
      if (!article) {
        return res.status(401).json({
          success: false,
          message: 'Article is Draft and has not been published',
        });
      }
    } catch (err) {
      res.status(500).json({
        Success: false,
        message: 'Internal Server Error'
      });
    }
    next();
  }
}

export default ValidateArticle;
