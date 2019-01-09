import chai from 'chai';
import SendEmail from '../../src/utilities/sendEmail';
import sendGrid from '@sendgrid/mail';
import sinon from 'sinon';

 const { expect } = chai;
 describe('Utility to send emails', () => {
  it('should send verification email after registration', async () => {
    const stubEmailSender = sinon.stub(SendEmail, 'emailSender').returns(true);
    const response = await SendEmail.verifyEmail('jideajayi11@gmail.com');
    expect(response).to.equal(true);
    stubEmailSender.restore();
  });
  it('should send email when passed the email details', async () => {
    const details = {
      email: 'jideajayi11@gmail.com',
      subject: 'Test Email Sending',
      emailBody: '<p>This email is being received</p>'
      + '<p>to test the utility that sends mail.'
    };
    const stubSendMethod = sinon.stub(sendGrid, 'send').returns(true);
    const response = await SendEmail.emailSender(details);
    expect(response).to.equal(true);
    sinon.assert.calledOnce(stubSendMethod);
    stubSendMethod.restore();
  });
  
  it('should send a mail to the user on completing registration', async () => {
    const stubSendMethod = sinon.stub(SendEmail, 'emailSender').returns(true);
    const response = await 
    SendEmail.confirmRegistrationComplete('jideajayi11@gmail.com');
    expect(response).to.equal(true);
    sinon.assert.calledOnce(stubSendMethod);
    stubSendMethod.restore();
  });
  it('should share an article with someone via email', async () => {
    const shareDetails = {
      articleURL: 'qwewerdeded',
      email: "wderrf",
      title: 'wertrdfdc',
      author: 'wewewede',
    };
    const stubSendMethod = sinon.stub(SendEmail, 'emailSender').returns(true);
    const response = await SendEmail.shareArticle(shareDetails);
    expect(response).to.equal(true);
    sinon.assert.calledOnce(stubSendMethod);
    stubSendMethod.restore();
  });
});
