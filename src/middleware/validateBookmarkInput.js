import {
  findDatabaseField,
  checkArticleExists,
  checkBookmarkExists,
  uuidV4Validator,
  helperMethods
} from '../utilities';


/**
 * @function validateBookmarkInput
 *
  * @description validates all input before bookmark controller
   *
   * @param {object} req http request
   * @param {object} res http response
   * @param {function} next callback
   *
   * @returns  {JSON} Returns a JSON object
   */
const validateBookmarkInput = async (req, res, next) => {
  const userId = req.decoded.id;
  const { articleId } = req.params;
  let isValidId, article, bookmark, userInToken;
  try {
    userInToken = await findDatabaseField.UserInToken(userId, res);

    if (userInToken === true) {
      isValidId = await uuidV4Validator(articleId, res);
    }
    if (isValidId === true) {
      article = await checkArticleExists(articleId, res);
    }
    if (article) {
      bookmark = await checkBookmarkExists(userId, articleId, res);
    }

    if (bookmark === false) {
      req.article = article;
      next();
    }
  } catch (error) {
    helperMethods.serverError(res);
  }
};

export default validateBookmarkInput;
