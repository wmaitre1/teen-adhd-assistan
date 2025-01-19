import { Schedule } from '../../types';

export class ScheduleNotifications {
  private static async requestPermission(): Promise<boolean> {
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

  static async scheduleReminders(schedule: Schedule) {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) return;

    const now = new Date();
    const [hours, minutes] = schedule.startTime.split(':');
    const classTime = new Date(now);
    classTime.setHours(parseInt(hours, 10));
    classTime.setMinutes(parseInt(minutes, 10));

    // Schedule 1-hour reminder
    const hourBefore = new Date(classTime.getTime() - 60 * 60 * 1000);
    if (hourBefore > now) {
      this.scheduleNotification(
        `${schedule.name} starts in 1 hour`,
        {
          body: `Class with ${schedule.teacher} at ${schedule.startTime}`,
          icon: '/icons/reminder.png',
          tag: `class-1h-${schedule.id}`,
        },
        hourBefore.getTime() - now.getTime()
      );
    }

    // Schedule 15-minute reminder
    const fifteenBefore = new Date(classTime.getTime() - 15 * 60 * 1000);
    if (fifteenBefore > now) {
      this.scheduleNotification(
        `${schedule.name} starts in 15 minutes`,
        {
          body: `Class with ${schedule.teacher} at ${schedule.startTime}`,
          icon: '/icons/reminder.png',
          tag: `class-15m-${schedule.id}`,
        },
        fifteenBefore.getTime() - now.getTime()
      );
    }
  }

  private static scheduleNotification(
    title: string,
    options: NotificationOptions,
    delay: number
  ) {
    setTimeout(() => {
      new Notification(title, options);
    }, delay);
  }

  static async scheduleDailySummary(schedules: Schedule[]) {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) return;

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(7, 0, 0, 0); // 7 AM tomorrow

    const delay = tomorrow.getTime() - now.getTime();

    setTimeout(() => {
      const classes = schedules
        .map(s => `${s.startTime} - ${s.name}`)
        .join('\n');

      new Notification('Daily Schedule Summary', {
        body: `Your classes today:\n${classes}`,
        icon: '/icons/calendar.png',
        tag: 'daily-summary',
      });
    }, delay);
  }
}