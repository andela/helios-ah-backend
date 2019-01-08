import models from '../models';
import Error from '../utilities/Error';

const { Report } = models;

/**
 * Class representing the Report controller
 * @class ReportController
 * @description reports controller
 */
class ReportController {
  /**
    * Report an Article
    * Route: POST: /articles/:articleId/report
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @return {res} res - Response object
    * @memberof ReportController
   */
  static async reportArticle(req, res) {
    const {
      type
    } = req.body;
    try {
      const reportCreated = await Report.create({
        plagiarism: (type === 'plagiarism'),
        agreementViolation: (type === 'agreementViolation'),
        reportComment: req.body.reportComment,
        articleId: req.params.articleId,
        userId: req.decoded.id
      });
      if (reportCreated) {
        res.status(201).json({
          success: true,
          message: 'Report created successfully',
          reportCreated
        });
      }
    } catch (error) {
      Error.handleErrorResponse(res, error);
    }
  }
}

export default ReportController;
