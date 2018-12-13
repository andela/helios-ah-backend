import models from '../models';

const { Article, tag } = models;

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

  /**
  * Create a Tag for an Article
  * Route: POST: /articles/tag
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @return {res} res - Response object
  * @memberof ArticlesController
 */
  static async createTag(req, res) {
    const { articleId, tagName } = req.body;
    try {
      const createTag = await tag.create({ tagName });
      const setArticleTag = await createTag.setTexts([articleId]);
      if (setArticleTag) {
        res.status(201).json({
          message: 'Tag was created successfully',
          success: true,
        });
      }
    } catch (error) {
      res.status(400).json({
        message: error.errors[0].message,
        success: false,
      });
    }
  }
}

export default ArticleController;
