import models from '../models';

const {
  Comments, ChildComments, ChildCommentHistory, CommentHistory, sequelize
} = models;

/**
 * Class representing the Comment controller
 * @class CommentController
 * @description Comments controller
 */
class UpdateComment {
  /**
  * Create a comment on another comment
  * @param {object} body - Request body object
  * @param {string} instance - Comment Id
  * @param {boolean} isChildComment - Response object
  * @return {res} res - new instance
  * @memberof UpdateComment
 */
  static async updateComment(body, instance, isChildComment = false) {
    const options = {
      where: {
        id: instance.id,
      },
      returning: true,
    };
    return sequelize.transaction(async (t) => {
      options.transaction = t;
      if (!isChildComment) {
        await CommentHistory.create({
          commentId: instance.id,
          userId: instance.userId,
          oldComment: instance.commentText
        });
        const updatedComment = await Comments.update({
          commentText: body.commentText
        }, options);
        return updatedComment[1][0];
      }
      await ChildCommentHistory.create({
        childCommentId: instance.id,
        userId: instance.userId,
        oldComment: instance.commentText
      });
      const updatedComment = await ChildComments.update({
        commentText: body.commentText
      }, options);
      return updatedComment[1][0];
    });
  }
}

export default UpdateComment;
