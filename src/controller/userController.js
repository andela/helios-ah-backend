import { cryptData } from '../utilities';
import models from '../models';

const { Users } = models;

/**
 * Class representing the user controller
 * @class UserController
 * @description users controller
 */
class UserController {
  /**
  * Sign up a user
  * Route: POST: /auth/signup
  * @param {object} req -Request object
  * @param {object} res - Response object
  * @return {res} res - Response object
  * @memberof USerController
 */
  static async userSignup(req, res) {
    const {
      username, password, email, firstName, lastName, bio
    } = req.body;
    try {
      const encryptedPassword = await cryptData.encryptData(password);
      const userCreated = await Users.create({
        username,
        password: encryptedPassword,
        email,
        firstName,
        lastName,
        bio,
      });
      if (userCreated) {
        res.status(201).send({
          message: `User ${userCreated.username} created successfully`,
          id: userCreated.id,
          username: userCreated.username,
          email: userCreated.email,
          token: 'Not yet implemented',
        });
      }
    } catch (error) {
      res.status(500).send({
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
}

export default UserController;
