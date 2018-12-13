import models from '../models';

const { Article, Bookmark } = models;

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
  * @memberof ArticleController
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
  * @description Bookmark an Article
  *
  * @param {object} req - Request object
  * @param {object} res - Response object
  *
  * @return {object} database response
  * @memberof ArticleController
 */
  static async bookmarkArticle(req, res) {
    const name = req.body.name || req.article.dataValues.title;
    const userId = req.decoded.id;
    const { articleId } = req.params;

    try {
      const createBookmark = await Bookmark.create({
        name, userId, articleId
      });
      if (createBookmark) {
        res.status(201).json({
          message: 'Article successfully bookmarked',
        });
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}

export default ArticleController;
