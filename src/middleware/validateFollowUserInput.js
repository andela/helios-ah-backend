import {
  findDatabaseField,
  follower,
  uuidV4Validator
} from '../utilities';


/**
 * @function validateFollowUserInput
 *
  * @description validates all input before follow user controller
   *
   * @param {object} req http request
   * @param {object} res http response
   * @param {function} next callback
   *
   * @returns  {JSON} Returns a JSON object
   */
const validateFollowUserInput = async (req, res, next) => {
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

  const checkForExistingFollowing = await follower
    .queryForExistingFollowing(true, userId, followerId);

  if (checkForExistingFollowing) {
    return res.status(409).json({
      success: false,
      message: 'You are already following this user'
    });
  }

  const isPreviousFollowing = await
  follower.queryForExistingFollowing(false, userId, followerId);

  if (isPreviousFollowing) {
    await follower
      .queryForUpdatingPreviousFollowing(true, userId, followerId);

    return res.status(200).json({
      success: true,
      message: 'You are now following this user'
    });
  }

  req.user = userInParams;
  next();
};

export default validateFollowUserInput;
