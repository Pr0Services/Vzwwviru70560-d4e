/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V55 — IMMOBILIER ENGINE STORE                     ║
 * ║                    Real Estate Property Management                            ║
 * ║                    Task C5: Nouveaux Engines                                  ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * IMMOBILIER ENGINE FEATURES:
 * - Property management
 * - Tenant tracking
 * - Rental agreements
 * - Maintenance requests
 * - Financial tracking
 * - 3D property viewer
 */

import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type PropertyType = 'apartment' | 'house' | 'commercial' | 'land' | 'parking' | 'storage'
export type PropertyStatus = 'available' | 'rented' | 'for_sale' | 'maintenance' | 'inactive'
export type TenantStatus = 'active' | 'pending' | 'former' | 'applicant'
export type LeaseStatus = 'draft' | 'active' | 'expired' | 'terminated' | 'renewed'
export type MaintenanceStatus = 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'emergency'
export type TransactionType = 'rent' | 'deposit' | 'expense' | 'maintenance' | 'tax' | 'other'

export interface Property {
  id: string
  identity_id: string
  name: string
  type: PropertyType
  status: PropertyStatus
  address: PropertyAddress
  details: PropertyDetails
  images: string[]
  documents: PropertyDocument[]
  current_tenant_id?: string
  monthly_rent?: number
  deposit_amount?: number
  purchase_price?: number
  market_value?: number
  created_at: string
  updated_at: string
}

export interface PropertyAddress {
  street: string
  city: string
  postal_code: string
  country: string
  coordinates?: { lat: number; lng: number }
}

export interface PropertyDetails {
  surface_m2: number
  rooms: number
  bedrooms?: number
  bathrooms?: number
  floor?: number
  total_floors?: number
  year_built?: number
  energy_rating?: string
  parking_spots?: number
  amenities: string[]
  description?: string
}

export interface PropertyDocument {
  id: string
  name: string
  type: 'deed' | 'insurance' | 'tax' | 'diagnostic' | 'photo' | 'plan' | 'other'
  url: string
  uploaded_at: string
}

export interface Tenant {
  id: string
  identity_id: string
  property_id?: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  status: TenantStatus
  move_in_date?: string
  move_out_date?: string
  emergency_contact?: {
    name: string
    phone: string
    relationship: string
  }
  documents: TenantDocument[]
  created_at: string
}

export interface TenantDocument {
  id: string
  name: string
  type: 'id' | 'payslip' | 'tax_return' | 'employer_letter' | 'guarantor' | 'other'
  url: string
  uploaded_at: string
}

export interface Lease {
  id: string
  property_id: string
  tenant_id: string
  status: LeaseStatus
  start_date: string
  end_date: string
  monthly_rent: number
  deposit_amount: number
  payment_day: number
  terms: string
  signed_at?: string
  terminated_at?: string
  renewal_count: number
  created_at: string
  updated_at: string
}

export interface MaintenanceRequest {
  id: string
  property_id: string
  tenant_id?: string
  title: string
  description: string
  priority: MaintenancePriority
  status: MaintenanceStatus
  category: string
  estimated_cost?: number
  actual_cost?: number
  scheduled_date?: string
  completed_date?: string
  assigned_to?: string
  photos: string[]
  notes: MaintenanceNote[]
  created_at: string
  updated_at: string
}

export interface MaintenanceNote {
  id: string
  author_id: string
  author_name: string
  content: string
  timestamp: string
}

export interface FinancialTransaction {
  id: string
  property_id: string
  tenant_id?: string
  type: TransactionType
  amount: number
  description: string
  date: string
  is_income: boolean
  category?: string
  receipt_url?: string
  created_at: string
}

export interface FinancialSummary {
  property_id: string
  period: string
  total_income: number
  total_expenses: number
  net_income: number
  rent_collected: number
  rent_expected: number
  occupancy_rate: number
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORE STATE
// ═══════════════════════════════════════════════════════════════════════════════

interface ImmobilierState {
  // Data
  properties: Record<string, Property>
  tenants: Record<string, Tenant>
  leases: Record<string, Lease>
  maintenance_requests: Record<string, MaintenanceRequest>
  transactions: Record<string, FinancialTransaction>
  
  // UI State
  selected_property_id: string | null
  is_loading: boolean
  error: string | null
  
  // Property CRUD
  createProperty: (data: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => Property
  updateProperty: (id: string, data: Partial<Property>) => void
  deleteProperty: (id: string) => boolean
  getProperty: (id: string) => Property | undefined
  getPropertiesByStatus: (status: PropertyStatus) => Property[]
  getPropertiesByType: (type: PropertyType) => Property[]
  
  // Tenant CRUD
  createTenant: (data: Omit<Tenant, 'id' | 'created_at'>) => Tenant
  updateTenant: (id: string, data: Partial<Tenant>) => void
  deleteTenant: (id: string) => boolean
  assignTenantToProperty: (tenantId: string, propertyId: string) => void
  
  // Lease Management
  createLease: (data: Omit<Lease, 'id' | 'created_at' | 'updated_at' | 'renewal_count'>) => Lease
  updateLease: (id: string, data: Partial<Lease>) => void
  terminateLease: (id: string, reason?: string) => void
  renewLease: (id: string, newEndDate: string, newRent?: number) => Lease
  getActiveLease: (propertyId: string) => Lease | undefined
  
  // Maintenance
  createMaintenanceRequest: (data: Omit<MaintenanceRequest, 'id' | 'created_at' | 'updated_at' | 'notes'>) => MaintenanceRequest
  updateMaintenanceRequest: (id: string, data: Partial<MaintenanceRequest>) => void
  addMaintenanceNote: (requestId: string, content: string, authorId: string, authorName: string) => void
  completeMaintenanceRequest: (id: string, actualCost?: number) => void
  getPendingMaintenance: (propertyId?: string) => MaintenanceRequest[]
  
  // Financial
  addTransaction: (data: Omit<FinancialTransaction, 'id' | 'created_at'>) => FinancialTransaction
  deleteTransaction: (id: string) => void
  getTransactions: (propertyId: string, startDate?: string, endDate?: string) => FinancialTransaction[]
  getFinancialSummary: (propertyId: string, period: string) => FinancialSummary
  getPortfolioSummary: () => { total_value: number; monthly_income: number; properties_count: number; occupied_count: number }
  
  // UI Actions
  selectProperty: (id: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

// ═══════════════════════════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════════════════════════

const initialState = {
  properties: {},
  tenants: {},
  leases: {},
  maintenance_requests: {},
  transactions: {},
  selected_property_id: null,
  is_loading: false,
  error: null,
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════════

export const useImmobilierEngineStore = create<ImmobilierState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,
      
      // Property CRUD
      createProperty: (data) => {
        const id = `property_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const now = new Date().toISOString()
        const property: Property = { ...data, id, created_at: now, updated_at: now }
        set(state => ({ properties: { ...state.properties, [id]: property } }))
        // Property created - logged via logger
        // logger.info('Property created:', id)
        return property
      },
      
      updateProperty: (id, data) => {
        set(state => ({
          properties: {
            ...state.properties,
            [id]: { ...state.properties[id], ...data, updated_at: new Date().toISOString() },
          },
        }))
      },
      
      deleteProperty: (id) => {
        if (!get().properties[id]) return false
        set(state => {
          const { [id]: _, ...properties } = state.properties
          return { properties }
        })
        return true
      },
      
      getProperty: (id) => get().properties[id],
      
      getPropertiesByStatus: (status) => Object.values(get().properties).filter(p => p.status === status),
      
      getPropertiesByType: (type) => Object.values(get().properties).filter(p => p.type === type),
      
      // Tenant CRUD
      createTenant: (data) => {
        const id = `tenant_${Date.now()}`
        const now = new Date().toISOString()
        const tenant: Tenant = { ...data, id, created_at: now }
        set(state => ({ tenants: { ...state.tenants, [id]: tenant } }))
        return tenant
      },
      
      updateTenant: (id, data) => {
        set(state => ({
          tenants: { ...state.tenants, [id]: { ...state.tenants[id], ...data } },
        }))
      },
      
      deleteTenant: (id) => {
        if (!get().tenants[id]) return false
        set(state => {
          const { [id]: _, ...tenants } = state.tenants
          return { tenants }
        })
        return true
      },
      
      assignTenantToProperty: (tenantId, propertyId) => {
        set(state => ({
          tenants: {
            ...state.tenants,
            [tenantId]: { ...state.tenants[tenantId], property_id: propertyId, status: 'active' },
          },
          properties: {
            ...state.properties,
            [propertyId]: { ...state.properties[propertyId], current_tenant_id: tenantId, status: 'rented' },
          },
        }))
      },
      
      // Lease Management
      createLease: (data) => {
        const id = `lease_${Date.now()}`
        const now = new Date().toISOString()
        const lease: Lease = { ...data, id, renewal_count: 0, created_at: now, updated_at: now }
        set(state => ({ leases: { ...state.leases, [id]: lease } }))
        return lease
      },
      
      updateLease: (id, data) => {
        set(state => ({
          leases: { ...state.leases, [id]: { ...state.leases[id], ...data, updated_at: new Date().toISOString() } },
        }))
      },
      
      terminateLease: (id) => {
        set(state => ({
          leases: {
            ...state.leases,
            [id]: { ...state.leases[id], status: 'terminated', terminated_at: new Date().toISOString() },
          },
        }))
      },
      
      renewLease: (id, newEndDate, newRent) => {
        const oldLease = get().leases[id]
        if (!oldLease) throw new Error('Lease not found')
        
        const newId = `lease_${Date.now()}`
        const now = new Date().toISOString()
        const newLease: Lease = {
          ...oldLease,
          id: newId,
          start_date: oldLease.end_date,
          end_date: newEndDate,
          monthly_rent: newRent ?? oldLease.monthly_rent,
          status: 'active',
          renewal_count: oldLease.renewal_count + 1,
          created_at: now,
          updated_at: now,
        }
        
        set(state => ({
          leases: {
            ...state.leases,
            [id]: { ...state.leases[id], status: 'renewed' },
            [newId]: newLease,
          },
        }))
        
        return newLease
      },
      
      getActiveLease: (propertyId) => {
        return Object.values(get().leases).find(l => l.property_id === propertyId && l.status === 'active')
      },
      
      // Maintenance
      createMaintenanceRequest: (data) => {
        const id = `maintenance_${Date.now()}`
        const now = new Date().toISOString()
        const request: MaintenanceRequest = { ...data, id, notes: [], created_at: now, updated_at: now }
        set(state => ({ maintenance_requests: { ...state.maintenance_requests, [id]: request } }))
        return request
      },
      
      updateMaintenanceRequest: (id, data) => {
        set(state => ({
          maintenance_requests: {
            ...state.maintenance_requests,
            [id]: { ...state.maintenance_requests[id], ...data, updated_at: new Date().toISOString() },
          },
        }))
      },
      
      addMaintenanceNote: (requestId, content, authorId, authorName) => {
        const note: MaintenanceNote = {
          id: `note_${Date.now()}`,
          author_id: authorId,
          author_name: authorName,
          content,
          timestamp: new Date().toISOString(),
        }
        
        set(state => ({
          maintenance_requests: {
            ...state.maintenance_requests,
            [requestId]: {
              ...state.maintenance_requests[requestId],
              notes: [...state.maintenance_requests[requestId].notes, note],
            },
          },
        }))
      },
      
      completeMaintenanceRequest: (id, actualCost) => {
        set(state => ({
          maintenance_requests: {
            ...state.maintenance_requests,
            [id]: {
              ...state.maintenance_requests[id],
              status: 'completed',
              actual_cost: actualCost,
              completed_date: new Date().toISOString(),
            },
          },
        }))
      },
      
      getPendingMaintenance: (propertyId) => {
        return Object.values(get().maintenance_requests).filter(r =>
          r.status !== 'completed' && r.status !== 'cancelled' &&
          (!propertyId || r.property_id === propertyId)
        )
      },
      
      // Financial
      addTransaction: (data) => {
        const id = `tx_${Date.now()}`
        const transaction: FinancialTransaction = { ...data, id, created_at: new Date().toISOString() }
        set(state => ({ transactions: { ...state.transactions, [id]: transaction } }))
        return transaction
      },
      
      deleteTransaction: (id) => {
        set(state => {
          const { [id]: _, ...transactions } = state.transactions
          return { transactions }
        })
      },
      
      getTransactions: (propertyId, startDate, endDate) => {
        return Object.values(get().transactions)
          .filter(t => {
            if (t.property_id !== propertyId) return false
            if (startDate && t.date < startDate) return false
            if (endDate && t.date > endDate) return false
            return true
          })
          .sort((a, b) => b.date.localeCompare(a.date))
      },
      
      getFinancialSummary: (propertyId, period) => {
        const txs = get().getTransactions(propertyId)
        const property = get().properties[propertyId]
        const lease = get().getActiveLease(propertyId)
        
        const income = txs.filter(t => t.is_income).reduce((sum, t) => sum + t.amount, 0)
        const expenses = txs.filter(t => !t.is_income).reduce((sum, t) => sum + t.amount, 0)
        
        return {
          property_id: propertyId,
          period,
          total_income: income,
          total_expenses: expenses,
          net_income: income - expenses,
          rent_collected: txs.filter(t => t.type === 'rent').reduce((sum, t) => sum + t.amount, 0),
          rent_expected: lease?.monthly_rent ?? 0,
          occupancy_rate: property?.status === 'rented' ? 100 : 0,
        }
      },
      
      getPortfolioSummary: () => {
        const properties = Object.values(get().properties)
        const rentedCount = properties.filter(p => p.status === 'rented').length
        
        return {
          total_value: properties.reduce((sum, p) => sum + (p.market_value || p.purchase_price || 0), 0),
          monthly_income: properties.reduce((sum, p) => sum + (p.monthly_rent || 0), 0),
          properties_count: properties.length,
          occupied_count: rentedCount,
        }
      },
      
      // UI Actions
      selectProperty: (id) => set({ selected_property_id: id }),
      setLoading: (loading) => set({ is_loading: loading }),
      setError: (error) => set({ error }),
      reset: () => set(initialState),
    })),
    { name: 'chenu-immobilier-engine' }
  )
)

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type { ImmobilierState }
export default useImmobilierEngineStore
