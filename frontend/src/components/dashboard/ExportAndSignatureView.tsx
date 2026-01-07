/**
 * CHE·NU Export & Signature View
 * PHASE 3: Wire export + signature verification
 */

import React, { useState, useRef } from 'react';
import { ManifestJson, EnterpriseIndexJson, CIReportJson } from './types';
import { exportToPDF, downloadJSON, generateExportId } from './export';
import { verifyManifest, parseManifestFile, generateVerificationReport, VerificationResult } from './verify';

interface Props {
  manifests: ManifestJson[];
  enterpriseIndex?: EnterpriseIndexJson | null;
  ciReport?: CIReportJson | null;
}

export const ExportAndSignatureView: React.FC<Props> = ({ 
  manifests, 
  enterpriseIndex,
  ciReport,
}) => {
  const [verifyResult, setVerifyResult] = useState<VerificationResult | null>(null);
  const [selectedManifest, setSelectedManifest] = useState<ManifestJson | null>(null);
  const [verificationReport, setVerificationReport] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVerify = (manifest: ManifestJson) => {
    const result = verifyManifest(manifest);
    setVerifyResult(result);
    setSelectedManifest(manifest);
    setVerificationReport(generateVerificationReport(manifest, result));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const manifest = await parseManifestFile(file);
    if (manifest) {
      handleVerify(manifest);
    } else {
      setVerifyResult({
        valid: false,
        status: 'error',
        message: 'Failed to parse manifest file',
      });
    }
  };

  const handleExportPDF = () => {
    exportToPDF(enterpriseIndex || null, ciReport || null, {
      title: 'CHE·NU Enterprise Dashboard',
      includeTimestamp: true,
      includeSig: true,
    });
  };

  const handleExportJSON = () => {
    downloadJSON(enterpriseIndex || null, ciReport || null);
  };

  const copyReport = () => {
    if (verificationReport) {
      navigator.clipboard.writeText(verificationReport);
    }
  };

  const exportId = enterpriseIndex ? generateExportId(enterpriseIndex) : null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Export & Signatures</h2>
        <div className="flex gap-2">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 print:hidden"
          >
            Export JSON
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 print:hidden"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Export ID */}
      {exportId && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 uppercase mb-1">Current Export ID</p>
          <p className="font-mono text-sm text-gray-900 dark:text-white">{exportId}</p>
          <p className="text-xs text-gray-400 mt-1">Deterministic based on enterprise stats</p>
        </div>
      )}

      {/* Verification Result */}
      {verifyResult && (
        <div className={`p-4 rounded-lg ${
          verifyResult.status === 'valid' || verifyResult.status === 'demo'
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={verifyResult.valid ? 'text-green-600' : 'text-red-600'}>
              {verifyResult.valid ? '✓' : '✗'}
            </span>
            <p className={`font-medium ${
              verifyResult.valid
                ? 'text-green-700 dark:text-green-300'
                : 'text-red-700 dark:text-red-300'
            }`}>
              {verifyResult.status.toUpperCase()}: {verifyResult.message}
            </p>
          </div>
          {verifyResult.details && (
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 mt-2">
              <p>Manifest: {verifyResult.details.manifest_id}</p>
              <p>Algorithm: {verifyResult.details.algorithm}</p>
              <p>Verified: {verifyResult.details.verified_at}</p>
            </div>
          )}
        </div>
      )}

      {/* Upload Manifest for Verification */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-medium text-gray-900 dark:text-white mb-3">Verify External Manifest</h3>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Upload Manifest (.json)
        </button>
      </div>

      {/* Verification Report */}
      {verificationReport && (
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-white">Verification Report</h3>
            <button
              onClick={copyReport}
              className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs hover:bg-gray-600"
            >
              Copy
            </button>
          </div>
          <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap overflow-x-auto">
            {verificationReport}
          </pre>
        </div>
      )}

      {/* Manifests List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-white">Available Manifests</h3>
        </div>

        {manifests.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No manifests available</p>
            <p className="text-sm mt-1">Export the dashboard to create a signed manifest</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {manifests.map(manifest => (
              <div key={manifest.manifest_id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-sm text-gray-900 dark:text-white">
                      {manifest.manifest_id}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Generated: {new Date(manifest.generated_at).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Version: {manifest.app_version} | Label: {manifest.label}
                    </p>
                  </div>
                  <button
                    onClick={() => handleVerify(manifest)}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Verify
                  </button>
                </div>

                {/* Artifacts */}
                <div className="mt-3">
                  <p className="text-xs text-gray-500 uppercase mb-2">Artifacts ({manifest.artifacts.length})</p>
                  <div className="space-y-1">
                    {manifest.artifacts.map((artifact, i) => (
                      <div key={i} className="flex items-center justify-between text-xs bg-gray-50 dark:bg-gray-900 rounded px-2 py-1">
                        <span className="font-mono text-gray-600 dark:text-gray-400">{artifact.filename}</span>
                        <span className="text-gray-400">{(artifact.bytes / 1024).toFixed(1)} KB</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Signature Info */}
                <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-900 rounded text-xs font-mono">
                  <span className="text-gray-500">sig:</span>{' '}
                  <span className="text-gray-400">{manifest.signature.slice(0, 32)}...</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Export Info */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 print:hidden">
        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Export Features</h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Deterministic PDF output (same data = same export ID)</li>
          <li>• Includes enterprise stats, dataset table, CI status</li>
          <li>• JSON export for programmatic access</li>
          <li>• Signature verification for audit trail</li>
          <li>• Print CSS optimized for A4</li>
        </ul>
      </div>
    </div>
  );
};

export default ExportAndSignatureView;
