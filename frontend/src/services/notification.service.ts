/**
 * CHE·NU — Notification Service
 */

import { Notification, NotificationSettings, NotificationStats, NotificationType } from '../types/notification.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class NotificationService {
  private getHeaders() {
    const token = localStorage.getItem('chenu_access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  // WebSocket connection for real-time notifications
  private ws: WebSocket | null = null;
  private listeners: ((notification: Notification) => void)[] = [];

  connect(userId: string) {
    const wsUrl = API_URL.replace('http', 'ws').replace('/api', '');
    this.ws = new WebSocket(`${wsUrl}/ws/notifications/${userId}`);

    this.ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      this.listeners.forEach(listener => listener(notification));
    };

    this.ws.onclose = () => {
      // Auto-reconnect after 5 seconds
      setTimeout(() => this.connect(userId), 5000);
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  onNotification(callback: (notification: Notification) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  async list(params?: {
    unread_only?: boolean;
    type?: NotificationType;
    limit?: number;
    offset?: number;
  }): Promise<{ notifications: Notification[]; total: number }> {
    const query = new URLSearchParams(params as any).toString();
    const response = await fetch(`${API_URL}/notifications?${query}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to list notifications');
    return response.json();
  }

  async markAsRead(id: string): Promise<void> {
    await fetch(`${API_URL}/notifications/${id}/read`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
  }

  async markAllAsRead(): Promise<void> {
    await fetch(`${API_URL}/notifications/read-all`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
  }

  async dismiss(id: string): Promise<void> {
    await fetch(`${API_URL}/notifications/${id}/dismiss`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
  }

  async dismissAll(): Promise<void> {
    await fetch(`${API_URL}/notifications/dismiss-all`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
  }

  async getStats(): Promise<NotificationStats> {
    const response = await fetch(`${API_URL}/notifications/stats`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to get notification stats');
    return response.json();
  }

  async getSettings(): Promise<NotificationSettings> {
    const response = await fetch(`${API_URL}/notifications/settings`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to get notification settings');
    return response.json();
  }

  async updateSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    const response = await fetch(`${API_URL}/notifications/settings`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(settings),
    });
    if (!response.ok) throw new Error('Failed to update notification settings');
    return response.json();
  }

  // Request browser notification permission
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;
    
    if (Notification.permission === 'granted') return true;
    
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  // Show browser notification
  showBrowserNotification(notification: Notification) {
    if (Notification.permission !== 'granted') return;

    new Notification(notification.title, {
      body: notification.message,
      icon: '/logo.png',
      tag: notification.id,
    });
  }
}

export const notificationService = new NotificationService();
export default notificationService;
