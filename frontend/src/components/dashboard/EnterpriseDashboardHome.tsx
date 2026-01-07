/**
 * CHE·NU Enterprise Dashboard Home
 */

import React from 'react';
import { EnterpriseIndexJson, CIReportJson, EnterpriseReportJson } from './types';

interface Props {
  enterpriseIndex: EnterpriseIndexJson | null;
  ciReport: CIReportJson | null;
  enterpriseReport: EnterpriseReportJson | null;
  isDemo: boolean;
}

export const EnterpriseDashboardHome: React.FC<Props> = ({
  enterpriseIndex,
  ciReport,
  enterpriseReport,
  isDemo,
}) => {
  if (!enterpriseIndex) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No enterprise data available</p>
        <p className="text-sm mt-2">Check that demo fixtures are loaded</p>
      </div>
    );
  }

  const stats = enterpriseIndex.enterprise_stats;
  const ciStatus = ciReport?.status || 'UNKNOWN';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Enterprise Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {enterpriseIndex.enterprise_id}
            {isDemo && <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-xs">DEMO</span>}
          </p>
        </div>
        <div className="text-right text-sm text-gray-500">
          <p>Generated: {new Date(enterpriseIndex.generated_at).toLocaleString()}</p>
          <p>Schema: {enterpriseIndex.schema_version}</p>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPITile label="Datasets" value={stats.total_datasets} />
        <KPITile label="Memory Units" value={stats.total_memory_units} />
        <KPITile label="Decisions" value={stats.total_decisions} />
        <KPITile label="Cross Relations" value={stats.cross_dataset_relations} />
      </div>

      {/* CI Status */}
      <div className={`p-4 rounded-lg border ${
        ciStatus === 'PASS' 
          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
          : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
      }`}>
        <div className="flex items-center gap-3">
          <span className={`text-2xl ${ciStatus === 'PASS' ? 'text-green-600' : 'text-red-600'}`}>
            {ciStatus === 'PASS' ? '✓' : '✗'}
          </span>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              CI Status: {ciStatus}
            </p>
            {ciReport && (
              <p className="text-sm text-gray-500">
                {ciReport.validated_datasets.length} datasets validated
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Warnings Panel */}
      {enterpriseReport && enterpriseReport.warnings.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <h3 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Warnings</h3>
          <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
            {enterpriseReport.warnings.map((w, i) => (
              <li key={i}>• {w.message} ({w.count})</li>
            ))}
          </ul>
        </div>
      )}

      {/* Top Datasets */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-white">Top Datasets</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Dataset</th>
                <th className="px-4 py-2 text-right text-gray-600 dark:text-gray-300">Version</th>
                <th className="px-4 py-2 text-right text-gray-600 dark:text-gray-300">Units</th>
                <th className="px-4 py-2 text-right text-gray-600 dark:text-gray-300">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {enterpriseIndex.dataset_index.slice(0, 5).map(ds => (
                <tr key={ds.dataset_id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-2 font-mono text-gray-900 dark:text-white">{ds.dataset_id}</td>
                  <td className="px-4 py-2 text-right text-gray-600 dark:text-gray-400">{ds.dataset_version}</td>
                  <td className="px-4 py-2 text-right text-gray-600 dark:text-gray-400">{ds.unit_count}</td>
                  <td className="px-4 py-2 text-right text-gray-500 dark:text-gray-500 text-xs">
                    {new Date(ds.last_updated).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const KPITile: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
  </div>
);

export default EnterpriseDashboardHome;
