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
   * Route: POST: /articles/tag:articleId
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {res} res - Response object
   * @memberof TagController
   */
  static async createTag(req, res) {
    const { articleId } = req.params;
    const { tagName } = req.body;

    try {
      const createdTag = await Promise.all(tagName.map(obj => Tags
        .findOrCreate({ where: { tagName: obj }, returning: true, })));
      await Promise.all(createdTag.map(obj => ArticleTag.findOrCreate({
        where: {
          articleId,
          tagId: obj[0].dataValues.id
        },
        returning: true,
      })));
      res.status(201).json({
        message: 'Tag was created successfully',
        success: true,
      });
    } catch (error) {
      return Error.handleErrorResponse(res, error);
    }
  }
}
export default TagController;
