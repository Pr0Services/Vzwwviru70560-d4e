/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V55 — Immobilier Page                             ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { logger } from '@/utils/logger';
import {
  useProperties,
  useCreateProperty,
  usePortfolioAnalytics,
} from '../hooks/useEngineAPIs';
import { PropertyCard } from '../components/engines';
import { useImmobilierStore } from '../stores';
import { formatters } from '../utils';
import type { PropertyStatus, PropertyType } from '../types';

const ImmobilierPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<PropertyType | ''>('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  const { data: properties, isLoading, error } = useProperties({
    status: statusFilter || undefined,
  });
  const { data: analytics } = usePortfolioAnalytics();
  const createMutation = useCreateProperty();
  const { selectProperty } = useImmobilierStore();

  const handleView = (propertyId: string) => {
    const property = properties?.find((p) => p.id === propertyId);
    if (property) {
      selectProperty(property);
      // Navigate to property details
      window.location.href = `/immobilier/${propertyId}`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        Erreur: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ui-slate">Immobilier</h1>
          <p className="text-gray-500">Gérez votre portefeuille immobilier</p>
        </div>
        <button
          onClick={() => logger.debug('Create property')}
          className="px-4 py-2 bg-sacred-gold text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
        >
          + Ajouter un bien
        </button>
      </div>

      {/* Analytics Dashboard */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-chenu shadow-chenu">
            <div className="text-sm text-gray-500">Biens</div>
            <div className="text-2xl font-bold text-ui-slate">
              {analytics.properties_count}
            </div>
          </div>
          <div className="bg-white p-4 rounded-chenu shadow-chenu">
            <div className="text-sm text-gray-500">Occupés</div>
            <div className="text-2xl font-bold text-jungle-emerald">
              {analytics.occupied_count}
            </div>
          </div>
          <div className="bg-white p-4 rounded-chenu shadow-chenu">
            <div className="text-sm text-gray-500">Vacance</div>
            <div className="text-2xl font-bold text-orange-500">
              {analytics.vacancy_rate.toFixed(1)}%
            </div>
          </div>
          <div className="bg-white p-4 rounded-chenu shadow-chenu">
            <div className="text-sm text-gray-500">Revenus/mois</div>
            <div className="text-2xl font-bold text-sacred-gold">
              {formatters.currency(analytics.monthly_income)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-chenu shadow-chenu">
            <div className="text-sm text-gray-500">Charges/mois</div>
            <div className="text-2xl font-bold text-red-500">
              {formatters.currency(analytics.monthly_expenses)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-chenu shadow-chenu">
            <div className="text-sm text-gray-500">ROI</div>
            <div className="text-2xl font-bold text-cenote-turquoise">
              {analytics.roi_percentage.toFixed(1)}%
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as PropertyStatus | '')}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sacred-gold"
        >
          <option value="">Tous les statuts</option>
          <option value="available">🟢 Disponible</option>
          <option value="rented">🔵 Loué</option>
          <option value="maintenance">🟠 En travaux</option>
          <option value="sold">⚪ Vendu</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as PropertyType | '')}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sacred-gold"
        >
          <option value="">Tous les types</option>
          <option value="apartment">🏢 Appartement</option>
          <option value="house">🏠 Maison</option>
          <option value="commercial">🏪 Commercial</option>
          <option value="land">🌍 Terrain</option>
          <option value="parking">🅿️ Parking</option>
        </select>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setView('grid')}
            className={`px-3 py-2 rounded-lg ${
              view === 'grid' ? 'bg-sacred-gold text-white' : 'bg-gray-100'
            }`}
          >
            ⊞
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-2 rounded-lg ${
              view === 'list' ? 'bg-sacred-gold text-white' : 'bg-gray-100'
            }`}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Properties Grid */}
      <div className={`grid gap-6 ${
        view === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {properties?.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onView={handleView}
            onEdit={(id) => logger.debug('Edit:', id)}
            onManage={(id) => logger.debug('Manage:', id)}
          />
        ))}
      </div>

      {properties?.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <span className="text-4xl mb-4 block">🏠</span>
          Aucun bien trouvé
        </div>
      )}
    </div>
  );
};

export default ImmobilierPage;
