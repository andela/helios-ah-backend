import Auth from '../utilities/authentication';
import Access from '../utilities/helperMethods';
import accessConstant from '../constants/access';
/**
 * Class representing the Authentication methods
 * @class Authenticate
 * @description Authenticate user writes
 */
class Authorization {
  /**
   * check if user has access
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request
   * @returns {null} - returns object
   */
  static async hasWriteAccess(req, res, next) {
    let hasAccess;
    if (req.params.articleId) {
      hasAccess = await Access
        .checkAcces(
          accessConstant.ARTICLE,
          req.params.articleId,
          req.decoded.id
        );
    }
    if (req.params.commentId) {
      hasAccess = await Access
        .checkAcces(
          accessConstant.COMMENT,
          req.params.commentId,
          req.decoded.id
        );
    }
    if (req.params.childCommentId) {
      hasAccess = await Access
        .checkAcces(
          accessConstant.CHILD,
          req.params.childCommentId,
          req.decoded.id
        );
    }
    if (req.params.userId) {
      hasAccess = await Access
        .checkAcces(
          accessConstant.USER,
          req.params.userId,
          req.decoded.id
        );
    }
    if (hasAccess) {
      return next();
    }
    return res.status(401).send({
      success: false,
      message: 'You don\'t have access to modify this record',
    });
  }

  /**
   *
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request
   * to the next handler
   * @returns {callback} next - The callback that passes the request
   * to the next handler
   * @returns {object} res - Response object containing an error due
   * to unauthorized access
   */
  static async checkToken(req, res, next) {
    const token = req.body.token || req.query.token
    || req.headers['x-access-token'];
    if (!token) {
      res.status(401).send({
        code: 401,
        message: 'User not authorized',
      });
    } else {
      try {
        const tokenVerified = await Auth.verifyToken(token);
        if (tokenVerified) {
          req.decoded = tokenVerified;
          next();
        } else {
          return res.status(401).send({
            success: false,
            message: 'Authentication failed',
          });
        }
      } catch (error) {
        return res.status(401).send({
          success: false,
          message: 'Authentication failed',
        });
      }
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
    const id = req.params.id || req.params.userId || req.params.articleId
    || req.params.commentId || req.params.childCommentId;
    const uuidV4Regex = new RegExp(['^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-',
      '[89AB][0-9A-F]{3}-[0-9A-F]{12}$'].join(''), 'i');
    const result = await uuidV4Regex.test(id);
    if (result) {
      return next();
    }
    res.status(400).json({
      success: false,
      message: 'Invalid Id'
    });
  }
}
export default Authorization;
