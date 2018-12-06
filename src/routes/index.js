
import {
  UserController,
  ArticleController,
} from '../controller';

import { validateUserInputs } from '../utilities';
import Authorization from '../middlewares/Authorization';

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
    validateUserInputs.validateCreateArticle,
    Authorization.checkToken,
    ArticleController.createArticle
  );
  app.get(
    '/api/v1/authors',
    UserController.getAuthors
  );
  app.get(
    '/api/v1/authors/:search',
    UserController.getAuthors
  );
};

export default routes;
