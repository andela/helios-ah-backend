import sendGrid from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

/**
 * @description utility to send mails
 */
class SendEmail {
  /**
   *
   * @param {string} email - email address to send the message to
   * @param {string} token - Token generated during signup
   * @returns {boolean} sends a verification email to user
   * after registration
   */
  static verifyEmail(email, token) {
    const details = {
      email,
      subject: 'Email Verification - Authors Haven',
      emailBody: `<p>Thank you for signing up.</p>
        <p>Next step is to verify this email
        address by clicking the link below.</p>
        <p> >>>
        <a href=http://localhost:4001/api/v1/auth/complete_reg/?token=${token}>
        Complete your registration </a><<< </p>`
    };
    return SendEmail.emailSender(details);
  }

  /**
   * This function sends an email on verification of email address
   * @param {string} email - email address to send the message to
   * @param {string} token - Token generated during signup
   * @returns {boolean} sends a verification email to user
   * after registration
  */
  static confirmRegistrationComplete(email) {
    const details = {
      email,
      subject: 'Registration Complete - Authors Haven',
      emailBody: `<p>Your registration has been completed<p>
      <p>Thank you for registering with Authors Haven.</p>
       <p> >>>
       <a href=http://localhost:4001/api/v1/>
       Go to your profile </a> <<< </p>`
    };
    return SendEmail.emailSender(details);
  }

  /**
   *
   * @param {object} details - Object containing info for sending email
   * @returns {boolean} sends email to users
   */
  static async emailSender(details) {
    sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      from: process.env.mail_master,
      html: details.emailBody,
      subject: details.subject,
      to: details.email
    };
    try {
      const isEmailSent = await sendGrid.send(msg);
      if (isEmailSent) {
        return true;
      }
    } catch (error) {
      return false;
    }
  }
}
export default SendEmail;
