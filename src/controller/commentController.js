import models from '../models';
import UpdateComment from '../utilities/UpdateComment';
import Error from '../utilities/Error';

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
      Error.handleErrorResponse(res, error);
    }
  }

  /**
  * Update a comment for an article
  * Route: PUT: /articles/comments/:commentId
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @return {res} res - Response object
  * @memberof CommentController
 */
  static async updateComment(req, res) {
    const options = {
      attributes: [
        'id',
        'commentText',
        'userId',
      ],
    };
    let updatedComment, comment, isChild = false;
    try {
      if (req.params.commentId) {
        options.attributes.push('articleId');
        options.where = {
          id: req.params.commentId,
        };
        comment = await Comments.findOne(options);
      } else {
        options.attributes.push('commentId');
        options.where = {
          id: req.params.childCommentId,
        };
        comment = await ChildComments.findOne(options);
        isChild = true;
      }

      if (comment.commentText) {
        if (comment.commentText !== req.body.commentText) {
          updatedComment = await UpdateComment
            .updateComment(req.body, comment, isChild);
        }
        return res.status(200).json({
          success: true,
          updatedComment: updatedComment || req.body
        });
      }
      return res.status(404).json({
        success: false,
        message: 'invalid comment Id'
      });
    } catch (error) {
      Error.handleErrorResponse(res, error);
    }
  }

  /**
  * Create a comment on another comment
  * Route: POST: /comments/:commentId/childComments
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
      Error.handleErrorResponse(res, error);
    }
  }
}

export default CommentController;
