import models from '../models';
import { helperMethods } from '../utilities';

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
      return helperMethods.serverError(res);
    }
    next();
  }
}

export default ValidateArticle;
