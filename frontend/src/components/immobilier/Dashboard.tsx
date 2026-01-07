/**
 * CHE·NU™ Immobilier Dashboard
 * Property management dashboard for Personal & Enterprise contexts
 * 
 * @module immobilier
 * @version 33.0
 */

import React, { useState, useEffect } from 'react';

// Types
interface Property {
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

interface DashboardStats {
  totalProperties: number;
  totalValue: number;
  averageOccupancy: number;
  monthlyRevenue: number;
  pendingMaintenance: number;
  upcomingLeaseRenewals: number;
}

interface ImmobilierDashboardProps {
  context: 'personal' | 'enterprise';
  identityId: string;
  onPropertySelect?: (propertyId: string) => void;
  onAddProperty?: () => void;
}

// Mock data for development
const mockProperties: Property[] = [
  {
    id: 'prop-001',
    name: 'Résidence Principale',
    address: '123 Rue Principale, Montréal, QC',
    type: 'residential',
    status: 'owned',
    value: 650000,
    lastInspection: '2024-06-15',
    nextMaintenance: '2025-03-01',
    imageUrl: '/images/properties/home1.jpg'
  },
  {
    id: 'prop-002',
    name: 'Triplex Rosemont',
    address: '456 Ave Rosemont, Montréal, QC',
    type: 'residential',
    status: 'rented',
    value: 1200000,
    units: 3,
    occupancyRate: 100,
    monthlyRevenue: 4500,
    lastInspection: '2024-09-20',
    nextMaintenance: '2025-01-15',
    imageUrl: '/images/properties/triplex1.jpg'
  },
  {
    id: 'prop-003',
    name: 'Local Commercial St-Denis',
    address: '789 Rue St-Denis, Montréal, QC',
    type: 'commercial',
    status: 'rented',
    value: 850000,
    units: 2,
    occupancyRate: 50,
    monthlyRevenue: 3200,
    lastInspection: '2024-11-01',
    imageUrl: '/images/properties/commercial1.jpg'
  },
  {
    id: 'prop-004',
    name: 'Terrain Laurentides',
    address: 'Lot 45, St-Sauveur, QC',
    type: 'land',
    status: 'owned',
    value: 175000,
    imageUrl: '/images/properties/land1.jpg'
  }
];

const mockStats: DashboardStats = {
  totalProperties: 4,
  totalValue: 2875000,
  averageOccupancy: 83,
  monthlyRevenue: 7700,
  pendingMaintenance: 3,
  upcomingLeaseRenewals: 2
};

// Status colors
const statusColors: Record<string, string> = {
  owned: 'bg-emerald-500',
  rented: 'bg-blue-500',
  for_sale: 'bg-amber-500',
  for_rent: 'bg-purple-500',
  under_construction: 'bg-orange-500'
};

const statusLabels: Record<string, string> = {
  owned: 'Propriété',
  rented: 'Loué',
  for_sale: 'À vendre',
  for_rent: 'À louer',
  under_construction: 'En construction'
};

const typeIcons: Record<string, string> = {
  residential: '🏠',
  commercial: '🏢',
  industrial: '🏭',
  land: '🌳',
  mixed: '🏗️'
};

// Components
const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: string;
  trend?: { value: number; positive: boolean };
  color?: string;
}> = ({ label, value, icon, trend, color = 'bg-slate-800' }) => (
  <div className={`${color} rounded-xl p-4 border border-slate-700`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-2xl">{icon}</span>
      {trend && (
        <span className={`text-sm ${trend.positive ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
        </span>
      )}
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-sm text-slate-400">{label}</div>
  </div>
);

const PropertyCard: React.FC<{
  property: Property;
  onClick?: () => void;
}> = ({ property, onClick }) => (
  <div 
    className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-amber-500/50 transition-colors cursor-pointer"
    onClick={onClick}
  >
    {/* Image placeholder */}
    <div className="h-32 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
      <span className="text-5xl">{typeIcons[property.type]}</span>
    </div>
    
    <div className="p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-white">{property.name}</h3>
          <p className="text-sm text-slate-400">{property.address}</p>
        </div>
        <span className={`${statusColors[property.status]} px-2 py-1 rounded-full text-xs text-white`}>
          {statusLabels[property.status]}
        </span>
      </div>
      
      {/* Value */}
      <div className="text-lg font-bold text-amber-400 mb-3">
        {property.value.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 })}
      </div>
      
      {/* Stats row */}
      <div className="flex items-center gap-4 text-sm text-slate-400">
        {property.units && (
          <span>🏠 {property.units} unités</span>
        )}
        {property.occupancyRate !== undefined && (
          <span className={property.occupancyRate >= 80 ? 'text-emerald-400' : 'text-amber-400'}>
            📊 {property.occupancyRate}% occupé
          </span>
        )}
        {property.monthlyRevenue && (
          <span>💰 {property.monthlyRevenue.toLocaleString('fr-CA')}$/mois</span>
        )}
      </div>
      
      {/* Maintenance alert */}
      {property.nextMaintenance && (
        <div className="mt-3 pt-3 border-t border-slate-700 flex items-center gap-2 text-sm">
          <span>🔧</span>
          <span className="text-slate-400">Prochain entretien:</span>
          <span className="text-white">{new Date(property.nextMaintenance).toLocaleDateString('fr-CA')}</span>
        </div>
      )}
    </div>
  </div>
);

const QuickActions: React.FC<{
  onAction: (action: string) => void;
}> = ({ onAction }) => (
  <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
    <h3 className="font-semibold text-white mb-4">⚡ Actions Rapides</h3>
    <div className="grid grid-cols-2 gap-2">
      {[
        { id: 'add_property', label: 'Ajouter Propriété', icon: '➕' },
        { id: 'new_tenant', label: 'Nouveau Locataire', icon: '👤' },
        { id: 'maintenance', label: 'Demande Entretien', icon: '🔧' },
        { id: 'collect_rent', label: 'Collecter Loyer', icon: '💰' },
        { id: 'inspection', label: 'Planifier Inspection', icon: '📋' },
        { id: 'report', label: 'Générer Rapport', icon: '📊' },
      ].map(action => (
        <button
          key={action.id}
          onClick={() => onAction(action.id)}
          className="flex items-center gap-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm"
        >
          <span>{action.icon}</span>
          <span className="text-slate-200">{action.label}</span>
        </button>
      ))}
    </div>
  </div>
);

const UpcomingEvents: React.FC = () => (
  <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
    <h3 className="font-semibold text-white mb-4">📅 Événements à Venir</h3>
    <div className="space-y-3">
      {[
        { date: '2025-01-15', type: 'maintenance', label: 'Entretien chaudière - Triplex Rosemont', icon: '🔧' },
        { date: '2025-02-01', type: 'lease', label: 'Renouvellement bail - Unité 101', icon: '📄' },
        { date: '2025-02-15', type: 'inspection', label: 'Inspection annuelle - Local St-Denis', icon: '🔍' },
        { date: '2025-03-01', type: 'tax', label: 'Taxes municipales - Résidence Principale', icon: '💳' },
      ].map((event, i) => (
        <div key={i} className="flex items-center gap-3 p-2 bg-slate-700/50 rounded-lg">
          <span className="text-xl">{event.icon}</span>
          <div className="flex-1">
            <div className="text-sm text-white">{event.label}</div>
            <div className="text-xs text-slate-400">{new Date(event.date).toLocaleDateString('fr-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Main Component
const ImmobilierDashboard: React.FC<ImmobilierDashboardProps> = ({
  context,
  identityId,
  onPropertySelect,
  onAddProperty
}) => {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  
  // Filter properties
  const filteredProperties = filter === 'all' 
    ? properties 
    : properties.filter(p => p.status === filter || p.type === filter);
  
  const handleQuickAction = (action: string) => {
    logger.debug('Quick action:', action);
    if (action === 'add_property' && onAddProperty) {
      onAddProperty();
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span>🏠</span>
            <span>Immobilier</span>
            <span className="text-sm font-normal text-slate-400 ml-2">
              {context === 'personal' ? '(Personnel)' : '(Entreprise)'}
            </span>
          </h1>
          <p className="text-slate-400">Gestion de votre portefeuille immobilier</p>
        </div>
        <button 
          onClick={onAddProperty}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors"
        >
          <span>➕</span>
          <span>Ajouter Propriété</span>
        </button>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <StatCard 
          label="Propriétés" 
          value={stats.totalProperties} 
          icon="🏘️"
        />
        <StatCard 
          label="Valeur Totale" 
          value={`${(stats.totalValue / 1000000).toFixed(1)}M$`} 
          icon="💎"
          trend={{ value: 5.2, positive: true }}
        />
        <StatCard 
          label="Taux d'Occupation" 
          value={`${stats.averageOccupancy}%`} 
          icon="📊"
          trend={{ value: 2, positive: true }}
        />
        <StatCard 
          label="Revenus/Mois" 
          value={`${(stats.monthlyRevenue / 1000).toFixed(1)}k$`} 
          icon="💰"
        />
        <StatCard 
          label="Entretiens" 
          value={stats.pendingMaintenance} 
          icon="🔧"
          color="bg-orange-900/50"
        />
        <StatCard 
          label="Renouvellements" 
          value={stats.upcomingLeaseRenewals} 
          icon="📄"
          color="bg-blue-900/50"
        />
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Properties Grid */}
        <div className="lg:col-span-2">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'Tous' },
              { id: 'owned', label: 'Propriétés' },
              { id: 'rented', label: 'Loués' },
              { id: 'for_rent', label: 'À Louer' },
              { id: 'residential', label: 'Résidentiel' },
              { id: 'commercial', label: 'Commercial' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  filter === tab.id 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Properties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProperties.map(property => (
              <PropertyCard 
                key={property.id}
                property={property}
                onClick={() => onPropertySelect?.(property.id)}
              />
            ))}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <QuickActions onAction={handleQuickAction} />
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
};

export default ImmobilierDashboard;
