/**
 * CHE·NU Changes Timeline
 */

import React from 'react';
import { EnterpriseIndexJson } from './types';

interface Props {
  enterpriseIndex: EnterpriseIndexJson | null;
}

interface TimelineEntry {
  id: string;
  type: 'merge' | 'batch' | 'update';
  dataset_id?: string;
  timestamp: string;
  units_changed: number;
  description: string;
}

export const ChangesTimeline: React.FC<Props> = ({ enterpriseIndex }) => {
  if (!enterpriseIndex) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No data available</p>
      </div>
    );
  }

  // Generate timeline from dataset updates
  const timeline: TimelineEntry[] = enterpriseIndex.dataset_index
    .map(ds => ({
      id: `update-${ds.dataset_id}`,
      type: 'update' as const,
      dataset_id: ds.dataset_id,
      timestamp: ds.last_updated,
      units_changed: ds.unit_count,
      description: `Dataset ${ds.dataset_id} v${ds.dataset_version}`,
    }))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Add enterprise index generation
  timeline.unshift({
    id: 'enterprise-gen',
    type: 'merge',
    timestamp: enterpriseIndex.generated_at,
    units_changed: enterpriseIndex.enterprise_stats.total_memory_units,
    description: 'Enterprise index generated',
  });

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Changes Timeline</h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {timeline.map(entry => (
            <div key={entry.id} className="p-4 flex items-start gap-4">
              {/* Icon */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                entry.type === 'merge'
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                  : entry.type === 'batch'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {entry.type === 'merge' ? '⚡' : entry.type === 'batch' ? '📦' : '📝'}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {entry.description}
                </p>
                {entry.dataset_id && (
                  <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-0.5">
                    {entry.dataset_id}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {entry.units_changed} units
                </p>
              </div>

              {/* Timestamp */}
              <div className="text-right flex-shrink-0">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(entry.timestamp).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Note */}
      <p className="text-sm text-gray-500 text-center">
        Timeline shows dataset updates and merge sessions. Read-only view.
      </p>
    </div>
  );
};

export default ChangesTimeline;
