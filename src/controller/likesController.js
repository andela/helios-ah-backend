import models from '../models';

const {
  Likes
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
      const isLiked = await Likes.create({
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
    } catch (err) {
      return res.status(500).json({
        where: 'like controller',
        success: false,
        message: 'Internal server Error'
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
  static async updateLikes(req, res) {
    const {
      articleId,
      liked
    } = req.params;
    const user = req.decoded;
    try {
      const isLiked = await Likes.update({
        isLiked: liked || 'false'
      }, {
        where: {
          userId: user.id,
          articleId
        }
      });
      if (isLiked) {
        return res.status(200).json({
          success: true,
          message: 'Article unliked successfully',
          articleId,
          isliked: 'false',
          userId: user.id
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error'
      });
    }
  }
}

export default LikesController;
