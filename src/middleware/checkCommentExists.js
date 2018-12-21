import models from '../models';
import { helperMethods } from '../utilities';

const { Comments, ChildComments } = models;

/**
 *
 * @function checkCommentExists
 * @description checks if comment exists on the database
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 * @param {Function} next - callback function
 * @returns {object} - message from server
*/
const checkCommentExists = async (req, res, next) => {
  try {
    const { commentId, childCommentId } = await req.params;
    let comment;
    if (commentId) {
      comment = await Comments.findByPk(commentId);
    }
    if (childCommentId) {
      const options = {
        where: {
          id: childCommentId
        },
        attributes: ['id']
      };
      comment = await ChildComments.findOne(options);
    }
    if (comment) {
      req.comment = comment;
      next();
    } else {
      return helperMethods.notFoundError(res, 'Comment does not exist');
    }
  } catch (error) {
    return helperMethods.serverError(res);
  }
};
export default checkCommentExists;
