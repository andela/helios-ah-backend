import models from '../models';

const {
  Feedback,
} = models;


/**
 * function checks if feedback table contains a previous feedback
 * @function checkFeedbackExist
 *@description checks if article exists on the database
 * @param {object} res - response
 * @param {object} user - Request Object
 * @param {object} articleId - UUID
 * @returns {object} - message from server
 */
const checkFeedbackExist = async (res, user, articleId) => {
  const report = await Feedback.findOne({
    where: {
      userId: user.id,
      articleId
    }
  });
  if (report) {
    return true;
  }
  return false;
};

export default checkFeedbackExist;
