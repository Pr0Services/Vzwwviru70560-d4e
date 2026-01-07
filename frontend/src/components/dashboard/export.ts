/**
 * CHE·NU Dashboard Export
 * Deterministic PDF export via print
 */

import { EnterpriseIndexJson, CIReportJson } from './types';

export interface ExportOptions {
  title?: string;
  includeTimestamp?: boolean;
  includeSig?: boolean;
}

/**
 * Generate deterministic export ID
 */
export function generateExportId(enterpriseIndex: EnterpriseIndexJson): string {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const hash = simpleHash(JSON.stringify(enterpriseIndex.enterprise_stats));
  return `EXPORT_${date}_${hash}`;
}

/**
 * Simple deterministic hash for IDs
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).toUpperCase().slice(0, 8);
}

/**
 * Prepare print-friendly HTML for PDF export
 */
export function preparePrintContent(
  enterpriseIndex: EnterpriseIndexJson | null,
  ciReport: CIReportJson | null,
  options: ExportOptions = {}
): string {
  if (!enterpriseIndex) return '<p>No data available</p>';

  const stats = enterpriseIndex.enterprise_stats;
  const exportId = generateExportId(enterpriseIndex);
  const timestamp = new Date().toISOString();

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>CHE·NU Enterprise Dashboard Export</title>
  <style>
    @page {
      size: A4;
      margin: 20mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #1a1a1a;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      border-bottom: 2px solid #1a1a1a;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .header h1 {
      margin: 0 0 8px 0;
      font-size: 24pt;
    }
    .header .meta {
      font-size: 9pt;
      color: #666;
    }
    .section {
      margin-bottom: 24px;
    }
    .section h2 {
      font-size: 14pt;
      border-bottom: 1px solid #ddd;
      padding-bottom: 8px;
      margin-bottom: 16px;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    .kpi {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: center;
    }
    .kpi .value {
      font-size: 20pt;
      font-weight: bold;
    }
    .kpi .label {
      font-size: 9pt;
      color: #666;
      text-transform: uppercase;
    }
    .status-pass {
      color: #16a34a;
    }
    .status-fail {
      color: #dc2626;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10pt;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background: #f5f5f5;
      font-weight: 600;
    }
    .footer {
      margin-top: 40px;
      padding-top: 16px;
      border-top: 1px solid #ddd;
      font-size: 8pt;
      color: #666;
    }
    .sig-block {
      margin-top: 24px;
      padding: 12px;
      background: #f9f9f9;
      border: 1px dashed #ccc;
      font-family: monospace;
      font-size: 8pt;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🌳 CHE·NU Enterprise Dashboard</h1>
    <div class="meta">
      <strong>Export ID:</strong> ${exportId}<br>
      <strong>Generated:</strong> ${timestamp}<br>
      <strong>Schema:</strong> ${enterpriseIndex.schema_version}<br>
      <strong>Label:</strong> ${enterpriseIndex.label}
    </div>
  </div>

  <div class="section">
    <h2>Enterprise Overview</h2>
    <div class="kpi-grid">
      <div class="kpi">
        <div class="value">${stats.total_datasets}</div>
        <div class="label">Datasets</div>
      </div>
      <div class="kpi">
        <div class="value">${stats.total_memory_units}</div>
        <div class="label">Memory Units</div>
      </div>
      <div class="kpi">
        <div class="value">${stats.total_decisions}</div>
        <div class="label">Decisions</div>
      </div>
      <div class="kpi">
        <div class="value">${stats.cross_dataset_relations}</div>
        <div class="label">Relations</div>
      </div>
    </div>
  </div>

  ${ciReport ? `
  <div class="section">
    <h2>CI Status</h2>
    <p class="${ciReport.status === 'PASS' ? 'status-pass' : 'status-fail'}">
      <strong>${ciReport.status === 'PASS' ? '✓' : '✗'} ${ciReport.status}</strong>
    </p>
    <p>Last run: ${ciReport.generated_at}</p>
  </div>
  ` : ''}

  <div class="section">
    <h2>Datasets</h2>
    <table>
      <thead>
        <tr>
          <th>Dataset ID</th>
          <th>Version</th>
          <th>Units</th>
          <th>Decisions</th>
          <th>Archives</th>
        </tr>
      </thead>
      <tbody>
        ${enterpriseIndex.dataset_index.map(ds => `
        <tr>
          <td>${ds.dataset_id}</td>
          <td>${ds.dataset_version}</td>
          <td>${ds.unit_count}</td>
          <td>${ds.decision_count}</td>
          <td>${ds.archive_count}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>Cross-Dataset Relations</h2>
    <p>Total: ${enterpriseIndex.cross_dataset_relations.length} relations</p>
    <table>
      <thead>
        <tr>
          <th>Source</th>
          <th>Target</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        ${enterpriseIndex.cross_dataset_relations.slice(0, 10).map(rel => `
        <tr>
          <td>${rel.source_global_id}</td>
          <td>${rel.target_global_id}</td>
          <td>${rel.relation_type}</td>
        </tr>
        `).join('')}
        ${enterpriseIndex.cross_dataset_relations.length > 10 ? `
        <tr>
          <td colspan="3" style="text-align: center; color: #666;">
            ... and ${enterpriseIndex.cross_dataset_relations.length - 10} more
          </td>
        </tr>
        ` : ''}
      </tbody>
    </table>
  </div>

  ${options.includeSig ? `
  <div class="sig-block">
    <strong>SIGNATURE PLACEHOLDER</strong><br>
    Export ID: ${exportId}<br>
    Algorithm: ed25519<br>
    Key ID: DEMO_KEY_01<br>
    Signature: [TO BE SIGNED BY CI PIPELINE]
  </div>
  ` : ''}

  <div class="footer">
    <p>
      CHE·NU™ — Governed Intelligence Operating System<br>
      This export is READ-ONLY and deterministic.<br>
      Verify signatures at: verify.chenu.ai
    </p>
  </div>
</body>
</html>
  `;
}

/**
 * Trigger browser print dialog for PDF export
 */
export function exportToPDF(
  enterpriseIndex: EnterpriseIndexJson | null,
  ciReport: CIReportJson | null,
  options: ExportOptions = {}
): void {
  const content = preparePrintContent(enterpriseIndex, ciReport, {
    includeSig: true,
    ...options,
  });

  // Create print window
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    
    // Trigger print after content loads
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

/**
 * Export as JSON (deterministic)
 */
export function exportToJSON(
  enterpriseIndex: EnterpriseIndexJson | null,
  ciReport: CIReportJson | null
): string {
  const exportId = enterpriseIndex ? generateExportId(enterpriseIndex) : 'EXPORT_EMPTY';
  
  return JSON.stringify({
    export_id: exportId,
    exported_at: new Date().toISOString(),
    enterprise_index: enterpriseIndex,
    ci_report: ciReport,
  }, null, 2);
}

/**
 * Download JSON export
 */
export function downloadJSON(
  enterpriseIndex: EnterpriseIndexJson | null,
  ciReport: CIReportJson | null
): void {
  const content = exportToJSON(enterpriseIndex, ciReport);
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `chenu_export_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
}

export default {
  generateExportId,
  preparePrintContent,
  exportToPDF,
  exportToJSON,
  downloadJSON,
};
