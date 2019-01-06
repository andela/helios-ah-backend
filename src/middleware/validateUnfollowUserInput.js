import {
  findDatabaseField,
  follower,
  uuidV4Validator
} from '../utilities';


/**
 * @function validateUnfollowUserInput
 *
  * @description validates all input before unfollow user controller
   *
   * @param {object} req http request
   * @param {object} res http response
   * @param {function} next callback
   *
   * @returns  {JSON} Returns a JSON object
   */
const validateUnfollowUserInput = async (req, res, next) => {
  const followerId = req.decoded.id;
  const userId = req.params.id;

  const userInToken = await findDatabaseField.UserInToken(followerId);

  if (!userInToken) {
    return res.status(404).json({ message: 'User does not exist' });
  }

  const isValidId = await uuidV4Validator(userId);

  if (!isValidId) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Id'
    });
  }

  const userInParams = await findDatabaseField
    .UserInParams(userId, res);

  if (!userInParams) {
    return res.status(404).json({ message: 'User does not exist' });
  }

  const isExistingFollowing = await
  follower.queryForExistingFollowing(true, userId, followerId);

  if (!isExistingFollowing) {
    return res.status(400).json({
      success: false,
      message: 'You do not follow this user'
    });
  }
  req.user = userInParams;
  next();
};

export default validateUnfollowUserInput;
