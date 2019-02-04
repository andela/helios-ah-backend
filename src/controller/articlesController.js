import { Op } from 'sequelize';
import models from '../models';
import errorResponse from '../utilities/Error';
import helperMethod from '../utilities/helperMethods';
import {
  follower,
  NotificationUtil,
  helperMethods,
} from '../utilities';

const {
  Article,
  Users,
  Bookmark,
  Comments,
  CommentHistory,
  Tags,
  ArticleTag,
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
      const followers = await follower.getFollowers(req.decoded.id);
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
        const notificationText = `${req.user.username} has published an article
    titled '${title}'`;

        req.io.emit('inAppNotifications', { notificationText });

        await NotificationUtil
          .setMultipleAppNotifications(
            followers[0].followers,
            notificationText,
            res
          );

        await NotificationUtil
          .setMultipleEmailNotifications(
            followers[0].followers,
            notificationText,
            res
          );

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
      const [, articleUpdated] = await Article.update({
        title,
        body,
        description,
        image,
        isDraft: isDraft || 'true'
      }, options);
      res.status(200).json({
        success: true,
        message: 'Article updated successfully',
        articleUpdated: articleUpdated[0],
      });
    } catch (error) {
      errorResponse.handleErrorResponse(res, error);
    }
  }

  /**
  * Publish an Article
  * Route: PUT: /articles
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @return {res} res - Response object
  * @memberof ArticlesController
 */
  static async publishArticle(req, res) {
    const { status, articleId } = req.params;
    const options = {
      where: {
        id: articleId
      },
      returning: true,
    };

    try {
      const [, articlePublished] = await Article.update({
        isDraft: status !== 'publish'
      }, options);
      res.status(200).json({
        success: true,
        message: 'Article updated successfully',
        articlePublished: articlePublished[0],
      });
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
        'readTime',
        'isDraft'
      ],
      limit: paginate.limit,
      offset,
    };
    options.include = [
      {
        model: Users,
        attributes: ['firstName', 'lastName']
      }
    ];
    if (req.query.author) {
      options.include = [
        {
          model: Users,
          attributes: ['firstName', 'lastName'],
          where: {
            [Op.or]: [
              {
                firstName: {
                  [Op.iLike]: `%${req.query.author}%`
                }
              },
              {
                lastName: {
                  [Op.iLike]: `%${req.query.author}%`
                }
              }
            ]
          }
        }
      ];
    } else if (req.query.tag) {
      const foundTag = await Tags.findOne({
        where: {
          tagName: {
            [Op.iLike]: `%${req.query.tag}%`
          }
        }
      });
      if (!foundTag) {
        return res.status(404).send({
          success: false,
          message: `No article tagged ${req.query.tag} found.`
        });
      }
      const tagId = foundTag.dataValues.id;
      const article = await ArticleTag.findAll({
        attributes: [],
        include: [
          {
            model: Article,
          }
        ],
        where: {
          tagId,
        }
      });
      return res.status(200).json({
        success: true,
        article
      });
    }

    if (req.originalUrl === '/api/v1/articles/user') {
      options.where = { isDeleted: false };
      if (req.query) {
        options.where = req.query.isDraft
          ? { ...options.where, isDraft: true }
          : { ...options.where, isDraft: false };
      }
    } else {
      options.where = {
        isDraft: false,
        isDeleted: false
      };
    }

    try {
      const articles = await Article.findAll(options);
      if (req.query.author && !articles[0]) {
        return res.status(200).send({
          success: false,
          message: `No article published by ${req.query.author}`
        });
      }
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
  * Route: GET: /articles
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
            model: Users,
            attributes: ['firstName', 'lastName', 'image']
          },
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
        await helperMethod.updateViewStat(
          article.id,
          article.viewStats,
          article.title
        );
        const tags = await ArticleTag.findAll({
          attributes: [],
          where: {
            articleId: article.id
          },
          include: [{
            model: Tags,
            attributes: ['tagName']
          }],
          raw: true
        });
        article.dataValues.tags = tags;
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
    const userId = req.decoded.id;
    const { articleId } = req.params;

    try {
      const name = req.body.name || req.article.title;

      const createBookmark = await Bookmark.findOrCreate({
        where: { name, userId, articleId },
        returning: true,
        raw: true,
      });
      if (createBookmark[0].isActive) {
        res.status(201).json({
          success: true,
          message: 'Article successfully bookmarked',
          bookmark: createBookmark[0],
        });
      } else {
        const updateBookmark = await Bookmark.update({ isActive: true }, {
          where: { name, userId, articleId },
          returning: true,
          raw: true,
        });
        if (updateBookmark) {
          res.status(201).json({
            success: true,
            message: 'Article successfully bookmarked',
            bookmark: updateBookmark[1][0],
          });
        }
      }
    } catch (error) {
      helperMethods.serverError(res);
    }
  }

  /**
  * GET /api/v1/articles/bookmarks
  * @description List Bookmarks
  *
  * @param {object} req - Request object
  * @param {object} res - Response object
  *
  * @return {object} database response
  * @memberof ArticleController
 */
  static async getBookmark(req, res) {
    const userId = req.decoded.id;
    try {
      const bookmarks = await Bookmark.findAll({
        where: { userId, isActive: true },
        attributes: ['id'],
        include: [{
          model: Article,
          as: 'bookmark',
          attributes: ['id', 'title', 'body', 'readTime', 'image', 'createdAt'],
          where: { isDeleted: false },
          include: [{
            model: Users,
            attributes: ['firstName', 'lastName'],
          }],
        }],
      });
      if (bookmarks) {
        return res.status(200).json({
          success: true,
          message: 'Bookmark was found',
          bookmarks,
        });
      }
      return res.status(200).json({
        success: false,
        message: 'Bookmark was not found',
      });
    } catch (error) {
      helperMethods.serverError(res);
    }
  }

  /**
  * @description Delete a Bookmark
  *
  * @param {object} req - Request Object
  * @param {object} res - Response Object
  *
  * @return {obejct} database response
  * @memberof ArticleController
  */
  static async deleteBookmark(req, res) {
    const options = {
      where: {
        articleId: req.params.articleId,
        userId: req.decoded.id,
      },
      returning: true,
    };
    try {
      const bookmarkDeleted = await Bookmark.update({
        isActive: false
      }, options);
      if (bookmarkDeleted[0]) {
        return res.status(200).json({
          success: true,
          message: 'Bookmark deleted successfully',
          bookmarkDeleted: bookmarkDeleted[1],
        });
      }
      return res.status(404).json({
        success: false,
        message: 'Bookmark was not found',
      });
    } catch (error) {
      helperMethods.serverError(res);
    }
  }

  /**
  * @description Delete an Article
  *
  * @param {object} req - Request Object
  * @param {object} res - Response Object
  *
  * @return {obejct} database response
  * @memberof ArticleController
  */
  static async deleteArticle(req, res) {
    const options = {
      where: {
        id: req.params.articleId
      },
      returning: true,
    };
    try {
      const articleDeleted = await Article.update({
        isDeleted: true
      }, options);
      res.status(200).json({
        success: true,
        message: 'Article deleted successfully',
        articleDeleted: articleDeleted[1],
      });
    } catch (error) {
      helperMethods.serverError(res);
    }
  }
}

export default ArticleController;
