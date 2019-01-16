import isIdValid from './isValidId';

/**
 * Trims input values from user
 * @param {object} objectWithValuesToTrim - request body to trim
 * @returns {object} trimmedValues - trimmed values of the request object
 */
const trimValues = (objectWithValuesToTrim) => {
  const trimmedValues = objectWithValuesToTrim;
  Object.keys(trimmedValues).forEach((key) => {
    trimmedValues[key] = trimmedValues[key].trim();
  });
  return trimmedValues;
};

/**
 * Defines the failed message returned when required fields are missing.
 * @param {object} res - Response object
 * @param {string} message - specific error message
 * @returns {res} - Response object
 */
const allFieldsRequired = (res, message) => {
  res.status(400).send({
    success: false,
    message: message || 'Invalid request. All fields are required',
  });
};

/** class representing an handler's validation
 * @class Validate
 * @description Validation for user inputs in all requests
 */
class Validate {
  /**
   *
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request
   * to the next handler
   * @returns {object} res - Response object when query is invalid
   * @memberof Validate
   */
  static validateSignup(req, res, next) {
    req.body = trimValues(req.body);
    const {
      username,
      password,
      email,
      firstName,
      lastName,
    } = req.body;
    if (username && password && email && firstName && lastName) {
      next();
    } else {
      allFieldsRequired(res);
    }
  }

  /**
   *
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request
   * to the next handler
   * @returns {object} res - Response object when query is invalid
   * @memberof Validate
   */
  static validateLogin(req, res, next) {
    req.body = trimValues(req.body);
    const {
      password, email
    } = req.body;
    if (password && email) {
      next();
    } else {
      allFieldsRequired(res);
    }
  }

  /**
   *
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request
   * to the next handler
   * @returns {object} res - Response object when query is invalid
   * @memberof Validate
   */
  static validateCreateArticle(req, res, next) {
    req.body = trimValues(req.body);
    const {
      title,
      body,
      description,
    } = req.body;
    if (title && body && description) {
      next();
    } else {
      allFieldsRequired(res);
    }
  }

  /**
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request
   * to the next handler
   * @returns {object} res - Response object when query is invalid
   * @memberof Validate
   */
  static validateCreateComment(req, res, next) {
    req.body = trimValues(req.body);
    const {
      commentText
    } = req.body;
    if (commentText) {
      next();
    } else {
      allFieldsRequired(res, 'commentText field is required');
    }
  }

  /**
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request
   * to the next handler
   * @returns {object} res - Response object when request body is invalid
   * @memberof Validate
   */
  static validateUserRoleBody(req, res, next) {
    const {
      roleId
    } = req.body;
    if (roleId && roleId >= 1 && roleId <= 3) {
      next();
    } else {
      res.status(400).send({
        message: 'Invalid role passed',
      });
    }
  }

  /**
   *
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request
   * to the next handler
   * @returns {object} res - Response object when authentication fail
   * @memberof Validate
   */
  static validateUserRoleAuth(req, res, next) {
    const roleId = req.decoded.role;
    if (roleId && (roleId === 2 || roleId === 3)) {
      next();
    } else {
      res.status(401).send({
        message: 'Invalid token. Only Admins. can update roles',
      });
    }
  }

  /**
   * Validate ratings Input
   * @param {integer} req - request
   * @param {object} res - Response object
   *  @param {callback} next - The callback that passes the request
   * to the next handler
   * @returns {object} - server responce
   */
  static validateRating(req, res, next) {
    const rating = parseInt(req.body.rating, 10);
    if ((rating > 5) || (rating < 1)) {
      return res.status(400).json({
        success: false,
        message: 'Bad request, Rating should be within the range of 1 to 5',
      });
    }
    next();
  }

  /**
   *  *
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request
   * to the next handler
   * @returns {object} res - Response object when query is invalid
   * @memberof Validate
   */
  static validateReport(req, res, next) {
    let message;
    req.body = trimValues(req.body);
    const {
      reportComment, type
    } = req.body;
    if (!(type === 'plagiarism' || type === 'agreementViolation')) {
      message = 'type is required and must be \'plagiarism\' '
       + 'or \'agreementViolation\'';
    }
    if (!reportComment) {
      message = 'reportComment field is required';
    }
    if (message) {
      allFieldsRequired(res, message);
    } else {
      next();
    }
  }

  /**
   * @description validates the like field
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request
   * to the next handler
   * @returns {object} res - Response object when query is invalid
   * @memberof Validate
   */
  static validateLikeStatus(req, res, next) {
    return (req.body.like === 'true' || req.body.like === 'false') ? next()
      : allFieldsRequired(res, 'like is required and must be a boolean');
  }

  /**
   * *
   * @param {object} req - HTTP request object
   * @param {object} res - HTTP response object
   * @param {callback} next - The callback that passes the request
   * to the next handler
   * @returns {object} res - HTTP response object
   * @memberof Validate
   */
  static async validateShareArticle(req, res, next) {
    req.body = trimValues(req.body);
    const {
      articleId,
      title,
      author,
      email
    } = req.body;
    if (articleId && title && author && email) {
      const isArticleIdValid = await isIdValid(articleId, res);
      if (isArticleIdValid === true) next();
    } else {
      allFieldsRequired(res);
    }
  }

  /**
   *
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request
   * to the next handler
   * @returns {object} res - Response object when query is invalid
   * @memberof Validate
   */
  static validateUserUpdate(req, res, next) {
    req.body = trimValues(req.body);
    const {
      firstName,
      lastName,
      image,
      bio
    } = req.body;
    if (
      firstName || lastName || image || bio
    ) {
      next();
    } else {
      allFieldsRequired(
        res,
        'firstname,lastname, image, or bio is required for update'
      );
    }
  }
}


export default Validate;
