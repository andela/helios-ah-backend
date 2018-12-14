import models from '../models';
import { checkFeedbackExist } from '../utilities';

const {
  Feedback,
} = models;

/**
 * Class representing the Ratings Controller
 * @class RatingsController
 * @description Ratings Controller
 */
class RatingsController {
  /**
   * like an Article
   * Route: POST: /articles
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {res} res - Response object
   */
  static async rateArticle(req, res) {
    const { articleId } = req.params;
    const { rating } = req.body;
    const user = req.decoded;
    try {
      const FeedbackExist = await checkFeedbackExist(res, user, articleId);
      if (!FeedbackExist) {
        const articleRating = await Feedback.create({
          userId: user.id,
          articleId,
          rating
        });
        if (articleRating) {
          return res.status(201).json({
            success: true,
            message: 'Article Rated successfully',
            articleId,
            rating,
            userId: user.id
          });
        }
      }
      res.status(400).json({
        success: false,
        message: 'Rating already Exist. Please consume'
        + ' a Put Route for Rating Update'
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }

  /**
   * like an Article
   * Route: POST: /articles
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {res} res - Response object
   */
  static async updateRating(req, res) {
    const { articleId } = req.params;
    const { rating } = req.body;
    const user = req.decoded;
    try {
      const articleRating = await Feedback.update({
        rating,
      }, {
        where: {
          userId: user.id,
          articleId
        }
      });
      if (articleRating) {
        return res.status(201).json({
          success: true,
          message: 'Article Rated successfully',
          articleId,
          rating,
          userId: user.id
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: `Internal Server Error, ${err}`
      });
    }
  }
}

export default RatingsController;
