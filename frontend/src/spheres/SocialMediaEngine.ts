/**
 * CHE·NU™ — SOCIAL & MEDIA SPHERE ENGINE v35
 * 
 * ════════════════════════════════════════════════════════════════════════════
 * Social Media Management: Publishing, Scheduling, Analytics, Engagement
 * Hootsuite + Buffer + Sprout Social + Later + Brandwatch UNIFIED
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * @author Jonathan Emmanuel Rodrigue
 * @version 35.0
 * @license Proprietary - All Rights Reserved
 */

// ═══════════════════════════════════════════════════════════════════════════
// SPHERE IDENTITY (V51 STANDARD)
// ═══════════════════════════════════════════════════════════════════════════

import type { SphereId } from '../types/spheres.types';

export const SPHERE_ID: SphereId = 'social';
export const SPHERE_COLOR = '#2F4C39';
export const SPHERE_ICON = '📱';
export const SPHERE_NAME = 'Social & Media';
export const SPHERE_NAME_FR = 'Social';

// ═══════════════════════════════════════════════════════════════════════════
// SOCIAL & MEDIA ENGINE
// ═══════════════════════════════════════════════════════════════════════════

export interface SocialMediaEngine {
  // Connected Accounts
  accounts: SocialAccount[];
  
  // Content
  content: ContentEngine;
  
  // Publishing
  publishing: PublishingEngine;
  
  // Scheduling
  scheduler: SchedulerEngine;
  
  // Inbox & Engagement
  inbox: SocialInbox;
  
  // Analytics
  analytics: SocialAnalytics;
  
  // Listening & Monitoring
  listening: ListeningEngine;
  
  // Influencer Management
  influencers: InfluencerEngine;
  
  // Campaigns
  campaigns: SocialCampaign[];
  
  // Ads
  advertising: AdvertisingEngine;
  
  // Team
  team: SocialTeam;
}

// ═══════════════════════════════════════════════════════════════════════════
// SOCIAL ACCOUNTS
// ═══════════════════════════════════════════════════════════════════════════

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  
  // Account Info
  username: string;
  displayName: string;
  avatar: string;
  bio?: string;
  
  // Type
  type: 'personal' | 'business' | 'creator';
  
  // Connection
  status: 'connected' | 'disconnected' | 'error' | 'expired';
  connectedAt: string;
  expiresAt?: string;
  lastSync: string;
  
  // Permissions
  permissions: string[];
  
  // Stats
  stats: AccountStats;
  
  // Settings
  settings: AccountSettings;
  
  // Labels
  labels: string[];
  color: string;
}

export type SocialPlatform = 
  | 'instagram'
  | 'instagram_business'
  | 'facebook'
  | 'facebook_page'
  | 'twitter'
  | 'linkedin'
  | 'linkedin_page'
  | 'tiktok'
  | 'youtube'
  | 'pinterest'
  | 'threads'
  | 'bluesky'
  | 'mastodon'
  | 'snapchat'
  | 'reddit'
  | 'whatsapp_business'
  | 'telegram';

export interface AccountStats {
  followers: number;
  following: number;
  posts: number;
  
  // Growth
  followersGrowth: number;
  followersGrowthPercent: number;
  
  // Engagement
  avgEngagement: number;
  avgReach: number;
  avgImpressions: number;
  
  // Recent
  recentPosts: number;
  recentEngagement: number;
  
  // History
  history: AccountStatHistory[];
}

export interface AccountStatHistory {
  date: string;
  followers: number;
  engagement: number;
  reach: number;
  impressions: number;
}

export interface AccountSettings {
  // Publishing
  defaultHashtags: string[];
  signature?: string;
  linkInBio?: string;
  
  // Auto-actions
  autoReply: boolean;
  autoLike: boolean;
  autoFollow: boolean;
  
  // Notifications
  notifyOnMention: boolean;
  notifyOnComment: boolean;
  notifyOnDM: boolean;
  
  // Best times
  bestTimesToPost: BestTime[];
}

export interface BestTime {
  dayOfWeek: number;
  hour: number;
  score: number;
  reason: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT ENGINE
// ═══════════════════════════════════════════════════════════════════════════

export interface ContentEngine {
  // Library
  library: ContentLibrary;
  
  // Creation
  creator: ContentCreator;
  
  // Templates
  templates: ContentTemplate[];
  
  // Hashtags
  hashtags: HashtagManager;
  
  // Captions
  captions: CaptionManager;
  
  // Media
  media: MediaManager;
}

export interface ContentLibrary {
  items: ContentItem[];
  folders: ContentFolder[];
  collections: ContentCollection[];
  
  // Stats
  totalItems: number;
  byType: Record<ContentType, number>;
  byPlatform: Record<SocialPlatform, number>;
}

export interface ContentItem {
  id: string;
  
  // Type
  type: ContentType;
  
  // Media
  media: MediaAsset[];
  
  // Text
  caption?: string;
  altText?: string;
  
  // Hashtags
  hashtags: string[];
  
  // Mentions
  mentions: string[];
  
  // Links
  links: ContentLink[];
  
  // Platform-specific
  platformData: Record<SocialPlatform, PlatformContent>;
  
  // Status
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  
  // Publishing
  publishedTo: PublishedPost[];
  scheduledFor: ScheduledPost[];
  
  // Organization
  folderId?: string;
  collections: string[];
  labels: string[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export type ContentType = 
  | 'image'
  | 'video'
  | 'carousel'
  | 'story'
  | 'reel'
  | 'text'
  | 'link'
  | 'poll'
  | 'thread'
  | 'live';

export interface MediaAsset {
  id: string;
  type: 'image' | 'video' | 'gif';
  url: string;
  thumbnailUrl?: string;
  
  // Properties
  width: number;
  height: number;
  duration?: number;
  size: number;
  format: string;
  
  // Optimized versions
  optimized: OptimizedMedia[];
  
  // Metadata
  altText?: string;
  caption?: string;
}

export interface OptimizedMedia {
  platform: SocialPlatform;
  url: string;
  width: number;
  height: number;
  format: string;
}

export interface ContentLink {
  url: string;
  shortUrl?: string;
  title?: string;
  description?: string;
  image?: string;
  utmParams?: UTMParams;
}

export interface UTMParams {
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
}

export interface PlatformContent {
  // Caption (may vary by platform)
  caption?: string;
  
  // Platform-specific fields
  firstComment?: string; // Instagram
  altText?: string;
  location?: string;
  taggedUsers?: string[];
  
  // Thread (Twitter/Threads)
  threadParts?: string[];
  
  // Poll
  pollOptions?: string[];
  pollDuration?: number;
  
  // Video
  thumbnail?: string;
  title?: string;
  description?: string;
  tags?: string[];
  category?: string;
  privacy?: string;
}

export interface PublishedPost {
  id: string;
  accountId: string;
  platform: SocialPlatform;
  postId: string;
  postUrl: string;
  publishedAt: string;
  
  // Performance
  performance: PostPerformance;
}

export interface ScheduledPost {
  id: string;
  accountId: string;
  platform: SocialPlatform;
  scheduledFor: string;
  status: 'scheduled' | 'publishing' | 'failed' | 'published';
  error?: string;
}

export interface PostPerformance {
  // Engagement
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  
  // Reach
  reach: number;
  impressions: number;
  
  // Video
  views?: number;
  watchTime?: number;
  avgWatchPercent?: number;
  
  // Clicks
  clicks?: number;
  linkClicks?: number;
  profileClicks?: number;
  
  // Calculated
  engagementRate: number;
  
  // History
  history: PerformanceHistory[];
  
  // Last updated
  updatedAt: string;
}

export interface PerformanceHistory {
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
}

export interface ContentFolder {
  id: string;
  name: string;
  parentId?: string;
  color?: string;
  itemCount: number;
}

export interface ContentCollection {
  id: string;
  name: string;
  description?: string;
  cover?: string;
  items: string[];
  isPublic: boolean;
  shareLink?: string;
}

export interface ContentTemplate {
  id: string;
  name: string;
  description?: string;
  
  // Type
  type: ContentType;
  platforms: SocialPlatform[];
  
  // Template content
  captionTemplate: string;
  variables: TemplateVariable[];
  
  // Media
  mediaPlaceholder?: string;
  suggestedMedia?: string[];
  
  // Hashtags
  hashtagGroups: string[];
  
  // Category
  category: string;
  
  // Usage
  usageCount: number;
  lastUsed?: string;
}

export interface TemplateVariable {
  name: string;
  description: string;
  type: 'text' | 'date' | 'link' | 'hashtag' | 'mention';
  defaultValue?: string;
  required: boolean;
}

export interface HashtagManager {
  // Saved groups
  groups: HashtagGroup[];
  
  // Research
  research: HashtagResearch;
  
  // Banned/restricted
  banned: string[];
  restricted: Record<SocialPlatform, string[]>;
  
  // Analytics
  analytics: HashtagAnalytics;
}

export interface HashtagGroup {
  id: string;
  name: string;
  hashtags: string[];
  platforms: SocialPlatform[];
  usageCount: number;
}

export interface HashtagResearch {
  search(query: string, platform: SocialPlatform): Promise<HashtagSuggestion[]>;
  getRelated(hashtag: string): Promise<HashtagSuggestion[]>;
  getTrending(platform: SocialPlatform): Promise<HashtagSuggestion[]>;
}

export interface HashtagSuggestion {
  hashtag: string;
  postCount: number;
  avgEngagement: number;
  difficulty: 'easy' | 'medium' | 'hard';
  trending: boolean;
  relevance: number;
}

export interface HashtagAnalytics {
  topPerforming: { hashtag: string; avgEngagement: number; uses: number }[];
  byReach: { hashtag: string; avgReach: number }[];
  history: { date: string; hashtag: string; performance: number }[];
}

export interface CaptionManager {
  // AI Generation
  generate(context: CaptionContext): Promise<string[]>;
  
  // Rewrite
  rewrite(caption: string, style: string): Promise<string>;
  
  // Optimize
  optimize(caption: string, platform: SocialPlatform): Promise<string>;
  
  // Saved captions
  saved: SavedCaption[];
  
  // Templates
  templates: CaptionTemplate[];
}

export interface CaptionContext {
  topic: string;
  tone: string;
  platform: SocialPlatform;
  contentType: ContentType;
  keywords?: string[];
  length?: 'short' | 'medium' | 'long';
  includeEmoji?: boolean;
  includeHashtags?: boolean;
  callToAction?: string;
}

export interface SavedCaption {
  id: string;
  caption: string;
  platforms: SocialPlatform[];
  tags: string[];
  usageCount: number;
}

export interface CaptionTemplate {
  id: string;
  name: string;
  template: string;
  variables: string[];
  category: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// PUBLISHING ENGINE
// ═══════════════════════════════════════════════════════════════════════════

export interface PublishingEngine {
  // Publish now
  publish(content: ContentItem, accounts: string[]): Promise<PublishResult>;
  
  // Cross-post
  crossPost(postId: string, targetAccounts: string[]): Promise<PublishResult>;
  
  // Queue
  queue: PublishQueue;
  
  // History
  history: PublishHistory[];
  
  // Settings
  settings: PublishSettings;
}

export interface PublishResult {
  success: boolean;
  results: {
    accountId: string;
    platform: SocialPlatform;
    success: boolean;
    postId?: string;
    postUrl?: string;
    error?: string;
  }[];
}

export interface PublishQueue {
  items: QueueItem[];
  
  // Queue management
  add(item: QueueItem): void;
  remove(id: string): void;
  reorder(ids: string[]): void;
  pause(): void;
  resume(): void;
  
  // Status
  status: 'active' | 'paused';
  nextPublish?: string;
}

export interface QueueItem {
  id: string;
  contentId: string;
  accountId: string;
  scheduledFor?: string;
  position: number;
  status: 'queued' | 'publishing' | 'published' | 'failed';
}

export interface PublishHistory {
  id: string;
  contentId: string;
  accountId: string;
  platform: SocialPlatform;
  postId: string;
  postUrl: string;
  publishedAt: string;
  method: 'manual' | 'scheduled' | 'queue' | 'auto';
}

export interface PublishSettings {
  // Auto-publish
  autoPublish: boolean;
  
  // Retry
  retryOnFail: boolean;
  maxRetries: number;
  
  // Notifications
  notifyOnPublish: boolean;
  notifyOnFail: boolean;
  
  // Quality checks
  requireApproval: boolean;
  checkSpelling: boolean;
  checkLinks: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// SCHEDULER ENGINE
// ═══════════════════════════════════════════════════════════════════════════

export interface SchedulerEngine {
  // Calendar
  calendar: ContentCalendar;
  
  // Scheduling
  schedule(content: ContentItem, accounts: string[], time: string): Promise<ScheduleResult>;
  
  // Bulk scheduling
  bulkSchedule(items: BulkScheduleItem[]): Promise<ScheduleResult[]>;
  
  // Auto-scheduling
  autoSchedule: AutoScheduler;
  
  // Time slots
  timeSlots: TimeSlotManager;
  
  // Recurring
  recurring: RecurringScheduler;
}

export interface ContentCalendar {
  // View
  view: 'day' | 'week' | 'month';
  
  // Items
  getItems(start: string, end: string): ScheduledItem[];
  
  // Drag & drop
  moveItem(id: string, newTime: string): void;
  
  // Filters
  filters: CalendarFilters;
}

export interface ScheduledItem {
  id: string;
  contentId: string;
  accountIds: string[];
  scheduledFor: string;
  status: 'scheduled' | 'publishing' | 'published' | 'failed';
  
  // Preview
  preview: {
    type: ContentType;
    thumbnail?: string;
    caption?: string;
  };
}

export interface CalendarFilters {
  accounts: string[];
  platforms: SocialPlatform[];
  contentTypes: ContentType[];
  status: string[];
  labels: string[];
}

export interface ScheduleResult {
  success: boolean;
  scheduleId?: string;
  error?: string;
}

export interface BulkScheduleItem {
  contentId: string;
  accountIds: string[];
  scheduledFor: string;
}

export interface AutoScheduler {
  enabled: boolean;
  
  // Settings
  settings: AutoScheduleSettings;
  
  // Suggest times
  suggestTimes(content: ContentItem, accounts: string[], count: number): Promise<SuggestedTime[]>;
  
  // Auto-fill week
  autoFillWeek(contentIds: string[], accounts: string[]): Promise<ScheduledItem[]>;
}

export interface AutoScheduleSettings {
  // Time preferences
  preferredDays: number[];
  preferredHours: { start: number; end: number };
  timezone: string;
  
  // Spacing
  minPostSpacing: number; // hours
  maxPostsPerDay: number;
  
  // Optimization
  optimizeForEngagement: boolean;
  useHistoricalData: boolean;
  avoidWeekends: boolean;
}

export interface SuggestedTime {
  time: string;
  score: number;
  reason: string;
  expectedEngagement: number;
}

export interface TimeSlotManager {
  slots: TimeSlot[];
  
  // Management
  addSlot(slot: TimeSlot): void;
  removeSlot(id: string): void;
  
  // Bulk
  setWeeklySchedule(slots: WeeklySlot[]): void;
}

export interface TimeSlot {
  id: string;
  dayOfWeek: number;
  time: string;
  accounts: string[];
  contentTypes: ContentType[];
  labels?: string[];
  enabled: boolean;
}

export interface WeeklySlot {
  dayOfWeek: number;
  times: string[];
}

export interface RecurringScheduler {
  items: RecurringItem[];
  
  // Management
  create(item: RecurringItemCreate): RecurringItem;
  update(id: string, updates: Partial<RecurringItem>): void;
  delete(id: string): void;
  pause(id: string): void;
  resume(id: string): void;
}

export interface RecurringItem {
  id: string;
  contentId: string;
  accountIds: string[];
  
  // Schedule
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  time: string;
  
  // Duration
  startDate: string;
  endDate?: string;
  occurrences?: number;
  
  // Status
  status: 'active' | 'paused' | 'completed';
  nextOccurrence?: string;
  completedOccurrences: number;
}

export interface RecurringItemCreate {
  contentId: string;
  accountIds: string[];
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  time: string;
  startDate: string;
  endDate?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// SOCIAL INBOX
// ═══════════════════════════════════════════════════════════════════════════

export interface SocialInbox {
  // Conversations
  conversations: Conversation[];
  
  // Mentions
  mentions: Mention[];
  
  // Comments
  comments: Comment[];
  
  // Messages
  messages: DirectMessage[];
  
  // Unified view
  feed: InboxItem[];
  
  // Filters & Search
  filters: InboxFilters;
  search(query: string): InboxItem[];
  
  // Actions
  actions: InboxActions;
  
  // Automation
  automation: InboxAutomation;
  
  // Stats
  stats: InboxStats;
}

export interface InboxItem {
  id: string;
  type: 'mention' | 'comment' | 'message' | 'review' | 'reaction';
  platform: SocialPlatform;
  accountId: string;
  
  // Sender
  sender: SocialUser;
  
  // Content
  content: string;
  media?: MediaAsset[];
  
  // Context
  postId?: string;
  postUrl?: string;
  parentId?: string;
  
  // Status
  status: 'unread' | 'read' | 'replied' | 'archived';
  sentiment?: 'positive' | 'neutral' | 'negative';
  priority?: 'low' | 'medium' | 'high';
  
  // Assignment
  assignedTo?: string;
  
  // Labels
  labels: string[];
  
  // Timestamps
  createdAt: string;
  readAt?: string;
  repliedAt?: string;
}

export interface SocialUser {
  id: string;
  platform: SocialPlatform;
  username: string;
  displayName: string;
  avatar?: string;
  
  // Stats
  followers?: number;
  verified?: boolean;
  
  // CRM link
  contactId?: string;
  
  // History
  previousInteractions: number;
  sentiment?: string;
}

export interface Conversation {
  id: string;
  platform: SocialPlatform;
  accountId: string;
  
  // Participant
  participant: SocialUser;
  
  // Messages
  messages: DirectMessage[];
  
  // Status
  status: 'active' | 'closed' | 'snoozed';
  unreadCount: number;
  
  // Last activity
  lastMessageAt: string;
  lastMessageBy: 'user' | 'us';
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  
  // Direction
  direction: 'inbound' | 'outbound';
  
  // Content
  content: string;
  media?: MediaAsset[];
  
  // Status
  status: 'sent' | 'delivered' | 'read';
  
  // Timestamps
  createdAt: string;
  deliveredAt?: string;
  readAt?: string;
}

export interface Mention {
  id: string;
  platform: SocialPlatform;
  accountId: string;
  
  // Who mentioned
  user: SocialUser;
  
  // Content
  content: string;
  postUrl: string;
  
  // Type
  type: 'post' | 'comment' | 'story' | 'tag';
  
  // Sentiment
  sentiment: 'positive' | 'neutral' | 'negative';
  
  // Status
  status: 'unread' | 'read' | 'replied';
  
  createdAt: string;
}

export interface Comment {
  id: string;
  platform: SocialPlatform;
  accountId: string;
  postId: string;
  
  // Author
  author: SocialUser;
  
  // Content
  content: string;
  
  // Parent (for replies)
  parentId?: string;
  
  // Engagement
  likes: number;
  replies: number;
  
  // Status
  status: 'visible' | 'hidden' | 'deleted';
  replied: boolean;
  
  // Sentiment
  sentiment: 'positive' | 'neutral' | 'negative';
  
  // Our reply
  ourReply?: string;
  
  createdAt: string;
}

export interface InboxFilters {
  platforms: SocialPlatform[];
  accounts: string[];
  types: string[];
  status: string[];
  sentiment: string[];
  assignedTo: string[];
  dateRange: { start: string; end: string };
}

export interface InboxActions {
  // Reply
  reply(itemId: string, content: string): Promise<void>;
  
  // Status
  markAsRead(itemIds: string[]): void;
  archive(itemIds: string[]): void;
  
  // Assignment
  assign(itemIds: string[], userId: string): void;
  
  // Labels
  addLabel(itemIds: string[], label: string): void;
  removeLabel(itemIds: string[], label: string): void;
  
  // Hide/Delete
  hideComment(commentId: string): void;
  deleteComment(commentId: string): void;
  
  // Block
  blockUser(userId: string, platform: SocialPlatform): void;
}

export interface InboxAutomation {
  rules: AutomationRule[];
  
  // Saved replies
  savedReplies: SavedReply[];
  
  // Auto-reply
  autoReply: AutoReplySettings;
}

export interface AutomationRule {
  id: string;
  name: string;
  enabled: boolean;
  
  // Triggers
  triggers: AutoTrigger[];
  
  // Conditions
  conditions: AutoCondition[];
  
  // Actions
  actions: AutoAction[];
}

export interface AutoTrigger {
  type: 'new_mention' | 'new_comment' | 'new_message' | 'keyword';
  config: Record<string, any>;
}

export interface AutoCondition {
  field: string;
  operator: string;
  value: unknown;
}

export interface AutoAction {
  type: 'reply' | 'assign' | 'label' | 'notify' | 'archive';
  config: Record<string, any>;
}

export interface SavedReply {
  id: string;
  name: string;
  content: string;
  shortcut?: string;
  platforms: SocialPlatform[];
  category: string;
  usageCount: number;
}

export interface AutoReplySettings {
  enabled: boolean;
  platforms: SocialPlatform[];
  
  // Outside hours
  outsideHours: boolean;
  businessHours: { start: string; end: string };
  
  // Message
  message: string;
  
  // Exceptions
  exceptions: string[];
}

export interface InboxStats {
  // Volume
  totalItems: number;
  unread: number;
  
  // Response
  avgResponseTime: number;
  responseRate: number;
  
  // By type
  byType: Record<string, number>;
  
  // By platform
  byPlatform: Record<SocialPlatform, number>;
  
  // Sentiment
  bySentiment: { positive: number; neutral: number; negative: number };
  
  // Trends
  volumeTrend: { date: string; count: number }[];
}

// ═══════════════════════════════════════════════════════════════════════════
// SOCIAL ANALYTICS
// ═══════════════════════════════════════════════════════════════════════════

export interface SocialAnalytics {
  // Overview
  overview: AnalyticsOverview;
  
  // Per account
  accountAnalytics: Record<string, AccountAnalytics>;
  
  // Content
  contentAnalytics: ContentAnalytics;
  
  // Audience
  audienceAnalytics: AudienceAnalytics;
  
  // Competitors
  competitorAnalytics: CompetitorAnalytics;
  
  // Reports
  reports: ReportEngine;
}

export interface AnalyticsOverview {
  // Period
  period: { start: string; end: string };
  
  // Totals
  totalFollowers: number;
  totalPosts: number;
  totalEngagement: number;
  totalReach: number;
  totalImpressions: number;
  
  // Growth
  followerGrowth: number;
  engagementGrowth: number;
  
  // Rates
  avgEngagementRate: number;
  
  // Best performing
  topPost: { id: string; platform: SocialPlatform; engagement: number };
  topPlatform: { platform: SocialPlatform; engagement: number };
  
  // Trends
  trends: OverviewTrend[];
}

export interface OverviewTrend {
  date: string;
  followers: number;
  posts: number;
  engagement: number;
  reach: number;
}

export interface AccountAnalytics {
  accountId: string;
  platform: SocialPlatform;
  
  // Followers
  followers: FollowerAnalytics;
  
  // Content
  content: ContentPerformanceAnalytics;
  
  // Engagement
  engagement: EngagementAnalytics;
  
  // Reach
  reach: ReachAnalytics;
  
  // Best times
  bestTimes: BestTimeAnalytics;
  
  // Hashtags
  hashtags: HashtagPerformance[];
}

export interface FollowerAnalytics {
  current: number;
  gained: number;
  lost: number;
  netGrowth: number;
  growthRate: number;
  
  // Demographics (if available)
  demographics?: {
    gender: { male: number; female: number; other: number };
    ageGroups: { group: string; percentage: number }[];
    locations: { location: string; percentage: number }[];
    languages: { language: string; percentage: number }[];
  };
  
  // History
  history: { date: string; count: number; change: number }[];
}

export interface ContentPerformanceAnalytics {
  totalPosts: number;
  
  // By type
  byType: { type: ContentType; count: number; avgEngagement: number }[];
  
  // By day
  byDay: { day: number; count: number; avgEngagement: number }[];
  
  // By hour
  byHour: { hour: number; count: number; avgEngagement: number }[];
  
  // Top posts
  topPosts: PostAnalytics[];
  
  // Worst posts
  worstPosts: PostAnalytics[];
}

export interface PostAnalytics {
  id: string;
  contentId: string;
  platform: SocialPlatform;
  
  // Timing
  publishedAt: string;
  
  // Type
  type: ContentType;
  
  // Preview
  thumbnail?: string;
  caption?: string;
  
  // Metrics
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
  impressions: number;
  clicks?: number;
  views?: number;
  
  // Engagement
  engagementRate: number;
  
  // Hashtags
  hashtags: string[];
}

export interface EngagementAnalytics {
  total: number;
  rate: number;
  
  // Breakdown
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  
  // History
  history: { date: string; engagement: number; rate: number }[];
  
  // By content type
  byContentType: { type: ContentType; engagement: number; rate: number }[];
}

export interface ReachAnalytics {
  totalReach: number;
  totalImpressions: number;
  
  // Types
  organic: number;
  paid: number;
  viral: number;
  
  // History
  history: { date: string; reach: number; impressions: number }[];
}

export interface BestTimeAnalytics {
  // By day
  byDay: { day: number; score: number; avgEngagement: number }[];
  
  // By hour
  byHour: { hour: number; score: number; avgEngagement: number }[];
  
  // Combined
  heatmap: { day: number; hour: number; score: number }[];
  
  // Recommendations
  recommendations: { day: number; hour: number; reason: string }[];
}

export interface HashtagPerformance {
  hashtag: string;
  uses: number;
  avgReach: number;
  avgEngagement: number;
  trend: 'up' | 'stable' | 'down';
}

export interface AudienceAnalytics {
  // Growth
  growth: {
    period: string;
    gained: number;
    lost: number;
    net: number;
    rate: number;
  };
  
  // Demographics
  demographics: {
    gender: { male: number; female: number; other: number };
    age: { group: string; percentage: number }[];
    location: { country: string; percentage: number }[];
    city: { city: string; percentage: number }[];
    language: { language: string; percentage: number }[];
  };
  
  // Interests
  interests: { interest: string; affinity: number }[];
  
  // Activity
  activity: {
    mostActiveHours: number[];
    mostActiveDays: number[];
    avgSessionDuration: number;
  };
  
  // Overlap
  platformOverlap?: { platforms: SocialPlatform[]; overlap: number }[];
}

export interface CompetitorAnalytics {
  competitors: Competitor[];
  comparison: CompetitorComparison;
  benchmarks: Benchmarks;
}

export interface Competitor {
  id: string;
  name: string;
  accounts: { platform: SocialPlatform; username: string }[];
  
  // Stats
  followers: Record<SocialPlatform, number>;
  engagement: Record<SocialPlatform, number>;
  postFrequency: number;
  
  // Content
  topContent: PostAnalytics[];
  contentMix: { type: ContentType; percentage: number }[];
  
  // Hashtags
  topHashtags: string[];
}

export interface CompetitorComparison {
  followers: { name: string; value: number }[];
  engagement: { name: string; value: number }[];
  growth: { name: string; value: number }[];
  postFrequency: { name: string; value: number }[];
}

export interface Benchmarks {
  industry: string;
  metrics: {
    metric: string;
    yourValue: number;
    industryAvg: number;
    percentile: number;
  }[];
}

// ═══════════════════════════════════════════════════════════════════════════
// LISTENING ENGINE
// ═══════════════════════════════════════════════════════════════════════════

export interface ListeningEngine {
  // Queries
  queries: ListeningQuery[];
  
  // Results
  mentions: ListeningMention[];
  
  // Trends
  trends: TrendAnalysis;
  
  // Sentiment
  sentiment: SentimentAnalysis;
  
  // Alerts
  alerts: ListeningAlert[];
}

export interface ListeningQuery {
  id: string;
  name: string;
  
  // Keywords
  keywords: string[];
  excludeKeywords: string[];
  
  // Filters
  platforms: SocialPlatform[];
  languages: string[];
  locations: string[];
  
  // Sources
  sources: ('social' | 'news' | 'blogs' | 'forums' | 'reviews')[];
  
  // Status
  enabled: boolean;
  
  // Stats
  mentionsCount: number;
  lastMention?: string;
}

export interface ListeningMention {
  id: string;
  queryId: string;
  
  // Source
  platform: string;
  source: string;
  url: string;
  
  // Author
  author: {
    name: string;
    username: string;
    avatar?: string;
    followers?: number;
  };
  
  // Content
  content: string;
  matchedKeywords: string[];
  
  // Analysis
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  reach: number;
  influence: number;
  
  // Status
  status: 'new' | 'reviewed' | 'actioned' | 'archived';
  
  createdAt: string;
}

export interface TrendAnalysis {
  // Volume
  volumeTrend: { date: string; count: number }[];
  
  // Topics
  topTopics: { topic: string; count: number; change: number }[];
  
  // Emerging
  emergingTopics: { topic: string; growth: number }[];
  
  // Related
  relatedTerms: { term: string; correlation: number }[];
}

export interface SentimentAnalysis {
  // Overall
  overall: { positive: number; neutral: number; negative: number };
  netSentiment: number;
  
  // Trend
  trend: { date: string; positive: number; neutral: number; negative: number }[];
  
  // By topic
  byTopic: { topic: string; sentiment: number }[];
  
  // Drivers
  positiveDrivers: string[];
  negativeDrivers: string[];
}

export interface ListeningAlert {
  id: string;
  name: string;
  queryId: string;
  
  // Condition
  condition: {
    type: 'volume_spike' | 'sentiment_drop' | 'keyword' | 'influencer';
    threshold: number;
    period: string;
  };
  
  // Notification
  channels: ('email' | 'push' | 'slack' | 'webhook')[];
  recipients: string[];
  
  // Status
  enabled: boolean;
  lastTriggered?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// SOCIAL AI AGENTS
// ═══════════════════════════════════════════════════════════════════════════

export interface SocialAgents {
  contentCreator: ContentCreatorAgent;
  scheduler: SchedulerAgent;
  engagementManager: EngagementManagerAgent;
  analyticsAdvisor: AnalyticsAdvisorAgent;
  trendSpotter: TrendSpotterAgent;
}

export interface ContentCreatorAgent {
  capabilities: [
    'caption_generation',
    'hashtag_suggestions',
    'content_ideas',
    'image_suggestions',
    'repurposing',
    'a_b_testing',
    'trend_adaptation',
    'brand_voice'
  ];
}

export interface SchedulerAgent {
  capabilities: [
    'optimal_timing',
    'frequency_optimization',
    'calendar_planning',
    'content_mix',
    'audience_analysis',
    'timezone_optimization',
    'event_awareness',
    'competitor_timing'
  ];
}

export interface EngagementManagerAgent {
  capabilities: [
    'response_drafting',
    'sentiment_detection',
    'priority_routing',
    'conversation_summary',
    'escalation_detection',
    'community_insights',
    'influencer_identification',
    'crisis_detection'
  ];
}

export interface AnalyticsAdvisorAgent {
  capabilities: [
    'performance_insights',
    'trend_identification',
    'benchmark_comparison',
    'content_recommendations',
    'audience_insights',
    'roi_analysis',
    'report_generation',
    'anomaly_detection'
  ];
}

export interface TrendSpotterAgent {
  capabilities: [
    'trend_detection',
    'viral_prediction',
    'hashtag_discovery',
    'content_opportunities',
    'competitor_monitoring',
    'industry_news',
    'meme_tracking',
    'cultural_moments'
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export const SUPPORTED_PLATFORMS: SocialPlatform[] = [
  'instagram', 'instagram_business', 'facebook', 'facebook_page',
  'twitter', 'linkedin', 'linkedin_page', 'tiktok', 'youtube',
  'pinterest', 'threads', 'bluesky', 'mastodon', 'snapchat', 'reddit'
];

export default {
  advantages: {
    comparison: {
      hootsuite: { score: 82, chenuScore: 94, advantage: '+12 (AI + Integration)' },
      buffer: { score: 78, chenuScore: 90, advantage: '+12 (Full analytics)' },
      sproutSocial: { score: 85, chenuScore: 92, advantage: '+7 (Better AI)' },
      later: { score: 75, chenuScore: 88, advantage: '+13 (Multi-platform)' },
    },
    uniqueFeatures: [
      'AI-powered content creation',
      'Smart scheduling with ML optimization',
      'Unified inbox across all platforms',
      'Advanced sentiment analysis',
      'Competitor monitoring',
      'Influencer discovery',
      'Integrated with CHE·NU CRM',
      'Brand voice consistency',
    ],
  },
  
  supportedPlatforms: SUPPORTED_PLATFORMS.length,
  
  defaults: {
    postSpacing: 4, // hours
    maxPostsPerDay: 3,
    hashtagsPerPost: 5,
  },
};
