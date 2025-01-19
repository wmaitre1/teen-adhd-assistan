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
}