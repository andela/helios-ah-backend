import models from '../models';
import Error from '../utilities/Error';

const { sequelize, Highlights, HighlightComments } = models;

/**
 * Class representing the Highlight controller
 * @class HighlightController
 * @description Highlight controller
 */
class HighlightController {
  /**
   * Create Highlight
   * Route: POST: /highlights/:articleId
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {res} res - Response object
   * @memberof HighlightController
   */
  static createHighlight(req, res) {
    const { articleId } = req.params;
    const { commentText, comment } = req.body;
    const userId = req.decoded.id;
    return sequelize.transaction(async (t) => {
      try {
        const newHighlight = await Highlights.create({
          articleId,
          text: commentText,
          userId,
        }, { transaction: t });
        if (comment) {
          const newComment = await HighlightController
            .newHighlightComment({
              comment,
              highlightId: newHighlight.id,
              userId,
              transaction: { transaction: t },
            }, res);
          if (newComment) {
            return newComment;
          }
        }
        res.status(201).json({
          message: 'Highlight was created successfully',
          success: true,
        });
      } catch (error) {
        return Error.handleErrorResponse(res, error);
      }
    });
  }

  /**
   * Create Highlight Comment
   * Route: POST: /highlights/comment/:highlightId
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {res} res - Response object
   * @memberof HighlightController
   */
  static async createHighlightComment(req, res) {
    const { highlightId } = req.params;
    const comment = req.body.commentText;
    const userId = req.decoded.id;
    try {
      const newComment = await HighlightController
        .newHighlightComment({
          comment,
          highlightId,
          userId,
          transaction: {},
        }, res);
      if (newComment) {
        return newComment;
      }
    } catch (error) {
      return Error.handleErrorResponse(res, error);
    }
  }

  /**
   * Get all Highlights of an article
   * Route: GET: /highlights/:articleId
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {res} res - Response object
   * @memberof HighlightController
   */
  static async getHighlights(req, res) {
    const { articleId } = req.params;
    try {
      const allHighlight = await Highlights.findAll({
        where: { articleId, isActive: true },
        attributes: ['id', 'text', 'userId'],
        include: [{
          model: HighlightComments,
          as: 'comments',
          where: { isActive: true },
          attributes: ['id', 'comment', 'userId'],
          required: false,
        }],
      });
      if (allHighlight[0]) {
        return res.status(200).json({
          message: 'Highlight found',
          success: true,
          highlights: allHighlight,
        });
      }
      return res.status(404).json({
        message: 'Highlight was not found',
        success: false,
      });
    } catch (error) {
      return Error.handleErrorResponse(res, error);
    }
  }

  /**
   * Function to add new Highlight Comment
   * @param {object} options - options
   * @param {object} res - Response object
   * @return {res} res - Response object
   * @memberof HighlightController
   */
  static async newHighlightComment(options, res) {
    const highlightComment = await HighlightComments.create({
      comment: options.comment,
      highlightId: options.highlightId,
      userId: options.userId,
    }, options.transaction);
    if (highlightComment) {
      return res.status(201).json({
        message: 'Highlight comment was created successfully',
        success: true,
      });
    }
  }
}

export default HighlightController;
