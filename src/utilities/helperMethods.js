import models from '../models';

const {
  Users, Comments, ChildComments, Article
} = models;
/**
 * A method used to send server errors
 * @param {object} res - HTTP response object
 * @param {String} message - The error message you want to set.
 * @returns {object} res - The HTTP response object
 */
const serverError = (res, message) => res.status(500).json({
  success: false,
  message: message || 'Internal server error',
});

/**
 * A method used to send sequelize validation error
 * @param {object} res - HTTP response object
 * @param {object} error - The error object from sequelize.
 * @returns {object} res - The HTTP response object
 */
const sequelizeValidationError = (res, error) => res.status(400).json({
  success: false,
  message: error.errors[0].message,
});

/**
 * A method used to confirm that a request was successful
 * @param {object} res - HTTP response object
 * @param {string} message - Custom message we want to send to the fron-end
 * @returns {object} res - HTTP response object
 */
const requestSuccessful = (res, message) => res.status(200).json({
  success: true,
  message: message || 'request completed successfully',
});

/**
 * A method used to send sequelize validation error
 * @param {string} schema - DataBase Schema
 * @param {string} itemId - Schema item
 * @param {object} userId - The user trying to modify data.
 * @returns {object} res - The HTTP response object
 */
const checkAcces = async (schema, itemId, userId) => {
  const ARTICLE = 'ARTICLE', COMMENT = 'COMMENT',
    CHILD = 'CHILD-COMMENT', USER = 'USER';
  const options = {
    where: {
      id: itemId,
      userId
    }
  };
  let user;
  switch (schema) {
    case ARTICLE:
      user = await Article.count(options);
      break;
    case COMMENT:
      user = await Comments.count(options);
      break;
    case CHILD:
      user = await ChildComments.count(options);
      break;
    case USER:
      user = await Users.count(options);
      break;
    default:
      user = 0;
      break;
  }
  return user;
};

export default {
  serverError,
  sequelizeValidationError,
  requestSuccessful,
  checkAcces,
};
