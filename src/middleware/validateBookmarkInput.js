import {
  findDatabaseField,
  checkArticleExists,
  checkBookmarkExists,
  uuidV4Validator,
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

  const userInToken = await findDatabaseField.UserInToken(userId);

  if (!userInToken) {
    return res.status(404).json({ message: 'User does not exist' });
  }

  const isValidId = await uuidV4Validator(articleId);

  if (!isValidId) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Id'
    });
  }

  const article = await checkArticleExists(articleId);
  const bookmark = await checkBookmarkExists(userId, articleId);

  if (!article) {
    return res.status(404).json({
      success: false,
      message: 'Article does not exist'
    });
  }

  if (bookmark) {
    return res.status(409).json({
      message: 'Bookmark already exists'
    });
  }
  req.article = article;
  next();
};

export default validateBookmarkInput;
