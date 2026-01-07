/**
 * CHE·NU™ Property Details Component
 * Detailed view of a single property with all DataSpace info
 * 
 * @module immobilier
 * @version 33.0
 */

import React, { useState } from 'react';

// Types
interface PropertyDocument {
  id: string;
  name: string;
  type: 'deed' | 'insurance' | 'tax' | 'mortgage' | 'lease' | 'inspection' | 'other';
  uploadedAt: string;
  expiresAt?: string;
  url?: string;
}

interface MaintenanceTask {
  id: string;
  title: string;
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  assignedTo?: string;
  cost?: number;
}

interface Tenant {
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

interface PropertyFinance {
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

interface PropertyDetailsData {
  id: string;
  name: string;
  address: string;
  type: 'residential' | 'commercial' | 'industrial' | 'land' | 'mixed';
  status: 'owned' | 'rented' | 'for_sale' | 'for_rent' | 'under_construction';
  description?: string;
  yearBuilt?: number;
  squareFeet?: number;
  lotSize?: string;
  bedrooms?: number;
  bathrooms?: number;
  units?: number;
  parking?: number;
  amenities?: string[];
  documents: PropertyDocument[];
  maintenance: MaintenanceTask[];
  tenants?: Tenant[];
  finance: PropertyFinance;
}

interface PropertyDetailsProps {
  propertyId: string;
  onBack?: () => void;
  onEdit?: () => void;
}

// Mock data
const mockProperty: PropertyDetailsData = {
  id: 'prop-002',
  name: 'Triplex Rosemont',
  address: '456 Ave Rosemont, Montréal, QC H2S 1X1',
  type: 'residential',
  status: 'rented',
  description: 'Magnifique triplex rénové dans le quartier Rosemont. 3 logements de 4½ avec balcons.',
  yearBuilt: 1945,
  squareFeet: 4200,
  lotSize: '3,500 pi²',
  units: 3,
  parking: 3,
  amenities: ['Balcons', 'Sous-sol aménagé', 'Cour arrière', 'Stationnement'],
  documents: [
    { id: 'd1', name: 'Acte de vente', type: 'deed', uploadedAt: '2020-03-15' },
    { id: 'd2', name: 'Assurance habitation 2024', type: 'insurance', uploadedAt: '2024-01-01', expiresAt: '2025-01-01' },
    { id: 'd3', name: 'Évaluation municipale 2024', type: 'tax', uploadedAt: '2024-06-01' },
    { id: 'd4', name: 'Contrat hypothèque', type: 'mortgage', uploadedAt: '2020-03-15' },
    { id: 'd5', name: 'Bail - Unité 101', type: 'lease', uploadedAt: '2023-07-01', expiresAt: '2025-06-30' },
    { id: 'd6', name: 'Bail - Unité 201', type: 'lease', uploadedAt: '2022-07-01', expiresAt: '2025-06-30' },
    { id: 'd7', name: 'Bail - Unité 301', type: 'lease', uploadedAt: '2024-07-01', expiresAt: '2025-06-30' },
    { id: 'd8', name: 'Inspection pré-achat', type: 'inspection', uploadedAt: '2020-02-20' },
  ],
  maintenance: [
    { id: 'm1', title: 'Entretien chaudière', status: 'scheduled', priority: 'medium', dueDate: '2025-01-15', cost: 350 },
    { id: 'm2', title: 'Réparation toiture (Unité 301)', status: 'in_progress', priority: 'high', assignedTo: 'Toitures ABC', cost: 2500 },
    { id: 'm3', title: 'Peinture couloir commun', status: 'pending', priority: 'low', cost: 800 },
    { id: 'm4', title: 'Inspection électrique annuelle', status: 'completed', priority: 'medium', cost: 450 },
  ],
  tenants: [
    { id: 't1', name: 'Marie Tremblay', unit: '101', email: 'marie@email.com', phone: '514-555-0101', leaseStart: '2023-07-01', leaseEnd: '2025-06-30', rentAmount: 1400, paymentStatus: 'current' },
    { id: 't2', name: 'Jean Lavoie', unit: '201', email: 'jean@email.com', phone: '514-555-0201', leaseStart: '2022-07-01', leaseEnd: '2025-06-30', rentAmount: 1500, paymentStatus: 'current' },
    { id: 't3', name: 'Sophie Martin', unit: '301', email: 'sophie@email.com', phone: '514-555-0301', leaseStart: '2024-07-01', leaseEnd: '2025-06-30', rentAmount: 1600, paymentStatus: 'late' },
  ],
  finance: {
    purchasePrice: 850000,
    currentValue: 1200000,
    mortgageBalance: 520000,
    monthlyPayment: 2800,
    annualTaxes: 8500,
    annualInsurance: 2400,
    monthlyRevenue: 4500,
    monthlyExpenses: 3500,
    roi: 8.5
  }
};

// Document type icons
const docTypeIcons: Record<string, string> = {
  deed: '📜',
  insurance: '🛡️',
  tax: '📋',
  mortgage: '🏦',
  lease: '📄',
  inspection: '🔍',
  other: '📎'
};

// Priority colors
const priorityColors: Record<string, string> = {
  low: 'bg-slate-500',
  medium: 'bg-blue-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500'
};

// Status colors
const statusColors: Record<string, string> = {
  pending: 'text-slate-400',
  scheduled: 'text-blue-400',
  in_progress: 'text-amber-400',
  completed: 'text-emerald-400'
};

// Payment status
const paymentStatusColors: Record<string, string> = {
  current: 'bg-emerald-500',
  late: 'bg-amber-500',
  overdue: 'bg-red-500'
};

// Tab Component
const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  badge?: number;
}> = ({ active, onClick, icon, label, badge }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
      active ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
    }`}
  >
    <span>{icon}</span>
    <span>{label}</span>
    {badge !== undefined && badge > 0 && (
      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{badge}</span>
    )}
  </button>
);

// Main Component
const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  propertyId,
  onBack,
  onEdit
}) => {
  const [property] = useState<PropertyDetailsData>(mockProperty);
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'maintenance' | 'tenants' | 'finance'>('overview');
  
  const pendingMaintenance = property.maintenance.filter(m => m.status !== 'completed').length;
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-lg">
              ← Retour
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold">{property.name}</h1>
            <p className="text-slate-400">{property.address}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg">
            🖨️ Imprimer
          </button>
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg">
            📤 Exporter
          </button>
          {onEdit && (
            <button onClick={onEdit} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg">
              ✏️ Modifier
            </button>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon="📊" label="Aperçu" />
        <TabButton active={activeTab === 'documents'} onClick={() => setActiveTab('documents')} icon="📁" label="Documents" badge={property.documents.length} />
        <TabButton active={activeTab === 'maintenance'} onClick={() => setActiveTab('maintenance')} icon="🔧" label="Entretien" badge={pendingMaintenance} />
        {property.tenants && (
          <TabButton active={activeTab === 'tenants'} onClick={() => setActiveTab('tenants')} icon="👥" label="Locataires" badge={property.tenants.length} />
        )}
        <TabButton active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} icon="💰" label="Finances" />
      </div>
      
      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Property Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Card */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h2 className="text-lg font-semibold mb-4">Informations Générales</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.yearBuilt && (
                  <div>
                    <div className="text-sm text-slate-400">Année construction</div>
                    <div className="text-lg font-semibold">{property.yearBuilt}</div>
                  </div>
                )}
                {property.squareFeet && (
                  <div>
                    <div className="text-sm text-slate-400">Superficie</div>
                    <div className="text-lg font-semibold">{property.squareFeet.toLocaleString()} pi²</div>
                  </div>
                )}
                {property.units && (
                  <div>
                    <div className="text-sm text-slate-400">Unités</div>
                    <div className="text-lg font-semibold">{property.units}</div>
                  </div>
                )}
                {property.parking && (
                  <div>
                    <div className="text-sm text-slate-400">Stationnement</div>
                    <div className="text-lg font-semibold">{property.parking} places</div>
                  </div>
                )}
              </div>
              
              {property.description && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <p className="text-slate-300">{property.description}</p>
                </div>
              )}
              
              {property.amenities && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="text-sm text-slate-400 mb-2">Caractéristiques</div>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-700 rounded-full text-sm">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-xl p-4">
                <div className="text-emerald-400 text-sm">Valeur Actuelle</div>
                <div className="text-2xl font-bold">{(property.finance.currentValue / 1000000).toFixed(2)}M$</div>
                <div className="text-emerald-400 text-sm">+{((property.finance.currentValue - property.finance.purchasePrice) / property.finance.purchasePrice * 100).toFixed(1)}%</div>
              </div>
              {property.finance.monthlyRevenue && (
                <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-4">
                  <div className="text-blue-400 text-sm">Revenus Mensuels</div>
                  <div className="text-2xl font-bold">{property.finance.monthlyRevenue.toLocaleString()}$</div>
                </div>
              )}
              <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-4">
                <div className="text-amber-400 text-sm">Dépenses Mensuelles</div>
                <div className="text-2xl font-bold">{property.finance.monthlyExpenses.toLocaleString()}$</div>
              </div>
              {property.finance.roi && (
                <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4">
                  <div className="text-purple-400 text-sm">ROI Annuel</div>
                  <div className="text-2xl font-bold">{property.finance.roi}%</div>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <h3 className="font-semibold mb-4">📅 Activité Récente</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-emerald-400">💰</span>
                  <span>Loyer reçu - Unité 101</span>
                  <span className="text-slate-500 ml-auto">Il y a 2j</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-emerald-400">💰</span>
                  <span>Loyer reçu - Unité 201</span>
                  <span className="text-slate-500 ml-auto">Il y a 3j</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-amber-400">🔧</span>
                  <span>Réparation toiture débutée</span>
                  <span className="text-slate-500 ml-auto">Il y a 5j</span>
                </div>
              </div>
            </div>
            
            {/* Alerts */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <h3 className="font-semibold mb-4">⚠️ Alertes</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-2 bg-amber-900/30 rounded-lg text-sm">
                  <span>⚠️</span>
                  <div>
                    <div className="font-medium text-amber-400">Loyer en retard</div>
                    <div className="text-slate-400">Unité 301 - Sophie Martin</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 bg-blue-900/30 rounded-lg text-sm">
                  <span>📄</span>
                  <div>
                    <div className="font-medium text-blue-400">Renouvellement bail</div>
                    <div className="text-slate-400">3 baux expirent en juin 2025</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'documents' && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Documents</h2>
            <button className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm">
              ➕ Ajouter Document
            </button>
          </div>
          <div className="space-y-2">
            {property.documents.map(doc => (
              <div key={doc.id} className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                <span className="text-2xl">{docTypeIcons[doc.type]}</span>
                <div className="flex-1">
                  <div className="font-medium">{doc.name}</div>
                  <div className="text-sm text-slate-400">
                    Ajouté le {new Date(doc.uploadedAt).toLocaleDateString('fr-CA')}
                    {doc.expiresAt && (
                      <span className={new Date(doc.expiresAt) < new Date() ? 'text-red-400 ml-2' : 'text-slate-400 ml-2'}>
                        • Expire le {new Date(doc.expiresAt).toLocaleDateString('fr-CA')}
                      </span>
                    )}
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-600 rounded">👁️</button>
                <button className="p-2 hover:bg-slate-600 rounded">⬇️</button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'maintenance' && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Tâches d'Entretien</h2>
            <button className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm">
              ➕ Nouvelle Tâche
            </button>
          </div>
          <div className="space-y-2">
            {property.maintenance.map(task => (
              <div key={task.id} className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg">
                <span className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`}></span>
                <div className="flex-1">
                  <div className="font-medium">{task.title}</div>
                  <div className="text-sm text-slate-400">
                    {task.assignedTo && `Assigné à: ${task.assignedTo} • `}
                    {task.dueDate && `Échéance: ${new Date(task.dueDate).toLocaleDateString('fr-CA')}`}
                  </div>
                </div>
                <span className={`text-sm ${statusColors[task.status]}`}>
                  {task.status === 'completed' ? '✅' : task.status === 'in_progress' ? '🔄' : task.status === 'scheduled' ? '📅' : '⏳'}
                  {' '}{task.status}
                </span>
                {task.cost && <span className="text-amber-400">{task.cost}$</span>}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'tenants' && property.tenants && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Locataires ({property.tenants.length})</h2>
            <button className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm">
              ➕ Ajouter Locataire
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {property.tenants.map(tenant => (
              <div key={tenant.id} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold">{tenant.name}</div>
                  <span className={`${paymentStatusColors[tenant.paymentStatus]} px-2 py-0.5 rounded text-xs`}>
                    {tenant.paymentStatus === 'current' ? 'À jour' : tenant.paymentStatus === 'late' ? 'En retard' : 'Impayé'}
                  </span>
                </div>
                <div className="text-sm text-slate-400 space-y-1">
                  <div>🏠 Unité {tenant.unit}</div>
                  <div>📧 {tenant.email}</div>
                  <div>📱 {tenant.phone}</div>
                  <div>📄 Bail: {new Date(tenant.leaseStart).toLocaleDateString('fr-CA')} - {new Date(tenant.leaseEnd).toLocaleDateString('fr-CA')}</div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-600 flex items-center justify-between">
                  <span className="text-amber-400 font-semibold">{tenant.rentAmount}$/mois</span>
                  <div className="flex gap-2">
                    <button className="p-1 hover:bg-slate-600 rounded text-sm">📧</button>
                    <button className="p-1 hover:bg-slate-600 rounded text-sm">📱</button>
                    <button className="p-1 hover:bg-slate-600 rounded text-sm">👁️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'finance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold mb-4">💰 Sommaire Financier</h2>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-slate-700">
                <span className="text-slate-400">Prix d'achat</span>
                <span>{property.finance.purchasePrice.toLocaleString()}$</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-700">
                <span className="text-slate-400">Valeur actuelle</span>
                <span className="text-emerald-400">{property.finance.currentValue.toLocaleString()}$</span>
              </div>
              {property.finance.mortgageBalance && (
                <div className="flex justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-400">Solde hypothèque</span>
                  <span className="text-red-400">-{property.finance.mortgageBalance.toLocaleString()}$</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-slate-700">
                <span className="text-slate-400">Équité</span>
                <span className="text-emerald-400 font-semibold">
                  {(property.finance.currentValue - (property.finance.mortgageBalance || 0)).toLocaleString()}$
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold mb-4">📊 Flux de Trésorerie Mensuel</h2>
            <div className="space-y-4">
              {property.finance.monthlyRevenue && (
                <div className="flex justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-400">Revenus locatifs</span>
                  <span className="text-emerald-400">+{property.finance.monthlyRevenue.toLocaleString()}$</span>
                </div>
              )}
              {property.finance.monthlyPayment && (
                <div className="flex justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-400">Paiement hypothèque</span>
                  <span className="text-red-400">-{property.finance.monthlyPayment.toLocaleString()}$</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-slate-700">
                <span className="text-slate-400">Taxes (mensuel)</span>
                <span className="text-red-400">-{Math.round(property.finance.annualTaxes / 12).toLocaleString()}$</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-700">
                <span className="text-slate-400">Assurance (mensuel)</span>
                <span className="text-red-400">-{Math.round(property.finance.annualInsurance / 12).toLocaleString()}$</span>
              </div>
              <div className="flex justify-between py-2 pt-4 font-semibold text-lg">
                <span>Cash-flow net</span>
                <span className={(property.finance.monthlyRevenue || 0) - property.finance.monthlyExpenses > 0 ? 'text-emerald-400' : 'text-red-400'}>
                  {((property.finance.monthlyRevenue || 0) - property.finance.monthlyExpenses).toLocaleString()}$/mois
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
