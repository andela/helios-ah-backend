
import {
  UserController,
  ArticleController,
  CommentController
} from '../controller';

import {
  validateUserInputs,
  follower
} from '../utilities';
import Authorization from '../middlewares/Authorization';
import userMiddleware from '../middlewares/User';
import checkArticleExists from '../middlewares/checkArticleExists';
import checkBookmarkExists from '../middlewares/checkBookmarkExists';
import findDatabaseField from '../middlewares/FindDatabaseField';
/**
 * Handles request
 * @param {object} app - An instance of the express module
 * @returns {object} - An object containing all routes
 */
const routes = (app) => {
  app.get('/api/v1/', (req, res) => {
    res.status(200).send({
      message: 'Welcome to the Authors-Haven API'
    });
  });
  app.post(
    '/api/v1/auth/signup',
    validateUserInputs.validateSignup,
    UserController.userSignup
  );
  app.post(
    '/api/v1/articles',
    Authorization.checkToken,
    validateUserInputs.validateCreateArticle,
    ArticleController.createArticle
  );
  app.delete(
    '/api/v1/articles/:articleId',
    Authorization.checkToken,
    findDatabaseField.UserInToken,
    validateUserInputs.uuidV4Validator,
    findDatabaseField.articleInParams,
    Authorization.checkForUnAuthorisedUser,
    ArticleController.deleteArticle
  );
  app.get(
    '/api/v1/profiles/:id/follow',
    validateUserInputs.uuidV4Validator,
    Authorization.checkToken,
    findDatabaseField.UserInToken,
    findDatabaseField.UserInParams,
    follower.checkForSelfFollow,
    follower.checkForExistingFollowing,
    follower.updatePreviousFollowing,
    UserController.followUser
  );
  app.delete(
    '/api/v1/profiles/:id/follow',
    validateUserInputs.uuidV4Validator,
    Authorization.checkToken,
    findDatabaseField.UserInToken,
    findDatabaseField.UserInParams,
    follower.checkForSelfUnfollow,
    UserController.unfollowUser,
    ArticleController.getArticles
  );
  app.get(
    '/api/v1/articles/user',
    Authorization.checkToken,
    ArticleController.getArticles
  );
  app.put(
    '/api/v1/articles/:articleId',
    validateUserInputs.validateCreateArticle,
    Authorization.checkToken,
    ArticleController.updateArticle
  );
  app.get(
    '/api/v1/authors',
    Authorization.checkToken,
    UserController.getAuthors
  );
  app.post(
    '/api/v1/articles/:articleId/comments',
    validateUserInputs.validateCreateComment,
    Authorization.checkToken,
    CommentController.createComment
  );
  app.post(
    '/api/v1/comments/:commentId/childcomments',
    validateUserInputs.validateCreateComment,
    Authorization.checkToken,
    CommentController.createChildComment
  );
  app.post(
    '/api/v1/user/requests/password/reset',
    userMiddleware.getUserByMail,
    UserController.requestResetPassword
  );
  app.put(
    '/api/v1/change/password',
    userMiddleware.getUserByMail,
    Authorization.checkToken,
    UserController.resetPassword
  );
  app.put(
    '/api/v1/users/role/:userId',
    Authorization.checkToken,
    validateUserInputs.validateUserRoleAuth,
    validateUserInputs.validateUserRoleBody,
    UserController.userRole
  );
  app.post(
    '/api/v1/articles/:articleId/bookmark',
    Authorization.checkToken,
    findDatabaseField.UserInToken,
    validateUserInputs.uuidV4Validator,
    checkArticleExists,
    checkBookmarkExists,
    ArticleController.bookmarkArticle
  );
  app.get(
    '/api/v1/articles',
    Authorization.checkToken,
    ArticleController.getArticles,
  );
};

export default routes;
