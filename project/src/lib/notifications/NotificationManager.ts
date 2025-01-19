import { useSettingsStore } from '../store/settingsStore';

export class NotificationManager {
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  static async showNotification(title: string, options?: NotificationOptions) {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) return;

    // Check quiet hours
    const settings = useSettingsStore.getState();
    if (settings.notifications.quietHours.enabled) {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const [startHours, startMinutes] = settings.notifications.quietHours.start.split(':').map(Number);
      const [endHours, endMinutes] = settings.notifications.quietHours.end.split(':').map(Number);
      const startTime = startHours * 60 + startMinutes;
      const endTime = endHours * 60 + endMinutes;

      if (startTime <= endTime) {
        if (currentTime >= startTime && currentTime <= endTime) {
          return; // Within quiet hours
        }
      } else {
        // Handles case where quiet hours span midnight
        if (currentTime >= startTime || currentTime <= endTime) {
          return; // Within quiet hours
        }
      }
    }

    // Add sound if enabled
    if (settings.soundEnabled) {
      options = {
        ...options,
        silent: false,
      };
    }

    return new Notification(title, options);
  }

  static async scheduleNotification(
    title: string,
    options: NotificationOptions,
    delay: number
  ) {
    setTimeout(() => {
      this.showNotification(title, options);
    }, delay);
  }

  static async scheduleTaskReminder(taskId: string, title: string, dueDate: Date) {
    const settings = useSettingsStore.getState();
    if (!settings.notifications.taskReminders) return;

    const now = new Date();
    const timeDiff = dueDate.getTime() - now.getTime();

    // Schedule 1 hour reminder
    if (timeDiff > 60 * 60 * 1000) {
      this.scheduleNotification(
        'Task Reminder',
        {
          body: `${title} is due in 1 hour`,
          tag: `task-1h-${taskId}`,
          icon: '/icons/task.png',
        },
        timeDiff - 60 * 60 * 1000
      );
    }

    // Schedule 15 minute reminder
    if (timeDiff > 15 * 60 * 1000) {
      this.scheduleNotification(
        'Task Reminder',
        {
          body: `${title} is due in 15 minutes`,
          tag: `task-15m-${taskId}`,
          icon: '/icons/task.png',
        },
        timeDiff - 15 * 60 * 1000
      );
    }
  }
}