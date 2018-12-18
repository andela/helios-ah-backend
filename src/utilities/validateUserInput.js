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
      username, password, email, firstName, lastName,
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
      title, body, description, image,
    } = req.body;
    if (title && body && description && image) {
      next();
    } else {
      allFieldsRequired(res);
    }
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
   *
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request
   * to the next handler
   * @returns {object} res - Response object when request body is invalid
   * @memberof Validate
   */
  static validateUserRoleBody(req, res, next) {
    const { roleId } = req.body;
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
   * @description checks if id from params is UUIDV4 or not
   *
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - callback
   *
   * @returns {Boolean} Returns an object
   */
  static async uuidV4Validator(req, res, next) {
    const id = req.params.id || req.params.userId || req.params.articleId;
    const uuidV4Regex = new RegExp(['^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-',
      '[89AB][0-9A-F]{3}-[0-9A-F]{12}$'].join(''), 'i');
    const result = await uuidV4Regex.test(id);
    if (result) {
      return next();
    }
    res.status(400).json({ message: 'Invalid Id' });
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
}

export default Validate;
