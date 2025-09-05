import admin from 'firebase-admin';
import User from '../models/User';

interface NotificationPayload {
  title: string;
  body: string;
  data?: { [key: string]: string };
  imageUrl?: string;
}

interface PushNotificationOptions {
  priority?: 'high' | 'normal';
  timeToLive?: number;
  sound?: string;
  badge?: number;
}

export class NotificationService {
  private initialized = false;

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          // Add your Firebase config here
        });
      }
      this.initialized = true;
    } catch (error) {
      console.error('Firebase initialization error:', error);
    }
  }

  async sendPushNotification(
    token: string,
    payload: NotificationPayload,
    options: PushNotificationOptions = {}
  ): Promise<boolean> {
    if (!this.initialized) {
      console.error('Firebase not initialized');
      return false;
    }

    try {
      const message = {
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl
        },
        data: payload.data || {},
        android: {
          priority: options.priority || 'high',
          ttl: options.timeToLive || 3600000,
          notification: {
            sound: options.sound || 'default',
            clickAction: 'FLUTTER_NOTIFICATION_CLICK'
          }
        },
        apns: {
          payload: {
            aps: {
              badge: options.badge || 0,
              sound: options.sound || 'default'
            }
          }
        },
        token
      };

      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  async sendToMultipleDevices(
    tokens: string[],
    payload: NotificationPayload,
    options: PushNotificationOptions = {}
  ): Promise<{ successCount: number; failureCount: number }> {
    if (!this.initialized || tokens.length === 0) {
      return { successCount: 0, failureCount: tokens.length };
    }

    try {
      const message = {
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl
        },
        data: payload.data || {},
        android: {
          priority: options.priority || 'high',
          ttl: options.timeToLive || 3600000
        },
        tokens
      };

      const response = await admin.messaging().sendMulticast(message);
      console.log('Multicast result:', response);
      
      return {
        successCount: response.successCount,
        failureCount: response.failureCount
      };
    } catch (error) {
      console.error('Error sending multicast message:', error);
      return { successCount: 0, failureCount: tokens.length };
    }
  }

  async sendToUser(
    userId: string,
    payload: NotificationPayload,
    options: PushNotificationOptions = {}
  ): Promise<boolean> {
    try {
      const user = await User.findById(userId);
      if (!user || !user.pushToken || !user.settings.notifications) {
        return false;
      }

      return await this.sendPushNotification(user.pushToken, payload, options);
    } catch (error) {
      console.error('Error sending notification to user:', error);
      return false;
    }
  }

  async sendCourseCompleteNotification(userId: string, courseTitle: string) {
    return await this.sendToUser(userId, {
      title: 'Course Completed! 🎉',
      body: `Congratulations on completing ${courseTitle}`,
      data: {
        type: 'course_complete',
        courseTitle
      }
    });
  }

  async sendQuizResultNotification(
    userId: string, 
    passed: boolean, 
    score: number, 
    courseTitle: string
  ) {
    const title = passed ? 'Quiz Passed! ✅' : 'Quiz Completed 📝';
    const body = passed 
      ? `Great job! You scored ${score}% on ${courseTitle}` 
      : `You scored ${score}% on ${courseTitle}. Try again to pass!`;

    return await this.sendToUser(userId, {
      title,
      body,
      data: {
        type: 'quiz_result',
        passed: passed.toString(),
        score: score.toString(),
        courseTitle
      }
    });
  }

  async sendMarketUpdateNotification(userIds: string[], marketUpdate: string) {
    try {
      const users = await User.find({
        _id: { $in: userIds },
        'settings.notifications': true,
        pushToken: { $exists: true, $ne: null }
      });

      const tokens = users.map(user => user.pushToken).filter(Boolean);

      if (tokens.length === 0) return { successCount: 0, failureCount: 0 };

      return await this.sendToMultipleDevices(tokens, {
        title: 'Market Update 📈',
        body: marketUpdate,
        data: {
          type: 'market_update'
        }
      });
    } catch (error) {
      console.error('Error sending market update:', error);
      return { successCount: 0, failureCount: 0 };
    }
  }

  async sendLearningReminderNotification(userId: string) {
    return await this.sendToUser(userId, {
      title: 'Continue Learning 📚',
      body: 'Complete your daily learning goal and earn more points!',
      data: {
        type: 'learning_reminder'
      }
    });
  }

  async sendAchievementNotification(userId: string, achievement: string) {
    return await this.sendToUser(userId, {
      title: 'New Achievement Unlocked! 🏆',
      body: achievement,
      data: {
        type: 'achievement',
        achievement
      }
    });
  }

  async sendTradingAlertNotification(
    userId: string, 
    symbol: string, 
    price: number, 
    changePercent: number
  ) {
    const direction = changePercent >= 0 ? 'up' : 'down';
    const emoji = changePercent >= 0 ? '📈' : '📉';
    
    return await this.sendToUser(userId, {
      title: `${symbol} Alert ${emoji}`,
      body: `${symbol} is ${direction} ${Math.abs(changePercent).toFixed(2)}% at ₹${price}`,
      data: {
        type: 'trading_alert',
        symbol,
        price: price.toString(),
        changePercent: changePercent.toString()
      }
    });
  }

  async scheduleNotification(
    userId: string,
    payload: NotificationPayload,
    scheduleTime: Date,
    options: PushNotificationOptions = {}
  ) {
    // For scheduling notifications, you might want to use a job queue like Bull or Agenda
    // This is a simple implementation using setTimeout for demo purposes
    const delay = scheduleTime.getTime() - Date.now();
    
    if (delay > 0) {
      setTimeout(async () => {
        await this.sendToUser(userId, payload, options);
      }, delay);
    }
  }
}

export default new NotificationService();
