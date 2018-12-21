import dotenv from 'dotenv';
import Promise from 'bluebird';
import models from '../models';
import sendEmail from './sendEmail';

dotenv.config();

const { Notification, Users } = models;


/**
 * @description class for controlling notifications
 */
class NotificationUtil {
  /**
   *@description sends an in app notification to user
   *
   * @param {Array} user - The user receiving the notification
   * @param {string} text - The text of the notification
   *
   * @returns {object} sends database query result
   */
  static async setSingleAppNotification(user, text) {
    try {
      if (user.inAppNotification) {
        Notification.create({
          userId: user.id,
          text
        });
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   *@description sends an in app notification to multiple users
   *
   * @param {Array} userArray - The array of users
   * @param {string} text - The text of the notification
   *
   * @returns {object} sends database query result
   */
  static async setMultipleAppNotifications(userArray, text) {
    try {
      models.sequelize.transaction(t => Promise.map(userArray, (user) => {
        if (user.inAppNotification) {
          return Notification
            .create({ userId: user.id, text }, { transaction: t });
        }
      }));
    } catch (error) {
      throw error;
    }
  }

  /**
   *@description sends an email app notification to user
   *
   * @param {Array} user - The user being sent the notification
   * @param {Object} emailDetails - The object containing the email details
   *
   * @returns {object} sends database query result
   */
  static async setSingleEmailNotification(user, emailDetails) {
    if (user.emailNotification) {
      try {
        await sendEmail.emailSender(emailDetails);
      } catch (error) {
        throw error;
      }
    }
  }

  /**
   *@description sends an email app notification to multiple users
   *
   * @param {Array} userArray - The user being sent the notification
   * @param {Object} emailText - The body of the email
   *
   * @returns {null} null
   */
  static async setMultipleEmailNotifications(userArray, emailText) {
    userArray.map(async (user) => {
      if (user.emailNotification) {
        const emailDetails = {
          email: user.email,
          subject: 'Author\'s Haven - Email notification',
          emailBody: `${emailText}`
        };
        await sendEmail.emailSender(emailDetails);
      }
    });
  }

  /**
   *@description checks if user is subscribed to email notifications
   *
   * @param {Object} user - User details
   *
   * @returns {boolean} - true or false
   */
  static async isUserEmailNotificationOn(user) {
    return user.emailNotification;
  }

  /**
   *@description checks if user is subscribed to in app notifications
   *
   * @param {Object} user - User details
   *
   * @returns {boolean} - true or false
   */
  static async isUserInAppNotificationOn(user) {
    return user.inAppNotification;
  }

  /**
   *@description updates notification status
   *
   * @param {Object} options - contains type of notification and boolean
   * @param {Object} user - object containing user details
   *
   * @returns {object} database response
   */
  static async updateNotificationStatus(options, user) {
    try {
      return Users.update(
        options,
        {
          where:
              {
                id: user.id
              },
          returning: true
        }
      );
    } catch (error) {
      throw error;
    }
  }
}

export default NotificationUtil;
