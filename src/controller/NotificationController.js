import dotenv from 'dotenv';
import NotificationUtil from '../utilities/Notification';

dotenv.config();


/**
 * @description class for handling notifications
 */
class NotificationController {
  /**
   *@description opts into email notification

   * @param {Object} req - Http request
   * @param {Object} res - Http response
   *
   * @returns {Object} - Http response
   */
  static async optIntoEmailNotifications(req, res) {
    const isUserEmailNotificationOn = await NotificationUtil
      .isUserEmailNotificationOn(req.user);

    if (isUserEmailNotificationOn) {
      return res.status(400).json({
        success: false,
        message: 'You have already subscribed for email notifications'
      });
    }
    await NotificationUtil
      .updateNotificationStatus({ emailNotification: true }, req.user);
    res.status(200).json({
      success: true,
      message: 'You have subscribed for email notifications'
    });
  }

  /**
   *@description opts out of email notifications

   * @param {Object} req - Http request
   * @param {Object} res - Http response
   *
   * @returns {Object} - Http response
   */
  static async optOutOfEmailNotifications(req, res) {
    const isUserEmailNotificationOn = await NotificationUtil
      .isUserEmailNotificationOn(req.user);

    if (!isUserEmailNotificationOn) {
      return res.status(400).json({
        success: false,
        message: 'You have not subscribed for email notifications'
      });
    }
    await NotificationUtil
      .updateNotificationStatus({ emailNotification: false }, req.user);
    res.status(200).json({
      success: true,
      message: 'You have unsubscribed from email notifications',
    });
  }

  /**
   *@description opts into in-app notifications

   * @param {Object} req - Http request
   * @param {Object} res - Http response
   *
   * @returns {Object} - Http response
   */
  static async optIntoInAppNotifications(req, res) {
    const isUserInAppNotificationOn = await NotificationUtil
      .isUserInAppNotificationOn(req.user);

    if (isUserInAppNotificationOn) {
      return res.status(400).json({
        success: false,
        message: 'You have already subscribed for in-app notifications'
      });
    }
    await NotificationUtil
      .updateNotificationStatus({ inAppNotification: true }, req.user);
    res.status(200).json({
      success: true,
      message: 'You have subscribed for in-app notifications'
    });
  }

  /**
   *@description opts user out of in-app notifications

   * @param {Object} req - Http request
   * @param {Object} res - Http response
   *
   * @returns {Object} - Http response
   */
  static async optOutOfInAppNotifications(req, res) {
    const isUserInAppNotificationOn = await NotificationUtil
      .isUserInAppNotificationOn(req.user);

    if (!isUserInAppNotificationOn) {
      return res.status(400).json({
        success: false,
        message: 'You have not subscribed for in-app notifications'
      });
    }
    await NotificationUtil
      .updateNotificationStatus({ inAppNotification: false }, req.user);
    res.status(200).json({
      success: true,
      message: 'You have unsubscribed from in-app notifications'
    });
  }
}

export default NotificationController;
