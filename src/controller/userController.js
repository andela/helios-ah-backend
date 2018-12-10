import { cryptData, authentication } from '../utilities';
import models from '../models';

const { Users, sequelize } = models;
const { Op } = sequelize.Sequelize;

/**
 * Class representing the user controller
 * @class UserController
 * @description users controller
 */
class UserController {
  /**
  * Sign up a user
  * Route: POST: /auth/signup
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @return {res} res - Response object
  * @memberof UserController
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
        const tokenCreated = await authentication.getToken(userCreated);
        res.status(201).send({
          message: `User ${userCreated.username} created successfully`,
          id: userCreated.id,
          username: userCreated.username,
          email: userCreated.email,
          token: tokenCreated,
        });
      }
    } catch (error) {
      res.status(500).send({
        message: 'Internal server error',
      });
    }
  }

  /**
  * List Authors
  * Route: GET: /authors
  * Route: GET: /authors/:search
  * @param {object} req -Request object
  * @param {object} res - Response object
  * @return {res} res - Response object
  * @memberof USerController
 */
  static async getAuthors(req, res) {
    try {
      let authors;
      if (req.query.search) {
        authors = await Users.findAll({
          attributes: [
            'id',
            'firstName',
            'lastName',
            'email',
            'image',
            'bio',
            'username'
          ],
          where: {
            [Op.or]: [
              {
                username: {
                  [Op.like]: `%${req.query.search}%`
                }
              },
              {
                firstName: {
                  [Op.like]: `%${req.query.search}%`
                }
              },
              {
                lastName: {
                  [Op.like]: `%${req.query.search}%`
                }
              },
            ],
          }
        });
      } else {
        authors = await Users.findAll({
          attributes: [
            'id',
            'firstName',
            'lastName',
            'email',
            'image',
            'bio',
            'username'
          ],
          where: {
            isVerified: true,
          }
        });
      }
      res.status(200).json({
        success: true,
        authors,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}

export default UserController;
