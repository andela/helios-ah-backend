import models from '../models';
import { helperMethods } from '../utilities';

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
      return helperMethods.serverError(res);
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
      return helperMethods.serverError(res);
    }
  }
}

export default LikesController;