import models from '../models';

const { Comments, ChildComments } = models;

/**
 * Class representing the Comment controller
 * @class CommentController
 * @description Comments controller
 */
class CommentController {
  /**
  * Create a comment for an article
  * Route: POST: /articles/:articleId/comments
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @return {res} res - Response object
  * @memberof CommentController
 */
  static async createComment(req, res) {
    try {
      const commentCreated = await Comments.create({
        commentText: req.body.commentText,
        articleId: req.params.articleId,
        userId: req.decoded.id
      });
      if (commentCreated) {
        res.status(201).json({
          success: true,
          commentCreated,
        });
      }
    } catch (error) {
      if (error.errors) {
        return res.status(400).json({
          success: false,
          message: error.errors[0].message
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  /**
  * Create a comment on another comment
  * Route: POST: /comments/:commentId/childcomments
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @return {res} res - Response object
  * @memberof CommentController
 */
  static async createChildComment(req, res) {
    try {
      const childCommentCreated = await ChildComments.create({
        commentText: req.body.commentText,
        commentId: req.params.commentId,
        userId: req.decoded.id
      });
      if (childCommentCreated) {
        res.status(201).json({
          success: true,
          childCommentCreated,
        });
      }
    } catch (error) {
      if (error.errors) {
        return res.status(400).json({
          success: false,
          message: error.errors[0].message
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

export default CommentController;
