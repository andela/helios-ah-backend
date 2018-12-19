import models from '../models';

const {
  Likes,
  Ratings
} = models;

/**
 * @description - Function checks values exists in a table
 * @function fineOneData
 * @param {object} req - request
 * @param {string} table - the database table to be queried
 * @returns {object} returns an output
 */
const findOneData = async (req, table) => {
  const user = req.decoded;
  const report = await table.findOne({
    where: {
      userId: user.id,
      articleId: req.params.articleId,
    }
  });
  return report;
};

/**
 * @class checkFeedbackExists
 * @description class containing logic to check if
 * a certain feedback already exist
 */
class checkFeedback {
  /**
   * function checks if feedback table contains a previous Like
   * @function checkLikes
   * @description checks if article exists on the database
   * @param {object} req - response
   * @param {object} res - Request Object
   * @param {object} next - UUID
   * @returns {object} - message from server
   */
  static async checkLikesExist(req, res, next) {
    const report = await findOneData(req, Likes);
    if (!report) {
      return next();
    }
    res.status(400).json({
      success: false,
      message: `Article ${req.params.articleId}, has already been liked.`
    });
  }

  /**
   * function checks if feedback table does not contains previous Like
   * @function checkLikes
   * @description checks if Likes exists on the database before update
   * @param {object} req - response
   * @param {object} res - Request Object
   * @param {object} next - next
   * @returns {object} - message from server
   */
  static async checkLikesNotExist(req, res, next) {
    const report = await findOneData(req, Likes);
    if (!report) {
      return res.status(400).json({
        success: false,
        message: 'Can not update Like status, Data does not exist'
      });
    }
    next();
  }

  /**
   * function checks if feedback table contains a previous Ratings
   * @function checkLikes
   * @description checks if article exists on the database
   * @param {object} req - response
   * @param {object} res - Request Object
   * @param {object} next - UUID
   * @returns {object} - message from server
   */
  static async checkRatingExist(req, res, next) {
    const report = await findOneData(req, Ratings);
    if (!report) {
      return next();
    }
    res.status(400).json({
      success: false,
      message: `Article ${req.params.articleId}, has already been rated.`
    });
  }

  /**
   * function checks if feedback table does not contain a previous Ratings
   * @function checkLikes
   * @description checks if Likes exists on the database before update
   * @param {object} req - response
   * @param {object} res - Request Object
   * @param {object} next - next
   * @returns {object} - message from server
   */
  static async checkRatingNotExist(req, res, next) {
    const report = await findOneData(req, Ratings);
    if (!report) {
      return res.status(400).json({
        success: false,
        message: 'Can not update Ratings status, Data does not exist'
      });
    }
    next();
  }
}

export default checkFeedback;
