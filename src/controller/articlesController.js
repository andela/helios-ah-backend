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
      title, body, description, image,
    } = req.body;
    try {
      const articleCreated = await Article.create({
        title,
        body,
        description,
        image,
      });
      if (articleCreated) {
        res.status(201).json({
          message: 'Article created successfully',
          articleCreated,
        });
      }
    } catch (error) {
      if (error.errors) {
        return res.status(400).json({
          message: error.errors[0].message
        });
      }
      return res.status(500).json({
        message: 'Internal server error',
        error,
      });
    }
  }
}

export default ArticleController;
