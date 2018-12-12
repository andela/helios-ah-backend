
import {
  UserController,
  ArticleController,
} from '../controller';

import { validateUserInputs, authentication } from '../utilities';
import userMiddleware from '../middlewares/User';

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
    UserController.completeRegistration
  );
  app.post(
    '/api/v1/auth/signup',
    validateUserInputs.validateSignup,
    UserController.userSignup
  );
  app.post(
    '/api/v1/articles',
    authentication.checkToken,
    validateUserInputs.validateCreateArticle,
    ArticleController.createArticle
  );
  app.post(
    '/api/v1/user/requests/password/reset',
    userMiddleware.getUserByMail,
    UserController.requestResetPassword
  );
  app.put(
    '/api/v1/change/password',
    authentication.checkToken,
    userMiddleware.getUserByMail,
    UserController.resetPassword
  );
  app.put(
    '/api/v1/users/role/:userId',
    authentication.checkToken,
    validateUserInputs.validateUserRoleAuth,
    validateUserInputs.validateUserRoleBody,
    UserController.userRole
  );
};

export default routes;
