import {
  UserController,
  ArticleController,
  LikesController,
  RatingsController
} from '../controller';

import { validateUserInputs } from '../utilities';

import {
  userMiddleware,
  checkArticleExists,
  ValidateArticle,
  Authorization
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
  app.get(
    '/api/v1/articles',
    Authorization.checkToken,
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
    '/api/v1/articles/:articleId/likes',
    Authorization.checkToken,
    checkArticleExists,
    ValidateArticle.checkArticleNotDraft,
    LikesController.likeArticle
  );
  app.put(
    '/api/v1/articles/:articleId/likes',
    Authorization.checkToken,
    checkArticleExists,
    LikesController.unlikeArticle
  );
  app.post(
    '/api/v1/articles/:articleId/ratings',
    Authorization.checkToken,
    checkArticleExists,
    ValidateArticle.checkArticleNotDraft,
    validateUserInputs.validateRating,
    RatingsController.rateArticle
  );
  app.put(
    '/api/v1/articles/:articleId/ratings',
    Authorization.checkToken,
    checkArticleExists,
    validateUserInputs.validateRating,
    RatingsController.updateRating
  );
};

export default routes;
