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
    let authors;
    const options = {
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
      },
    };
    try {
      if (req.query.search) {
        options.where = {
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
          isVerified: true,
        };
      }
      authors = await Users.findAll(options);

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

  /**
   * Updates user role
   * Route: PUT: users/role/:userId
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {res} res - Response object
   * @memberof UserController
   */
  static async userRole(req, res) {
    try {
      const userUpdated = await Users.update({
        roleId: req.body.roleId,
      }, {
        where: {
          id: req.params.userId
        }
      });
      if (userUpdated[0] === 1) {
        res.status(200).send({
          message: 'User role was updated successfully',
          success: true
        });
      }
    } catch (error) {
      res.status(500).send({
        message: 'Internal server error',
        success: false
      });
    }
  }
}

export default UserController;
