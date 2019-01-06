import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import models from '../../src/models';
import notificationUtil from '../../src/utilities/Notification';
import sendEmail from '../../src/utilities/sendEmail';


chai.use(chaiHttp);
const { expect } = chai;
const { Notification, Users } = models

const user1 = {
  id: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
  firstName: 'John',
  lastName: 'Doe',
  email: 'yomizy@wizzy.com',
  roleId: 1,
  password: 'password',
  username: 'icecream',
  emailNotification: true,
  inAppNotification: true,
  isVerified: true,
  createdAt: new Date(Date.now()),
  updatedAt: new Date(Date.now())
}

  const user2 = {
    id: 'e7eaef9b-c3d9-40fa-89e1-26eae190f1aa',
    firstName: 'Mike',
    lastName: 'Nugget',
    email: 'mike@myzone.com',
    roleId: 1,
    username: 'shangai',
    emailNotification: true,
    inAppNotification: true,
    isVerified: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }
  
  const user3 = {
    id: 'c667aa9b-e5a1-4552-960b-8cc2a9c09ccb',
    firstName: 'Tony',
    lastName: 'Nwosu',
    email: 'tonyboy@andela.com',
    roleId: 1,
    username: 'Tonyboy',
    isVerified: true,
    emailNotification: true,
    inAppNotification: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }

  const user4 = {
    id: 'cccd8ee7-bc98-4a8e-a832-ca116d6fff0b',
    username: 'JaneDoeReporter',
    email: 'janedoereporter@wemail.com',
    firstName: 'JaneReporter',
    lastName: 'DoeReporter',
    bio: 'Finds and report articles',
    roleId: 1,
    isVerified: true,
    emailNotification: false,
    inAppNotification: false,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }

  const options = {
    inAppNotification: false 
  }
  const userArray = [
    user1, user2, user3
  ]

const details = {
  emailBody: 'You are receiving this mail because you now follow this user',
  subject: 'Follow at Author\'s Haven',
  email: 'teejay2k4@yahoo.com'
}

const msg = {
  from: process.env.mail_master,
  html: details.emailBody,
  subject: details.subject,
  to: details.email
};

describe('Notifications functions', () => {
  let myNotificationSpy;
  let myEmailSpy;

  beforeEach(() => {
    myNotificationSpy = sinon.spy(Notification, 'create')
    myEmailSpy = sinon.spy(sendEmail, 'emailSender')
  })

  afterEach(() => {
    myNotificationSpy.restore();
    myEmailSpy.restore();
  })

  const notificationText = 'You are now following this user'

  describe('Notification utilites', () => {
    it('it should create an in app notification', async () => {
    await notificationUtil.setSingleAppNotification(user1, `${notificationText}`)
      sinon.assert.calledOnce(myNotificationSpy);
    });
    it('it should send an email notification', async () => {
      await notificationUtil.setSingleEmailNotification(user1, details)
        sinon.assert.calledOnce(myEmailSpy);
    });
    it('it should send multiple app notifications', async () => {
      await notificationUtil.setMultipleAppNotifications(userArray, `${notificationText}`)
        sinon.assert.calledThrice(myNotificationSpy);
    });
    it('it should send multiple email notifications', async () => {
      await notificationUtil.setMultipleEmailNotifications(userArray, details)
        sinon.assert.calledThrice(myEmailSpy);
    });
    it('it should check if user email notification is on', async () => {
      expect(await notificationUtil.isUserEmailNotificationOn(user1)).to.equal(true);
      expect(await notificationUtil.isUserEmailNotificationOn(user2)).to.equal(true);
      expect(await notificationUtil.isUserEmailNotificationOn(user3)).to.equal(true);
      expect(await notificationUtil.isUserEmailNotificationOn(user4)).to.equal(false);
    });
    it('it should check if user in app notification is on', async () => {
      expect(await notificationUtil.isUserInAppNotificationOn(user1)).to.equal(true);
      expect(await notificationUtil.isUserInAppNotificationOn(user2)).to.equal(true);
      expect(await notificationUtil.isUserInAppNotificationOn(user3)).to.equal(true);
      expect(await notificationUtil.isUserInAppNotificationOn(user4)).to.equal(false);
    });
    it('it should update notification status', async () => {
      const mySpy = sinon.spy(Users, 'update');
      await notificationUtil.updateNotificationStatus(options, user4)
        sinon.assert.calledOnce(mySpy);
        mySpy.restore();
    });
  });
});
