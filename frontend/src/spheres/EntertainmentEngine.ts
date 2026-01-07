/**
 * CHE·NU™ — ENTERTAINMENT SPHERE ENGINE v35
 * 
 * ════════════════════════════════════════════════════════════════════════════
 * Complete Entertainment Platform: Streaming, Creator Studio, Watch Party
 * Netflix + YouTube + Twitch + Spotify + TikTok KILLER
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

export const SPHERE_ID: SphereId = 'entertainment';
export const SPHERE_COLOR = '#E9E4D6';
export const SPHERE_ICON = '🎬';
export const SPHERE_NAME = 'Entertainment';
export const SPHERE_NAME_FR = 'Loisirs';

// ═══════════════════════════════════════════════════════════════════════════
// VIDEO CATEGORIES — COMPLETE TAXONOMY
// ═══════════════════════════════════════════════════════════════════════════

export type ContentType = 
  | 'movie' | 'series' | 'short_form' | 'live' 
  | 'user_generated' | 'educational' | 'music' 
  | 'sports' | 'news' | 'podcast' | 'audiobook';

export type MovieGenre = 
  | 'action' | 'comedy' | 'drama' | 'horror' | 'sci_fi' 
  | 'fantasy' | 'romance' | 'thriller' | 'documentary' 
  | 'animation' | 'family' | 'international';

export type SeriesType = 
  | 'drama' | 'comedy' | 'reality' | 'documentary' 
  | 'anime' | 'k_drama' | 'soap' | 'limited_series';

export type LiveCategory = 
  | 'gaming' | 'music' | 'talk_show' | 'sports' 
  | 'education' | 'events' | 'religious' | 'news' | 'creative';

export type ShortFormCategory = 
  | 'viral' | 'tutorial' | 'comedy' | 'dance' 
  | 'music' | 'news' | 'reaction' | 'compilation';

// ═══════════════════════════════════════════════════════════════════════════
// VIDEO CATEGORIES CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

export interface CategoryConfig {
  id: string;
  name: string;
  nameFr: string;
  icon: string;
  color: string;
  subCategories?: string[];
  ageRating?: string;
}

export const MOVIE_CATEGORIES: Record<MovieGenre, CategoryConfig> = {
  action: {
    id: 'action',
    name: 'Action',
    nameFr: 'Action',
    icon: '💥',
    color: '#FF4444',
    subCategories: ['martial_arts', 'superhero', 'spy', 'war', 'disaster', 'heist']
  },
  comedy: {
    id: 'comedy',
    name: 'Comedy',
    nameFr: 'Comédie',
    icon: '😂',
    color: '#FFD700',
    subCategories: ['romantic_comedy', 'parody', 'dark_comedy', 'slapstick', 'satire', 'mockumentary']
  },
  drama: {
    id: 'drama',
    name: 'Drama',
    nameFr: 'Drame',
    icon: '🎭',
    color: '#8B4513',
    subCategories: ['historical', 'biographical', 'legal', 'medical', 'family', 'coming_of_age']
  },
  horror: {
    id: 'horror',
    name: 'Horror',
    nameFr: 'Horreur',
    icon: '👻',
    color: '#4A0000',
    subCategories: ['slasher', 'supernatural', 'psychological', 'found_footage', 'body_horror', 'folk_horror'],
    ageRating: '18+'
  },
  sci_fi: {
    id: 'sci_fi',
    name: 'Science Fiction',
    nameFr: 'Science-Fiction',
    icon: '🚀',
    color: '#00CED1',
    subCategories: ['space', 'cyberpunk', 'time_travel', 'dystopia', 'alien', 'post_apocalyptic']
  },
  fantasy: {
    id: 'fantasy',
    name: 'Fantasy',
    nameFr: 'Fantaisie',
    icon: '🧙',
    color: '#9932CC',
    subCategories: ['high_fantasy', 'urban_fantasy', 'fairy_tale', 'mythology', 'sword_sorcery', 'magical_realism']
  },
  romance: {
    id: 'romance',
    name: 'Romance',
    nameFr: 'Romance',
    icon: '💕',
    color: '#FF69B4',
    subCategories: ['contemporary', 'period', 'lgbtq', 'tearjerker', 'second_chance', 'enemies_to_lovers']
  },
  thriller: {
    id: 'thriller',
    name: 'Thriller',
    nameFr: 'Thriller',
    icon: '😰',
    color: '#2F4F4F',
    subCategories: ['crime', 'political', 'conspiracy', 'survival', 'psychological', 'techno_thriller']
  },
  documentary: {
    id: 'documentary',
    name: 'Documentary',
    nameFr: 'Documentaire',
    icon: '📹',
    color: '#228B22',
    subCategories: ['nature', 'true_crime', 'historical', 'social', 'sports', 'music', 'science']
  },
  animation: {
    id: 'animation',
    name: 'Animation',
    nameFr: 'Animation',
    icon: '🎨',
    color: '#FF6347',
    subCategories: ['anime', 'pixar_style', 'stop_motion', 'adult', 'classic', 'experimental']
  },
  family: {
    id: 'family',
    name: 'Family',
    nameFr: 'Famille',
    icon: '👨‍👩‍👧‍👦',
    color: '#32CD32',
    subCategories: ['kids', 'all_ages', 'educational', 'holiday', 'adventure', 'musical'],
    ageRating: 'G'
  },
  international: {
    id: 'international',
    name: 'International',
    nameFr: 'International',
    icon: '🌍',
    color: '#4169E1',
    subCategories: ['bollywood', 'korean', 'french', 'japanese', 'spanish', 'nordic', 'middle_eastern', 'african']
  }
};

export const LIVE_CATEGORIES: Record<LiveCategory, CategoryConfig & { features: string[] }> = {
  gaming: {
    id: 'gaming',
    name: 'Gaming',
    nameFr: 'Jeux Vidéo',
    icon: '🎮',
    color: '#9146FF',
    features: ['chat', 'donations', 'raids', 'clips', 'predictions', 'channel_points']
  },
  music: {
    id: 'music',
    name: 'Music',
    nameFr: 'Musique',
    icon: '🎵',
    color: '#1DB954',
    features: ['chat', 'donations', 'song_requests', 'setlist', 'merch']
  },
  talk_show: {
    id: 'talk_show',
    name: 'Talk Shows',
    nameFr: 'Talk Shows',
    icon: '🎙️',
    color: '#FF6B6B',
    features: ['chat', 'call_ins', 'polls', 'qa', 'guests']
  },
  sports: {
    id: 'sports',
    name: 'Sports',
    nameFr: 'Sports',
    icon: '⚽',
    color: '#00D4AA',
    features: ['stats', 'multi_view', 'predictions', 'highlights', 'commentary']
  },
  education: {
    id: 'education',
    name: 'Education',
    nameFr: 'Éducation',
    icon: '📚',
    color: '#4ECDC4',
    features: ['qa', 'notes', 'certificates', 'quizzes', 'resources']
  },
  events: {
    id: 'events',
    name: 'Events',
    nameFr: 'Événements',
    icon: '🎪',
    color: '#FFE66D',
    features: ['tickets', 'vip', 'meet_and_greet', 'backstage', 'exclusive']
  },
  religious: {
    id: 'religious',
    name: 'Religious',
    nameFr: 'Religieux',
    icon: '⛪',
    color: '#C9B037',
    features: ['donations', 'prayer', 'community', 'sermons', 'events']
  },
  news: {
    id: 'news',
    name: 'News',
    nameFr: 'Actualités',
    icon: '📰',
    color: '#333333',
    features: ['breaking', 'commentary', 'sources', 'fact_check', 'multi_perspective']
  },
  creative: {
    id: 'creative',
    name: 'Creative',
    nameFr: 'Créatif',
    icon: '🎨',
    color: '#E056FD',
    features: ['chat', 'process_view', 'tutorials', 'commissions', 'portfolio']
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export interface MediaContent {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  thumbnail: string;
  poster?: string;
  backdrop?: string;
  duration: number; // seconds
  releaseDate: string;
  rating: ContentRating;
  genres: string[];
  tags: string[];
  language: string;
  subtitles: SubtitleTrack[];
  audioTracks: AudioTrack[];
  quality: VideoQuality[];
  creator: CreatorInfo;
  stats: ContentStats;
  monetization: MonetizationSettings;
  governance: ContentGovernance;
}

export interface ContentRating {
  system: 'MPAA' | 'TV' | 'ESRB' | 'PEGI' | 'custom';
  rating: string;
  descriptors: string[];
  ageRestriction?: number;
}

export interface SubtitleTrack {
  language: string;
  languageCode: string;
  url: string;
  format: 'vtt' | 'srt' | 'ass';
  isAI: boolean;
  isCC: boolean; // Closed Captions
}

export interface AudioTrack {
  language: string;
  languageCode: string;
  codec: string;
  channels: '2.0' | '5.1' | '7.1' | 'Atmos';
  isOriginal: boolean;
  isDescriptive: boolean; // Audio description for visually impaired
}

export interface VideoQuality {
  resolution: '480p' | '720p' | '1080p' | '4K' | '8K';
  hdr: boolean;
  dolbyVision: boolean;
  bitrate: number;
  codec: 'h264' | 'h265' | 'av1' | 'vp9';
}

export interface CreatorInfo {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  subscribers: number;
  type: 'individual' | 'design_studio' | 'network' | 'official';
}

export interface ContentStats {
  views: number;
  likes: number;
  dislikes: number;
  comments: number;
  shares: number;
  watchTime: number; // Total watch time in seconds
  completionRate: number; // % of viewers who finish
  avgRating: number; // 1-5 stars
}

export interface MonetizationSettings {
  type: 'free' | 'ad_supported' | 'subscription' | 'rental' | 'purchase';
  price?: number;
  rentalPeriod?: number; // hours
  adBreaks?: AdBreak[];
  creatorRevenue: CreatorRevenue;
}

export interface AdBreak {
  position: number; // seconds into video
  type: 'pre_roll' | 'mid_roll' | 'post_roll';
  skippable: boolean;
  skipAfter?: number; // seconds
}

export interface CreatorRevenue {
  sharePercentage: number; // CHE·NU gives 70% vs YouTube's 55%
  totalEarnings: number;
  monthlyEarnings: number;
  breakdown: {
    ads: number;
    subscriptions: number;
    tips: number;
    merchandise: number;
    sponsorships: number;
  };
}

export interface ContentGovernance {
  // CHE·NU Exclusive: Ethical content governance
  timeLimit?: number; // Optional daily viewing limit
  breakReminders: boolean; // "Take a break" reminders
  ageVerified: boolean;
  contentWarnings: string[];
  factChecked: boolean;
  sourceLinks: string[];
  noAddictionMechanics: boolean; // No autoplay trap
}

// ═══════════════════════════════════════════════════════════════════════════
// STREAMING PLAYER ENGINE
// ═══════════════════════════════════════════════════════════════════════════

export interface StreamingPlayerConfig {
  // Playback
  autoplay: boolean;
  autoplayNext: boolean; // Can be disabled for governance
  defaultQuality: 'auto' | VideoQuality['resolution'];
  playbackSpeed: number;
  volume: number;
  muted: boolean;
  
  // Display
  theater: boolean;
  fullscreen: boolean;
  pip: boolean; // Picture-in-picture
  miniPlayer: boolean;
  
  // Subtitles
  subtitlesEnabled: boolean;
  preferredSubtitleLanguage: string;
  subtitleStyle: SubtitleStyle;
  
  // Audio
  preferredAudioLanguage: string;
  normalizeVolume: boolean;
  
  // Accessibility
  audioDescription: boolean;
  closedCaptions: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  
  // Governance
  breakReminderInterval: number; // minutes, 0 = disabled
  dailyLimitMinutes: number; // 0 = unlimited
  bingePrevention: boolean;
}

export interface SubtitleStyle {
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  fontFamily: string;
  color: string;
  backgroundColor: string;
  backgroundOpacity: number;
  position: 'bottom' | 'top';
}

export interface PlayerState {
  isPlaying: boolean;
  isPaused: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  buffered: number;
  volume: number;
  quality: VideoQuality;
  playbackRate: number;
  error: PlayerError | null;
}

export interface PlayerError {
  code: string;
  message: string;
  recoverable: boolean;
  action?: 'retry' | 'reload' | 'contact_support';
}

// ═══════════════════════════════════════════════════════════════════════════
// WATCH PARTY ENGINE (Netflix Killer Feature)
// ═══════════════════════════════════════════════════════════════════════════

export interface WatchParty {
  id: string;
  type: 'private' | 'public' | 'premiere';
  host: PartyHost;
  content: MediaContent;
  participants: PartyParticipant[];
  settings: WatchPartySettings;
  state: WatchPartyState;
  chat: PartyChatEngine;
  reactions: ReactionEngine;
  interactive: InteractiveFeatures;
}

export interface PartyHost {
  userId: string;
  name: string;
  avatar: string;
  isCreator: boolean;
  controls: HostControls;
}

export interface HostControls {
  canPause: boolean;
  canSeek: boolean;
  canKick: boolean;
  canMute: boolean;
  canTransferHost: boolean;
  canEndParty: boolean;
}

export interface PartyParticipant {
  userId: string;
  name: string;
  avatar: string;
  role: 'host' | 'co_host' | 'moderator' | 'participant';
  status: 'watching' | 'away' | 'buffering';
  joinedAt: string;
  reactions: number;
  messages: number;
}

export interface WatchPartySettings {
  maxParticipants: number;
  inviteOnly: boolean;
  allowLateJoin: boolean;
  syncTolerance: number; // ms
  voiceChat: boolean;
  videoChat: boolean;
  textChat: boolean;
  reactions: boolean;
  polls: boolean;
  shareLink: string;
  password?: string;
}

export interface WatchPartyState {
  status: 'waiting' | 'playing' | 'paused' | 'ended';
  currentTime: number;
  hostTime: number;
  lastSync: string;
  participantCount: number;
}

export interface PartyChatEngine {
  messages: ChatMessage[];
  slowMode: boolean;
  slowModeInterval: number;
  emoteOnly: boolean;
  subscriberOnly: boolean;
  filters: ChatFilters;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  type: 'text' | 'emote' | 'gif' | 'sticker' | 'system';
  highlighted: boolean;
  pinned: boolean;
  reactions: MessageReaction[];
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface ChatFilters {
  toxicity: boolean;
  spam: boolean;
  links: boolean;
  caps: boolean;
  emoteSpam: boolean;
  language: string[];
}

export interface ReactionEngine {
  available: ReactionType[];
  current: ActiveReaction[];
  burstLimit: number;
  cooldown: number;
}

export interface ReactionType {
  id: string;
  emoji: string;
  name: string;
  animation?: string;
  sound?: string;
}

export interface ActiveReaction {
  type: ReactionType;
  userId: string;
  position: { x: number; y: number };
  timestamp: number;
}

export interface InteractiveFeatures {
  polls: PollSystem;
  quizzes: QuizSystem;
  predictions: PredictionSystem;
  trivia: TriviaSystem;
  games: MiniGameSystem;
}

export interface PollSystem {
  active: Poll | null;
  history: Poll[];
  canCreate: boolean;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  duration: number;
  anonymous: boolean;
  multiSelect: boolean;
  createdBy: string;
  createdAt: string;
  endsAt: string;
  status: 'active' | 'ended';
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
  voters?: string[]; // Only if not anonymous
}

// ═══════════════════════════════════════════════════════════════════════════
// CREATOR STUDIO ENGINE (YouTube Killer)
// ═══════════════════════════════════════════════════════════════════════════

export interface CreatorStudio {
  // Dashboard
  dashboard: CreatorDashboard;
  
  // Content Management
  content: ContentManagement;
  
  // Upload
  upload: UploadEngine;
  
  // Editing
  editing: VideoEditingEngine;
  
  // Analytics
  analytics: CreatorAnalytics;
  
  // Monetization
  monetization: CreatorMonetization;
  
  // Community
  community: CommunityManagement;
  
  // AI Tools
  ai: AICreatorTools;
}

export interface CreatorDashboard {
  overview: DashboardOverview;
  recentUploads: MediaContent[];
  notifications: CreatorNotification[];
  tasks: CreatorTask[];
  earnings: EarningsSummary;
  performance: PerformanceSummary;
}

export interface DashboardOverview {
  totalViews: number;
  viewsChange: number;
  totalSubscribers: number;
  subscribersChange: number;
  totalWatchTime: number;
  watchTimeChange: number;
  totalRevenue: number;
  revenueChange: number;
  period: '24h' | '7d' | '28d' | '90d' | '365d';
}

export interface ContentManagement {
  videos: MediaContent[];
  shorts: MediaContent[];
  live: LiveStream[];
  playlists: Playlist[];
  posts: CommunityPost[];
  drafts: Draft[];
  scheduled: ScheduledContent[];
}

export interface UploadEngine {
  // Supported formats - MORE than YouTube
  supportedFormats: string[]; // ['mp4', 'mov', 'avi', 'mkv', 'webm', 'hevc', 'prores', 'raw']
  maxFileSize: string; // '256GB' vs YouTube's ~128GB
  
  // Features
  chunkUpload: boolean;
  resumable: boolean;
  cloudImport: CloudImportSource[];
  batchUpload: boolean;
  scheduling: boolean;
  premiere: boolean;
  
  // Processing
  autoTranscode: boolean;
  qualityPresets: VideoQuality[];
  thumbnailGeneration: boolean;
  subtitleExtraction: boolean;
}

export interface CloudImportSource {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
}

export interface VideoEditingEngine {
  // In-browser editing - No software needed!
  trimming: boolean;
  cutting: boolean;
  splitting: boolean;
  merging: boolean;
  
  // Effects
  effects: EffectLibrary;
  transitions: TransitionLibrary;
  filters: FilterLibrary;
  
  // Audio
  music: RoyaltyFreeMusicLibrary;
  soundEffects: SoundEffectLibrary;
  voiceover: VoiceoverTools;
  audioMixing: AudioMixingTools;
  
  // Text & Graphics
  titles: TitleTemplates;
  lowerThirds: LowerThirdTemplates;
  graphics: GraphicOverlays;
  
  // AI Features
  aiSubtitles: AISubtitleEngine;
  aiThumbnails: AIThumbnailGenerator;
  aiHighlights: AIHighlightDetection;
  aiSilenceRemoval: AISilenceRemoval;
  
  // Export
  chapters: ChapterEditor;
  endScreens: EndScreenEditor;
  cards: InfoCardSystem;
}

export interface CreatorAnalytics {
  // Real-time
  realtime: RealtimeAnalytics;
  
  // Historical
  views: ViewAnalytics;
  watchTime: WatchTimeAnalytics;
  engagement: EngagementAnalytics;
  audience: AudienceAnalytics;
  revenue: RevenueAnalytics;
  
  // Advanced
  retention: RetentionAnalysis;
  traffic: TrafficSourceAnalysis;
  demographics: DemographicInsights;
  comparison: CompetitorComparison;
  
  // AI Insights
  aiInsights: AIAnalyticsEngine;
  predictions: GrowthPredictions;
  recommendations: ContentRecommendations;
}

export interface CreatorMonetization {
  // Status
  eligible: boolean;
  requirements: MonetizationRequirements;
  
  // Revenue Streams
  adRevenue: AdRevenueSettings;
  subscriptions: SubscriptionSettings;
  tips: TipSettings;
  merchandise: MerchandiseSettings;
  sponsorships: SponsorshipSettings;
  
  // Payouts
  payouts: PayoutSettings;
  balance: number;
  pendingBalance: number;
  history: PayoutHistory[];
}

export interface AdRevenueSettings {
  enabled: boolean;
  creatorShare: 70; // CHE·NU gives 70% vs YouTube's 55%!
  adFormats: ('pre_roll' | 'mid_roll' | 'post_roll' | 'display')[];
  adCategories: string[];
  blockedCategories: string[];
  minimumVideoLength: number; // For mid-rolls
}

export interface SubscriptionSettings {
  enabled: boolean;
  creatorShare: 90; // CHE·NU gives 90% vs YouTube's 70%!
  tiers: SubscriptionTier[];
  perks: SubscriptionPerk[];
  badges: SubscriptionBadge[];
  emotes: CustomEmote[];
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  perks: string[];
  badge: string;
  emotes: string[];
}

export interface TipSettings {
  enabled: boolean;
  creatorShare: 95; // CHE·NU gives 95% vs YouTube's 70%!
  minimumAmount: number;
  maximumAmount: number;
  customAmounts: number[];
  messages: boolean;
  animations: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// AI CREATOR TOOLS
// ═══════════════════════════════════════════════════════════════════════════

export interface AICreatorTools {
  scriptWriter: AIScriptWriter;
  voiceover: AIVoiceoverEngine;
  videoEnhancer: AIVideoEnhancer;
  thumbnailGenerator: AIThumbnailEngine;
  seoOptimizer: AISEOEngine;
  trendAnalyzer: AITrendAnalyzer;
  contentIdeas: AIContentIdeaGenerator;
  titleGenerator: AITitleGenerator;
  descriptionWriter: AIDescriptionWriter;
  hashtagSuggester: AIHashtagSuggester;
}

export interface AIScriptWriter {
  generate(topic: string, options: ScriptOptions): Promise<Script>;
  improve(script: string, feedback: string): Promise<Script>;
  research(topic: string): Promise<ResearchResults>;
  outline(topic: string): Promise<ScriptOutline>;
}

export interface ScriptOptions {
  style: 'educational' | 'entertainment' | 'documentary' | 'tutorial' | 'review';
  length: 'short' | 'medium' | 'long';
  tone: 'casual' | 'professional' | 'humorous' | 'serious';
  targetAudience: string;
  includeHooks: boolean;
  includeCTA: boolean;
}

export interface Script {
  title: string;
  hook: string;
  sections: ScriptSection[];
  callToAction: string;
  estimatedDuration: number;
  keywords: string[];
}

export interface ScriptSection {
  title: string;
  content: string;
  visualNotes: string;
  duration: number;
}

export interface AIThumbnailEngine {
  generate(content: MediaContent, options: ThumbnailOptions): Promise<Thumbnail[]>;
  analyze(thumbnail: string): Promise<ThumbnailAnalysis>;
  abTest(thumbnails: Thumbnail[]): Promise<ABTestSetup>;
}

export interface ThumbnailOptions {
  style: 'clean' | 'bold' | 'dramatic' | 'minimal' | 'collage';
  includeText: boolean;
  textContent?: string;
  colorScheme?: string[];
  faceFocus: boolean;
  emotionTarget?: 'curiosity' | 'excitement' | 'shock' | 'happiness';
}

export interface Thumbnail {
  id: string;
  url: string;
  style: string;
  predictedCTR: number;
  strengths: string[];
  suggestions: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// LIVE STREAMING ENGINE (Twitch Killer)
// ═══════════════════════════════════════════════════════════════════════════

export interface LiveStreamEngine {
  // Stream Setup
  setup: StreamSetup;
  
  // Broadcasting
  broadcast: BroadcastEngine;
  
  // Chat
  chat: LiveChatEngine;
  
  // Interactions
  interactions: StreamInteractions;
  
  // Monetization
  monetization: LiveMonetization;
  
  // Analytics
  analytics: LiveAnalytics;
  
  // Moderation
  moderation: LiveModeration;
}

export interface StreamSetup {
  title: string;
  category: LiveCategory;
  tags: string[];
  language: string;
  thumbnail: string;
  scheduledStart?: string;
  
  // Technical
  streamKey: string;
  ingestServer: string;
  backupServer: string;
  
  // Settings
  latencyMode: 'ultra_low' | 'low' | 'normal';
  recording: boolean;
  dvr: boolean; // Rewind during live
  chatReplay: boolean;
  
  // Access
  visibility: 'public' | 'unlisted' | 'subscribers_only';
  ageRestricted: boolean;
  requiresTicket: boolean;
}

export interface BroadcastEngine {
  status: 'offline' | 'starting' | 'live' | 'ending';
  startedAt?: string;
  duration: number;
  viewers: ViewerCount;
  health: StreamHealth;
  quality: StreamQuality;
}

export interface ViewerCount {
  current: number;
  peak: number;
  average: number;
  unique: number;
}

export interface StreamHealth {
  status: 'excellent' | 'good' | 'fair' | 'poor';
  bitrate: number;
  fps: number;
  droppedFrames: number;
  latency: number;
  issues: StreamIssue[];
}

export interface StreamIssue {
  type: 'bandwidth' | 'encoding' | 'network' | 'server';
  severity: 'warning' | 'error';
  message: string;
  suggestion: string;
}

export interface StreamInteractions {
  // Twitch-style features
  channelPoints: ChannelPointSystem;
  predictions: PredictionSystem;
  polls: PollSystem;
  raids: RaidSystem;
  
  // Enhanced features
  reactions: ReactionEngine;
  clips: ClipSystem;
  highlights: HighlightMarkers;
  multiStream: MultiStreamSupport;
  
  // Unique to CHE·NU
  governedInteractions: GovernedInteractions;
}

export interface ChannelPointSystem {
  enabled: boolean;
  name: string; // Custom name for points
  icon: string;
  rewards: ChannelPointReward[];
  earning: PointEarningRules;
}

export interface ChannelPointReward {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  enabled: boolean;
  userInputRequired: boolean;
  cooldown: number;
  maxPerStream?: number;
  maxPerUser?: number;
  action: RewardAction;
}

export interface RewardAction {
  type: 'highlight' | 'sound' | 'effect' | 'custom';
  payload: unknown;
}

export interface GovernedInteractions {
  // CHE·NU exclusive: Ethical live streaming
  toxicityPrevention: ToxicityPrevention;
  healthyViewingReminders: boolean;
  noGambling: boolean;
  noDarkPatterns: boolean;
  transparentMetrics: boolean;
}

export interface ToxicityPrevention {
  enabled: boolean;
  aiModeration: boolean;
  hateSpeeceFilter: boolean;
  harassmentDetection: boolean;
  raidProtection: boolean;
  brigadeDetection: boolean;
  autoTimeout: boolean;
  appealProcess: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// SHORT FORM VIDEO ENGINE (TikTok/Reels/Shorts Killer)
// ═══════════════════════════════════════════════════════════════════════════

export interface ShortFormEngine {
  // Feed
  feed: ShortFormFeed;
  
  // Creation
  creation: ShortFormCreation;
  
  // Discovery
  discovery: ShortFormDiscovery;
  
  // Engagement
  engagement: ShortFormEngagement;
  
  // Monetization
  monetization: ShortFormMonetization;
  
  // Governance (CHE·NU exclusive)
  governance: ShortFormGovernance;
}

export interface ShortFormFeed {
  algorithm: EthicalAlgorithm;
  personaliation: PersonalizationSettings;
  following: boolean;
  forYou: boolean;
  trending: boolean;
  categories: ShortFormCategory[];
}

export interface EthicalAlgorithm {
  // CHE·NU exclusive: No addiction mechanics
  diversityEnforced: boolean; // No filter bubbles
  breakReminders: boolean;
  dailyLimit?: number;
  noInfiniteScroll: boolean;
  transparentRanking: boolean;
  userControlled: boolean;
}

export interface ShortFormCreation {
  maxDuration: 180; // 3 minutes
  minDuration: 3;
  aspectRatio: '9:16';
  
  // Capture
  camera: CameraFeatures;
  
  // Editing
  trimming: boolean;
  filters: FilterLibrary;
  effects: EffectLibrary;
  text: TextOverlays;
  stickers: StickerLibrary;
  music: MusicLibrary;
  voiceover: boolean;
  greenScreen: boolean;
  duet: boolean;
  stitch: boolean;
  
  // AI Features
  aiFilters: AIFilterEngine;
  aiEffects: AIEffectEngine;
  aiCaptions: AICaptionEngine;
  aiMusic: AIMusicSuggestions;
}

export interface ShortFormGovernance {
  // CHE·NU exclusive
  noAddictiveMechanics: {
    noAutoplayTrap: boolean;
    sessionLimits: boolean;
    breakReminders: boolean;
    screenTimeTracking: boolean;
  };
  contentQuality: {
    misinformationLabels: boolean;
    factChecking: boolean;
    sourceVerification: boolean;
    aiGeneratedLabels: boolean;
  };
  userControl: {
    algorithmTransparency: boolean;
    contentFilters: boolean;
    watchHistoryControl: boolean;
    recommendationTuning: boolean;
  };
  mentalHealth: {
    bodyImageFilters: boolean; // Warn about unrealistic edits
    comparisonReminders: boolean;
    positiveContentBoost: boolean;
    crisisResources: boolean;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  // Categories
  MOVIE_CATEGORIES,
  LIVE_CATEGORIES,
  
  // Default configurations
  defaultPlayerConfig: {
    autoplay: false,
    autoplayNext: false, // CHE·NU: No binge trap by default
    defaultQuality: 'auto',
    playbackSpeed: 1,
    volume: 1,
    muted: false,
    theater: false,
    fullscreen: false,
    pip: false,
    miniPlayer: false,
    subtitlesEnabled: true,
    preferredSubtitleLanguage: 'auto',
    subtitleStyle: {
      fontSize: 'medium',
      fontFamily: 'Inter, sans-serif',
      color: '#FFFFFF',
      backgroundColor: '#000000',
      backgroundOpacity: 0.75,
      position: 'bottom'
    },
    preferredAudioLanguage: 'auto',
    normalizeVolume: true,
    audioDescription: false,
    closedCaptions: false,
    reducedMotion: false,
    highContrast: false,
    breakReminderInterval: 60, // Every hour
    dailyLimitMinutes: 0, // No limit by default, user can set
    bingePrevention: true // CHE·NU: Enabled by default
  } as StreamingPlayerConfig,
  
  // Revenue shares (BETTER than competitors!)
  revenueShares: {
    ads: {
      chenu: 70,
      youtube: 55,
      advantage: '+15%'
    },
    subscriptions: {
      chenu: 90,
      youtube: 70,
      advantage: '+20%'
    },
    tips: {
      chenu: 95,
      youtube: 70,
      advantage: '+25%'
    }
  }
};
