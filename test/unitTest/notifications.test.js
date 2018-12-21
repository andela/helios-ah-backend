import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import { NotificationUtil } from '../../src/utilities';

chai.use(chaiHttp);
const { expect } = chai;

let user;
let emailDetails = {
  emailBody: 'You are receiving this mail because you now follow this user',
  subject: 'Follow at Author\'s Haven',
  email: 'teejay2k4@yahoo.com'
}
describe('Notifications functions', () => { 

  const userId = '2034avc-avc-123-abty-ttyl'
  const notificationText = 'You are now following this user'

  describe('setNotifcation method', () => {
    it('it should create an in app notification', async () => {
      const stub = await sinon.stub(NotificationUtil, 'setSingleAppNotification');
      stub.resolves({response: 'In app notification created'});
      try {
      const setSingleAppNotification = await NotificationUtil
        .setSingleAppNotification(userId, notificationText)
          expect(setSingleAppNotification.response).to.equal('In app notification created');
      } catch (error) {
          throw error;
      }
    });
    it('it should send an email notification', async () => {
      const stub = await sinon.stub(NotificationUtil, 'setSingleEmailNotification');
      stub.resolves({response: 'Email notification sent'});
      try {
      const setSingleEmailNotification = await NotificationUtil
        .setSingleEmailNotification(emailDetails)
          expect(setSingleEmailNotification.response).to.equal('Email notification sent');
      } catch (error) {
          throw error;
      }
    });
  });
});
