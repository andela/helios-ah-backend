

/**
 * @function uuidV4Validator
   * @description checks if id from params is UUIDV4 or not
   *
   * @param {string} id - id of entity
   * @param {object} res - Http response

   * @returns {Boolean} Returns an object
   */
const uuidV4Validator = async (id, res) => {
  const uuidV4Regex = new RegExp(['^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-',
    '[89AB][0-9A-F]{3}-[0-9A-F]{12}$'].join(''), 'i');

  const result = await uuidV4Regex.test(id);
  if (!result) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Id'
    });
  }
  return true;
};

export default uuidV4Validator;
