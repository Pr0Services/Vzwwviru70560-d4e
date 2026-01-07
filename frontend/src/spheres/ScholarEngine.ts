/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — SCHOLAR SPHERE ENGINE                           ║
 * ║                    Knowledge, Learning & Research Platform                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Engine complet pour la gestion du savoir et de l'apprentissage:
 * - Gestion des connaissances (Knowledge Base)
 * - Apprentissage et formation
 * - Recherche et documentation
 * - Bibliothèque et ressources
 * - Notes et annotations
 * - Certifications et compétences
 * 
 * @author CHE·NU Team
 * @version 51.0
 * @license Proprietary - All Rights Reserved
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES CENTRAUX
// ═══════════════════════════════════════════════════════════════════════════════

import type { SphereId, BureauSectionId } from '../types/spheres.types';

export const SPHERE_ID: SphereId = 'scholars';
export const SPHERE_COLOR = '#9B59B6';
export const SPHERE_ICON = '📚';
export const SPHERE_NAME = 'Scholar';
export const SPHERE_NAME_FR = 'Savoir';

// ═══════════════════════════════════════════════════════════════════════════════
// KNOWLEDGE BASE ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  
  // Structure
  categories: KnowledgeCategory[];
  articles: KnowledgeArticle[];
  
  // Settings
  settings: KnowledgeBaseSettings;
  
  // Statistics
  stats: KnowledgeBaseStats;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface KnowledgeCategory {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  icon: string;
  color: string;
  order: number;
  articleCount: number;
  children: KnowledgeCategory[];
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  slug: string;
  
  // Content
  content: ArticleContent;
  summary: string;
  
  // Classification
  categoryId: string;
  tags: string[];
  
  // Status
  status: ArticleStatus;
  visibility: ArticleVisibility;
  
  // Versioning
  version: number;
  versionHistory: ArticleVersion[];
  
  // Authorship
  author: Author;
  contributors: Author[];
  
  // Dates
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  
  // Engagement
  views: number;
  likes: number;
  bookmarks: number;
  
  // SEO
  metaTitle: string;
  metaDescription: string;
  
  // Relations
  relatedArticles: string[];
  linkedResources: string[];
  
  // Feedback
  feedback: ArticleFeedback[];
  rating: number;
  ratingCount: number;
}

export interface ArticleContent {
  format: 'markdown' | 'html' | 'rich_text';
  body: string;
  toc: TableOfContents[];
  codeBlocks: CodeBlock[];
  images: ArticleImage[];
  attachments: Attachment[];
}

export interface TableOfContents {
  id: string;
  level: number;
  title: string;
  anchor: string;
}

export interface CodeBlock {
  id: string;
  language: string;
  code: string;
  filename: string | null;
  runnable: boolean;
}

export interface ArticleImage {
  id: string;
  url: string;
  alt: string;
  caption: string | null;
  width: number;
  height: number;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  downloads: number;
}

export type ArticleStatus = 'draft' | 'review' | 'published' | 'archived' | 'deprecated';

export type ArticleVisibility = 'public' | 'internal' | 'private' | 'restricted';

export interface ArticleVersion {
  version: number;
  content: string;
  author: string;
  createdAt: string;
  changeNote: string;
  diff: string | null;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
}

export interface ArticleFeedback {
  id: string;
  type: 'helpful' | 'not_helpful' | 'suggestion' | 'error_report';
  content: string;
  userId: string;
  createdAt: string;
  resolved: boolean;
}

export interface KnowledgeBaseSettings {
  allowComments: boolean;
  allowRatings: boolean;
  allowSuggestions: boolean;
  requireApproval: boolean;
  defaultVisibility: ArticleVisibility;
  versioningEnabled: boolean;
}

export interface KnowledgeBaseStats {
  totalArticles: number;
  totalCategories: number;
  totalViews: number;
  totalContributors: number;
  avgRating: number;
  mostViewed: string[];
  recentlyUpdated: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEARNING ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export interface LearningEngine {
  courses: Course[];
  paths: LearningPath[];
  progress: LearningProgress[];
  certifications: LearnerCertification[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  
  // Content
  modules: CourseModule[];
  totalDuration: number; // minutes
  
  // Classification
  category: string;
  level: CourseLevel;
  tags: string[];
  
  // Requirements
  prerequisites: string[];
  objectives: string[];
  
  // Instructor
  instructor: Instructor;
  
  // Status
  status: CourseStatus;
  
  // Pricing
  pricing: CoursePricing;
  
  // Enrollment
  enrollmentCount: number;
  maxEnrollment: number | null;
  enrollmentDeadline: string | null;
  
  // Dates
  startDate: string | null;
  endDate: string | null;
  
  // Ratings
  rating: number;
  reviewCount: number;
  
  // Certificate
  certificateEnabled: boolean;
  certificateTemplate: string | null;
  
  // Media
  thumbnail: string;
  trailer: string | null;
}

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type CourseStatus = 'draft' | 'published' | 'archived' | 'coming_soon';

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  
  // Lessons
  lessons: Lesson[];
  
  // Duration
  duration: number; // minutes
  
  // Requirements
  unlockCondition: UnlockCondition | null;
  
  // Assessment
  quiz: Quiz | null;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
  
  // Content
  contentType: LessonContentType;
  content: LessonContent;
  
  // Duration
  duration: number; // minutes
  
  // Resources
  resources: LessonResource[];
  
  // Completion
  completionCriteria: CompletionCriteria;
}

export type LessonContentType = 'video' | 'text' | 'interactive' | 'quiz' | 'assignment' | 'live';

export interface LessonContent {
  video?: VideoContent;
  text?: string;
  interactive?: InteractiveContent;
  quiz?: Quiz;
  assignment?: Assignment;
  live?: LiveSession;
}

export interface VideoContent {
  url: string;
  provider: 'youtube' | 'vimeo' | 'hosted' | 'stream';
  duration: number;
  transcript: string | null;
  captions: Caption[];
  chapters: VideoChapter[];
}

export interface Caption {
  language: string;
  url: string;
}

export interface VideoChapter {
  title: string;
  startTime: number;
}

export interface InteractiveContent {
  type: 'simulation' | 'sandbox' | 'exercise' | 'game';
  url: string;
  config: Record<string, unknown>;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  dueDate: string | null;
  submissionType: 'file' | 'text' | 'url' | 'code';
  maxScore: number;
  rubric: RubricItem[];
  peerReview: boolean;
}

export interface RubricItem {
  criteria: string;
  description: string;
  maxPoints: number;
}

export interface LiveSession {
  scheduledDate: string;
  duration: number;
  platform: 'zoom' | 'teams' | 'meet' | 'webinar';
  joinUrl: string;
  recording: string | null;
}

export interface LessonResource {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'link' | 'code' | 'data';
  url: string;
  description: string;
}

export interface CompletionCriteria {
  type: 'view' | 'duration' | 'quiz_pass' | 'assignment_submit';
  threshold: number;
}

export interface UnlockCondition {
  type: 'completion' | 'date' | 'manual';
  prerequisiteId: string | null;
  unlockDate: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUIZ & ASSESSMENT ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export interface Quiz {
  id: string;
  title: string;
  description: string;
  
  // Questions
  questions: Question[];
  
  // Settings
  settings: QuizSettings;
  
  // Grading
  passingScore: number;
  maxScore: number;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  explanation: string | null;
  points: number;
  
  // Options (for multiple choice)
  options: QuestionOption[];
  
  // Answer
  correctAnswer: string | string[];
  
  // Media
  image: string | null;
  
  // Metadata
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export type QuestionType =
  | 'multiple_choice'
  | 'multiple_select'
  | 'true_false'
  | 'short_answer'
  | 'essay'
  | 'matching'
  | 'ordering'
  | 'fill_blank'
  | 'code';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizSettings {
  timeLimit: number | null; // minutes
  attempts: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showCorrectAnswers: boolean;
  showExplanations: boolean;
  allowReview: boolean;
  proctoring: boolean;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  
  // Attempt details
  attemptNumber: number;
  startedAt: string;
  completedAt: string | null;
  
  // Answers
  answers: QuizAnswer[];
  
  // Results
  score: number;
  passed: boolean;
  
  // Time
  timeSpent: number; // seconds
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  points: number;
  timeSpent: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEARNING PATH
// ═══════════════════════════════════════════════════════════════════════════════

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  
  // Structure
  milestones: PathMilestone[];
  
  // Classification
  category: string;
  level: CourseLevel;
  
  // Duration
  estimatedDuration: number; // hours
  
  // Goals
  learningOutcomes: string[];
  targetSkills: Skill[];
  
  // Status
  status: CourseStatus;
  
  // Stats
  enrollmentCount: number;
  completionRate: number;
  
  // Media
  thumbnail: string;
}

export interface PathMilestone {
  id: string;
  title: string;
  description: string;
  order: number;
  
  // Content
  items: PathItem[];
  
  // Completion
  completionCriteria: MilestoneCompletion;
  
  // Rewards
  badge: Badge | null;
  skills: string[];
}

export interface PathItem {
  id: string;
  type: 'course' | 'article' | 'quiz' | 'project' | 'external';
  referenceId: string;
  title: string;
  required: boolean;
  order: number;
}

export interface MilestoneCompletion {
  type: 'all' | 'percentage' | 'required_only';
  threshold: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SKILLS & COMPETENCIES
// ═══════════════════════════════════════════════════════════════════════════════

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  
  // Levels
  levels: SkillLevel[];
  
  // Assessment
  assessmentMethod: AssessmentMethod;
  
  // Relations
  prerequisites: string[];
  relatedSkills: string[];
  
  // Metadata
  icon: string;
  color: string;
}

export type SkillCategory =
  | 'technical'
  | 'soft'
  | 'domain'
  | 'tool'
  | 'language'
  | 'certification';

export interface SkillLevel {
  level: number;
  name: string;
  description: string;
  criteria: string[];
  experienceRequired: number; // hours
}

export type AssessmentMethod = 'quiz' | 'project' | 'peer_review' | 'manager_review' | 'self_assessment';

export interface UserSkill {
  skillId: string;
  userId: string;
  currentLevel: number;
  experience: number;
  lastAssessed: string;
  endorsements: Endorsement[];
  evidence: SkillEvidence[];
}

export interface Endorsement {
  id: string;
  endorserId: string;
  endorserName: string;
  comment: string;
  createdAt: string;
}

export interface SkillEvidence {
  id: string;
  type: 'course' | 'project' | 'certification' | 'work';
  title: string;
  description: string;
  url: string | null;
  date: string;
  verified: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CERTIFICATION ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export interface LearnerCertification {
  id: string;
  name: string;
  description: string;
  
  // Issuer
  issuer: CertificationIssuer;
  
  // Requirements
  requirements: CertificationRequirement[];
  
  // Exam
  exam: CertificationExam | null;
  
  // Validity
  validityPeriod: number | null; // months
  renewalRequirements: RenewalRequirement[];
  
  // Credentials
  credentialId: string;
  credentialUrl: string;
  
  // Status
  status: CertificationStatus;
  
  // Dates
  earnedDate: string;
  expirationDate: string | null;
  
  // Display
  badge: Badge;
  certificate: CertificateTemplate;
}

export interface CertificationIssuer {
  id: string;
  name: string;
  logo: string;
  website: string;
  verificationUrl: string;
}

export interface CertificationRequirement {
  type: 'course' | 'experience' | 'exam' | 'project';
  description: string;
  fulfilled: boolean;
}

export interface CertificationExam {
  id: string;
  name: string;
  duration: number; // minutes
  questionCount: number;
  passingScore: number;
  attempts: number;
  fee: number;
  schedulingUrl: string;
}

export interface RenewalRequirement {
  type: 'continuing_education' | 'exam' | 'project' | 'fee';
  description: string;
  amount: number;
}

export type CertificationStatus = 'active' | 'expired' | 'suspended' | 'revoked';

export interface CertificateTemplate {
  id: string;
  name: string;
  templateUrl: string;
  fields: CertificateField[];
}

export interface CertificateField {
  name: string;
  type: 'text' | 'date' | 'image' | 'qr';
  position: { x: number; y: number };
}

// ═══════════════════════════════════════════════════════════════════════════════
// BADGE SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

export interface Badge {
  id: string;
  name: string;
  description: string;
  
  // Visual
  image: string;
  color: string;
  
  // Classification
  category: BadgeCategory;
  rarity: BadgeRarity;
  
  // Criteria
  criteria: BadgeCriteria;
  
  // Points
  points: number;
  
  // Stats
  earnedCount: number;
}

export type BadgeCategory =
  | 'achievement'
  | 'milestone'
  | 'skill'
  | 'participation'
  | 'contribution'
  | 'special';

export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface BadgeCriteria {
  type: 'automatic' | 'manual';
  conditions: BadgeCondition[];
}

export interface BadgeCondition {
  type: 'course_complete' | 'quiz_pass' | 'streak' | 'contribution' | 'skill_level';
  target: string;
  threshold: number;
}

export interface UserBadge {
  badgeId: string;
  userId: string;
  earnedAt: string;
  displayed: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROGRESS TRACKING
// ═══════════════════════════════════════════════════════════════════════════════

export interface LearningProgress {
  userId: string;
  
  // Course progress
  courseProgress: CourseProgress[];
  
  // Path progress
  pathProgress: PathProgress[];
  
  // Overall stats
  stats: LearningStats;
  
  // Streaks
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  
  // Goals
  goals: LearningGoal[];
}

export interface CourseProgress {
  courseId: string;
  status: ProgressStatus;
  
  // Progress
  completedLessons: string[];
  totalLessons: number;
  percentComplete: number;
  
  // Time
  timeSpent: number; // minutes
  lastAccessedAt: string;
  startedAt: string;
  completedAt: string | null;
  
  // Scores
  quizScores: { quizId: string; score: number; passed: boolean }[];
  assignmentScores: { assignmentId: string; score: number }[];
  
  // Certificate
  certificateEarned: boolean;
  certificateUrl: string | null;
}

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed' | 'expired';

export interface PathProgress {
  pathId: string;
  status: ProgressStatus;
  
  // Progress
  completedMilestones: string[];
  totalMilestones: number;
  percentComplete: number;
  
  // Time
  startedAt: string;
  completedAt: string | null;
  
  // Earned
  badgesEarned: string[];
  skillsGained: string[];
}

export interface LearningStats {
  totalCoursesCompleted: number;
  totalPathsCompleted: number;
  totalTimeSpent: number; // minutes
  totalPointsEarned: number;
  totalBadgesEarned: number;
  totalCertifications: number;
  averageQuizScore: number;
  skillsAcquired: number;
}

export interface LearningGoal {
  id: string;
  type: 'course' | 'path' | 'time' | 'skill';
  target: string;
  targetValue: number;
  currentValue: number;
  deadline: string;
  status: 'active' | 'completed' | 'failed' | 'cancelled';
}

// ═══════════════════════════════════════════════════════════════════════════════
// RESEARCH ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export interface ResearchEngine {
  projects: ResearchProject[];
  papers: ResearchPaper[];
  datasets: Dataset[];
  experiments: Experiment[];
}

export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  
  // Classification
  field: string;
  subfield: string;
  keywords: string[];
  
  // Team
  principalInvestigator: Researcher;
  team: Researcher[];
  
  // Timeline
  startDate: string;
  endDate: string | null;
  status: ProjectStatus;
  
  // Funding
  funding: FundingSource[];
  budget: number;
  
  // Outputs
  papers: string[];
  datasets: string[];
  patents: string[];
  
  // Collaboration
  collaborators: Institution[];
}

export type ProjectStatus = 'proposal' | 'active' | 'completed' | 'suspended' | 'cancelled';

export interface Researcher {
  id: string;
  name: string;
  title: string;
  affiliation: string;
  email: string;
  orcid: string | null;
  expertise: string[];
  publications: number;
  citations: number;
}

export interface Institution {
  id: string;
  name: string;
  type: 'university' | 'research_institute' | 'company' | 'government';
  country: string;
  website: string;
}

export interface FundingSource {
  organization: string;
  grantId: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  
  // Authors
  authors: PaperAuthor[];
  
  // Publication
  journal: string | null;
  conference: string | null;
  year: number;
  volume: string | null;
  issue: string | null;
  pages: string | null;
  
  // Identifiers
  doi: string | null;
  arxivId: string | null;
  pmid: string | null;
  
  // Classification
  keywords: string[];
  categories: string[];
  
  // Access
  openAccess: boolean;
  pdfUrl: string | null;
  
  // Metrics
  citations: number;
  downloads: number;
  
  // Status
  status: PaperStatus;
}

export interface PaperAuthor {
  name: string;
  affiliation: string;
  isCorresponding: boolean;
  orcid: string | null;
}

export type PaperStatus = 'draft' | 'submitted' | 'under_review' | 'accepted' | 'published' | 'rejected';

export interface Dataset {
  id: string;
  name: string;
  description: string;
  
  // Content
  format: string;
  size: number;
  recordCount: number;
  
  // Schema
  schema: DatasetSchema;
  
  // Access
  accessLevel: 'public' | 'restricted' | 'private';
  license: string;
  downloadUrl: string;
  
  // Metadata
  version: string;
  lastUpdated: string;
  doi: string | null;
  
  // Usage
  downloads: number;
  citations: number;
}

export interface DatasetSchema {
  fields: DatasetField[];
  primaryKey: string[];
}

export interface DatasetField {
  name: string;
  type: string;
  description: string;
  nullable: boolean;
  example: string;
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  projectId: string;
  
  // Design
  hypothesis: string;
  methodology: string;
  variables: ExperimentVariable[];
  
  // Execution
  status: ExperimentStatus;
  startDate: string;
  endDate: string | null;
  
  // Results
  results: ExperimentResult[];
  conclusion: string | null;
  
  // Data
  datasets: string[];
  notebooks: string[];
}

export type ExperimentStatus = 'planned' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface ExperimentVariable {
  name: string;
  type: 'independent' | 'dependent' | 'control';
  description: string;
  values: string[];
}

export interface ExperimentResult {
  metric: string;
  value: number;
  unit: string;
  confidence: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LIBRARY ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export interface LibraryEngine {
  collections: Collection[];
  items: LibraryItem[];
  bookmarks: Bookmark[];
  readingList: ReadingListItem[];
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  type: CollectionType;
  
  // Items
  itemCount: number;
  items: string[];
  
  // Sharing
  visibility: 'private' | 'shared' | 'public';
  collaborators: string[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  
  // Display
  coverImage: string | null;
  color: string;
}

export type CollectionType = 'folder' | 'reading_list' | 'research' | 'course_materials' | 'favorites';

export interface LibraryItem {
  id: string;
  type: LibraryItemType;
  title: string;
  description: string;
  
  // Source
  source: ItemSource;
  url: string;
  
  // Content
  content: string | null;
  thumbnail: string | null;
  
  // Metadata
  author: string | null;
  publishedDate: string | null;
  tags: string[];
  
  // Status
  status: ItemStatus;
  
  // Engagement
  notes: Note[];
  highlights: Highlight[];
  
  // Progress
  readProgress: number;
  lastReadAt: string | null;
  
  // Organization
  collections: string[];
  
  // Timestamps
  addedAt: string;
  updatedAt: string;
}

export type LibraryItemType = 'article' | 'book' | 'paper' | 'video' | 'podcast' | 'website' | 'document';

export interface ItemSource {
  name: string;
  url: string;
  favicon: string | null;
}

export type ItemStatus = 'unread' | 'reading' | 'completed' | 'archived';

export interface Note {
  id: string;
  content: string;
  position: NotePosition | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotePosition {
  type: 'page' | 'timestamp' | 'paragraph';
  value: string;
}

export interface Highlight {
  id: string;
  text: string;
  color: string;
  note: string | null;
  position: HighlightPosition;
  createdAt: string;
}

export interface HighlightPosition {
  startOffset: number;
  endOffset: number;
  selector: string;
}

export interface Bookmark {
  id: string;
  itemId: string;
  title: string;
  url: string;
  tags: string[];
  notes: string;
  createdAt: string;
}

export interface ReadingListItem {
  id: string;
  itemId: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string | null;
  addedAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// INSTRUCTOR SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

export interface Instructor {
  id: string;
  name: string;
  email: string;
  
  // Profile
  bio: string;
  avatar: string;
  title: string;
  
  // Expertise
  expertise: string[];
  qualifications: string[];
  
  // Stats
  coursesCreated: number;
  totalStudents: number;
  averageRating: number;
  
  // Social
  website: string | null;
  linkedin: string | null;
  twitter: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENGINE STATE
// ═══════════════════════════════════════════════════════════════════════════════

export interface ScholarEngineState {
  // Knowledge Base
  knowledgeBase: KnowledgeBase | null;
  articles: KnowledgeArticle[];
  
  // Learning
  learning: LearningEngine;
  progress: LearningProgress | null;
  
  // Skills
  skills: Skill[];
  userSkills: UserSkill[];
  
  // Research
  research: ResearchEngine;
  
  // Library
  library: LibraryEngine;
  
  // UI State
  activeSection: BureauSectionId;
  selectedArticle: string | null;
  selectedCourse: string | null;
  
  // Filters
  searchQuery: string;
  filters: ScholarFilters;
  
  // Loading
  isLoading: boolean;
  error: string | null;
}

export interface ScholarFilters {
  category: string | null;
  level: CourseLevel | null;
  status: ArticleStatus | null;
  tags: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENGINE ACTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export type ScholarEngineAction =
  | { type: 'SET_KNOWLEDGE_BASE'; payload: KnowledgeBase }
  | { type: 'SET_ARTICLES'; payload: KnowledgeArticle[] }
  | { type: 'ADD_ARTICLE'; payload: KnowledgeArticle }
  | { type: 'UPDATE_ARTICLE'; payload: { id: string; data: Partial<KnowledgeArticle> } }
  | { type: 'SET_LEARNING'; payload: LearningEngine }
  | { type: 'SET_PROGRESS'; payload: LearningProgress }
  | { type: 'UPDATE_COURSE_PROGRESS'; payload: CourseProgress }
  | { type: 'SET_SKILLS'; payload: Skill[] }
  | { type: 'UPDATE_USER_SKILL'; payload: UserSkill }
  | { type: 'SET_RESEARCH'; payload: ResearchEngine }
  | { type: 'SET_LIBRARY'; payload: LibraryEngine }
  | { type: 'ADD_LIBRARY_ITEM'; payload: LibraryItem }
  | { type: 'SET_ACTIVE_SECTION'; payload: BureauSectionId }
  | { type: 'SET_SELECTED_ARTICLE'; payload: string | null }
  | { type: 'SET_SELECTED_COURSE'; payload: string | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<ScholarFilters> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT STATE
// ═══════════════════════════════════════════════════════════════════════════════

export const initialScholarEngineState: ScholarEngineState = {
  knowledgeBase: null,
  articles: [],
  learning: {
    courses: [],
    paths: [],
    progress: [],
    certifications: [],
  },
  progress: null,
  skills: [],
  userSkills: [],
  research: {
    projects: [],
    papers: [],
    datasets: [],
    experiments: [],
  },
  library: {
    collections: [],
    items: [],
    bookmarks: [],
    readingList: [],
  },
  activeSection: 'dashboard',
  selectedArticle: null,
  selectedCourse: null,
  searchQuery: '',
  filters: {
    category: null,
    level: null,
    status: null,
    tags: [],
  },
  isLoading: false,
  error: null,
};

// ═══════════════════════════════════════════════════════════════════════════════
// ENGINE REDUCER
// ═══════════════════════════════════════════════════════════════════════════════

export function scholarEngineReducer(
  state: ScholarEngineState,
  action: ScholarEngineAction
): ScholarEngineState {
  switch (action.type) {
    case 'SET_KNOWLEDGE_BASE':
      return { ...state, knowledgeBase: action.payload };
    case 'SET_ARTICLES':
      return { ...state, articles: action.payload };
    case 'ADD_ARTICLE':
      return { ...state, articles: [...state.articles, action.payload] };
    case 'UPDATE_ARTICLE':
      return {
        ...state,
        articles: state.articles.map((a) =>
          a.id === action.payload.id ? { ...a, ...action.payload.data } : a
        ),
      };
    case 'SET_LEARNING':
      return { ...state, learning: action.payload };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'SET_SKILLS':
      return { ...state, skills: action.payload };
    case 'SET_RESEARCH':
      return { ...state, research: action.payload };
    case 'SET_LIBRARY':
      return { ...state, library: action.payload };
    case 'SET_ACTIVE_SECTION':
      return { ...state, activeSection: action.payload };
    case 'SET_SELECTED_ARTICLE':
      return { ...state, selectedArticle: action.payload };
    case 'SET_SELECTED_COURSE':
      return { ...state, selectedCourse: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  SPHERE_ID,
  SPHERE_COLOR,
  SPHERE_ICON,
  SPHERE_NAME,
  SPHERE_NAME_FR,
  initialState: initialScholarEngineState,
  reducer: scholarEngineReducer,
};
