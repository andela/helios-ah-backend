import models from '../models';
import Error from '../utilities/Error';

const { Tags, ArticleTag } = models;

/**
 * Class representing the Tag controller
 * @class TagController
 * @description tags controller
 */
class TagController {
  /**
   * Create a Tag for an Article
   * Route: POST: /articles/tag
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {res} res - Response object
   * @memberof TagController
   */
  static async createTag(req, res) {
    const { articleId } = req.params;
    const { tagName } = req.body;
    try {
      const checkTag = await Tags.findOne({
        where: { tagName }
      });
      if (checkTag) {
        const checkArticleTag = await TagController
          .findArticleTag(articleId, checkTag.id, res);
        if (checkArticleTag) {
          return checkArticleTag;
        }
        const setArticleTag = await TagController
          .addArticleTag(articleId, checkTag.id, res);
        if (setArticleTag) {
          return setArticleTag;
        }
      }
      const createdTag = await Tags.create({
        tagName
      });
      await ArticleTag.create({
        articleId,
        tagId: createdTag.dataValues.id
      });
      res.status(201).json({
        message: 'Tag was created successfully',
        success: true,
      });
    } catch (error) {
      return Error.handleErrorResponse(res, error);
    }
  }

  /**
   * Find an Article with a particular Tag
   * @param {uuid} articleId - articleId
   * @param {string} tagId - tagId
   * @param {res} res - Response object
   * @return {res} - Response object
   * @memberof TagController
   */
  static async findArticleTag(articleId, tagId, res) {
    const checkArticleTag = await ArticleTag.findOne({
      where: {
        articleId,
        tagId
      }
    });
    if (checkArticleTag) {
      return res.status(200).json({
        message: 'Tag already exist for the article',
        success: true,
      });
    }
  }

  /**
   * Add an Article to a Tag
   * @param {uuid} articleId - articleId
   * @param {string} tagId - tagId
   * @param {res} res - Response object
   * @return {res} - Response object
   * @memberof TagController
   */
  static async addArticleTag(articleId, tagId, res) {
    const setArticleTag = await ArticleTag.create({
      articleId,
      tagId
    });
    if (setArticleTag) {
      return res.status(201).json({
        message: 'Article was tagged',
        success: true,
      });
    }
  }
}
export default TagController;
