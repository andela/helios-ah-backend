import chai from 'chai';
import SendEmail from '../src/utilities/sendEmail';

const { expect } = chai;

describe('Utility to send emails', () => {
  it('should send verification email after registration', async () => {
    try {
      expect(await SendEmail.verifyEmail('jideajayi11@gmail.com')).to.equal(true);
    } catch (error) {
      expect(error).to.equal(null);
    }
  });
  it('should send email when passed the email details', async () => {
    const details = {
      email: 'jideajayi11@gmail.com',
      subject: 'Test Email Sending',
      emailBody: '<p>This email is being received</p>'
      + '<p>to test the utility that sends mail.'
    };
    try {
      expect(await SendEmail.emailSender(details)).to.equal(true);
    } catch (error) {
      expect(error).to.equal(null);
    }
  });
});
