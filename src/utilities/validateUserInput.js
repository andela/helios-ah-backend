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
 * @returns {res} - Response object
 */
const allFieldsRequired = (res) => {
  res.status(400).send({
    message: 'Invalid request. All fields are required',
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
      username, password, email, bio, firstName, lastName,
    } = req.body;
    if (username && password && email && bio && firstName && lastName) {
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
}

export default Validate;
