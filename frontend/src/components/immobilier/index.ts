/**
 * CHE·NU™ Immobilier Module
 * Complete property management for Personal & Enterprise contexts
 * 
 * @module immobilier
 * @version 33.0
 */

// Main Components
export { default as ImmobilierDashboard } from './Dashboard';
export { default as PropertyDetails } from './PropertyDetails';

// Types
export interface Property {
  id: string;
  name: string;
  address: string;
  type: 'residential' | 'commercial' | 'industrial' | 'land' | 'mixed';
  status: 'owned' | 'rented' | 'for_sale' | 'for_rent' | 'under_construction';
  value: number;
  units?: number;
  occupancyRate?: number;
  monthlyRevenue?: number;
  lastInspection?: string;
  nextMaintenance?: string;
  imageUrl?: string;
}

export interface Tenant {
  id: string;
  name: string;
  unit: string;
  email: string;
  phone: string;
  leaseStart: string;
  leaseEnd: string;
  rentAmount: number;
  paymentStatus: 'current' | 'late' | 'overdue';
}

export interface MaintenanceTask {
  id: string;
  title: string;
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  assignedTo?: string;
  cost?: number;
}

export interface PropertyDocument {
  id: string;
  name: string;
  type: 'deed' | 'insurance' | 'tax' | 'mortgage' | 'lease' | 'inspection' | 'other';
  uploadedAt: string;
  expiresAt?: string;
  url?: string;
}

export interface PropertyFinance {
  purchasePrice: number;
  currentValue: number;
  mortgageBalance?: number;
  monthlyPayment?: number;
  annualTaxes: number;
  annualInsurance: number;
  monthlyRevenue?: number;
  monthlyExpenses: number;
  roi?: number;
}

// Constants
export const PROPERTY_TYPES = {
  residential: { label: 'Résidentiel', icon: '🏠' },
  commercial: { label: 'Commercial', icon: '🏢' },
  industrial: { label: 'Industriel', icon: '🏭' },
  land: { label: 'Terrain', icon: '🌳' },
  mixed: { label: 'Mixte', icon: '🏗️' },
} as const;

export const PROPERTY_STATUSES = {
  owned: { label: 'Propriété', color: 'emerald' },
  rented: { label: 'Loué', color: 'blue' },
  for_sale: { label: 'À vendre', color: 'amber' },
  for_rent: { label: 'À louer', color: 'purple' },
  under_construction: { label: 'En construction', color: 'orange' },
} as const;

export const PAYMENT_STATUSES = {
  current: { label: 'À jour', color: 'emerald' },
  late: { label: 'En retard', color: 'amber' },
  overdue: { label: 'Impayé', color: 'red' },
} as const;

export const MAINTENANCE_PRIORITIES = {
  low: { label: 'Basse', color: 'slate' },
  medium: { label: 'Moyenne', color: 'blue' },
  high: { label: 'Haute', color: 'orange' },
  urgent: { label: 'Urgente', color: 'red' },
} as const;
