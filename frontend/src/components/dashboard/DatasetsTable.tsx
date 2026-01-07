/**
 * CHE·NU Datasets Table
 */

import React, { useState, useMemo } from 'react';
import { DatasetIndexEntry, CIReportJson } from './types';

interface Props {
  datasets: DatasetIndexEntry[];
  ciReport: CIReportJson | null;
  onSelectDataset?: (dataset: DatasetIndexEntry) => void;
}

type FilterKey = 'all' | 'pass' | 'fail' | 'warnings';

export const DatasetsTable: React.FC<Props> = ({ datasets, ciReport, onSelectDataset }) => {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [search, setSearch] = useState('');

  const getDatasetStatus = (datasetId: string) => {
    const validation = ciReport?.validated_datasets.find(d => d.dataset_id === datasetId);
    return validation?.status || 'UNKNOWN';
  };

  const getDatasetWarnings = (datasetId: string) => {
    const validation = ciReport?.validated_datasets.find(d => d.dataset_id === datasetId);
    return validation?.warnings.length || 0;
  };

  const filteredDatasets = useMemo(() => {
    return datasets.filter(ds => {
      const status = getDatasetStatus(ds.dataset_id);
      const warnings = getDatasetWarnings(ds.dataset_id);
      
      if (search && !ds.dataset_id.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      
      switch (filter) {
        case 'pass': return status === 'PASS' && warnings === 0;
        case 'fail': return status === 'FAIL';
        case 'warnings': return warnings > 0;
        default: return true;
      }
    });
  }, [datasets, filter, search, ciReport]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Datasets</h2>
        <span className="text-sm text-gray-500">{filteredDatasets.length} of {datasets.length}</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search datasets..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm flex-1 min-w-[200px]"
        />
        <div className="flex gap-2">
          {(['all', 'pass', 'fail', 'warnings'] as FilterKey[]).map(key => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300 font-medium">Dataset ID</th>
              <th className="px-4 py-3 text-center text-gray-600 dark:text-gray-300 font-medium">Status</th>
              <th className="px-4 py-3 text-right text-gray-600 dark:text-gray-300 font-medium">Version</th>
              <th className="px-4 py-3 text-right text-gray-600 dark:text-gray-300 font-medium">Units</th>
              <th className="px-4 py-3 text-right text-gray-600 dark:text-gray-300 font-medium">Decisions</th>
              <th className="px-4 py-3 text-right text-gray-600 dark:text-gray-300 font-medium">Archives</th>
              <th className="px-4 py-3 text-right text-gray-600 dark:text-gray-300 font-medium">Warnings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredDatasets.map(ds => {
              const status = getDatasetStatus(ds.dataset_id);
              const warnings = getDatasetWarnings(ds.dataset_id);
              
              return (
                <tr 
                  key={ds.dataset_id}
                  onClick={() => onSelectDataset?.(ds)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                >
                  <td className="px-4 py-3 font-mono text-gray-900 dark:text-white">{ds.dataset_id}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                      status === 'PASS' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{ds.dataset_version}</td>
                  <td className="px-4 py-3 text-right text-gray-900 dark:text-white font-medium">{ds.unit_count}</td>
                  <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{ds.decision_count}</td>
                  <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{ds.archive_count}</td>
                  <td className="px-4 py-3 text-right">
                    {warnings > 0 ? (
                      <span className="text-amber-600 dark:text-amber-400">{warnings}</span>
                    ) : (
                      <span className="text-gray-400">0</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DatasetsTable;
