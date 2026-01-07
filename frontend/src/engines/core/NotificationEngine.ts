/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — NOTIFICATION ENGINE                                   ║
 * ║              Core Engine 6/6                                                 ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  "User-controlled notifications. No dark patterns."                         ║
 * ║  "Every notification has a cost. No notification pollution."                ║
 * ║  "CHE·NU does NOT optimize for addiction."                                  ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type NotificationType = 
  | 'info'              // Informational
  | 'success'           // Task completed
  | 'warning'           // Attention needed
  | 'error'             // Problem occurred
  | 'approval_request'  // Human approval needed
  | 'budget_alert'      // Token/cost related
  | 'system'            // System messages
  | 'agent_update'      // Agent activity
  | 'thread_update'     // Thread changes
  | 'mention';          // User mentioned

export type NotificationPriority = 'critical' | 'high' | 'normal' | 'low';
export type DeliveryChannel = 'in_app' | 'push' | 'email' | 'sms';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  
  // Content
  title: string;
  body: string;
  icon?: string;
  
  // Context
  sphere_id?: string;
  thread_id?: string;
  action_url?: string;
  
  // Source
  source: {
    type: 'system' | 'agent' | 'user';
    id: string;
    name?: string;
  };
  
  // Target
  user_id: string;
  
  // Status
  status: 'pending' | 'delivered' | 'read' | 'dismissed' | 'actioned';
  
  // Timestamps
  created_at: string;
  delivered_at?: string;
  read_at?: string;
  expires_at?: string;
  
  // Actions
  actions?: NotificationAction[];
  
  // Cost
  token_cost: number;
}

export interface NotificationAction {
  id: string;
  label: string;
  action_type: 'approve' | 'reject' | 'navigate' | 'dismiss' | 'custom';
  action_data?: Record<string, any>;
  primary?: boolean;
}

export interface NotificationPreferences {
  user_id: string;
  
  // Global settings
  notifications_enabled: boolean;
  quiet_hours?: {
    start: string; // HH:mm
    end: string;
    timezone: string;
  };
  
  // Per-type settings
  type_settings: Record<NotificationType, {
    enabled: boolean;
    channels: DeliveryChannel[];
    min_priority: NotificationPriority;
    batch_delay_minutes?: number;
  }>;
  
  // Per-sphere settings
  sphere_settings: Record<string, {
    enabled: boolean;
    priority_override?: NotificationPriority;
  }>;
  
  // Budget
  daily_notification_budget: number;
  notifications_used_today: number;
}

export interface NotificationBatch {
  id: string;
  user_id: string;
  notifications: string[]; // notification IDs
  scheduled_for: string;
  delivered: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATION ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export class NotificationEngine {
  private notifications: Map<string, Notification> = new Map();
  private userPreferences: Map<string, NotificationPreferences> = new Map();
  private pendingBatches: Map<string, NotificationBatch> = new Map();
  private subscribers: Map<string, Array<(notification: Notification) => void>> = new Map();
  
  // Anti-addiction metrics
  private dailyStats: Map<string, {
    date: string;
    count: number;
    token_cost: number;
    by_type: Record<NotificationType, number>;
  }> = new Map();
  
  constructor() {}
  
  // ═══════════════════════════════════════════════════════════════════════════
  // NOTIFICATION SENDING
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Send a notification (governed)
   */
  async send(params: {
    type: NotificationType;
    priority: NotificationPriority;
    title: string;
    body: string;
    user_id: string;
    source: Notification['source'];
    sphere_id?: string;
    thread_id?: string;
    action_url?: string;
    actions?: NotificationAction[];
    expires_in_hours?: number;
  }): Promise<Notification | null> {
    // Check if notifications are allowed
    const prefs = this.getOrCreatePreferences(params.user_id);
    
    // Global check
    if (!prefs.notifications_enabled) {
      return null;
    }
    
    // Type check
    const typeSettings = prefs.type_settings[params.type];
    if (!typeSettings?.enabled) {
      return null;
    }
    
    // Priority check
    if (!this.meetsMinPriority(params.priority, typeSettings.min_priority)) {
      return null;
    }
    
    // Budget check (anti-addiction)
    if (prefs.notifications_used_today >= prefs.daily_notification_budget) {
      // Only allow critical notifications over budget
      if (params.priority !== 'critical') {
        logger.warn(`User ${params.user_id} notification budget exceeded`);
        return null;
      }
    }
    
    // Quiet hours check
    if (this.isQuietHours(prefs) && params.priority !== 'critical') {
      // Queue for later
      return this.queueForLater(params, prefs);
    }
    
    // Create notification
    const notification = this.createNotification(params);
    
    // Check if should batch
    if (typeSettings.batch_delay_minutes && typeSettings.batch_delay_minutes > 0) {
      return this.addToBatch(notification, typeSettings.batch_delay_minutes);
    }
    
    // Deliver immediately
    return this.deliver(notification);
  }
  
  /**
   * Send system notification (bypasses some checks)
   */
  async sendSystem(
    userId: string,
    title: string,
    body: string,
    priority: NotificationPriority = 'normal'
  ): Promise<Notification> {
    const notification = this.createNotification({
      type: 'system',
      priority,
      title,
      body,
      user_id: userId,
      source: { type: 'system', id: 'system' },
    });
    
    return this.deliver(notification);
  }
  
  /**
   * Request approval notification
   */
  async requestApproval(params: {
    user_id: string;
    title: string;
    body: string;
    approval_id: string;
    sphere_id?: string;
    thread_id?: string;
  }): Promise<Notification> {
    const notification = this.createNotification({
      type: 'approval_request',
      priority: 'high',
      title: params.title,
      body: params.body,
      user_id: params.user_id,
      source: { type: 'system', id: 'governance' },
      sphere_id: params.sphere_id,
      thread_id: params.thread_id,
      actions: [
        { id: 'approve', label: 'Approve', action_type: 'approve', action_data: { approval_id: params.approval_id }, primary: true },
        { id: 'reject', label: 'Reject', action_type: 'reject', action_data: { approval_id: params.approval_id } },
      ],
    });
    
    return this.deliver(notification);
  }
  
  /**
   * Budget alert notification
   */
  async sendBudgetAlert(
    userId: string,
    currentBalance: number,
    threshold: number,
    sphereId?: string
  ): Promise<Notification> {
    const notification = this.createNotification({
      type: 'budget_alert',
      priority: currentBalance < threshold * 0.1 ? 'critical' : 'high',
      title: 'Budget Alert',
      body: `Your token balance (${currentBalance}) is below the threshold (${threshold})`,
      user_id: userId,
      source: { type: 'system', id: 'budget_monitor' },
      sphere_id: sphereId,
    });
    
    return this.deliver(notification);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // NOTIFICATION RETRIEVAL
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Get notifications for a user
   */
  getNotifications(
    userId: string,
    options?: {
      status?: Notification['status'];
      type?: NotificationType;
      sphere_id?: string;
      limit?: number;
      offset?: number;
    }
  ): Notification[] {
    let results = Array.from(this.notifications.values())
      .filter(n => n.user_id === userId);
    
    if (options?.status) {
      results = results.filter(n => n.status === options.status);
    }
    
    if (options?.type) {
      results = results.filter(n => n.type === options.type);
    }
    
    if (options?.sphere_id) {
      results = results.filter(n => n.sphere_id === options.sphere_id);
    }
    
    // Sort by created_at descending
    results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    // Pagination
    const offset = options?.offset || 0;
    const limit = options?.limit || 50;
    
    return results.slice(offset, offset + limit);
  }
  
  /**
   * Get unread count
   */
  getUnreadCount(userId: string, sphereId?: string): number {
    return Array.from(this.notifications.values())
      .filter(n => 
        n.user_id === userId && 
        n.status === 'delivered' &&
        (!sphereId || n.sphere_id === sphereId)
      )
      .length;
  }
  
  /**
   * Get pending approval count
   */
  getPendingApprovalCount(userId: string): number {
    return Array.from(this.notifications.values())
      .filter(n => 
        n.user_id === userId && 
        n.type === 'approval_request' &&
        n.status !== 'actioned' &&
        n.status !== 'dismissed'
      )
      .length;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // NOTIFICATION ACTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Mark as read
   */
  markAsRead(notificationId: string): boolean {
    const notification = this.notifications.get(notificationId);
    if (!notification) return false;
    
    notification.status = 'read';
    notification.read_at = new Date().toISOString();
    return true;
  }
  
  /**
   * Mark all as read for a user
   */
  markAllAsRead(userId: string, sphereId?: string): number {
    let count = 0;
    this.notifications.forEach(n => {
      if (n.user_id === userId && n.status === 'delivered') {
        if (!sphereId || n.sphere_id === sphereId) {
          n.status = 'read';
          n.read_at = new Date().toISOString();
          count++;
        }
      }
    });
    return count;
  }
  
  /**
   * Dismiss notification
   */
  dismiss(notificationId: string): boolean {
    const notification = this.notifications.get(notificationId);
    if (!notification) return false;
    
    notification.status = 'dismissed';
    return true;
  }
  
  /**
   * Execute notification action
   */
  executeAction(notificationId: string, actionId: string): { success: boolean; action_data?: unknown } {
    const notification = this.notifications.get(notificationId);
    if (!notification) return { success: false };
    
    const action = notification.actions?.find(a => a.id === actionId);
    if (!action) return { success: false };
    
    notification.status = 'actioned';
    
    return {
      success: true,
      action_data: action.action_data,
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PREFERENCES
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Get user preferences
   */
  getPreferences(userId: string): NotificationPreferences | null {
    return this.userPreferences.get(userId) || null;
  }
  
  /**
   * Update user preferences
   */
  updatePreferences(userId: string, updates: Partial<NotificationPreferences>): NotificationPreferences {
    const prefs = this.getOrCreatePreferences(userId);
    Object.assign(prefs, updates);
    return prefs;
  }
  
  /**
   * Set type preference
   */
  setTypePreference(
    userId: string,
    type: NotificationType,
    settings: NotificationPreferences['type_settings'][NotificationType]
  ): void {
    const prefs = this.getOrCreatePreferences(userId);
    prefs.type_settings[type] = settings;
  }
  
  /**
   * Set sphere preference
   */
  setSpherePreference(
    userId: string,
    sphereId: string,
    settings: { enabled: boolean; priority_override?: NotificationPriority }
  ): void {
    const prefs = this.getOrCreatePreferences(userId);
    prefs.sphere_settings[sphereId] = settings;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SUBSCRIPTION (Real-time)
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Subscribe to notifications for a user
   */
  subscribe(userId: string, callback: (notification: Notification) => void): () => void {
    if (!this.subscribers.has(userId)) {
      this.subscribers.set(userId, []);
    }
    this.subscribers.get(userId)!.push(callback);
    
    return () => {
      const subs = this.subscribers.get(userId);
      if (subs) {
        const index = subs.indexOf(callback);
        if (index !== -1) subs.splice(index, 1);
      }
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ANTI-ADDICTION METRICS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Get daily stats for a user
   */
  getDailyStats(userId: string): {
    count: number;
    token_cost: number;
    by_type: Record<NotificationType, number>;
    budget_remaining: number;
  } {
    const today = new Date().toISOString().split('T')[0];
    const key = `${userId}_${today}`;
    const stats = this.dailyStats.get(key) || {
      date: today,
      count: 0,
      token_cost: 0,
      by_type: {} as Record<NotificationType, number>,
    };
    
    const prefs = this.getOrCreatePreferences(userId);
    
    return {
      ...stats,
      budget_remaining: prefs.daily_notification_budget - stats.count,
    };
  }
  
  /**
   * Reset daily notification counter (called at midnight)
   */
  resetDailyCounter(userId: string): void {
    const prefs = this.userPreferences.get(userId);
    if (prefs) {
      prefs.notifications_used_today = 0;
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // HELPER METHODS
  // ═══════════════════════════════════════════════════════════════════════════
  
  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
  
  private getOrCreatePreferences(userId: string): NotificationPreferences {
    let prefs = this.userPreferences.get(userId);
    if (!prefs) {
      prefs = this.createDefaultPreferences(userId);
      this.userPreferences.set(userId, prefs);
    }
    return prefs;
  }
  
  private createDefaultPreferences(userId: string): NotificationPreferences {
    const defaultTypeSettings: NotificationPreferences['type_settings'] = {} as any;
    const types: NotificationType[] = [
      'info', 'success', 'warning', 'error', 'approval_request',
      'budget_alert', 'system', 'agent_update', 'thread_update', 'mention'
    ];
    
    types.forEach(type => {
      defaultTypeSettings[type] = {
        enabled: true,
        channels: ['in_app'],
        min_priority: type === 'info' ? 'low' : 'normal',
        batch_delay_minutes: type === 'info' ? 15 : 0,
      };
    });
    
    return {
      user_id: userId,
      notifications_enabled: true,
      type_settings: defaultTypeSettings,
      sphere_settings: {},
      daily_notification_budget: 50, // Anti-addiction: max 50 notifications per day
      notifications_used_today: 0,
    };
  }
  
  private createNotification(params: {
    type: NotificationType;
    priority: NotificationPriority;
    title: string;
    body: string;
    user_id: string;
    source: Notification['source'];
    sphere_id?: string;
    thread_id?: string;
    action_url?: string;
    actions?: NotificationAction[];
    expires_in_hours?: number;
  }): Notification {
    const now = new Date();
    
    return {
      id: this.generateId('notif'),
      type: params.type,
      priority: params.priority,
      title: params.title,
      body: params.body,
      sphere_id: params.sphere_id,
      thread_id: params.thread_id,
      action_url: params.action_url,
      source: params.source,
      user_id: params.user_id,
      status: 'pending',
      created_at: now.toISOString(),
      expires_at: params.expires_in_hours 
        ? new Date(now.getTime() + params.expires_in_hours * 60 * 60 * 1000).toISOString()
        : undefined,
      actions: params.actions,
      token_cost: this.calculateTokenCost(params.priority),
    };
  }
  
  private deliver(notification: Notification): Notification {
    notification.status = 'delivered';
    notification.delivered_at = new Date().toISOString();
    
    this.notifications.set(notification.id, notification);
    
    // Update stats
    this.updateDailyStats(notification);
    
    // Update user preferences
    const prefs = this.userPreferences.get(notification.user_id);
    if (prefs) {
      prefs.notifications_used_today++;
    }
    
    // Notify subscribers
    const subs = this.subscribers.get(notification.user_id);
    if (subs) {
      subs.forEach(cb => cb(notification));
    }
    
    return notification;
  }
  
  private queueForLater(params: unknown, prefs: NotificationPreferences): Notification | null {
    const notification = this.createNotification(params);
    notification.status = 'pending';
    this.notifications.set(notification.id, notification);
    
    // Calculate delivery time (after quiet hours)
    const [endHour, endMinute] = prefs.quiet_hours!.end.split(':').map(Number);
    const deliveryTime = new Date();
    deliveryTime.setHours(endHour, endMinute, 0, 0);
    
    // If end time is past, deliver next day
    if (deliveryTime < new Date()) {
      deliveryTime.setDate(deliveryTime.getDate() + 1);
    }
    
    // Schedule delivery (in production, would use job queue)
    setTimeout(() => {
      this.deliver(notification);
    }, deliveryTime.getTime() - Date.now());
    
    return notification;
  }
  
  private addToBatch(notification: Notification, delayMinutes: number): Notification {
    notification.status = 'pending';
    this.notifications.set(notification.id, notification);
    
    // Find or create batch
    const batchKey = `${notification.user_id}_${notification.type}`;
    let batch = this.pendingBatches.get(batchKey);
    
    if (!batch) {
      batch = {
        id: this.generateId('batch'),
        user_id: notification.user_id,
        notifications: [],
        scheduled_for: new Date(Date.now() + delayMinutes * 60 * 1000).toISOString(),
        delivered: false,
      };
      this.pendingBatches.set(batchKey, batch);
      
      // Schedule batch delivery
      setTimeout(() => {
        this.deliverBatch(batchKey);
      }, delayMinutes * 60 * 1000);
    }
    
    batch.notifications.push(notification.id);
    return notification;
  }
  
  private deliverBatch(batchKey: string): void {
    const batch = this.pendingBatches.get(batchKey);
    if (!batch || batch.delivered) return;
    
    batch.notifications.forEach(id => {
      const notification = this.notifications.get(id);
      if (notification && notification.status === 'pending') {
        this.deliver(notification);
      }
    });
    
    batch.delivered = true;
    this.pendingBatches.delete(batchKey);
  }
  
  private meetsMinPriority(priority: NotificationPriority, minPriority: NotificationPriority): boolean {
    const priorityOrder = { critical: 4, high: 3, normal: 2, low: 1 };
    return priorityOrder[priority] >= priorityOrder[minPriority];
  }
  
  private isQuietHours(prefs: NotificationPreferences): boolean {
    if (!prefs.quiet_hours) return false;
    
    const now = new Date();
    const [startHour, startMinute] = prefs.quiet_hours.start.split(':').map(Number);
    const [endHour, endMinute] = prefs.quiet_hours.end.split(':').map(Number);
    
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    if (startMinutes < endMinutes) {
      return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    } else {
      // Quiet hours span midnight
      return currentMinutes >= startMinutes || currentMinutes < endMinutes;
    }
  }
  
  private calculateTokenCost(priority: NotificationPriority): number {
    const costs = { critical: 1, high: 0.5, normal: 0.25, low: 0.1 };
    return costs[priority];
  }
  
  private updateDailyStats(notification: Notification): void {
    const today = new Date().toISOString().split('T')[0];
    const key = `${notification.user_id}_${today}`;
    
    let stats = this.dailyStats.get(key);
    if (!stats) {
      stats = {
        date: today,
        count: 0,
        token_cost: 0,
        by_type: {} as Record<NotificationType, number>,
      };
      this.dailyStats.set(key, stats);
    }
    
    stats.count++;
    stats.token_cost += notification.token_cost;
    stats.by_type[notification.type] = (stats.by_type[notification.type] || 0) + 1;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default NotificationEngine;
