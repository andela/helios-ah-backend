/**
 * Class representing the Error Utilities
 * @class Error
 * @description Create structured errors
 */
class Error {
  /**
  * Send error to the client
  * @argument {object} res - Response object
  * @argument {object} error - Error object
  * @return {res} res - Response object
  * @memberof Error
 */
  static sendError(res, error) {
    if (error.errors) {
      res.status(400).json({
        success: false,
        message: error.errors[0].message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error,
      });
    }
  }
}

export default Error;
