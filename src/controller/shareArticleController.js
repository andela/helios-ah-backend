import dotenv from 'dotenv';
import { helperMethods, sendEmail } from '../utilities';

dotenv.config();

/**
 * Class representing the shareArticle controller
 * @class ShareArticle
 * @description controller used to handle routes for sharing articles
 */
class ShareArticle {
/**
  * Share an article
  * Route: POST: /articles/share
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @return {res} res - Response object
  * @memberof ShareArticle
 */
  static async ShareArticleViaEmail(req, res) {
    const shareDetails = {
      articleURL: `${process.env.shareArticleURL}/${req.body.articleId}`,
      email: req.body.email,
      title: req.body.title,
      author: req.body.author,
    };
    try {
      const isEmailSent = await sendEmail.shareArticle(shareDetails);
      if (isEmailSent === true) {
        return res.status(200).json({
          success: true,
          message: 'You have successfully shared the article with '
          + 'the owner of the email address.',
        });
      }
      res.status(400).json({
        success: false,
        message: 'Could not share your article. '
         + 'Please try to share the article again.',
      });
    } catch (error) {
      if (error.errors) {
        return helperMethods.sequelizeValidationError(res, error);
      }
      return helperMethods.serverError(res);
    }
  }
}

export default ShareArticle;
