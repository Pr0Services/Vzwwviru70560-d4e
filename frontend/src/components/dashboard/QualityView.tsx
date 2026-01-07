/**
 * CHE·NU Quality View
 */

import React from 'react';
import { CIReportJson, EnterpriseReportJson } from './types';

interface Props {
  ciReport: CIReportJson | null;
  enterpriseReport: EnterpriseReportJson | null;
}

export const QualityView: React.FC<Props> = ({ ciReport, enterpriseReport }) => {
  if (!ciReport) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No CI report available</p>
      </div>
    );
  }

  const metrics = ciReport.metrics;
  const hasErrors = ciReport.validated_datasets.some(d => d.status === 'FAIL');
  const totalWarnings = ciReport.validated_datasets.reduce((sum, d) => sum + d.warnings.length, 0);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quality & CI Health</h2>

      {/* CI Status Banner */}
      <div className={`p-6 rounded-lg ${
        ciReport.status === 'PASS'
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
          : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
      }`}>
        <div className="flex items-center gap-4">
          <span className={`text-4xl ${ciReport.status === 'PASS' ? 'text-green-600' : 'text-red-600'}`}>
            {ciReport.status === 'PASS' ? '✓' : '✗'}
          </span>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              CI Status: {ciReport.status}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Generated: {new Date(ciReport.generated_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Orphan Units" value={metrics.orphan_memory_units} threshold={25} />
        <MetricCard label="Deprecated Ratio" value={`${(metrics.deprecated_ratio * 100).toFixed(1)}%`} threshold="15%" />
        <MetricCard label="Archive Ratio" value={`${(metrics.archive_ratio * 100).toFixed(1)}%`} threshold="25%" />
        <MetricCard label="Cross Relations" value={metrics.cross_dataset_relation_count} threshold={200} />
      </div>

      {/* Run CI Hint */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Run CI locally:
        </p>
        <code className="block mt-2 px-3 py-2 bg-gray-100 dark:bg-gray-900 rounded text-sm font-mono text-gray-800 dark:text-gray-300">
          npm run chenu:ci
        </code>
      </div>

      {/* Errors */}
      {hasErrors && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h3 className="font-medium text-red-800 dark:text-red-200 mb-3">Errors</h3>
          <div className="space-y-3">
            {ciReport.validated_datasets
              .filter(d => d.status === 'FAIL')
              .map(ds => (
                <div key={ds.dataset_id} className="border-l-2 border-red-400 pl-3">
                  <p className="font-mono text-sm text-red-700 dark:text-red-300">{ds.dataset_id}</p>
                  <ul className="mt-1 space-y-1">
                    {ds.errors.map((err, i) => (
                      <li key={i} className="text-sm text-red-600 dark:text-red-400">
                        • [{err.code}] {err.message}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {totalWarnings > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <h3 className="font-medium text-amber-800 dark:text-amber-200 mb-3">
            Warnings ({totalWarnings})
          </h3>
          <div className="space-y-3">
            {ciReport.validated_datasets
              .filter(d => d.warnings.length > 0)
              .map(ds => (
                <div key={ds.dataset_id} className="border-l-2 border-amber-400 pl-3">
                  <p className="font-mono text-sm text-amber-700 dark:text-amber-300">{ds.dataset_id}</p>
                  <ul className="mt-1 space-y-1">
                    {ds.warnings.map((warn, i) => (
                      <li key={i} className="text-sm text-amber-600 dark:text-amber-400">
                        • [{warn.code}] {warn.message}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MetricCard: React.FC<{ label: string; value: number | string; threshold: number | string }> = ({
  label,
  value,
  threshold,
}) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const numThreshold = typeof threshold === 'string' ? parseFloat(threshold) : threshold;
  const isWarning = numValue > numThreshold;

  return (
    <div className={`rounded-lg border p-4 ${
      isWarning
        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }`}>
      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">{label}</p>
      <p className={`text-2xl font-bold ${
        isWarning ? 'text-amber-700 dark:text-amber-300' : 'text-gray-900 dark:text-white'
      }`}>
        {value}
      </p>
      <p className="text-xs text-gray-400 mt-1">threshold: {threshold}</p>
    </div>
  );
};

export default QualityView;
