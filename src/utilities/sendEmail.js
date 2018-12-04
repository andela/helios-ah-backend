import sendgrid from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();
/**
 * @description utility to send mails
 */
class SendEmail {
  /**
   *
   * @param {string} email
   * @returns {boolean} sends a verification email to user
   * after registration
   */
  static verifyEmail(email) {
    const details = {
      email,
      subject: 'Email Verification - Authors Haven',
      emailBody: '<p>Thank you for signing up.</p>'
      + '<p>Next step is to verify this email'
      + ' address by clicking the link below.</p>'
      + '<p> >>>Heroku Link<<< </p>'
    };
    return SendEmail.emailSender(details);
  }

  /**
   *
   * @param {object} details
   * @returns {boolean} sends email to users
   */
  static emailSender(details) {
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      from: 'babajide.ajayi@andela.com',
      html: details.emailBody,
      subject: details.subject,
      to: details.email
    };
    if (sendgrid.send(msg)) {
      return true;
    }
  }
}
export default SendEmail;
