/**
 * Class defining helper methods
 * @class HelperMethods
 * @description helper methods
 */
class HelperMethods {
  /**
   * Defines method that retuns an error when the test fails
   * @returns {object} - An error object
  */
  static testError() {
    return new Error('An error occurred while sending the request');
  }
}

export default HelperMethods;
