/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — BUSINESS SPHERE ENGINE                          ║
 * ║                    Opérations et Gestion d'Entreprise                        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Engine pour la gestion complète des activités business:
 * - Gestion de projets et clients
 * - Facturation et devis
 * - Contrats et documents
 * - CRM et relations clients
 * - Ressources et équipes
 * - Tableau de bord financier
 * 
 * @version 51.0
 */

import type { SphereId, BureauSectionId } from '../types/spheres.types';

export const SPHERE_ID: SphereId = 'business';
export const SPHERE_COLOR = '#D8B26A';
export const SPHERE_ICON = '💼';
export const SPHERE_NAME = 'Business';
export const SPHERE_NAME_FR = 'Business';

// ═══════════════════════════════════════════════════════════════════════════════
// CLIENT MANAGEMENT ENGINE (CRM)
// ═══════════════════════════════════════════════════════════════════════════════

export interface CRMEngine {
  clients: Client[];
  contacts: Contact[];
  leads: Lead[];
  opportunities: Opportunity[];
  activities: ClientActivity[];
  segments: ClientSegment[];
}

export interface Client {
  id: string;
  type: 'individual' | 'company';
  name: string;
  displayName: string;
  
  // Company details
  companyName: string | null;
  industry: string | null;
  size: CompanySize | null;
  website: string | null;
  
  // Contact info
  email: string;
  phone: string | null;
  address: Address | null;
  
  // Billing
  billingAddress: Address | null;
  taxId: string | null;
  paymentTerms: number;
  currency: string;
  
  // Status
  status: ClientStatus;
  healthScore: number;
  lifetimeValue: number;
  
  // Relations
  contacts: string[];
  projects: string[];
  invoices: string[];
  contracts: string[];
  
  // Metadata
  tags: string[];
  customFields: Record<string, unknown>;
  notes: string;
  
  // Dates
  createdAt: string;
  updatedAt: string;
  lastContactAt: string | null;
}

export type CompanySize = 'micro' | 'small' | 'medium' | 'large' | 'enterprise';

export type ClientStatus = 'prospect' | 'active' | 'inactive' | 'churned' | 'blocked';

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Contact {
  id: string;
  clientId: string;
  
  // Personal
  firstName: string;
  lastName: string;
  title: string | null;
  department: string | null;
  
  // Contact info
  email: string;
  phone: string | null;
  mobile: string | null;
  
  // Role
  isPrimary: boolean;
  role: ContactRole;
  
  // Social
  linkedin: string | null;
  twitter: string | null;
  
  // Preferences
  preferredContact: 'email' | 'phone' | 'mobile';
  timezone: string | null;
  language: string;
  
  // Notes
  notes: string;
  
  createdAt: string;
  updatedAt: string;
}

export type ContactRole = 'decision_maker' | 'influencer' | 'user' | 'technical' | 'billing' | 'other';

export interface Lead {
  id: string;
  source: LeadSource;
  status: LeadStatus;
  
  // Contact info
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  
  // Qualification
  score: number;
  budget: number | null;
  timeline: string | null;
  needs: string[];
  
  // Assignment
  assignedTo: string | null;
  
  // Tracking
  activities: string[];
  notes: string;
  
  // Conversion
  convertedToClientId: string | null;
  convertedAt: string | null;
  
  createdAt: string;
  updatedAt: string;
}

export type LeadSource = 
  | 'website' | 'referral' | 'social_media' | 'advertising' 
  | 'cold_call' | 'event' | 'partner' | 'other';

export type LeadStatus = 
  | 'new' | 'contacted' | 'qualified' | 'proposal' 
  | 'negotiation' | 'won' | 'lost' | 'nurturing';

export interface Opportunity {
  id: string;
  clientId: string;
  name: string;
  description: string;
  
  // Value
  value: number;
  currency: string;
  probability: number;
  expectedCloseDate: string;
  
  // Stage
  stage: OpportunityStage;
  stageHistory: StageChange[];
  
  // Assignment
  owner: string;
  team: string[];
  
  // Related
  contacts: string[];
  products: OpportunityProduct[];
  competitors: string[];
  
  // Notes
  notes: string;
  nextStep: string;
  
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
}

export type OpportunityStage = 
  | 'prospecting' | 'qualification' | 'needs_analysis' 
  | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

export interface StageChange {
  fromStage: OpportunityStage;
  toStage: OpportunityStage;
  date: string;
  reason: string;
}

export interface OpportunityProduct {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

export interface ClientActivity {
  id: string;
  clientId: string;
  type: ActivityType;
  subject: string;
  description: string;
  date: string;
  duration: number | null;
  outcome: string | null;
  participants: string[];
  relatedTo: { type: string; id: string } | null;
  createdBy: string;
  createdAt: string;
}

export type ActivityType = 
  | 'call' | 'email' | 'meeting' | 'task' | 'note' | 'demo' | 'follow_up';

export interface ClientSegment {
  id: string;
  name: string;
  description: string;
  criteria: SegmentCriteria[];
  clientCount: number;
  createdAt: string;
}

export interface SegmentCriteria {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in';
  value: unknown;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT MANAGEMENT ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export interface ProjectEngine {
  projects: Project[];
  tasks: ProjectTask[];
  milestones: ProjectMilestone[];
  timeEntries: TimeEntry[];
  resources: ProjectResource[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  clientId: string | null;
  
  // Type & Status
  type: ProjectType;
  status: ProjectStatus;
  priority: Priority;
  
  // Dates
  startDate: string;
  endDate: string | null;
  deadline: string | null;
  
  // Budget
  budget: number | null;
  spent: number;
  currency: string;
  billingType: BillingType;
  hourlyRate: number | null;
  
  // Progress
  progress: number;
  completedTasks: number;
  totalTasks: number;
  
  // Team
  manager: string;
  team: ProjectMember[];
  
  // Structure
  milestones: string[];
  phases: ProjectPhase[];
  
  // Documents
  documents: string[];
  
  // Metadata
  tags: string[];
  customFields: Record<string, unknown>;
  
  createdAt: string;
  updatedAt: string;
}

export type ProjectType = 
  | 'client' | 'internal' | 'maintenance' | 'research' | 'other';

export type ProjectStatus = 
  | 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export type BillingType = 'fixed' | 'hourly' | 'retainer' | 'milestone' | 'non_billable';

export interface ProjectMember {
  userId: string;
  role: string;
  allocation: number;
  startDate: string;
  endDate: string | null;
}

export interface ProjectPhase {
  id: string;
  name: string;
  description: string;
  order: number;
  startDate: string;
  endDate: string | null;
  status: 'pending' | 'active' | 'completed';
}

export interface ProjectTask {
  id: string;
  projectId: string;
  parentId: string | null;
  
  // Content
  title: string;
  description: string;
  
  // Assignment
  assignee: string | null;
  collaborators: string[];
  
  // Status
  status: TaskStatus;
  priority: Priority;
  
  // Dates
  startDate: string | null;
  dueDate: string | null;
  completedAt: string | null;
  
  // Effort
  estimatedHours: number | null;
  actualHours: number;
  
  // Billing
  billable: boolean;
  billedAmount: number;
  
  // Dependencies
  dependencies: TaskDependency[];
  blockedBy: string[];
  
  // Subtasks
  subtasks: string[];
  completedSubtasks: number;
  
  // Metadata
  tags: string[];
  attachments: string[];
  comments: TaskComment[];
  
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 
  | 'backlog' | 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled';

export interface TaskDependency {
  taskId: string;
  type: 'finish_to_start' | 'start_to_start' | 'finish_to_finish' | 'start_to_finish';
}

export interface TaskComment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface ProjectMilestone {
  id: string;
  projectId: string;
  name: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'achieved' | 'missed';
  deliverables: string[];
  payment: number | null;
  completedAt: string | null;
}

export interface TimeEntry {
  id: string;
  projectId: string;
  taskId: string | null;
  userId: string;
  
  // Time
  date: string;
  startTime: string;
  endTime: string | null;
  duration: number;
  
  // Description
  description: string;
  
  // Billing
  billable: boolean;
  hourlyRate: number | null;
  amount: number;
  invoiced: boolean;
  invoiceId: string | null;
  
  createdAt: string;
  updatedAt: string;
}

export interface ProjectResource {
  id: string;
  projectId: string;
  type: 'human' | 'equipment' | 'material' | 'software';
  name: string;
  cost: number;
  unit: string;
  quantity: number;
  allocation: ResourceAllocation[];
}

export interface ResourceAllocation {
  startDate: string;
  endDate: string;
  percentage: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// INVOICING ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export interface InvoicingEngine {
  invoices: Invoice[];
  quotes: Quote[];
  payments: Payment[];
  products: Product[];
  taxRates: TaxRate[];
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  projectId: string | null;
  
  // Status
  status: InvoiceStatus;
  
  // Dates
  issueDate: string;
  dueDate: string;
  paidAt: string | null;
  
  // Items
  items: InvoiceItem[];
  
  // Amounts
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  currency: string;
  
  // Tax
  taxRate: number;
  taxId: string | null;
  
  // Discount
  discountType: 'percentage' | 'fixed' | null;
  discountValue: number | null;
  
  // Payment
  paymentTerms: string;
  paymentInstructions: string | null;
  
  // Notes
  notes: string | null;
  terms: string | null;
  
  // PDF
  pdfUrl: string | null;
  
  // Reminders
  reminders: InvoiceReminder[];
  
  createdAt: string;
  updatedAt: string;
  sentAt: string | null;
}

export type InvoiceStatus = 
  | 'draft' | 'sent' | 'viewed' | 'partial' | 'paid' | 'overdue' | 'cancelled' | 'refunded';

export interface InvoiceItem {
  id: string;
  type: 'product' | 'service' | 'time' | 'expense' | 'custom';
  productId: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
  timeEntryIds: string[];
}

export interface InvoiceReminder {
  id: string;
  type: 'before_due' | 'on_due' | 'after_due';
  daysDelta: number;
  sentAt: string | null;
  template: string;
}

export interface Quote {
  id: string;
  number: string;
  clientId: string;
  opportunityId: string | null;
  
  // Status
  status: QuoteStatus;
  
  // Dates
  issueDate: string;
  validUntil: string;
  acceptedAt: string | null;
  
  // Items
  items: InvoiceItem[];
  
  // Amounts
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
  
  // Versions
  version: number;
  previousVersions: string[];
  
  // Notes
  notes: string | null;
  terms: string | null;
  
  // PDF
  pdfUrl: string | null;
  
  // Conversion
  convertedToInvoiceId: string | null;
  
  createdAt: string;
  updatedAt: string;
  sentAt: string | null;
}

export type QuoteStatus = 
  | 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired' | 'revised';

export interface Payment {
  id: string;
  invoiceId: string;
  clientId: string;
  
  // Amount
  amount: number;
  currency: string;
  
  // Method
  method: PaymentMethod;
  reference: string | null;
  
  // Status
  status: PaymentStatus;
  
  // Dates
  date: string;
  processedAt: string | null;
  
  // Notes
  notes: string | null;
  
  createdAt: string;
}

export type PaymentMethod = 
  | 'cash' | 'check' | 'bank_transfer' | 'credit_card' 
  | 'paypal' | 'stripe' | 'other';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string | null;
  type: 'product' | 'service';
  price: number;
  currency: string;
  unit: string;
  taxRate: number;
  isActive: boolean;
  category: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  region: string;
  isDefault: boolean;
  isActive: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTRACT ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export interface ContractEngine {
  contracts: Contract[];
  templates: ContractTemplate[];
  amendments: ContractAmendment[];
}

export interface Contract {
  id: string;
  number: string;
  title: string;
  type: ContractType;
  clientId: string;
  projectId: string | null;
  
  // Parties
  parties: ContractParty[];
  
  // Dates
  startDate: string;
  endDate: string | null;
  signedAt: string | null;
  
  // Status
  status: ContractStatus;
  
  // Value
  value: number | null;
  currency: string;
  paymentSchedule: PaymentSchedule[];
  
  // Terms
  terms: ContractTerms;
  
  // Documents
  documentUrl: string;
  attachments: string[];
  
  // Signatures
  signatures: ContractSignature[];
  
  // Amendments
  amendments: string[];
  
  // Renewal
  autoRenew: boolean;
  renewalTerms: string | null;
  renewalNotice: number | null;
  
  // Notes
  notes: string;
  
  createdAt: string;
  updatedAt: string;
}

export type ContractType = 
  | 'service' | 'employment' | 'nda' | 'partnership' 
  | 'license' | 'lease' | 'purchase' | 'other';

export type ContractStatus = 
  | 'draft' | 'pending_signature' | 'active' | 'expired' 
  | 'terminated' | 'renewed' | 'suspended';

export interface ContractParty {
  type: 'company' | 'individual';
  name: string;
  role: string;
  email: string;
  address: Address | null;
}

export interface PaymentSchedule {
  amount: number;
  dueDate: string;
  description: string;
  status: 'pending' | 'invoiced' | 'paid';
  invoiceId: string | null;
}

export interface ContractTerms {
  paymentTerms: string;
  deliverables: string[];
  warranties: string[];
  liabilities: string[];
  termination: string;
  jurisdiction: string;
  disputeResolution: string;
}

export interface ContractSignature {
  partyName: string;
  email: string;
  signedAt: string | null;
  ipAddress: string | null;
  signatureUrl: string | null;
}

export interface ContractAmendment {
  id: string;
  contractId: string;
  number: string;
  title: string;
  description: string;
  effectiveDate: string;
  signedAt: string | null;
  documentUrl: string;
  createdAt: string;
}

export interface ContractTemplate {
  id: string;
  name: string;
  type: ContractType;
  description: string;
  content: string;
  variables: TemplateVariable[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateVariable {
  name: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'list';
  label: string;
  required: boolean;
  defaultValue: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FINANCIAL DASHBOARD ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export interface FinancialDashboard {
  summary: FinancialSummary;
  cashFlow: CashFlowEntry[];
  expenses: Expense[];
  reports: FinancialReport[];
}

export interface FinancialSummary {
  period: { start: string; end: string };
  revenue: number;
  expenses: number;
  profit: number;
  profitMargin: number;
  invoicedAmount: number;
  receivedAmount: number;
  outstandingAmount: number;
  overdueAmount: number;
  currency: string;
}

export interface CashFlowEntry {
  date: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  balance: number;
  description: string;
  referenceType: 'invoice' | 'expense' | 'payment' | 'other';
  referenceId: string | null;
}

export interface Expense {
  id: string;
  category: string;
  vendor: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  projectId: string | null;
  clientId: string | null;
  billable: boolean;
  billed: boolean;
  invoiceId: string | null;
  receiptUrl: string | null;
  paymentMethod: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  approvedBy: string | null;
  createdAt: string;
}

export interface FinancialReport {
  id: string;
  type: ReportType;
  name: string;
  period: { start: string; end: string };
  generatedAt: string;
  data: Record<string, unknown>;
  pdfUrl: string | null;
}

export type ReportType = 
  | 'profit_loss' | 'balance_sheet' | 'cash_flow' 
  | 'aging' | 'revenue_by_client' | 'revenue_by_project';

// ═══════════════════════════════════════════════════════════════════════════════
// ENGINE STATE
// ═══════════════════════════════════════════════════════════════════════════════

export interface BusinessEngineState {
  crm: CRMEngine;
  projects: ProjectEngine;
  invoicing: InvoicingEngine;
  contracts: ContractEngine;
  financial: FinancialDashboard;
  activeSection: BureauSectionId;
  selectedClient: string | null;
  selectedProject: string | null;
  filters: BusinessFilters;
  isLoading: boolean;
  error: string | null;
}

export interface BusinessFilters {
  clientStatus: ClientStatus | null;
  projectStatus: ProjectStatus | null;
  invoiceStatus: InvoiceStatus | null;
  dateRange: { start: string; end: string } | null;
  searchQuery: string;
}

export const initialBusinessEngineState: BusinessEngineState = {
  crm: {
    clients: [],
    contacts: [],
    leads: [],
    opportunities: [],
    activities: [],
    segments: [],
  },
  projects: {
    projects: [],
    tasks: [],
    milestones: [],
    timeEntries: [],
    resources: [],
  },
  invoicing: {
    invoices: [],
    quotes: [],
    payments: [],
    products: [],
    taxRates: [],
  },
  contracts: {
    contracts: [],
    templates: [],
    amendments: [],
  },
  financial: {
    summary: {
      period: { start: '', end: '' },
      revenue: 0,
      expenses: 0,
      profit: 0,
      profitMargin: 0,
      invoicedAmount: 0,
      receivedAmount: 0,
      outstandingAmount: 0,
      overdueAmount: 0,
      currency: 'CAD',
    },
    cashFlow: [],
    expenses: [],
    reports: [],
  },
  activeSection: 'dashboard',
  selectedClient: null,
  selectedProject: null,
  filters: {
    clientStatus: null,
    projectStatus: null,
    invoiceStatus: null,
    dateRange: null,
    searchQuery: '',
  },
  isLoading: false,
  error: null,
};

// ═══════════════════════════════════════════════════════════════════════════════
// ENGINE ACTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export type BusinessEngineAction =
  | { type: 'SET_CRM'; payload: CRMEngine }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: { id: string; data: Partial<Client> } }
  | { type: 'SET_PROJECTS'; payload: ProjectEngine }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; data: Partial<Project> } }
  | { type: 'SET_INVOICING'; payload: InvoicingEngine }
  | { type: 'ADD_INVOICE'; payload: Invoice }
  | { type: 'UPDATE_INVOICE_STATUS'; payload: { id: string; status: InvoiceStatus } }
  | { type: 'SET_CONTRACTS'; payload: ContractEngine }
  | { type: 'SET_FINANCIAL'; payload: FinancialDashboard }
  | { type: 'SET_ACTIVE_SECTION'; payload: BureauSectionId }
  | { type: 'SET_SELECTED_CLIENT'; payload: string | null }
  | { type: 'SET_SELECTED_PROJECT'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: Partial<BusinessFilters> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// ═══════════════════════════════════════════════════════════════════════════════
// ENGINE REDUCER
// ═══════════════════════════════════════════════════════════════════════════════

export function businessEngineReducer(
  state: BusinessEngineState,
  action: BusinessEngineAction
): BusinessEngineState {
  switch (action.type) {
    case 'SET_CRM':
      return { ...state, crm: action.payload };
    case 'ADD_CLIENT':
      return { ...state, crm: { ...state.crm, clients: [...state.crm.clients, action.payload] } };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'ADD_PROJECT':
      return { ...state, projects: { ...state.projects, projects: [...state.projects.projects, action.payload] } };
    case 'SET_INVOICING':
      return { ...state, invoicing: action.payload };
    case 'SET_CONTRACTS':
      return { ...state, contracts: action.payload };
    case 'SET_FINANCIAL':
      return { ...state, financial: action.payload };
    case 'SET_ACTIVE_SECTION':
      return { ...state, activeSection: action.payload };
    case 'SET_SELECTED_CLIENT':
      return { ...state, selectedClient: action.payload };
    case 'SET_SELECTED_PROJECT':
      return { ...state, selectedProject: action.payload };
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
  initialState: initialBusinessEngineState,
  reducer: businessEngineReducer,
};
