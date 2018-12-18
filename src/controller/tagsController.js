import models from '../models';

const { Tag, ArticleTag } = models;

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
      const checkTag = await Tag.findOne({
        where: { tagName }
      });
      if (checkTag) {
        const checkArticleTag = await ArticleTag.findOne({
          where: {
            ArticleId: articleId,
            TagId: checkTag.id
          }
        });
        if (checkArticleTag) {
          return res.status(200).json({
            message: 'Tag already exist for the article',
            success: true
          });
        }
        const setArticleTag = await ArticleTag.create({
          ArticleId: articleId,
          TagId: checkTag.id
        });
        if (setArticleTag) {
          return res.status(201).json({
            message: 'Article was tagged',
            success: true
          });
        }
      }
      const createTag = await Tag.create({
        tagName
      });
      await createTag.setTexts([articleId]);
      res.status(201).json({
        message: 'Tag was created successfully',
        success: true,
      });
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
        ArticleId: articleId,
        TagId: tagId
      }
    });
    if (checkArticleTag) {
      return res.status(200).json({
        message: 'Tag already exist for the article',
        success: true
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
      ArticleId: articleId,
      TagId: tagId
    });
    if (setArticleTag) {
      return res.status(201).json({
        message: 'Article was tagged',
        success: true
      });
    }
  }
}
export default TagController;
