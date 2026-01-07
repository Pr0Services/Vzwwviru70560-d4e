/**
 * CHE·NU Dashboard Types
 */

export interface EnterpriseIndexJson {
  enterprise_id: string;
  schema_version: string;
  label: string;
  generated_at: string;
  source_datasets: SourceDataset[];
  dataset_index: DatasetIndexEntry[];
  global_memory_map: GlobalMemoryEntry[];
  cross_dataset_relations: CrossDatasetRelation[];
  enterprise_stats: EnterpriseStats;
}

export interface SourceDataset {
  dataset_id: string;
  dataset_version: string;
  path: string;
}

export interface DatasetIndexEntry {
  dataset_id: string;
  dataset_version: string;
  unit_count: number;
  decision_count: number;
  archive_count: number;
  last_updated: string;
}

export interface GlobalMemoryEntry {
  global_id: string;
  dataset_id: string;
  memory_id: string;
  category: string;
  sphere: string;
  tags: string[];
  relations: { target_global_id: string; relation_type: string }[];
}

export interface CrossDatasetRelation {
  source_global_id: string;
  target_global_id: string;
  relation_type: string;
}

export interface EnterpriseStats {
  total_datasets: number;
  total_memory_units: number;
  total_decisions: number;
  total_archives: number;
  cross_dataset_relations: number;
}

export interface CIReportJson {
  status: 'PASS' | 'FAIL';
  generated_at: string;
  validated_datasets: {
    dataset_id: string;
    status: 'PASS' | 'FAIL';
    errors: { code: string; message: string }[];
    warnings: { code: string; message: string }[];
  }[];
  metrics: {
    memory_units_per_dataset: Record<string, number>;
    orphan_memory_units: number;
    deprecated_ratio: number;
    archive_ratio: number;
    cross_dataset_relation_count: number;
  };
  artifacts: {
    enterprise_index_path: string;
    enterprise_report_path: string;
  };
}

export interface EnterpriseReportJson {
  enterprise_id: string;
  generated_at: string;
  status: 'PASS' | 'PASS_WITH_WARNINGS' | 'FAIL';
  warnings: { code: string; message: string; count: number }[];
  dataset_warnings: {
    dataset_id: string;
    warnings: { code: string; message: string; count: number }[];
  }[];
  stats: {
    datasets: number;
    units: number;
    decisions: number;
    archives: number;
    cross_dataset_relations: number;
    orphan_candidates: number;
  };
}

export interface ManifestJson {
  manifest_id: string;
  generated_at: string;
  app_version: string;
  dataset_id: string;
  label: string;
  artifacts: {
    filename: string;
    sha256: string;
    bytes: number;
    mime_type: string;
  }[];
  signer: {
    algorithm: string;
    key_id: string;
    public_key: string;
  };
  signature: string;
}

export type UIMode = 'light' | 'dark_strict' | 'incident' | 'print';
