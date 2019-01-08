import {
  findDatabaseField,
  follower,
  uuidV4Validator,
  helperMethods
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

  let isValidId, userInToken, userInParams, checkForExistingFollowing;
  try {
    userInToken = await findDatabaseField.UserInToken(followerId, res);

    if (userInToken === true) {
      isValidId = await uuidV4Validator(userId, res);
    }
    if (isValidId === true) {
      userInParams = await findDatabaseField.UserInParams(userId, res);
    }
    if (userInParams) {
      checkForExistingFollowing = await follower
        .queryForExistingFollowing(true, true, userId, followerId, res);
    }

    if (checkForExistingFollowing === true) {
      await follower
        .queryForUpdatingPreviousFollowing(true, true, userId, followerId, res);
    }

    if (checkForExistingFollowing === false) {
      req.user = userInParams;
      next();
    }
  } catch (error) {
    helperMethods.serverError(res);
  }
};


export default validateFollowUserInput;
