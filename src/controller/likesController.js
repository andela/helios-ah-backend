import models from '../models';
import { checkFeedbackExist } from '../utilities';

const {
  Feedback,
} = models;

/**
 * Class representing the Likes Controller
 * @class LikesController
 * @description Likes Controller
 */
class LikesController {
  /**
   * like an Article
   * Route: POST: POST /api/v1/articles/:articleId/like
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {res} res - Response object
   */
  static async likeArticle(req, res) {
    const {
      articleId
    } = req.params;
    const user = req.decoded;
    try {
      const FeedbackExist = await checkFeedbackExist(res, user, articleId);
      if (!FeedbackExist) {
        const isLiked = await Feedback.create({
          userId: user.id,
          articleId,
          isLiked: 'true'
        });
        if (isLiked) {
          return res.status(201).json({
            success: true,
            message: 'Article liked successfully',
            articleId,
            isliked: 'true',
            userId: user.id
          });
        }
      }
      res.status(400).json({
        success: false,
        message: 'Article already liked. Please consume'
        + ' a Put Route to Update like status'
      });
    } catch (err) {
      return res.status(500).json({
        message: `Internal server Error,  ${err}`,
        success: 'false'
      });
    }
  }

  /**
   * unlike an Article
   * Route: POST: /api/v1/articles/:articleId/like
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {res} res - Response object
   */
  static async unlikeArticle(req, res) {
    const {
      articleId
    } = req.params;
    const user = req.decoded;
    try {
      const isLiked = await Feedback.update({
        isLiked: 'false'
      }, {
        where: {
          userId: user.id,
          articleId
        }
      });
      if (isLiked) {
        res.status(201).json({
          success: true,
          message: 'Article unliked successfully',
          articleId,
          isliked: 'false',
          userId: user.id
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: `Internal Server Error, ${err}`
      });
    }
  }
}

export default LikesController;
