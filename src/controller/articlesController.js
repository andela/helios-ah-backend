import models from '../models';
import errorResponse from '../utilities/Error';
import helperMethod from '../utilities/helperMethods';

const {
  Article,
  Users,
  Bookmark,
  Comments,
  CommentHistory,
  ChildComments,
  ChildCommentHistory,
} = models;

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
      title, body, description, image, isDraft
    } = req.body;
    try {
      const articleCreated = await Article.create({
        title,
        body,
        description,
        readTime: (body.split(' ').length < 200) ? 'less than 1min'
          : `about ${Math.round(body.split(' ').length / 200)}min`,
        image,
        userId: req.decoded.id,
        isDraft: isDraft || 'true'
      });
      if (articleCreated) {
        res.status(201).json({
          success: true,
          message: 'Article created successfully',
          articleCreated,
        });
      }
    } catch (error) {
      errorResponse.handleErrorResponse(res, error);
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
      title, body, description, image, isDraft
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
        isDraft: isDraft || 'true'
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
      errorResponse.handleErrorResponse(res, error);
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
    const paginate = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 100,
    };
    const offset = (paginate.page * paginate.limit) - paginate.limit;
    const options = {
      attributes: [
        'id',
        'title',
        'body',
        'description',
        'image',
      ],
      limit: paginate.limit,
      offset,
    };

    if (req.originalUrl === '/api/v1/articles/user') {
      options.where = {
        userId: req.decoded.id,
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
        message: 'Internal server error',
      });
    }
  }

  /**
  * Get a specific Article
  * Route: POST: /articles
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @return {res} res - Response object
  * @memberof ArticleController
 */
  static async getArticle(req, res) {
    try {
      const article = await Article.findOne({
        include: [
          {
            model: Comments,
            as: 'Comments',
            include: [
              {
                model: Users,
                attributes: ['firstName', 'lastName', 'username'],
              },
              {
                model: CommentHistory,
                attributes: { exclude: ['userId', 'commentId'] }
              }, {
                model: ChildComments,
                include: [
                  {
                    model: Users,
                    attributes: ['firstName', 'lastName', 'username'],
                  },
                  {
                    model: ChildCommentHistory,
                    attributes: { exclude: ['userId', 'childCommentId'] }
                  }
                ],
                attributes: { exclude: ['userId', 'commentId'] }
              }
            ],
            attributes: { exclude: ['userId', 'articleId'] }
          }
        ],
        where: {
          id: req.params.articleId,
        }
      });
      if (article) {
        await helperMethod.updateViewStat(article.id, article.viewStats, article.title);
        res.status(200).json({
          success: true,
          article,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Invalid article Id',
        });
      }
    } catch (error) {
      errorResponse.handleErrorResponse(res, error);
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
          success: true,
          message: 'Article successfully bookmarked',
        });
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}

export default ArticleController;
