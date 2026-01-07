/**
 * CHE·NU Enterprise Dashboard
 * Main dashboard component with route handling
 * READ-ONLY — No data modification
 */

import React, { useState } from 'react';
import { useDashboardData } from './useDemoData';
import { EnterpriseDashboardHome } from './EnterpriseDashboardHome';
import { DatasetsTable } from './DatasetsTable';
import { RelationsExplorer } from './RelationsExplorer';
import { QualityView } from './QualityView';
import { ChangesTimeline } from './ChangesTimeline';
import { ExportAndSignatureView } from './ExportAndSignatureView';
import { DatasetIndexEntry, UIMode } from './types';
import './print.css';

type DashboardRoute = 
  | 'home'
  | 'datasets'
  | 'relations'
  | 'quality'
  | 'changes'
  | 'export';

interface DashboardProps {
  initialRoute?: DashboardRoute;
  uiMode?: UIMode;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  initialRoute = 'home',
  uiMode = 'dark_strict',
}) => {
  const [route, setRoute] = useState<DashboardRoute>(initialRoute);
  const [selectedDataset, setSelectedDataset] = useState<DatasetIndexEntry | null>(null);
  const data = useDashboardData();

  const navItems: { route: DashboardRoute; label: string; icon: string }[] = [
    { route: 'home', label: 'Overview', icon: '📊' },
    { route: 'datasets', label: 'Datasets', icon: '📁' },
    { route: 'relations', label: 'Relations', icon: '🔗' },
    { route: 'quality', label: 'Quality', icon: '✓' },
    { route: 'changes', label: 'Changes', icon: '📜' },
    { route: 'export', label: 'Export', icon: '📤' },
  ];

  // Loading state
  if (data.loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading enterprise data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (data.error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-400 text-lg mb-2">⚠ Error</p>
          <p className="text-gray-400">{data.error}</p>
          <p className="text-gray-500 text-sm mt-4">
            Check that demo fixtures exist in /demo_fixtures/
          </p>
        </div>
      </div>
    );
  }

  // Render current route
  const renderContent = () => {
    switch (route) {
      case 'home':
        return (
          <EnterpriseDashboardHome
            enterpriseIndex={data.enterpriseIndex}
            ciReport={data.ciReport}
            enterpriseReport={data.enterpriseReport}
            isDemo={data.isDemo}
          />
        );
      case 'datasets':
        return (
          <DatasetsTable
            datasets={data.enterpriseIndex?.dataset_index || []}
            ciReport={data.ciReport}
            onSelectDataset={setSelectedDataset}
          />
        );
      case 'relations':
        return (
          <RelationsExplorer
            relations={data.enterpriseIndex?.cross_dataset_relations || []}
            memoryMap={data.enterpriseIndex?.global_memory_map || []}
          />
        );
      case 'quality':
        return (
          <QualityView
            ciReport={data.ciReport}
            enterpriseReport={data.enterpriseReport}
          />
        );
      case 'changes':
        return (
          <ChangesTimeline
            enterpriseIndex={data.enterpriseIndex}
          />
        );
      case 'export':
        return (
          <ExportAndSignatureView
            manifests={data.manifests}
            enterpriseIndex={data.enterpriseIndex}
            ciReport={data.ciReport}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen flex ${
      uiMode === 'dark_strict' ? 'bg-gray-900 text-white' :
      uiMode === 'incident' ? 'bg-black text-red-100' :
      uiMode === 'print' ? 'bg-white text-black' :
      'bg-gray-100 text-gray-900'
    }`}>
      {/* Left Navigation */}
      <nav className={`w-64 flex-shrink-0 border-r ${
        uiMode === 'dark_strict' ? 'bg-gray-800 border-gray-700' :
        uiMode === 'incident' ? 'bg-gray-900 border-red-900' :
        'bg-white border-gray-200'
      } print:hidden`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-lg font-bold">CHE·NU</h1>
          <p className="text-xs text-gray-500">Enterprise Dashboard</p>
          {data.isDemo && (
            <span className="inline-block mt-2 px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs">
              DEMO MODE
            </span>
          )}
        </div>

        {/* Nav Items */}
        <div className="p-2">
          {navItems.map(item => (
            <button
              key={item.route}
              onClick={() => setRoute(item.route)}
              className={`w-full text-left px-3 py-2 rounded-lg mb-1 flex items-center gap-3 transition-colors ${
                route === item.route
                  ? uiMode === 'dark_strict' 
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : uiMode === 'dark_strict'
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-gray-700 text-xs text-gray-500">
          <p>Source: {data.source}</p>
          <p>Schema: {data.enterpriseIndex?.schema_version || 'N/A'}</p>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>

      {/* Footer Trace Strip (for incident mode) */}
      {uiMode === 'incident' && (
        <div className="fixed bottom-0 left-64 right-0 h-8 bg-red-900/50 border-t border-red-800 flex items-center px-4 text-xs text-red-300 print:hidden">
          <span>INCIDENT MODE — All actions logged — READ-ONLY</span>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
