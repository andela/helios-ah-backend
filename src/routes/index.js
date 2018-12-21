
import passport from 'passport';

import {
  UserController,
  ArticleController,
  LikesController,
  RatingsController,
  CommentController,
  SocialLoginController,
  ReportController
} from '../controller';

import {
  validateUserInputs,
  follower
} from '../utilities';

import {
  userMiddleware,
  checkArticleExists,
  ValidateArticle,
  Authorization,
  checkBookmarkExists,
  findDatabaseField,
  checkFeedback
} from '../middleware';

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
  app.get(
    '/api/v1/auth/complete_reg/',
    Authorization.checkToken,
    UserController.completeRegistration
  );
  app.post(
    '/api/v1/auth/signup',
    validateUserInputs.validateSignup,
    UserController.userSignup
  );
  app.post(
    '/api/v1/auth/login',
    validateUserInputs.validateLogin,
    UserController.userLogin
  );
  app.post(
    '/api/v1/articles',
    Authorization.checkToken,
    validateUserInputs.validateCreateArticle,
    ArticleController.createArticle
  );
  app.get(
    '/api/v1/profiles/:id/follow',
    Authorization.checkToken,
    Authorization.uuidV4Validator,
    findDatabaseField.UserInToken,
    findDatabaseField.UserInParams,
    follower.checkForSelfFollow,
    follower.checkForExistingFollowing,
    follower.updatePreviousFollowing,
    UserController.followUser
  );
  app.delete(
    '/api/v1/profiles/:id/follow',
    Authorization.checkToken,
    Authorization.uuidV4Validator,
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
    Authorization.checkToken,
    validateUserInputs.validateCreateArticle,
    ArticleController.updateArticle
  );
  app.get(
    '/api/v1/authors',
    Authorization.checkToken,
    UserController.getAuthors
  );
  app.post(
    '/api/v1/articles/:articleId/comments',
    Authorization.checkToken,
    validateUserInputs.validateCreateComment,
    CommentController.createComment
  );
  app.put(
    '/api/v1/articles/comments/:commentId',
    Authorization.checkToken,
    Authorization.uuidV4Validator,
    Authorization.hasWriteAccess,
    validateUserInputs.validateCreateComment,
    CommentController.updateComment
  );
  app.put(
    '/api/v1/articles/comments/childComments/:childCommentId',
    Authorization.checkToken,
    Authorization.uuidV4Validator,
    Authorization.hasWriteAccess,
    validateUserInputs.validateCreateComment,
    CommentController.updateComment
  );
  app.post(
    '/api/v1/comments/:commentId/childcomments',
    Authorization.checkToken,
    validateUserInputs.validateCreateComment,
    CommentController.createChildComment
  );
  app.post(
    '/api/v1/user/requests/password/reset',
    userMiddleware.getUserByMail,
    UserController.requestResetPassword
  );
  app.put(
    '/api/v1/change/password',
    Authorization.checkToken,
    userMiddleware.getUserByMail,
    UserController.resetPassword
  );
  app.put(
    '/api/v1/users/role/:userId',
    Authorization.checkToken,
    validateUserInputs.validateUserRoleAuth,
    validateUserInputs.validateUserRoleBody,
    UserController.userRole
  );
  app.get(
    '/api/v1/auth/social_fb',
    passport.authenticate('facebook', { session: false }),
  );
  app.get(
    '/api/v1/auth/social_fb/callback',
    passport.authenticate('facebook', {
      failureRedirect: 'api/v1/social_login/failed',
      session: false,
    }),
    SocialLoginController.facebookLogin,
  );
  app.get(
    '/api/v1/auth/social_tw',
    passport.authenticate('twitter', { session: false }),
  );
  app.get(
    '/api/v1/auth/social_tw/callback',
    passport
      .authenticate('twitter', {
        failureRedirect: 'api/v1/social_login/failed',
        session: false,
      }),
    SocialLoginController.twitterLogin,
  );
  app.get(
    '/api/v1/auth/social_ggl',
    passport
      .authenticate('google', { session: false, scope: ['profile', 'email'] }),
  );
  app.get(
    '/api/v1/auth/social_ggl/callback',
    passport.authenticate('google', {
      failureRedirect: 'api/v1/social_login/failed',
      session: false,
      scope: ['profile'],
    }),
    SocialLoginController.googleLogin,
  );
  app.get(
    'api/v1/social_login/failed',
    SocialLoginController.socialLoginFailed
  );
  app.post(
    '/api/v1/articles/:articleId/likes',
    Authorization.checkToken,
    checkArticleExists,
    ValidateArticle.checkArticleNotDraft,
    checkFeedback.checkLikesExist,
    LikesController.likeArticle
  );
  app.put(
    '/api/v1/articles/:articleId/likes',
    Authorization.checkToken,
    checkArticleExists,
    checkFeedback.checkLikesNotExist,
    LikesController.updateLikes
  );
  app.post(
    '/api/v1/articles/:articleId/ratings',
    Authorization.checkToken,
    checkArticleExists,
    ValidateArticle.checkArticleNotDraft,
    checkFeedback.checkRatingExist,
    validateUserInputs.validateRating,
    RatingsController.rateArticle
  );
  app.put(
    '/api/v1/articles/:articleId/ratings',
    Authorization.checkToken,
    checkArticleExists,
    checkFeedback.checkRatingNotExist,
    validateUserInputs.validateRating,
    RatingsController.updateRating
  );
  app.post(
    '/api/v1/articles/:articleId/bookmark',
    Authorization.checkToken,
    findDatabaseField.UserInToken,
    Authorization.uuidV4Validator,
    checkArticleExists,
    checkBookmarkExists,
    ArticleController.bookmarkArticle
  );
  app.get(
    '/api/v1/articles',
    ArticleController.getArticles,
  );
  app.post(
    '/api/v1/articles/:articleId/report',
    Authorization.checkToken,
    validateUserInputs.validateReport,
    ReportController.reportArticle
  );
};

export default routes;
