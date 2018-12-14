import models from '../models';

const { Article } = models;

/**
 * Class representing the Article controller
 * @class ArticleController
 * @description articles controller
 */
class ArticleController {
  /**
  * Create an Article
  * Route: POST: /articles
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @return {res} res - Response object
  * @memberof ArticlesController
 */
  static async createArticle(req, res) {
    const {
      title, body, description, image
    } = req.body;
    try {
      const articleCreated = await Article.create({
        title,
        body,
        description,
        image,
        userId: req.decoded.id,
      });
      if (articleCreated) {
        res.status(201).json({
          success: true,
          message: 'Article created successfully',
          articleCreated,
        });
      }
    } catch (error) {
      if (error.errors) {
        return res.status(400).json({
          success: false,
          message: error.errors[0].message
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error,
      });
    }
  }

  /**
  * Update an Article
  * Route: PUT: /articles
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @return {res} res - Response object
  * @memberof ArticlesController
 */
  static async updateArticle(req, res) {
    const {
      title, body, description, image
    } = req.body;
    const options = {
      where: {
        id: req.params.articleId
      },
      returning: true,
    };
    try {
      const articleUpdated = await Article.update({
        title,
        body,
        description,
        image,
      }, options);
      if (articleUpdated[0] === 1) {
        res.status(200).json({
          success: true,
          message: 'Article updated successfully',
          articleUpdated: articleUpdated[1],
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Provide a valid article Id'
        });
      }
    } catch (error) {
      if (error.errors) {
        res.status(400).json({
          success: false,
          message: error.errors[0].message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error',
          error,
        });
      }
    }
  }

  /**
  * Get Article
  * Route: GET: /articles
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @return {res} res - Response object
  * @memberof ArticlesController
 */
  static async getArticles(req, res) {
    const options = {
      attributes: [
        'id',
        'title',
        'body',
        'description',
        'image',
      ],
    };

    if (req.originalUrl === '/api/v1/articles/user') {
      options.where = {
        isDraft: false,
        userId: 'req.decoded.id',
      };
    } else {
      options.where = {
        isDraft: false,
      };
    }

    try {
      const articles = await Article.findAll(options);
      res.status(200).json({
        success: true,
        articles,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

export default ArticleController;
