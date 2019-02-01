import sendGrid from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();
let baseUrl = '';

if (process.env.NODE_ENV !== 'production') {
  baseUrl = 'http://localhost:4001/api/v1';
} else {
  baseUrl = process.env.SENDGRID_URL;
}

/**
 * @description utility to send mails
 */
class SendEmail {
  /**
   * @param {object} shareDetails - email address to send the message to
   * @returns {boolean} specifies if the email was sent successfully
   * after registration
   */
  static shareArticle(shareDetails) {
    const details = {
      email: shareDetails.email,
      subject: `${shareDetails.title} - Authors Haven`,
      emailBody: `<p>An article from Authors Haven was shared with you.</p>
      <div>
        Title: ${shareDetails.title}
        Author: ${shareDetails.author}
      </div>
      <p>Click this <a href="${shareDetails.articleURL}">link</a> 
      to view the article</p>`
    };
    return SendEmail.emailSender(details);
  }

  /**
   * @param {string} email - email address to send the message to
   * @param {string} token - Token generated during signup
   * @returns {boolean} specifies if the email was sent successfully
   */
  static verifyEmail(email, token) {
    const details = {
      email,
      subject: 'Email Verification - Authors Haven',
      emailBody: `<p>Thank you for signing up.</p>
        <p>Next step is to verify this email
        address by clicking the link below.</p>
        <p> >>>
        <a href=${baseUrl}/signup/verify?token=${token}>
        Complete your registration </a><<< </p>`
    };
    return SendEmail.emailSender(details);
  }

  /**
   * This function sends an email on verification of email address
   * @param {string} email - email address to send the message to
   * @param {string} token - Token generated during signup
   * @returns {boolean} specifies if a verification email was sent to user
   * after registration
  */
  static confirmRegistrationComplete(email) {
    const details = {
      email,
      subject: 'Registration Complete - Authors Haven',
      emailBody: `<p>Your registration has been completed<p>
      <p>Thank you for registering with Authors Haven.</p>
       <p> >>>
       <a href=${baseUrl}/login>
       Visit Authors Haven </a> <<< </p>`
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
