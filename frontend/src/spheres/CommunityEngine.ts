/**
 * CHE·NU™ — COMMUNITY SPHERE ENGINE v35
 * 
 * ════════════════════════════════════════════════════════════════════════════
 * Complete Community Platform: Comments, Forums, Groups, Events
 * Reddit + Discord + Facebook Groups + Eventbrite KILLER
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

export const SPHERE_ID: SphereId = 'community';
export const SPHERE_COLOR = '#3F7249';
export const SPHERE_ICON = '👥';
export const SPHERE_NAME = 'Community';
export const SPHERE_NAME_FR = 'Communauté';

// ═══════════════════════════════════════════════════════════════════════════
// COMMENT SYSTEM — BEST IN CLASS
// ═══════════════════════════════════════════════════════════════════════════

export interface CommentEngine {
  comments: Comment[];
  config: CommentConfig;
  moderation: ModerationEngine;
  voting: VotingEngine;
  engagement: EngagementEngine;
  accessibility: AccessibilityEngine;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMMENT STRUCTURE
// ═══════════════════════════════════════════════════════════════════════════

export interface Comment {
  id: string;
  parentId: string | null; // null = top-level
  rootId: string; // ID of the top-level comment in thread
  
  // Content
  content: CommentContent;
  
  // Author
  author: CommentAuthor;
  
  // Timestamps
  createdAt: string;
  updatedAt: string | null;
  editedAt: string | null;
  
  // Status
  status: CommentStatus;
  
  // Engagement
  votes: CommentVotes;
  reactions: CommentReaction[];
  replies: Comment[];
  replyCount: number;
  
  // Metadata
  metadata: CommentMetadata;
  
  // Moderation
  moderation: CommentModeration;
  
  // Awards
  awards: CommentAward[];
  
  // Highlights
  highlighted: boolean;
  pinned: boolean;
  authorHighlighted: boolean; // Highlighted by content creator
}

export interface CommentContent {
  raw: string;
  rendered: string; // HTML rendered
  format: 'plain' | 'markdown' | 'rich';
  
  // Embedded content
  mentions: Mention[];
  hashtags: string[];
  links: EmbeddedLink[];
  media: EmbeddedMedia[];
  codeBlocks: CodeBlock[];
  quotes: QuotedComment[];
  spoilers: SpoilerBlock[];
  math: MathBlock[];
  
  // Character limits
  length: number;
  maxLength: 10000; // Much more than Reddit's ~10k
}

export interface Mention {
  userId: string;
  username: string;
  displayName: string;
  position: { start: number; end: number };
}

export interface EmbeddedLink {
  url: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  type: 'link' | 'video' | 'image' | 'tweet' | 'article';
  verified: boolean;
  safetyCheck: LinkSafetyCheck;
}

export interface LinkSafetyCheck {
  safe: boolean;
  malware: boolean;
  phishing: boolean;
  adultContent: boolean;
  checkedAt: string;
}

export interface EmbeddedMedia {
  type: 'image' | 'gif' | 'video';
  url: string;
  thumbnail: string;
  width: number;
  height: number;
  alt: string;
  nsfw: boolean;
}

export interface CodeBlock {
  language: string;
  code: string;
  highlighted: string; // Syntax highlighted HTML
}

export interface QuotedComment {
  commentId: string;
  authorName: string;
  content: string;
  timestamp: string;
}

export interface SpoilerBlock {
  id: string;
  content: string;
  label?: string;
}

export interface MathBlock {
  latex: string;
  rendered: string;
  inline: boolean;
}

export interface CommentAuthor {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  
  // Status
  verified: boolean;
  isOP: boolean; // Original poster
  isModerator: boolean;
  isAdmin: boolean;
  isCreator: boolean; // Content creator
  isExpert: boolean; // Verified expert in topic
  
  // Reputation
  karma: AuthorKarma;
  level: number;
  badges: AuthorBadge[];
  
  // Flair
  flair?: AuthorFlair;
  
  // Account info
  accountAge: number; // days
  joinedCommunity: number; // days
}

export interface AuthorKarma {
  total: number;
  comment: number;
  post: number;
  award: number;
  helpful: number;
}

export interface AuthorBadge {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface AuthorFlair {
  text: string;
  emoji?: string;
  backgroundColor?: string;
  textColor?: string;
  editable: boolean;
}

export type CommentStatus = 
  | 'visible'
  | 'hidden'
  | 'removed'
  | 'removed_by_author'
  | 'removed_by_moderator'
  | 'removed_by_automod'
  | 'pending_review'
  | 'collapsed';

export interface CommentVotes {
  upvotes: number;
  downvotes: number;
  score: number; // upvotes - downvotes
  userVote: 'up' | 'down' | null;
  controversial: boolean;
  
  // Weighted voting (CHE·NU exclusive)
  weightedScore: number;
  qualityScore: number;
}

export interface CommentReaction {
  type: ReactionType;
  count: number;
  users: string[]; // User IDs (limited)
  userReacted: boolean;
}

export interface ReactionType {
  id: string;
  emoji: string;
  name: string;
  category: 'positive' | 'negative' | 'neutral' | 'special';
}

export const REACTION_TYPES: ReactionType[] = [
  { id: 'like', emoji: '👍', name: 'Like', category: 'positive' },
  { id: 'dislike', emoji: '👎', name: 'Dislike', category: 'negative' },
  { id: 'love', emoji: '❤️', name: 'Love', category: 'positive' },
  { id: 'laugh', emoji: '😂', name: 'Laugh', category: 'positive' },
  { id: 'wow', emoji: '😮', name: 'Wow', category: 'neutral' },
  { id: 'sad', emoji: '😢', name: 'Sad', category: 'neutral' },
  { id: 'angry', emoji: '😡', name: 'Angry', category: 'negative' },
  { id: 'insightful', emoji: '💡', name: 'Insightful', category: 'positive' },
  { id: 'helpful', emoji: '🎯', name: 'Helpful', category: 'positive' },
  { id: 'fire', emoji: '🔥', name: 'Fire', category: 'positive' },
  { id: 'thinking', emoji: '🤔', name: 'Thinking', category: 'neutral' },
  { id: 'award', emoji: '🏆', name: 'Award', category: 'special' },
];

export interface CommentMetadata {
  // Threading
  depth: number; // 0 = top-level
  threadSize: number; // Total comments in thread
  
  // Context
  contextType: 'post' | 'video' | 'article' | 'live_stream' | 'product';
  contextId: string;
  
  // Source
  source: 'web' | 'mobile' | 'api' | 'embed';
  userAgent?: string;
  
  // Engagement
  viewCount: number;
  shareCount: number;
  reportCount: number;
  
  // AI Analysis
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  toxicityScore: number; // 0-1
  spamScore: number; // 0-1
  qualityScore: number; // 0-1
  
  // Language
  language: string;
  translated?: TranslatedContent;
}

export interface TranslatedContent {
  originalLanguage: string;
  translations: Record<string, string>;
  autoTranslated: boolean;
}

export interface CommentModeration {
  // Flags
  flagged: boolean;
  flagCount: number;
  flagReasons: FlagReason[];
  
  // Actions
  actions: ModerationAction[];
  
  // Appeals
  appealed: boolean;
  appealStatus?: 'pending' | 'approved' | 'denied';
  
  // Auto-moderation
  autoModActions: AutoModAction[];
}

export interface FlagReason {
  reason: string;
  count: number;
  timestamp: string;
}

export interface ModerationAction {
  id: string;
  type: 'remove' | 'hide' | 'warn' | 'ban' | 'approve';
  moderatorId: string;
  reason: string;
  timestamp: string;
  public: boolean;
  appealable: boolean;
}

export interface AutoModAction {
  rule: string;
  action: string;
  confidence: number;
  timestamp: string;
  overridden: boolean;
}

export interface CommentAward {
  id: string;
  type: AwardType;
  giver: {
    id: string;
    username: string;
    anonymous: boolean;
  };
  message?: string;
  timestamp: string;
}

export interface AwardType {
  id: string;
  name: string;
  icon: string;
  animation?: string;
  cost: number; // In platform currency
  benefits: AwardBenefit[];
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface AwardBenefit {
  type: 'highlight' | 'coins' | 'premium' | 'badge' | 'visibility';
  value: unknown;
  recipient: 'author' | 'giver' | 'both';
}

// ═══════════════════════════════════════════════════════════════════════════
// COMMENT CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

export interface CommentConfig {
  // Permissions
  permissions: CommentPermissions;
  
  // Display
  display: CommentDisplayConfig;
  
  // Sorting
  sorting: CommentSortingConfig;
  
  // Features
  features: CommentFeatures;
  
  // Rate Limits
  rateLimits: CommentRateLimits;
}

export interface CommentPermissions {
  canComment: boolean;
  canReply: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canVote: boolean;
  canReact: boolean;
  canReport: boolean;
  canAward: boolean;
  canEmbed: boolean;
  canUploadMedia: boolean;
  
  // Requirements
  minAccountAge: number; // days
  minKarma: number;
  verifiedEmailRequired: boolean;
  subscriberOnly: boolean;
}

export interface CommentDisplayConfig {
  // Threading
  maxDepth: number; // Max nesting level (default: unlimited)
  collapseAfterDepth: number; // Auto-collapse after this depth
  loadMoreThreshold: number; // Load more after N comments
  
  // Visibility
  showDeleted: 'placeholder' | 'hidden' | 'full_moderators';
  showRemoved: 'placeholder' | 'hidden';
  showScore: boolean;
  showVoteButtons: boolean;
  showReactions: boolean;
  showAwards: boolean;
  showUserFlair: boolean;
  showUserBadges: boolean;
  
  // Collapsed
  autoCollapseNegative: boolean;
  collapseThreshold: number; // Score below which to collapse
  
  // Highlighting
  highlightOP: boolean;
  highlightModerators: boolean;
  highlightVerified: boolean;
  highlightNew: boolean;
  newThresholdMinutes: number;
}

export interface CommentSortingConfig {
  defaultSort: CommentSortOption;
  availableSorts: CommentSortOption[];
  rememberSort: boolean;
}

export type CommentSortOption = 
  | 'best'
  | 'top'
  | 'new'
  | 'old'
  | 'controversial'
  | 'qa'
  | 'live';

export interface CommentFeatures {
  // Core
  threading: boolean;
  editing: boolean;
  deletion: boolean;
  voting: boolean;
  reactions: boolean;
  awards: boolean;
  
  // Rich content
  markdown: boolean;
  media: boolean;
  links: boolean;
  mentions: boolean;
  hashtags: boolean;
  spoilers: boolean;
  codeBlocks: boolean;
  math: boolean;
  
  // Social
  sharing: boolean;
  bookmarking: boolean;
  quoting: boolean;
  embedding: boolean;
  
  // Moderation
  reporting: boolean;
  selfModeration: boolean; // Author can hide replies
  
  // AI
  translation: boolean;
  summarization: boolean;
  sentimentDisplay: boolean;
}

export interface CommentRateLimits {
  commentsPerMinute: number;
  commentsPerHour: number;
  commentsPerDay: number;
  editsPerComment: number;
  editWindowMinutes: number;
  deletionWindowMinutes: number;
  mediaUploadsPerComment: number;
  mentionsPerComment: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// MODERATION ENGINE — AI-ASSISTED
// ═══════════════════════════════════════════════════════════════════════════

export interface ModerationEngine {
  // Auto-moderation
  autoMod: AutoModEngine;
  
  // Human moderation
  humanMod: HumanModEngine;
  
  // Transparency
  transparency: ModerationTransparency;
  
  // Appeals
  appeals: AppealSystem;
}

export interface AutoModEngine {
  enabled: boolean;
  
  // AI Filters
  filters: {
    toxicity: ToxicityFilter;
    spam: SpamFilter;
    misinformation: MisinformationFilter;
    pii: PIIFilter;
    duplicate: DuplicateFilter;
    language: LanguageFilter;
    nsfw: NSFWFilter;
  };
  
  // Rules
  rules: AutoModRule[];
  
  // Actions
  defaultActions: AutoModActions;
}

export interface ToxicityFilter {
  enabled: boolean;
  threshold: number; // 0-1
  categories: {
    hate_speech: boolean;
    harassment: boolean;
    threats: boolean;
    profanity: boolean;
    sexual_content: boolean;
    self_harm: boolean;
  };
  action: 'remove' | 'hide' | 'flag' | 'warn';
  allowAppeal: boolean;
}

export interface SpamFilter {
  enabled: boolean;
  threshold: number;
  patterns: {
    repetition: boolean;
    links: boolean;
    emojis: boolean;
    caps: boolean;
    copypasta: boolean;
  };
  action: 'remove' | 'hide' | 'flag';
  trustedUsersExempt: boolean;
}

export interface MisinformationFilter {
  enabled: boolean;
  sources: string[]; // Fact-checking sources
  action: 'label' | 'hide' | 'remove';
  labelText: string;
  showSources: boolean;
}

export interface PIIFilter {
  enabled: boolean;
  detect: {
    emails: boolean;
    phones: boolean;
    addresses: boolean;
    ssn: boolean;
    creditCards: boolean;
    names: boolean;
  };
  action: 'redact' | 'remove' | 'flag';
  alertUser: boolean;
}

export interface DuplicateFilter {
  enabled: boolean;
  threshold: number; // Similarity threshold 0-1
  timeWindow: number; // Hours
  action: 'remove' | 'flag';
  sameAuthorOnly: boolean;
}

export interface LanguageFilter {
  enabled: boolean;
  allowedLanguages: string[];
  autoTranslate: boolean;
  action: 'translate' | 'flag' | 'hide';
}

export interface NSFWFilter {
  enabled: boolean;
  aiDetection: boolean;
  threshold: number;
  action: 'blur' | 'hide' | 'remove';
  requireTag: boolean;
}

export interface AutoModRule {
  id: string;
  name: string;
  enabled: boolean;
  conditions: RuleCondition[];
  actions: RuleAction[];
  priority: number;
  createdBy: string;
  createdAt: string;
}

export interface RuleCondition {
  type: 'keyword' | 'regex' | 'user' | 'karma' | 'age' | 'domain' | 'custom';
  operator: 'contains' | 'equals' | 'matches' | 'gt' | 'lt' | 'in';
  value: unknown;
  caseSensitive?: boolean;
}

export interface RuleAction {
  type: 'remove' | 'hide' | 'flag' | 'approve' | 'report' | 'ban' | 'notify';
  reason?: string;
  duration?: number;
  notifyUser?: boolean;
}

export interface AutoModActions {
  onToxicity: 'remove' | 'hide' | 'flag';
  onSpam: 'remove' | 'hide' | 'flag';
  onMisinformation: 'label' | 'hide' | 'remove';
  onPII: 'redact' | 'remove';
  onNSFW: 'blur' | 'hide' | 'remove';
}

export interface HumanModEngine {
  // Queue
  queue: ModerationQueue;
  
  // Moderators
  moderators: ModeratorRole[];
  
  // Actions
  availableActions: ModeratorAction[];
  
  // Logs
  logs: ModeratorLog[];
}

export interface ModerationQueue {
  items: QueueItem[];
  filters: QueueFilter[];
  sorting: QueueSort;
  stats: QueueStats;
}

export interface QueueItem {
  id: string;
  type: 'comment' | 'post' | 'user' | 'appeal';
  content: unknown;
  reason: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reportCount: number;
  flaggedAt: string;
  assignedTo?: string;
  status: 'pending' | 'in_review' | 'resolved';
}

export interface ModeratorRole {
  id: string;
  name: string;
  permissions: ModeratorPermission[];
  color: string;
  icon: string;
}

export type ModeratorPermission = 
  | 'view_queue'
  | 'approve_content'
  | 'remove_content'
  | 'ban_users'
  | 'manage_rules'
  | 'manage_moderators'
  | 'view_logs'
  | 'handle_appeals';

export interface ModerationTransparency {
  // Public mod log (like Reddit's)
  publicLog: boolean;
  showRemovedContent: 'placeholder' | 'reason_only' | 'full';
  showModeratorNames: boolean;
  showRemovalReasons: boolean;
  
  // Statistics
  publicStats: boolean;
  statsInclude: ('removals' | 'bans' | 'appeals' | 'automod')[];
}

export interface AppealSystem {
  enabled: boolean;
  appealWindow: number; // Hours
  reviewTime: number; // Target hours for review
  
  // Process
  process: AppealProcess;
  
  // Outcomes
  outcomes: AppealOutcome[];
}

export interface AppealProcess {
  requireReason: boolean;
  minReasonLength: number;
  maxAppealsPerAction: number;
  escalationLevels: string[];
  aiAssisted: boolean;
}

export type AppealOutcome = 
  | 'approved' // Content restored
  | 'denied' // Decision upheld
  | 'modified' // Partial restoration
  | 'escalated'; // Needs higher review

// ═══════════════════════════════════════════════════════════════════════════
// VOTING ENGINE — ANTI-MANIPULATION
// ═══════════════════════════════════════════════════════════════════════════

export interface VotingEngine {
  config: VotingConfig;
  antiManipulation: AntiManipulation;
  weighting: VoteWeighting;
}

export interface VotingConfig {
  upvoteEnabled: boolean;
  downvoteEnabled: boolean;
  showScores: boolean;
  fuzzing: boolean; // Slight score randomization
  
  // Permissions
  minKarmaToVote: number;
  minAgeToVote: number; // Account age in days
  
  // Limits
  votesPerHour: number;
  votesPerDay: number;
}

export interface AntiManipulation {
  // Detection
  voteBrigadingDetection: boolean;
  sockPuppetDetection: boolean;
  botDetection: boolean;
  suspiciousPatternDetection: boolean;
  
  // Prevention
  voteRateLimiting: boolean;
  ipBasedLimiting: boolean;
  deviceFingerprinting: boolean;
  behavioralAnalysis: boolean;
  
  // Actions
  onDetection: 'nullify' | 'flag' | 'ban';
  alertModerators: boolean;
}

export interface VoteWeighting {
  enabled: boolean;
  factors: WeightingFactor[];
}

export interface WeightingFactor {
  name: string;
  weight: number; // Multiplier
  description: string;
}

export const DEFAULT_WEIGHTING_FACTORS: WeightingFactor[] = [
  { name: 'account_age', weight: 1.2, description: 'Older accounts have more weight' },
  { name: 'karma', weight: 1.1, description: 'Higher karma = more weight' },
  { name: 'verified_email', weight: 1.1, description: 'Verified accounts have more weight' },
  { name: 'community_contribution', weight: 1.3, description: 'Active contributors have more weight' },
  { name: 'expertise', weight: 1.5, description: 'Verified experts in topic have more weight' },
];

// ═══════════════════════════════════════════════════════════════════════════
// FORUM ENGINE — REDDIT KILLER
// ═══════════════════════════════════════════════════════════════════════════

export interface ForumEngine {
  communities: Community[];
  posts: ForumPost[];
  moderation: ForumModeration;
  discovery: ForumDiscovery;
  reputation: ReputationSystem;
}

export interface Community {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  banner: string;
  color: string;
  
  // Stats
  memberCount: number;
  activeCount: number;
  postCount: number;
  
  // Settings
  settings: CommunitySettings;
  
  // Rules
  rules: CommunityRule[];
  
  // Team
  moderators: CommunityModerator[];
  
  // Customization
  customization: CommunityCustomization;
  
  // Flairs
  postFlairs: PostFlair[];
  userFlairs: UserFlair[];
  
  // Metadata
  createdAt: string;
  isNSFW: boolean;
  isQuarantined: boolean;
  isRestricted: boolean;
}

export interface CommunitySettings {
  // Posting
  allowPosts: boolean;
  allowedPostTypes: PostType[];
  requireFlair: boolean;
  requireApproval: boolean;
  
  // Comments
  allowComments: boolean;
  commentSort: CommentSortOption;
  
  // Membership
  membershipType: 'open' | 'restricted' | 'private';
  requireApplication: boolean;
  
  // Discovery
  searchable: boolean;
  showInAll: boolean;
  
  // Moderation
  crowdsourcedModeration: boolean;
  automodEnabled: boolean;
}

export interface CommunityRule {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  reportable: boolean;
  order: number;
}

export interface CommunityModerator {
  userId: string;
  username: string;
  role: string;
  permissions: ModeratorPermission[];
  addedAt: string;
}

export interface CommunityCustomization {
  theme: CommunityTheme;
  widgets: CommunityWidget[];
  css?: string; // Custom CSS (like old Reddit)
  emojis: CustomEmoji[];
}

export interface CommunityTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  linkColor: string;
  buttonStyle: 'rounded' | 'square' | 'pill';
  headerStyle: 'banner' | 'compact' | 'minimal';
}

export interface CommunityWidget {
  id: string;
  type: 'text' | 'rules' | 'moderators' | 'links' | 'calendar' | 'custom';
  title: string;
  content: unknown;
  order: number;
}

export interface CustomEmoji {
  id: string;
  name: string;
  url: string;
  creator: string;
  createdAt: string;
}

export type PostType = 
  | 'text'
  | 'link'
  | 'image'
  | 'video'
  | 'gallery'
  | 'poll'
  | 'event'
  | 'ama'
  | 'megathread'
  | 'wiki';

export interface ForumPost {
  id: string;
  community: string;
  author: CommentAuthor;
  
  // Content
  type: PostType;
  title: string;
  content: PostContent;
  
  // Flair
  flair?: PostFlair;
  
  // Status
  status: 'visible' | 'removed' | 'locked' | 'archived' | 'pinned';
  
  // Engagement
  votes: CommentVotes;
  commentCount: number;
  shareCount: number;
  awards: CommentAward[];
  
  // Timestamps
  createdAt: string;
  updatedAt?: string;
  
  // Flags
  isNSFW: boolean;
  isSpoiler: boolean;
  isOC: boolean; // Original Content
  isLocked: boolean;
  isPinned: boolean;
  isArchived: boolean;
  
  // Crossposts
  crosspostedFrom?: string;
  crosspostCount: number;
}

export interface PostContent {
  text?: string;
  html?: string;
  url?: string;
  media?: PostMedia[];
  poll?: PostPoll;
  event?: PostEvent;
}

export interface PostMedia {
  type: 'image' | 'video' | 'gif';
  url: string;
  thumbnail: string;
  width: number;
  height: number;
  caption?: string;
}

export interface PostPoll {
  question: string;
  options: PollOption[];
  duration: number;
  endsAt: string;
  totalVotes: number;
  userVote?: string;
  multipleChoice: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

export interface PostEvent {
  title: string;
  description: string;
  startTime: string;
  endTime?: string;
  location?: string;
  isVirtual: boolean;
  virtualLink?: string;
  attendees: number;
  isAttending: boolean;
}

export interface PostFlair {
  id: string;
  text: string;
  backgroundColor: string;
  textColor: string;
  emoji?: string;
  modOnly: boolean;
}

export interface UserFlair {
  id: string;
  text: string;
  backgroundColor: string;
  textColor: string;
  emoji?: string;
  editable: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// GROUP ENGINE — DISCORD + FACEBOOK KILLER
// ═══════════════════════════════════════════════════════════════════════════

export interface GroupEngine {
  groups: Group[];
  channels: Channel[];
  voice: VoiceEngine;
  events: GroupEventEngine;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  icon: string;
  banner: string;
  
  // Type
  type: 'public' | 'private' | 'secret';
  category: GroupCategory;
  
  // Members
  memberCount: number;
  members: GroupMember[];
  
  // Structure
  channels: Channel[];
  categories: ChannelCategory[];
  roles: GroupRole[];
  
  // Settings
  settings: GroupSettings;
  
  // Features
  features: GroupFeatures;
  
  // Stats
  stats: GroupStats;
}

export type GroupCategory = 
  | 'gaming'
  | 'music'
  | 'education'
  | 'science'
  | 'entertainment'
  | 'sports'
  | 'technology'
  | 'art'
  | 'local'
  | 'professional'
  | 'support'
  | 'other';

export interface GroupMember {
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  roles: string[];
  joinedAt: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  customStatus?: string;
}

export interface Channel {
  id: string;
  groupId: string;
  name: string;
  type: ChannelType;
  category?: string;
  topic?: string;
  
  // Permissions
  permissions: ChannelPermission[];
  
  // Settings
  slowMode?: number;
  nsfw: boolean;
  archived: boolean;
  
  // Voice specific
  voiceSettings?: VoiceChannelSettings;
  
  // Position
  position: number;
}

export type ChannelType = 
  | 'text'
  | 'voice'
  | 'video'
  | 'stage'
  | 'announcement'
  | 'forum'
  | 'media';

export interface ChannelCategory {
  id: string;
  name: string;
  channels: string[];
  collapsed: boolean;
  position: number;
}

export interface ChannelPermission {
  roleId: string;
  allow: string[];
  deny: string[];
}

export interface VoiceChannelSettings {
  bitrate: number;
  userLimit: number;
  rtcRegion: string;
  videoQuality: 'auto' | '720p' | '1080p';
}

export interface GroupRole {
  id: string;
  name: string;
  color: string;
  icon?: string;
  position: number;
  permissions: GroupPermission[];
  mentionable: boolean;
  hoisted: boolean; // Show separately in member list
}

export type GroupPermission = 
  | 'administrator'
  | 'manage_group'
  | 'manage_roles'
  | 'manage_channels'
  | 'kick_members'
  | 'ban_members'
  | 'create_invites'
  | 'manage_messages'
  | 'mention_everyone'
  | 'use_external_emojis'
  | 'add_reactions'
  | 'send_messages'
  | 'embed_links'
  | 'attach_files'
  | 'read_message_history'
  | 'connect_voice'
  | 'speak'
  | 'video'
  | 'mute_members'
  | 'deafen_members'
  | 'move_members'
  | 'use_voice_activity'
  | 'priority_speaker'
  | 'stream'
  | 'manage_events'
  | 'manage_threads';

export interface GroupSettings {
  // General
  defaultNotifications: 'all' | 'mentions' | 'none';
  explicitContentFilter: 'disabled' | 'members_without_roles' | 'all';
  
  // Verification
  verificationLevel: 'none' | 'low' | 'medium' | 'high' | 'highest';
  
  // Moderation
  autoModEnabled: boolean;
  autoModRules: AutoModRule[];
  
  // Features
  enableWelcomeScreen: boolean;
  welcomeMessage?: string;
  
  // Boost
  boostLevel: number;
  boostCount: number;
}

export interface GroupFeatures {
  // Communication
  textChannels: boolean;
  voiceChannels: boolean;
  videoChannels: boolean;
  stageChannels: boolean;
  threads: boolean;
  forumChannels: boolean;
  
  // Social
  events: boolean;
  scheduling: boolean;
  polls: boolean;
  
  // Content
  fileSharing: boolean;
  mediaGallery: boolean;
  wiki: boolean;
  
  // Monetization
  subscriptions: boolean;
  shop: boolean;
  
  // Governance (CHE·NU exclusive)
  governedModeration: boolean;
  transparencyReports: boolean;
  memberWellbeing: boolean;
}

export interface GroupStats {
  totalMembers: number;
  activeMembers: number; // Last 7 days
  messagesPerDay: number;
  voiceMinutesPerDay: number;
  topChannels: { channelId: string; messages: number }[];
  growthRate: number;
  retentionRate: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// VOICE ENGINE
// ═══════════════════════════════════════════════════════════════════════════

export interface VoiceEngine {
  // Voice Channels
  voiceChannels: VoiceChannel[];
  
  // Stage Channels (like Clubhouse)
  stageChannels: StageChannel[];
  
  // Features
  features: VoiceFeatures;
}

export interface VoiceChannel {
  id: string;
  name: string;
  participants: VoiceParticipant[];
  settings: VoiceChannelSettings;
  screenShares: ScreenShare[];
}

export interface VoiceParticipant {
  userId: string;
  username: string;
  avatar: string;
  isMuted: boolean;
  isDeafened: boolean;
  isSpeaking: boolean;
  isSelfMuted: boolean;
  isSelfDeafened: boolean;
  isStreaming: boolean;
  isVideoOn: boolean;
  volume: number;
}

export interface ScreenShare {
  userId: string;
  streamId: string;
  type: 'screen' | 'window' | 'application';
  quality: 'auto' | '720p' | '1080p' | '4k';
  frameRate: number;
  viewers: number;
}

export interface StageChannel {
  id: string;
  name: string;
  topic: string;
  speakers: StageSpeaker[];
  audience: StageAudienceMember[];
  raisedHands: string[];
  isLive: boolean;
  startedAt?: string;
  scheduledFor?: string;
}

export interface StageSpeaker {
  userId: string;
  username: string;
  avatar: string;
  isSpeaking: boolean;
  isMuted: boolean;
  role: 'host' | 'speaker' | 'invited';
}

export interface StageAudienceMember {
  userId: string;
  username: string;
  avatar: string;
  handRaised: boolean;
}

export interface VoiceFeatures {
  noiseSuppression: boolean;
  echoCancellation: boolean;
  automaticGainControl: boolean;
  spatialAudio: boolean;
  musicMode: boolean;
  pushToTalk: boolean;
  voiceActivity: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// EVENT ENGINE — EVENTBRITE + MEETUP KILLER
// ═══════════════════════════════════════════════════════════════════════════

export interface GroupEventEngine {
  events: GroupEvent[];
  templates: EventTemplate[];
  recurring: RecurringEvent[];
}

export interface GroupEvent {
  id: string;
  groupId: string;
  channelId?: string;
  
  // Basic Info
  title: string;
  description: string;
  image?: string;
  
  // Timing
  startTime: string;
  endTime: string;
  timezone: string;
  
  // Location
  locationType: 'virtual' | 'in_person' | 'hybrid';
  location?: PhysicalLocation;
  virtualLink?: string;
  
  // Settings
  privacy: 'public' | 'private' | 'community';
  requiresRSVP: boolean;
  maxAttendees?: number;
  
  // Ticketing
  isFree: boolean;
  tickets?: EventTicket[];
  
  // Attendees
  interestedCount: number;
  goingCount: number;
  attendees: EventAttendee[];
  
  // Creator
  createdBy: string;
  createdAt: string;
  
  // Status
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
}

export interface PhysicalLocation {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: { lat: number; lng: number };
}

export interface EventTicket {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  quantity: number;
  sold: number;
  available: number;
  salesStart?: string;
  salesEnd?: string;
  perks: string[];
}

export interface EventAttendee {
  userId: string;
  username: string;
  avatar: string;
  status: 'interested' | 'going' | 'not_going' | 'maybe';
  ticketType?: string;
  checkedIn: boolean;
  rsvpTime: string;
}

export interface EventTemplate {
  id: string;
  name: string;
  description: string;
  defaultDuration: number;
  defaultSettings: Partial<GroupEvent>;
}

export interface RecurringEvent {
  id: string;
  baseEvent: GroupEvent;
  recurrence: EventRecurrence;
  instances: GroupEvent[];
}

export interface EventRecurrence {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  endDate?: string;
  count?: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// REPUTATION SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

export interface ReputationSystem {
  karma: KarmaSystem;
  badges: BadgeSystem;
  levels: LevelSystem;
  achievements: AchievementSystem;
}

export interface KarmaSystem {
  types: KarmaType[];
  earning: KarmaEarningRules;
  spending: KarmaSpendingRules;
  decay: KarmaDecayRules;
}

export interface KarmaType {
  id: string;
  name: string;
  icon: string;
  description: string;
  visible: boolean;
}

export const KARMA_TYPES: KarmaType[] = [
  { id: 'post', name: 'Post Karma', icon: '📝', description: 'Earned from post upvotes', visible: true },
  { id: 'comment', name: 'Comment Karma', icon: '💬', description: 'Earned from comment upvotes', visible: true },
  { id: 'award', name: 'Award Karma', icon: '🏆', description: 'Earned from receiving awards', visible: true },
  { id: 'helpful', name: 'Helpful Karma', icon: '🎯', description: 'Earned when marked as helpful', visible: true },
  { id: 'community', name: 'Community Karma', icon: '👥', description: 'Earned from community contributions', visible: false },
];

export interface KarmaEarningRules {
  postUpvote: number;
  postDownvote: number;
  commentUpvote: number;
  commentDownvote: number;
  awardReceived: number;
  awardGiven: number;
  helpfulMark: number;
  maxPerPost: number;
  maxPerDay: number;
}

export interface KarmaSpendingRules {
  // Some features require karma
  createCommunity: number;
  customEmoji: number;
  prioritySupport: number;
}

export interface KarmaDecayRules {
  enabled: boolean;
  rate: number; // % per month
  floor: number; // Minimum karma
  exemptBadges: string[];
}

export interface BadgeSystem {
  available: Badge[];
  userBadges: UserBadge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: 'achievement' | 'contribution' | 'community' | 'event' | 'special';
  requirements: BadgeRequirement[];
  perks?: string[];
}

export interface BadgeRequirement {
  type: string;
  value: number;
  description: string;
}

export interface UserBadge {
  badgeId: string;
  earnedAt: string;
  displayOrder?: number;
  isDisplayed: boolean;
}

export interface LevelSystem {
  currentLevel: number;
  currentXP: number;
  nextLevelXP: number;
  totalXP: number;
  levels: Level[];
}

export interface Level {
  level: number;
  xpRequired: number;
  title: string;
  perks: string[];
  badge?: string;
}

export interface AchievementSystem {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  progress: AchievementProgress[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  requirements: AchievementRequirement[];
  reward?: AchievementReward;
}

export interface AchievementRequirement {
  type: string;
  target: number;
  description: string;
}

export interface AchievementReward {
  type: 'badge' | 'karma' | 'flair' | 'feature';
  value: unknown;
}

export interface UserAchievement {
  achievementId: string;
  earnedAt: string;
  notified: boolean;
}

export interface AchievementProgress {
  achievementId: string;
  current: number;
  target: number;
  percentage: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  REACTION_TYPES,
  DEFAULT_WEIGHTING_FACTORS,
  KARMA_TYPES,
  
  // Default configurations
  defaultCommentConfig: {
    permissions: {
      canComment: true,
      canReply: true,
      canEdit: true,
      canDelete: true,
      canVote: true,
      canReact: true,
      canReport: true,
      canAward: true,
      canEmbed: true,
      canUploadMedia: true,
      minAccountAge: 0,
      minKarma: 0,
      verifiedEmailRequired: false,
      subscriberOnly: false,
    },
    display: {
      maxDepth: -1, // Unlimited
      collapseAfterDepth: 10,
      loadMoreThreshold: 50,
      showDeleted: 'placeholder',
      showRemoved: 'placeholder',
      showScore: true,
      showVoteButtons: true,
      showReactions: true,
      showAwards: true,
      showUserFlair: true,
      showUserBadges: true,
      autoCollapseNegative: true,
      collapseThreshold: -5,
      highlightOP: true,
      highlightModerators: true,
      highlightVerified: true,
      highlightNew: true,
      newThresholdMinutes: 60,
    },
    sorting: {
      defaultSort: 'best',
      availableSorts: ['best', 'top', 'new', 'old', 'controversial', 'qa'],
      rememberSort: true,
    },
    features: {
      threading: true,
      editing: true,
      deletion: true,
      voting: true,
      reactions: true,
      awards: true,
      markdown: true,
      media: true,
      links: true,
      mentions: true,
      hashtags: true,
      spoilers: true,
      codeBlocks: true,
      math: true,
      sharing: true,
      bookmarking: true,
      quoting: true,
      embedding: true,
      reporting: true,
      selfModeration: true,
      translation: true,
      summarization: true,
      sentimentDisplay: false,
    },
    rateLimits: {
      commentsPerMinute: 3,
      commentsPerHour: 30,
      commentsPerDay: 200,
      editsPerComment: 10,
      editWindowMinutes: 1440, // 24 hours
      deletionWindowMinutes: 1440,
      mediaUploadsPerComment: 10,
      mentionsPerComment: 20,
    },
  } as CommentConfig,
};
