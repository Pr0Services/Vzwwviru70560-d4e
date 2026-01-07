/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — PERSONAL SPHERE ENGINE                          ║
 * ║                    Vie Personnelle et Bien-être                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Engine pour la gestion de la vie personnelle:
 * - Santé et bien-être
 * - Finances personnelles
 * - Famille et relations
 * - Objectifs et habitudes
 * - Journal personnel
 * 
 * @version 51.0
 */

import type { SphereId, BureauSectionId } from '../types/spheres.types';

export const SPHERE_ID: SphereId = 'personal';
export const SPHERE_COLOR = '#3EB4A2';
export const SPHERE_ICON = '🏠';
export const SPHERE_NAME = 'Personal';
export const SPHERE_NAME_FR = 'Personnel';

// ═══════════════════════════════════════════════════════════════════════════════
// HEALTH & WELLNESS ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export interface HealthEngine {
  profile: HealthProfile;
  metrics: HealthMetric[];
  goals: HealthGoal[];
  activities: Activity[];
  medications: Medication[];
  appointments: MedicalAppointment[];
}

export interface HealthProfile {
  id: string;
  birthDate: string;
  bloodType: string | null;
  allergies: string[];
  conditions: string[];
  emergencyContacts: EmergencyContact[];
}

export interface HealthMetric {
  id: string;
  type: MetricType;
  value: number;
  unit: string;
  recordedAt: string;
  source: 'manual' | 'device' | 'app';
  notes: string | null;
}

export type MetricType = 
  | 'weight' | 'height' | 'bmi' | 'blood_pressure' | 'heart_rate'
  | 'sleep_hours' | 'steps' | 'calories' | 'water_intake' | 'mood';

export interface HealthGoal {
  id: string;
  type: MetricType;
  target: number;
  current: number;
  deadline: string | null;
  status: 'active' | 'achieved' | 'missed';
}

export interface Activity {
  id: string;
  type: ActivityType;
  name: string;
  duration: number;
  caloriesBurned: number | null;
  date: string;
  notes: string | null;
}

export type ActivityType = 
  | 'exercise' | 'yoga' | 'meditation' | 'walking' | 'running' 
  | 'cycling' | 'swimming' | 'gym' | 'sports' | 'other';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string | null;
  reminders: MedicationReminder[];
  sideEffects: string[];
}

export interface MedicationReminder {
  time: string;
  days: number[];
  enabled: boolean;
}

export interface MedicalAppointment {
  id: string;
  type: AppointmentType;
  provider: string;
  location: string;
  date: string;
  time: string;
  notes: string;
  documents: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
}

export type AppointmentType = 
  | 'checkup' | 'specialist' | 'dental' | 'vision' | 'therapy' | 'other';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PERSONAL FINANCE ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export interface PersonalFinanceEngine {
  accounts: FinancialAccount[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: FinancialGoal[];
  bills: RecurringBill[];
  subscriptions: Subscription[];
}

export interface FinancialAccount {
  id: string;
  name: string;
  type: AccountType;
  institution: string;
  balance: number;
  currency: string;
  lastUpdated: string;
  isActive: boolean;
}

export type AccountType = 
  | 'checking' | 'savings' | 'credit_card' | 'investment' 
  | 'retirement' | 'loan' | 'cash' | 'other';

export interface Transaction {
  id: string;
  accountId: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  category: string;
  subcategory: string | null;
  description: string;
  date: string;
  tags: string[];
  isRecurring: boolean;
}

export interface Budget {
  id: string;
  name: string;
  period: 'weekly' | 'monthly' | 'yearly';
  categories: BudgetCategory[];
  startDate: string;
  endDate: string;
}

export interface BudgetCategory {
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'achieved' | 'cancelled';
  contributions: Contribution[];
}

export interface Contribution {
  amount: number;
  date: string;
  source: string;
}

export interface RecurringBill {
  id: string;
  name: string;
  amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  dueDate: number;
  category: string;
  autopay: boolean;
  status: 'active' | 'paused' | 'cancelled';
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'yearly';
  category: string;
  startDate: string;
  renewalDate: string;
  cancellationUrl: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FAMILY & RELATIONSHIPS ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export interface FamilyEngine {
  members: FamilyMember[];
  events: FamilyEvent[];
  tasks: FamilyTask[];
  documents: FamilyDocument[];
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  birthDate: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string;
  importantDates: ImportantDate[];
}

export interface ImportantDate {
  date: string;
  type: 'birthday' | 'anniversary' | 'other';
  description: string;
  reminder: boolean;
}

export interface FamilyEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'gathering' | 'celebration' | 'trip' | 'other';
  participants: string[];
  location: string | null;
  budget: number | null;
}

export interface FamilyTask {
  id: string;
  title: string;
  assignee: string;
  dueDate: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

export interface FamilyDocument {
  id: string;
  name: string;
  type: 'insurance' | 'legal' | 'medical' | 'educational' | 'other';
  fileUrl: string;
  expirationDate: string | null;
  notes: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOALS & HABITS ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export interface GoalsEngine {
  goals: PersonalGoal[];
  habits: Habit[];
  streaks: Streak[];
  reflections: Reflection[];
}

export interface PersonalGoal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  type: 'achievement' | 'habit' | 'project';
  status: 'active' | 'completed' | 'abandoned';
  deadline: string | null;
  milestones: Milestone[];
  progress: number;
  motivation: string;
  obstacles: string[];
  createdAt: string;
  completedAt: string | null;
}

export type GoalCategory = 
  | 'health' | 'career' | 'education' | 'financial' 
  | 'relationships' | 'personal_growth' | 'hobbies' | 'other';

export interface Milestone {
  id: string;
  title: string;
  dueDate: string | null;
  completed: boolean;
  completedAt: string | null;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: HabitFrequency;
  targetDays: number[];
  currentStreak: number;
  longestStreak: number;
  completions: HabitCompletion[];
  category: GoalCategory;
  reminder: HabitReminder | null;
  isActive: boolean;
}

export interface HabitFrequency {
  type: 'daily' | 'weekly' | 'specific_days';
  times: number;
  days?: number[];
}

export interface HabitCompletion {
  date: string;
  completed: boolean;
  notes: string | null;
}

export interface HabitReminder {
  time: string;
  enabled: boolean;
}

export interface Streak {
  habitId: string;
  startDate: string;
  endDate: string | null;
  length: number;
  isCurrent: boolean;
}

export interface Reflection {
  id: string;
  date: string;
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  mood: number;
  gratitude: string[];
  accomplishments: string[];
  challenges: string[];
  lessons: string[];
  goals_review: string;
  notes: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// JOURNAL ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export interface JournalEngine {
  entries: JournalEntry[];
  tags: JournalTag[];
  prompts: JournalPrompt[];
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: number | null;
  tags: string[];
  location: string | null;
  weather: string | null;
  attachments: JournalAttachment[];
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JournalAttachment {
  id: string;
  type: 'image' | 'audio' | 'document';
  url: string;
  caption: string | null;
}

export interface JournalTag {
  id: string;
  name: string;
  color: string;
  count: number;
}

export interface JournalPrompt {
  id: string;
  text: string;
  category: string;
  used: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENGINE STATE
// ═══════════════════════════════════════════════════════════════════════════════

export interface PersonalEngineState {
  health: HealthEngine;
  finance: PersonalFinanceEngine;
  family: FamilyEngine;
  goals: GoalsEngine;
  journal: JournalEngine;
  activeSection: BureauSectionId;
  isLoading: boolean;
  error: string | null;
}

export const initialPersonalEngineState: PersonalEngineState = {
  health: {
    profile: { id: '', birthDate: '', bloodType: null, allergies: [], conditions: [], emergencyContacts: [] },
    metrics: [],
    goals: [],
    activities: [],
    medications: [],
    appointments: [],
  },
  finance: {
    accounts: [],
    transactions: [],
    budgets: [],
    goals: [],
    bills: [],
    subscriptions: [],
  },
  family: {
    members: [],
    events: [],
    tasks: [],
    documents: [],
  },
  goals: {
    goals: [],
    habits: [],
    streaks: [],
    reflections: [],
  },
  journal: {
    entries: [],
    tags: [],
    prompts: [],
  },
  activeSection: 'dashboard',
  isLoading: false,
  error: null,
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  SPHERE_ID,
  SPHERE_COLOR,
  SPHERE_ICON,
  SPHERE_NAME,
  SPHERE_NAME_FR,
  initialState: initialPersonalEngineState,
};
