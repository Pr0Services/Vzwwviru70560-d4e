/**
 * CHE·NU Dashboard Data Hook
 * PRIORITY: Real artifacts first, fallback to /demo_fixtures/
 */

import { useState, useEffect } from 'react';
import { EnterpriseIndexJson, CIReportJson, EnterpriseReportJson, ManifestJson } from './types';

export interface DashboardData {
  enterpriseIndex: EnterpriseIndexJson | null;
  ciReport: CIReportJson | null;
  enterpriseReport: EnterpriseReportJson | null;
  manifests: ManifestJson[];
  loading: boolean;
  error: string | null;
  isDemo: boolean;
  source: 'real' | 'demo' | 'none';
}

// Demo fixtures paths
const DEMO_PATHS = {
  enterpriseIndex: '/demo_fixtures/enterprise_index.demo.json',
  ciReport: '/demo_fixtures/ci_report.demo.json',
  enterpriseReport: '/demo_fixtures/enterprise_index.report.demo.json',
  manifests: '/demo_fixtures/manifests/demo_dashboard_export.manifest.json',
};

// Real artifact paths (production)
const REAL_PATHS = {
  enterpriseIndex: '/output/enterprise_index.json',
  ciReport: '/output/ci_report.json',
  enterpriseReport: '/output/enterprise_index.report.json',
  manifests: '/output/manifests/',
};

async function tryFetch<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (res.ok) return await res.json();
    return null;
  } catch {
    return null;
  }
}

export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    enterpriseIndex: null,
    ciReport: null,
    enterpriseReport: null,
    manifests: [],
    loading: true,
    error: null,
    isDemo: true,
    source: 'none',
  });

  useEffect(() => {
    const loadData = async () => {
      // STEP 1: Try real artifacts first
      let enterpriseIndex = await tryFetch<EnterpriseIndexJson>(REAL_PATHS.enterpriseIndex);
      let ciReport = await tryFetch<CIReportJson>(REAL_PATHS.ciReport);
      let enterpriseReport = await tryFetch<EnterpriseReportJson>(REAL_PATHS.enterpriseReport);
      let source: 'real' | 'demo' | 'none' = 'real';

      // STEP 2: Fallback to demo fixtures if real not found
      if (!enterpriseIndex) {
        enterpriseIndex = await tryFetch<EnterpriseIndexJson>(DEMO_PATHS.enterpriseIndex);
        source = 'demo';
      }
      if (!ciReport) {
        ciReport = await tryFetch<CIReportJson>(DEMO_PATHS.ciReport);
      }
      if (!enterpriseReport) {
        enterpriseReport = await tryFetch<EnterpriseReportJson>(DEMO_PATHS.enterpriseReport);
      }

      // STEP 3: Load manifests
      let manifests: ManifestJson[] = [];
      const manifest = await tryFetch<ManifestJson>(DEMO_PATHS.manifests);
      if (manifest) manifests = [manifest];

      // STEP 4: Set final state
      if (!enterpriseIndex && !ciReport) {
        setData({
          enterpriseIndex: null,
          ciReport: null,
          enterpriseReport: null,
          manifests: [],
          loading: false,
          error: 'No data available. Check /output/ or /demo_fixtures/',
          isDemo: true,
          source: 'none',
        });
      } else {
        setData({
          enterpriseIndex,
          ciReport,
          enterpriseReport,
          manifests,
          loading: false,
          error: null,
          isDemo: source === 'demo',
          source,
        });
      }
    };

    loadData();
  }, []);

  return data;
}

// Alias for backward compatibility
export const useDemoData = useDashboardData;

export default useDashboardData;
