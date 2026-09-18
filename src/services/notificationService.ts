import { NotificationItem } from '../types';
import { INITIAL_NOTIFICATIONS } from '../data/mockData';

const NOTIFICATIONS_STORAGE_KEY = 'scholarsetu_notifications';

export const notificationService = {
  getNotifications(userId?: string): NotificationItem[] {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (stored) {
        const parsed: NotificationItem[] = JSON.parse(stored);
        if (userId) {
          return parsed.filter((n) => n.userId === userId || n.userId === 'all');
        }
        return parsed;
      }
    } catch {
      // Fallback
    }

    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
    return userId ? INITIAL_NOTIFICATIONS.filter((n) => n.userId === userId) : INITIAL_NOTIFICATIONS;
  },

  getUnreadCount(userId?: string): number {
    const list = this.getNotifications(userId);
    return list.filter((n) => !n.read).length;
  },

  markAsRead(id: string): void {
    const list = this.getNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
  },

  markAllAsRead(userId?: string): void {
    const list = this.getNotifications();
    const updated = list.map((n) => {
      if (!userId || n.userId === userId || n.userId === 'all') {
        return { ...n, read: true };
      }
      return n;
    });
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
  },

  createNotification(data: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): NotificationItem {
    const list = this.getNotifications();
    const newNotif: NotificationItem = {
      ...data,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      read: false
    };
    const updated = [newNotif, ...list];
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    return newNotif;
  }
};
