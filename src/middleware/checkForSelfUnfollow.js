/**
   * @description checks to see if user is following self
   *
   * @param {object} req Http request
   * @param {object} res Http response
   * @param {function} next callback
   *
   * @returns  {JSON} Returns a JSON object
   */
const checkForSelfUnfollow = async (req, res, next) => {
  const userId = await req.params.id;
  const followerId = await req.decoded.id;

  if (userId === followerId) {
    return res.status(400).json({
      success: false,
      message: 'You cannot follow or unfollow yourself'
    });
  }
  next();
};

export default checkForSelfUnfollow;
