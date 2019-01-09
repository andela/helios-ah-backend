import passport from 'passport';

import {
  UserController,
  ArticleController,
  LikesController,
  RatingsController,
  CommentController,
  TagController,
  HighlightController,
  SocialLoginController,
  ReportController,
  NotificationController,
} from '../controller';

import {
  validateUserInputs,
} from '../utilities';

import {
  userMiddleware,
  checkArticleExists,
  ValidateArticle,
  Authorization,
  checkCommentExists,
  findDatabaseField,
  checkFeedback,
  checkForSelfFollow,
  validateBookmarkInput,
  validateFollowUserInput,
  validateUnfollowUserInput
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
    findDatabaseField.UserInToken,
    validateUserInputs.validateCreateArticle,
    ArticleController.createArticle
  );
  app.delete(
    '/api/v1/articles/:articleId',
    Authorization.checkToken,
    findDatabaseField.UserInToken,
    Authorization.uuidV4Validator,
    findDatabaseField.articleInParams,
    Authorization.hasWriteAccess,
    ArticleController.deleteArticle
  );
  app.get(
    '/api/v1/notifications/email',
    Authorization.checkToken,
    findDatabaseField.UserInToken,
    NotificationController.optIntoEmailNotifications
  );
  app.get(
    '/api/v1/notifications/app',
    Authorization.checkToken,
    findDatabaseField.UserInToken,
    NotificationController.optIntoInAppNotifications
  );
  app.delete(
    '/api/v1/notifications/email',
    Authorization.checkToken,
    findDatabaseField.UserInToken,
    NotificationController.optOutOfEmailNotifications
  );
  app.delete(
    '/api/v1/notifications/app',
    Authorization.checkToken,
    findDatabaseField.UserInToken,
    NotificationController.optOutOfInAppNotifications
  );
  app.get(
    '/api/v1/profiles/:id/follow',
    Authorization.checkToken,
    checkForSelfFollow,
    validateFollowUserInput,
    UserController.followUser
  );
  app.delete(
    '/api/v1/profiles/:id/follow',
    Authorization.checkToken,
    checkForSelfFollow,
    validateUnfollowUserInput,
    UserController.unfollowUser
  );
  app.get(
    '/api/v1/articles/user',
    Authorization.checkToken,
    ArticleController.getArticles
  );
  app.get(
    '/api/v1/articles/:articleId',
    Authorization.uuidV4Validator,
    ArticleController.getArticle
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
    '/api/v1/comments/:commentId/childComments',
    Authorization.checkToken,
    validateUserInputs.validateCreateComment,
    CommentController.createChildComment
  );
  app.post(
    '/api/v1/articles/tag/:articleId',
    Authorization.checkToken,
    TagController.createTag
  );
  app.post(
    '/api/v1/comments/:commentId/likes',
    Authorization.checkToken,
    checkCommentExists,
    checkFeedback.checkLikedCommentExist,
    LikesController.likeComment
  );
  app.put(
    '/api/v1/comments/:commentId/likes',
    Authorization.checkToken,
    validateUserInputs.validateLikeStatus,
    checkCommentExists,
    checkFeedback.verifyLikeStatus,
    LikesController.updateCommentLike
  );
  app.post(
    '/api/v1/childComments/:childCommentId/likes',
    Authorization.checkToken,
    checkCommentExists,
    checkFeedback.checkLikedCommentExist,
    LikesController.likeComment
  );
  app.put(
    '/api/v1/childComments/:childCommentId/likes',
    Authorization.checkToken,
    validateUserInputs.validateLikeStatus,
    checkCommentExists,
    checkFeedback.verifyLikeStatus,
    LikesController.updateCommentLike
  );
  app.post(
    '/api/v1/articles/tag/:articleId',
    Authorization.checkToken,
    TagController.createTag
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
    findDatabaseField.UserInToken,
    checkArticleExists,
    ValidateArticle.checkArticleNotDraft,
    checkFeedback.checkLikesExist,
    LikesController.likeArticle
  );
  app.put(
    '/api/v1/articles/:articleId/likes',
    Authorization.checkToken,
    findDatabaseField.UserInToken,
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
    validateBookmarkInput,
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
  app.post(
    '/api/v1/highlights/:articleId',
    Authorization.checkToken,
    Authorization.uuidV4Validator,
    validateUserInputs.validateCreateComment,
    HighlightController.createHighlight
  );
  app.post(
    '/api/v1/highlights/comment/:highlightId',
    Authorization.checkToken,
    Authorization.uuidV4Validator,
    validateUserInputs.validateCreateComment,
    HighlightController.createHighlightComment
  );
  app.get(
    '/api/v1/highlights/:articleId',
    Authorization.uuidV4Validator,
    HighlightController.getHighlights
  );
};

export default routes;
