import {
  findDatabaseField,
  follower,
  uuidV4Validator,
  helperMethods
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

  let isValidId, userInToken, userInParams, isExistingFollowing;
  let updateFollowingStatus;

  try {
    userInToken = await findDatabaseField.UserInToken(followerId, res);

    if (userInToken === true) {
      isValidId = await uuidV4Validator(userId, res);
    }
    if (isValidId === true) {
      userInParams = await findDatabaseField.UserInParams(userId, res);
    }
    if (userInParams) {
      isExistingFollowing = await follower
        .queryForExistingFollowing(true, false, userId, followerId, res);
    }

    if (isExistingFollowing === true) {
      updateFollowingStatus = await follower
        .queryForUpdatingPreviousFollowing(false, userId, followerId, res);
    }

    if (updateFollowingStatus === true) {
      next();
    }
  } catch (error) {
    helperMethods.serverError(res);
  }
};

export default validateUnfollowUserInput;
