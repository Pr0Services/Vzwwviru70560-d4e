/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — GOVERNMENT SPHERE ENGINE                        ║
 * ║                    Institutions, Compliance & Public Services                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Engine complet pour la gestion des relations institutionnelles:
 * - Documents officiels et formulaires
 * - Conformité réglementaire
 * - Permis et licences
 * - Relations avec les autorités
 * - Subventions et aides gouvernementales
 * 
 * @author CHE·NU Team
 * @version 51.0
 * @license Proprietary - All Rights Reserved
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES CENTRAUX
// ═══════════════════════════════════════════════════════════════════════════════

import type { SphereId, BureauSectionId } from '../types/spheres.types';

export const SPHERE_ID: SphereId = 'government';
export const SPHERE_COLOR = '#8D8371';
export const SPHERE_ICON = '🏛️';
export const SPHERE_NAME = 'Government & Institutions';
export const SPHERE_NAME_FR = 'Institutions';

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT OFFICIEL SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

export interface OfficialDocument {
  id: string;
  type: DocumentType;
  title: string;
  description: string;
  
  // Source
  issuingAuthority: Authority;
  jurisdiction: Jurisdiction;
  
  // Dates
  issueDate: string;
  expirationDate: string | null;
  renewalDate: string | null;
  
  // Status
  status: DocumentStatus;
  validationStatus: ValidationStatus;
  
  // Content
  fileUrl: string;
  fileType: 'pdf' | 'image' | 'digital';
  fileSize: number;
  checksum: string;
  
  // Metadata
  referenceNumber: string;
  tags: string[];
  notes: string;
  
  // Audit
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  auditTrail: AuditEntry[];
}

export type DocumentType =
  | 'permit'
  | 'license'
  | 'certificate'
  | 'registration'
  | 'tax_document'
  | 'legal_document'
  | 'contract'
  | 'authorization'
  | 'declaration'
  | 'notification'
  | 'correspondence'
  | 'form'
  | 'receipt'
  | 'other';

export type DocumentStatus =
  | 'draft'
  | 'pending_submission'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'expired'
  | 'revoked'
  | 'archived';

export type ValidationStatus =
  | 'not_validated'
  | 'pending_validation'
  | 'validated'
  | 'validation_failed'
  | 'requires_update';

// ═══════════════════════════════════════════════════════════════════════════════
// AUTHORITY & JURISDICTION
// ═══════════════════════════════════════════════════════════════════════════════

export interface Authority {
  id: string;
  name: string;
  nameShort: string;
  type: AuthorityType;
  level: AuthorityLevel;
  
  // Contact
  website: string;
  email: string;
  phone: string;
  address: Address;
  
  // Departments
  departments: Department[];
  
  // Operating hours
  operatingHours: OperatingHours;
  
  // Services
  services: GovernmentService[];
  
  // Metadata
  countryCode: string;
  regionCode: string;
}

export type AuthorityType =
  | 'federal'
  | 'state'
  | 'provincial'
  | 'municipal'
  | 'regulatory'
  | 'judicial'
  | 'tax'
  | 'customs'
  | 'labor'
  | 'environmental'
  | 'health'
  | 'safety'
  | 'transport'
  | 'immigration'
  | 'other';

export type AuthorityLevel =
  | 'international'
  | 'national'
  | 'regional'
  | 'local';

export interface Jurisdiction {
  id: string;
  name: string;
  level: AuthorityLevel;
  parentId: string | null;
  countryCode: string;
  regionCode: string | null;
  cityCode: string | null;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  services: string[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  coordinates?: { lat: number; lng: number };
}

export interface OperatingHours {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
  holidays: Holiday[];
}

export interface TimeSlot {
  open: string;
  close: string;
}

export interface Holiday {
  date: string;
  name: string;
  closed: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPLIANCE ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export interface ComplianceEngine {
  requirements: ComplianceRequirement[];
  audits: ComplianceAudit[];
  violations: Violation[];
  remediations: Remediation[];
  certifications: Certification[];
}

export interface ComplianceRequirement {
  id: string;
  name: string;
  description: string;
  category: ComplianceCategory;
  
  // Authority
  authority: Authority;
  regulation: Regulation;
  
  // Applicability
  applicableTo: ApplicabilityRule[];
  effectiveDate: string;
  
  // Status
  status: RequirementStatus;
  complianceStatus: ComplianceStatus;
  
  // Deadlines
  deadline: string | null;
  renewalPeriod: string | null; // ISO 8601 duration
  
  // Actions required
  requiredActions: RequiredAction[];
  requiredDocuments: string[];
  
  // Penalties
  penalties: Penalty[];
  
  // Tracking
  lastReviewDate: string;
  nextReviewDate: string;
  responsiblePerson: string;
}

export type ComplianceCategory =
  | 'tax'
  | 'labor'
  | 'environmental'
  | 'health_safety'
  | 'data_privacy'
  | 'financial'
  | 'licensing'
  | 'industry_specific'
  | 'reporting'
  | 'other';

export type RequirementStatus =
  | 'active'
  | 'upcoming'
  | 'expired'
  | 'superseded'
  | 'under_review';

export type ComplianceStatus =
  | 'compliant'
  | 'non_compliant'
  | 'partially_compliant'
  | 'pending_review'
  | 'not_applicable'
  | 'exempt';

export interface Regulation {
  id: string;
  name: string;
  shortName: string;
  description: string;
  effectiveDate: string;
  authority: string;
  url: string;
  sections: RegulationSection[];
}

export interface RegulationSection {
  id: string;
  number: string;
  title: string;
  content: string;
  requirements: string[];
}

export interface ApplicabilityRule {
  type: 'industry' | 'size' | 'location' | 'activity' | 'revenue';
  condition: string;
  value: string;
}

export interface RequiredAction {
  id: string;
  description: string;
  deadline: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  assignee: string;
  completedAt: string | null;
  evidence: string[];
}

export interface Penalty {
  type: 'fine' | 'suspension' | 'revocation' | 'criminal' | 'civil';
  description: string;
  minAmount: number | null;
  maxAmount: number | null;
  currency: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPLIANCE AUDIT
// ═══════════════════════════════════════════════════════════════════════════════

export interface ComplianceAudit {
  id: string;
  type: AuditType;
  name: string;
  description: string;
  
  // Scope
  scope: AuditScope;
  requirements: string[]; // requirement IDs
  
  // Schedule
  scheduledDate: string;
  startDate: string | null;
  endDate: string | null;
  
  // Status
  status: AuditStatus;
  
  // Findings
  findings: AuditFinding[];
  overallRating: AuditRating;
  
  // Reports
  reportUrl: string | null;
  
  // Audit team
  leadAuditor: string;
  auditors: string[];
  
  // Follow-up
  followUpRequired: boolean;
  followUpDate: string | null;
}

export type AuditType =
  | 'internal'
  | 'external'
  | 'regulatory'
  | 'certification'
  | 'surprise';

export interface AuditScope {
  departments: string[];
  processes: string[];
  locations: string[];
  period: { start: string; end: string };
}

export type AuditStatus =
  | 'planned'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'postponed';

export interface AuditFinding {
  id: string;
  type: FindingType;
  severity: FindingSeverity;
  title: string;
  description: string;
  requirement: string;
  evidence: string[];
  recommendation: string;
  status: FindingStatus;
  dueDate: string | null;
  closedDate: string | null;
}

export type FindingType =
  | 'non_conformity'
  | 'observation'
  | 'opportunity_for_improvement'
  | 'positive_practice';

export type FindingSeverity = 'critical' | 'major' | 'minor' | 'observation';

export type FindingStatus = 'open' | 'in_progress' | 'closed' | 'verified';

export type AuditRating = 'excellent' | 'good' | 'satisfactory' | 'needs_improvement' | 'unsatisfactory';

// ═══════════════════════════════════════════════════════════════════════════════
// VIOLATIONS & REMEDIATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface Violation {
  id: string;
  type: ViolationType;
  severity: ViolationSeverity;
  
  // Details
  title: string;
  description: string;
  requirement: string;
  regulation: string;
  
  // Discovery
  discoveredDate: string;
  discoveredBy: string;
  discoveryMethod: 'audit' | 'self_report' | 'complaint' | 'inspection' | 'other';
  
  // Status
  status: ViolationStatus;
  
  // Impact
  financialImpact: number | null;
  operationalImpact: string;
  reputationalImpact: string;
  
  // Response
  remediation: Remediation | null;
  
  // Authority interaction
  reportedToAuthority: boolean;
  authorityResponse: string | null;
  penaltiesAssessed: Penalty[];
}

export type ViolationType =
  | 'regulatory'
  | 'contractual'
  | 'policy'
  | 'procedural';

export type ViolationSeverity = 'critical' | 'high' | 'medium' | 'low';

export type ViolationStatus =
  | 'identified'
  | 'under_investigation'
  | 'confirmed'
  | 'remediation_in_progress'
  | 'remediated'
  | 'closed'
  | 'escalated';

export interface Remediation {
  id: string;
  violationId: string;
  
  // Plan
  plan: RemediationPlan;
  
  // Status
  status: RemediationStatus;
  
  // Dates
  plannedStartDate: string;
  actualStartDate: string | null;
  plannedEndDate: string;
  actualEndDate: string | null;
  
  // Resources
  responsiblePerson: string;
  team: string[];
  budget: number | null;
  actualCost: number | null;
  
  // Verification
  verified: boolean;
  verifiedBy: string | null;
  verifiedDate: string | null;
  
  // Documentation
  evidence: string[];
  notes: string;
}

export interface RemediationPlan {
  rootCause: string;
  correctiveActions: RemediationAction[];
  preventiveActions: RemediationAction[];
  timeline: RemediationMilestone[];
}

export interface RemediationAction {
  id: string;
  description: string;
  assignee: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  completedDate: string | null;
}

export interface RemediationMilestone {
  id: string;
  name: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
}

export type RemediationStatus =
  | 'planning'
  | 'in_progress'
  | 'completed'
  | 'verified'
  | 'failed';

// ═══════════════════════════════════════════════════════════════════════════════
// PERMIT & LICENSE ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export interface PermitEngine {
  permits: Permit[];
  licenses: License[];
  applications: PermitApplication[];
  renewals: PermitRenewal[];
}

export interface Permit {
  id: string;
  type: PermitType;
  name: string;
  description: string;
  
  // Authority
  issuingAuthority: Authority;
  jurisdiction: Jurisdiction;
  
  // Details
  permitNumber: string;
  issueDate: string;
  expirationDate: string | null;
  
  // Status
  status: PermitStatus;
  
  // Conditions
  conditions: PermitCondition[];
  restrictions: string[];
  
  // Fees
  applicationFee: number;
  annualFee: number | null;
  currency: string;
  
  // Documents
  documentUrl: string;
  supportingDocuments: string[];
  
  // Compliance
  inspections: Inspection[];
  violations: string[];
  
  // Renewal
  renewalRequired: boolean;
  renewalDeadline: string | null;
  renewalStatus: RenewalStatus | null;
}

export type PermitType =
  | 'business'
  | 'construction'
  | 'environmental'
  | 'health'
  | 'safety'
  | 'zoning'
  | 'signage'
  | 'event'
  | 'import_export'
  | 'professional'
  | 'other';

export type PermitStatus =
  | 'active'
  | 'expired'
  | 'suspended'
  | 'revoked'
  | 'pending_renewal';

export interface PermitCondition {
  id: string;
  description: string;
  type: 'mandatory' | 'recommended';
  compliance: 'met' | 'not_met' | 'pending_review';
  evidence: string | null;
}

export type RenewalStatus = 'not_started' | 'in_progress' | 'submitted' | 'approved' | 'denied';

export interface License extends Permit {
  licenseCategory: string;
  professionalRequirements: string[];
  continuingEducation: ContinuingEducation | null;
}

export interface ContinuingEducation {
  requiredHours: number;
  completedHours: number;
  periodStart: string;
  periodEnd: string;
  courses: EducationCourse[];
}

export interface EducationCourse {
  id: string;
  name: string;
  provider: string;
  hours: number;
  completedDate: string;
  certificateUrl: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PERMIT APPLICATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface PermitApplication {
  id: string;
  permitType: PermitType;
  authority: Authority;
  
  // Application details
  applicationNumber: string;
  submissionDate: string;
  
  // Status tracking
  status: ApplicationStatus;
  statusHistory: StatusChange[];
  
  // Required documents
  requiredDocuments: RequiredDocument[];
  
  // Fees
  applicationFee: number;
  feePaid: boolean;
  paymentDate: string | null;
  paymentReference: string | null;
  
  // Processing
  assignedReviewer: string | null;
  estimatedProcessingTime: number; // days
  actualProcessingTime: number | null;
  
  // Decision
  decision: ApplicationDecision | null;
  decisionDate: string | null;
  decisionNotes: string | null;
  
  // Appeal
  appealable: boolean;
  appealDeadline: string | null;
  appealStatus: AppealStatus | null;
}

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'additional_info_required'
  | 'pending_inspection'
  | 'pending_decision'
  | 'approved'
  | 'denied'
  | 'withdrawn';

export interface StatusChange {
  fromStatus: ApplicationStatus;
  toStatus: ApplicationStatus;
  date: string;
  reason: string;
  changedBy: string;
}

export interface RequiredDocument {
  id: string;
  name: string;
  description: string;
  required: boolean;
  status: 'not_submitted' | 'submitted' | 'approved' | 'rejected';
  fileUrl: string | null;
  rejectionReason: string | null;
}

export type ApplicationDecision = 'approved' | 'approved_with_conditions' | 'denied';

export type AppealStatus = 'not_filed' | 'filed' | 'under_review' | 'upheld' | 'overturned';

// ═══════════════════════════════════════════════════════════════════════════════
// INSPECTION ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export interface Inspection {
  id: string;
  type: InspectionType;
  permitId: string | null;
  authority: Authority;
  
  // Schedule
  scheduledDate: string;
  actualDate: string | null;
  duration: number | null; // minutes
  
  // Inspector
  inspector: Inspector;
  
  // Location
  location: Address;
  areas: string[];
  
  // Status
  status: InspectionStatus;
  
  // Results
  result: InspectionResult | null;
  findings: InspectionFinding[];
  overallScore: number | null; // 0-100
  
  // Documentation
  reportUrl: string | null;
  photos: string[];
  notes: string;
  
  // Follow-up
  followUpRequired: boolean;
  followUpDate: string | null;
  correctiveActions: string[];
}

export type InspectionType =
  | 'routine'
  | 'follow_up'
  | 'complaint'
  | 'pre_opening'
  | 'annual'
  | 'surprise';

export type InspectionStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rescheduled';

export type InspectionResult = 'pass' | 'pass_with_conditions' | 'fail' | 'inconclusive';

export interface Inspector {
  id: string;
  name: string;
  title: string;
  authority: string;
  badgeNumber: string;
  contactEmail: string;
  contactPhone: string;
}

export interface InspectionFinding {
  id: string;
  category: string;
  item: string;
  status: 'compliant' | 'non_compliant' | 'not_applicable';
  severity: FindingSeverity;
  description: string;
  correctionRequired: boolean;
  correctionDeadline: string | null;
  correctionStatus: 'pending' | 'completed' | 'verified';
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNMENT SERVICES ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export interface GovernmentService {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  authority: Authority;
  
  // Access
  accessMethod: AccessMethod[];
  url: string | null;
  
  // Requirements
  eligibility: EligibilityRequirement[];
  requiredDocuments: string[];
  
  // Fees
  fees: ServiceFee[];
  
  // Processing
  processingTime: string;
  
  // Support
  contactInfo: ContactInfo;
  faq: FAQ[];
}

export type ServiceCategory =
  | 'registration'
  | 'licensing'
  | 'permits'
  | 'benefits'
  | 'tax'
  | 'records'
  | 'complaints'
  | 'information'
  | 'other';

export type AccessMethod = 'online' | 'in_person' | 'mail' | 'phone' | 'email';

export interface EligibilityRequirement {
  id: string;
  description: string;
  mandatory: boolean;
}

export interface ServiceFee {
  name: string;
  amount: number;
  currency: string;
  frequency: 'one_time' | 'annual' | 'monthly' | 'per_transaction';
}

export interface ContactInfo {
  email: string;
  phone: string;
  fax: string | null;
  address: Address | null;
  hours: string;
}

export interface FAQ {
  question: string;
  answer: string;
  category: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GRANTS & SUBSIDIES ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export interface GrantEngine {
  grants: Grant[];
  applications: GrantApplication[];
  awards: GrantAward[];
}

export interface Grant {
  id: string;
  name: string;
  description: string;
  category: GrantCategory;
  
  // Provider
  provider: Authority;
  program: string;
  
  // Funding
  totalBudget: number;
  minAmount: number;
  maxAmount: number;
  currency: string;
  
  // Timeline
  applicationDeadline: string;
  decisionDate: string;
  fundingPeriod: { start: string; end: string };
  
  // Eligibility
  eligibility: EligibilityRequirement[];
  
  // Application
  applicationUrl: string;
  requiredDocuments: string[];
  
  // Status
  status: GrantStatus;
  
  // Statistics
  applicationsReceived: number | null;
  awardsGiven: number | null;
  successRate: number | null;
}

export type GrantCategory =
  | 'research'
  | 'innovation'
  | 'small_business'
  | 'export'
  | 'training'
  | 'environmental'
  | 'cultural'
  | 'social'
  | 'infrastructure'
  | 'other';

export type GrantStatus = 'open' | 'closed' | 'upcoming' | 'awarded';

export interface GrantApplication {
  id: string;
  grantId: string;
  
  // Application
  submissionDate: string;
  projectTitle: string;
  projectDescription: string;
  requestedAmount: number;
  
  // Status
  status: GrantApplicationStatus;
  
  // Documents
  proposal: string;
  budget: string;
  supportingDocs: string[];
  
  // Review
  score: number | null;
  reviewNotes: string | null;
  
  // Decision
  decision: 'pending' | 'approved' | 'rejected' | 'waitlisted';
  awardedAmount: number | null;
}

export type GrantApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'shortlisted'
  | 'approved'
  | 'rejected'
  | 'withdrawn';

export interface GrantAward {
  id: string;
  grantId: string;
  applicationId: string;
  
  // Award details
  awardedAmount: number;
  awardDate: string;
  
  // Terms
  terms: string;
  conditions: string[];
  reportingRequirements: ReportingRequirement[];
  
  // Disbursement
  disbursementSchedule: Disbursement[];
  totalDisbursed: number;
  
  // Status
  status: AwardStatus;
  
  // Compliance
  reports: GrantReport[];
  audits: string[];
}

export type AwardStatus = 'active' | 'completed' | 'suspended' | 'terminated';

export interface ReportingRequirement {
  type: 'progress' | 'financial' | 'final';
  frequency: string;
  dueDate: string;
  submitted: boolean;
}

export interface Disbursement {
  id: string;
  amount: number;
  scheduledDate: string;
  actualDate: string | null;
  status: 'scheduled' | 'processed' | 'delayed' | 'cancelled';
}

export interface GrantReport {
  id: string;
  type: 'progress' | 'financial' | 'final';
  period: { start: string; end: string };
  submissionDate: string;
  status: 'submitted' | 'approved' | 'revision_required';
  documentUrl: string;
  feedback: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CERTIFICATION ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export interface Certification {
  id: string;
  type: CertificationType;
  name: string;
  description: string;
  
  // Issuer
  issuer: Authority | string;
  standard: string;
  
  // Validity
  issueDate: string;
  expirationDate: string;
  
  // Status
  status: CertificationStatus;
  
  // Scope
  scope: string[];
  
  // Documentation
  certificateUrl: string;
  auditReports: string[];
  
  // Maintenance
  surveillanceSchedule: SurveillanceAudit[];
  recertificationDate: string;
}

export type CertificationType =
  | 'quality' // ISO 9001
  | 'environmental' // ISO 14001
  | 'safety' // ISO 45001
  | 'information_security' // ISO 27001
  | 'industry_specific'
  | 'professional'
  | 'product'
  | 'other';

export type CertificationStatus = 'active' | 'suspended' | 'expired' | 'withdrawn';

export interface SurveillanceAudit {
  id: string;
  scheduledDate: string;
  status: 'scheduled' | 'completed' | 'postponed';
  result: AuditRating | null;
  findings: AuditFinding[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUDIT TRAIL
// ═══════════════════════════════════════════════════════════════════════════════

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  userId: string;
  userName: string;
  details: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  previousValue: unknown;
  newValue: unknown;
}

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'view'
  | 'export'
  | 'submit'
  | 'approve'
  | 'reject'
  | 'archive';

// ═══════════════════════════════════════════════════════════════════════════════
// ENGINE STATE
// ═══════════════════════════════════════════════════════════════════════════════

export interface GovernmentEngineState {
  // Documents
  documents: OfficialDocument[];
  documentFilters: DocumentFilters;
  
  // Authorities
  authorities: Authority[];
  
  // Compliance
  compliance: ComplianceEngine;
  
  // Permits
  permits: PermitEngine;
  
  // Services
  services: GovernmentService[];
  
  // Grants
  grants: GrantEngine;
  
  // Certifications
  certifications: Certification[];
  
  // UI State
  activeSection: BureauSectionId;
  selectedDocument: string | null;
  selectedPermit: string | null;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

export interface DocumentFilters {
  type: DocumentType | null;
  status: DocumentStatus | null;
  authority: string | null;
  dateRange: { start: string; end: string } | null;
  searchQuery: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENGINE ACTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export type GovernmentEngineAction =
  | { type: 'SET_DOCUMENTS'; payload: OfficialDocument[] }
  | { type: 'ADD_DOCUMENT'; payload: OfficialDocument }
  | { type: 'UPDATE_DOCUMENT'; payload: { id: string; data: Partial<OfficialDocument> } }
  | { type: 'DELETE_DOCUMENT'; payload: string }
  | { type: 'SET_DOCUMENT_FILTERS'; payload: Partial<DocumentFilters> }
  | { type: 'SET_AUTHORITIES'; payload: Authority[] }
  | { type: 'SET_COMPLIANCE'; payload: ComplianceEngine }
  | { type: 'ADD_REQUIREMENT'; payload: ComplianceRequirement }
  | { type: 'UPDATE_COMPLIANCE_STATUS'; payload: { id: string; status: ComplianceStatus } }
  | { type: 'SET_PERMITS'; payload: PermitEngine }
  | { type: 'ADD_PERMIT'; payload: Permit }
  | { type: 'UPDATE_PERMIT'; payload: { id: string; data: Partial<Permit> } }
  | { type: 'SUBMIT_APPLICATION'; payload: PermitApplication }
  | { type: 'SET_SERVICES'; payload: GovernmentService[] }
  | { type: 'SET_GRANTS'; payload: GrantEngine }
  | { type: 'APPLY_FOR_GRANT'; payload: GrantApplication }
  | { type: 'SET_CERTIFICATIONS'; payload: Certification[] }
  | { type: 'SET_ACTIVE_SECTION'; payload: BureauSectionId }
  | { type: 'SET_SELECTED_DOCUMENT'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT STATE
// ═══════════════════════════════════════════════════════════════════════════════

export const initialGovernmentEngineState: GovernmentEngineState = {
  documents: [],
  documentFilters: {
    type: null,
    status: null,
    authority: null,
    dateRange: null,
    searchQuery: '',
  },
  authorities: [],
  compliance: {
    requirements: [],
    audits: [],
    violations: [],
    remediations: [],
    certifications: [],
  },
  permits: {
    permits: [],
    licenses: [],
    applications: [],
    renewals: [],
  },
  services: [],
  grants: {
    grants: [],
    applications: [],
    awards: [],
  },
  certifications: [],
  activeSection: 'dashboard',
  selectedDocument: null,
  selectedPermit: null,
  isLoading: false,
  error: null,
};

// ═══════════════════════════════════════════════════════════════════════════════
// ENGINE REDUCER
// ═══════════════════════════════════════════════════════════════════════════════

export function governmentEngineReducer(
  state: GovernmentEngineState,
  action: GovernmentEngineAction
): GovernmentEngineState {
  switch (action.type) {
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload };
    case 'ADD_DOCUMENT':
      return { ...state, documents: [...state.documents, action.payload] };
    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map((doc) =>
          doc.id === action.payload.id ? { ...doc, ...action.payload.data } : doc
        ),
      };
    case 'DELETE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter((doc) => doc.id !== action.payload),
      };
    case 'SET_DOCUMENT_FILTERS':
      return {
        ...state,
        documentFilters: { ...state.documentFilters, ...action.payload },
      };
    case 'SET_AUTHORITIES':
      return { ...state, authorities: action.payload };
    case 'SET_COMPLIANCE':
      return { ...state, compliance: action.payload };
    case 'SET_PERMITS':
      return { ...state, permits: action.payload };
    case 'SET_SERVICES':
      return { ...state, services: action.payload };
    case 'SET_GRANTS':
      return { ...state, grants: action.payload };
    case 'SET_CERTIFICATIONS':
      return { ...state, certifications: action.payload };
    case 'SET_ACTIVE_SECTION':
      return { ...state, activeSection: action.payload };
    case 'SET_SELECTED_DOCUMENT':
      return { ...state, selectedDocument: action.payload };
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
  initialState: initialGovernmentEngineState,
  reducer: governmentEngineReducer,
};
