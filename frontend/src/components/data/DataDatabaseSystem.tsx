// CHE·NU™ Data & Database Section Components
// Complete data management with tables, schemas, queries, and visualization

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';

// ============================================================
// TYPES
// ============================================================

type DataType = 'string' | 'number' | 'boolean' | 'date' | 'json' | 'array' | 'reference';
type FieldConstraint = 'required' | 'unique' | 'indexed' | 'primary' | 'foreign';
type QueryOperator = 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'in' | 'between';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'table' | 'cards' | 'json' | 'schema';

interface FieldDefinition {
  id: string;
  name: string;
  type: DataType;
  description?: string;
  constraints: FieldConstraint[];
  defaultValue?: unknown;
  referenceTable?: string;
  referenceField?: string;
  enumValues?: string[];
  isNullable: boolean;
  isComputed?: boolean;
  computeFormula?: string;
}

interface TableSchema {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  sphereId: string;
  fields: FieldDefinition[];
  primaryKey: string[];
  indexes: Array<{
    name: string;
    fields: string[];
    unique: boolean;
  }>;
  relations: Array<{
    name: string;
    targetTable: string;
    type: 'one-to-one' | 'one-to-many' | 'many-to-many';
    sourceField: string;
    targetField: string;
  }>;
  recordCount: number;
  lastModified: Date;
  createdAt: Date;
}

interface DataRecord {
  id: string;
  [key: string]: unknown;
  _metadata?: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    version: number;
  };
}

interface QueryFilter {
  field: string;
  operator: QueryOperator;
  value: unknown;
}

interface QuerySort {
  field: string;
  direction: SortDirection;
}

interface DataQuery {
  table: string;
  filters: QueryFilter[];
  sort?: QuerySort[];
  limit?: number;
  offset?: number;
  select?: string[];
  include?: string[];
}

interface QueryResult {
  records: DataRecord[];
  total: number;
  page: number;
  pageSize: number;
  executionTime: number;
}

interface DataTableProps {
  schema: TableSchema;
  records: DataRecord[];
  onRecordClick?: (record: DataRecord) => void;
  onRecordEdit?: (record: DataRecord) => void;
  onRecordDelete?: (recordId: string) => void;
  onAddRecord?: () => void;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  pageSize?: number;
  className?: string;
}

interface SchemaViewerProps {
  schema: TableSchema;
  onFieldClick?: (field: FieldDefinition) => void;
  onEditSchema?: () => void;
  showRelations?: boolean;
  className?: string;
}

interface QueryBuilderProps {
  tables: TableSchema[];
  onExecuteQuery?: (query: DataQuery) => void;
  savedQueries?: Array<{ id: string; name: string; query: DataQuery }>;
  onSaveQuery?: (name: string, query: DataQuery) => void;
  className?: string;
}

interface RecordFormProps {
  schema: TableSchema;
  record?: DataRecord;
  onSubmit?: (data: Record<string, any>) => void;
  onCancel?: () => void;
  mode: 'create' | 'edit' | 'view';
  className?: string;
}

interface DataDashboardProps {
  tables: TableSchema[];
  onTableClick?: (table: TableSchema) => void;
  onCreateTable?: () => void;
  showStats?: boolean;
  className?: string;
}

// ============================================================
// BRAND COLORS (Memory Prompt)
// ============================================================

const BRAND = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
};

// ============================================================
// CONSTANTS
// ============================================================

const DATA_TYPE_CONFIG: Record<DataType, { color: string; icon: string; label: string }> = {
  string: { color: '#38A169', icon: 'Aa', label: 'Text' },
  number: { color: '#3182CE', icon: '#', label: 'Number' },
  boolean: { color: '#805AD5', icon: '◐', label: 'Boolean' },
  date: { color: BRAND.sacredGold, icon: '📅', label: 'Date' },
  json: { color: '#DD6B20', icon: '{}', label: 'JSON' },
  array: { color: BRAND.cenoteTurquoise, icon: '[]', label: 'Array' },
  reference: { color: '#D53F8C', icon: '🔗', label: 'Reference' },
};

const CONSTRAINT_CONFIG: Record<FieldConstraint, { color: string; label: string; icon: string }> = {
  required: { color: '#E53E3E', label: 'Required', icon: '*' },
  unique: { color: '#805AD5', label: 'Unique', icon: '◆' },
  indexed: { color: '#3182CE', label: 'Indexed', icon: '⚡' },
  primary: { color: BRAND.sacredGold, label: 'Primary Key', icon: '🔑' },
  foreign: { color: '#D53F8C', label: 'Foreign Key', icon: '🔗' },
};

const OPERATOR_CONFIG: Record<QueryOperator, { label: string; symbol: string }> = {
  eq: { label: 'Equals', symbol: '=' },
  ne: { label: 'Not Equals', symbol: '≠' },
  gt: { label: 'Greater Than', symbol: '>' },
  lt: { label: 'Less Than', symbol: '<' },
  gte: { label: 'Greater or Equal', symbol: '≥' },
  lte: { label: 'Less or Equal', symbol: '≤' },
  contains: { label: 'Contains', symbol: '∋' },
  in: { label: 'In List', symbol: '∈' },
  between: { label: 'Between', symbol: '↔' },
};

// ============================================================
// UTILITIES
// ============================================================

function formatValue(value: unknown, type: DataType): string {
  if (value === null || value === undefined) return '—';
  
  switch (type) {
    case 'date':
      return new Date(value).toLocaleDateString();
    case 'boolean':
      return value ? '✓ Yes' : '✗ No';
    case 'json':
    case 'array':
      return JSON.stringify(value).substring(0, 50) + '...';
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : value;
    default:
      return String(value);
  }
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  // Data dashboard
  dataDashboard: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },

  dashboardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dashboardTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  createButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#ffffff',
    backgroundColor: BRAND.sacredGold,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },

  createButtonHover: {
    backgroundColor: BRAND.earthEmber,
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },

  statCard: {
    padding: '16px 20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
  },

  statValue: {
    fontSize: '28px',
    fontWeight: 700,
    color: BRAND.uiSlate,
    marginBottom: '4px',
  },

  statLabel: {
    fontSize: '12px',
    color: BRAND.ancientStone,
    textTransform: 'uppercase' as const,
  },

  tablesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },

  // Table card
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  tableCardHover: {
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transform: 'translateY(-2px)',
  },

  tableCardHeader: {
    padding: '16px',
    borderBottom: `1px solid ${BRAND.ancientStone}08`,
  },

  tableIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: `${BRAND.cenoteTurquoise}15`,
    color: BRAND.cenoteTurquoise,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    marginBottom: '12px',
  },

  tableName: {
    fontSize: '15px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    marginBottom: '4px',
  },

  tableDescription: {
    fontSize: '13px',
    color: BRAND.ancientStone,
    lineHeight: 1.4,
  },

  tableCardBody: {
    padding: '16px',
  },

  tableStats: {
    display: 'flex',
    gap: '16px',
    marginBottom: '12px',
  },

  tableStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: BRAND.ancientStone,
  },

  fieldsList: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
  },

  fieldTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    backgroundColor: BRAND.softSand,
    borderRadius: '4px',
    fontSize: '11px',
    color: BRAND.uiSlate,
  },

  fieldTypeIcon: {
    fontSize: '10px',
    fontWeight: 700,
  },

  // Data table
  dataTable: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
    overflow: 'hidden',
  },

  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: `1px solid ${BRAND.ancientStone}08`,
  },

  tableTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  tableActions: {
    display: 'flex',
    gap: '8px',
  },

  actionButton: {
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: 500,
    color: BRAND.ancientStone,
    backgroundColor: BRAND.softSand,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  actionButtonHover: {
    backgroundColor: `${BRAND.ancientStone}20`,
    color: BRAND.uiSlate,
  },

  tableContainer: {
    overflowX: 'auto' as const,
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },

  th: {
    padding: '12px 16px',
    textAlign: 'left' as const,
    fontSize: '12px',
    fontWeight: 600,
    color: BRAND.ancientStone,
    backgroundColor: BRAND.softSand,
    borderBottom: `1px solid ${BRAND.ancientStone}15`,
    whiteSpace: 'nowrap' as const,
  },

  thSortable: {
    cursor: 'pointer',
    userSelect: 'none' as const,
  },

  thSortIcon: {
    marginLeft: '4px',
    opacity: 0.5,
  },

  td: {
    padding: '12px 16px',
    fontSize: '13px',
    color: BRAND.uiSlate,
    borderBottom: `1px solid ${BRAND.ancientStone}08`,
  },

  tdCheckbox: {
    width: '40px',
  },

  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },

  tr: {
    transition: 'background-color 0.15s',
  },

  trHover: {
    backgroundColor: BRAND.softSand,
  },

  trSelected: {
    backgroundColor: `${BRAND.sacredGold}10`,
  },

  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    borderTop: `1px solid ${BRAND.ancientStone}08`,
  },

  paginationInfo: {
    fontSize: '13px',
    color: BRAND.ancientStone,
  },

  paginationButtons: {
    display: 'flex',
    gap: '4px',
  },

  pageButton: {
    padding: '6px 12px',
    fontSize: '13px',
    color: BRAND.ancientStone,
    backgroundColor: 'transparent',
    border: `1px solid ${BRAND.ancientStone}20`,
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  pageButtonActive: {
    backgroundColor: BRAND.sacredGold,
    color: '#ffffff',
    borderColor: BRAND.sacredGold,
  },

  // Schema viewer
  schemaViewer: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
    overflow: 'hidden',
  },

  schemaHeader: {
    padding: '16px 20px',
    borderBottom: `1px solid ${BRAND.ancientStone}08`,
  },

  schemaTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    marginBottom: '4px',
  },

  schemaMeta: {
    display: 'flex',
    gap: '16px',
    fontSize: '13px',
    color: BRAND.ancientStone,
  },

  schemaContent: {
    padding: '20px',
  },

  fieldsTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },

  fieldRow: {
    borderBottom: `1px solid ${BRAND.ancientStone}08`,
  },

  fieldRowHover: {
    backgroundColor: BRAND.softSand,
  },

  fieldCell: {
    padding: '12px 16px',
    fontSize: '13px',
    verticalAlign: 'middle' as const,
  },

  fieldName: {
    fontWeight: 500,
    color: BRAND.uiSlate,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  fieldType: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 500,
  },

  fieldConstraints: {
    display: 'flex',
    gap: '4px',
  },

  constraintBadge: {
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 500,
  },

  relationsSection: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: BRAND.softSand,
    borderRadius: '8px',
  },

  relationsTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    marginBottom: '12px',
  },

  relationsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },

  relationItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    fontSize: '13px',
  },

  relationIcon: {
    color: '#D53F8C',
  },

  relationName: {
    fontWeight: 500,
    color: BRAND.uiSlate,
  },

  relationTarget: {
    color: BRAND.ancientStone,
  },

  relationArrow: {
    color: BRAND.ancientStone,
  },

  // Query builder
  queryBuilder: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
    overflow: 'hidden',
  },

  queryHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: `1px solid ${BRAND.ancientStone}08`,
  },

  queryTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  queryContent: {
    padding: '20px',
  },

  querySection: {
    marginBottom: '20px',
  },

  querySectionTitle: {
    fontSize: '13px',
    fontWeight: 500,
    color: BRAND.ancientStone,
    marginBottom: '8px',
    textTransform: 'uppercase' as const,
  },

  tableSelector: {
    padding: '10px 14px',
    fontSize: '14px',
    color: BRAND.uiSlate,
    backgroundColor: BRAND.softSand,
    border: `1px solid ${BRAND.ancientStone}20`,
    borderRadius: '8px',
    width: '100%',
    outline: 'none',
    cursor: 'pointer',
  },

  filtersList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },

  filterRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },

  filterSelect: {
    flex: 1,
    padding: '8px 12px',
    fontSize: '13px',
    color: BRAND.uiSlate,
    backgroundColor: BRAND.softSand,
    border: `1px solid ${BRAND.ancientStone}20`,
    borderRadius: '6px',
    outline: 'none',
  },

  filterInput: {
    flex: 2,
    padding: '8px 12px',
    fontSize: '13px',
    color: BRAND.uiSlate,
    backgroundColor: BRAND.softSand,
    border: `1px solid ${BRAND.ancientStone}20`,
    borderRadius: '6px',
    outline: 'none',
  },

  removeFilterButton: {
    padding: '8px',
    fontSize: '14px',
    color: '#E53E3E',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },

  addFilterButton: {
    padding: '8px 12px',
    fontSize: '13px',
    fontWeight: 500,
    color: BRAND.cenoteTurquoise,
    backgroundColor: `${BRAND.cenoteTurquoise}10`,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },

  queryActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    paddingTop: '16px',
    borderTop: `1px solid ${BRAND.ancientStone}08`,
  },

  executeButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#ffffff',
    backgroundColor: BRAND.sacredGold,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },

  saveQueryButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 500,
    color: BRAND.uiSlate,
    backgroundColor: 'transparent',
    border: `1px solid ${BRAND.ancientStone}30`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  // Record form
  recordForm: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
    overflow: 'hidden',
  },

  formHeader: {
    padding: '16px 20px',
    borderBottom: `1px solid ${BRAND.ancientStone}08`,
  },

  formTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  formContent: {
    padding: '20px',
  },

  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },

  formGroupFull: {
    gridColumn: '1 / -1',
  },

  formLabel: {
    fontSize: '13px',
    fontWeight: 500,
    color: BRAND.uiSlate,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  requiredMark: {
    color: '#E53E3E',
  },

  formInput: {
    padding: '10px 14px',
    fontSize: '14px',
    color: BRAND.uiSlate,
    backgroundColor: BRAND.softSand,
    border: `1px solid ${BRAND.ancientStone}20`,
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.15s',
  },

  formInputFocus: {
    borderColor: BRAND.sacredGold,
  },

  formTextarea: {
    padding: '10px 14px',
    fontSize: '14px',
    color: BRAND.uiSlate,
    backgroundColor: BRAND.softSand,
    border: `1px solid ${BRAND.ancientStone}20`,
    borderRadius: '8px',
    outline: 'none',
    minHeight: '100px',
    resize: 'vertical' as const,
  },

  formSelect: {
    padding: '10px 14px',
    fontSize: '14px',
    color: BRAND.uiSlate,
    backgroundColor: BRAND.softSand,
    border: `1px solid ${BRAND.ancientStone}20`,
    borderRadius: '8px',
    outline: 'none',
    cursor: 'pointer',
  },

  formActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    paddingTop: '20px',
    borderTop: `1px solid ${BRAND.ancientStone}08`,
    marginTop: '20px',
  },

  submitButton: {
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#ffffff',
    backgroundColor: BRAND.sacredGold,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },

  cancelButton: {
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: 500,
    color: BRAND.ancientStone,
    backgroundColor: 'transparent',
    border: `1px solid ${BRAND.ancientStone}30`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  // Empty state
  emptyState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    textAlign: 'center' as const,
  },

  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.5,
  },

  emptyText: {
    fontSize: '14px',
    color: BRAND.ancientStone,
    marginBottom: '16px',
  },
};

// ============================================================
// TABLE CARD COMPONENT
// ============================================================

interface TableCardProps {
  table: TableSchema;
  onClick?: () => void;
  className?: string;
}

export function TableCard({
  table,
  onClick,
  className,
}: TableCardProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.tableCard,
        ...(isHovered && styles.tableCardHover),
      }}
      className={className}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.tableCardHeader}>
        <div style={styles.tableIcon}>🗄️</div>
        <div style={styles.tableName}>{table.displayName}</div>
        {table.description && (
          <div style={styles.tableDescription}>{table.description}</div>
        )}
      </div>

      <div style={styles.tableCardBody}>
        <div style={styles.tableStats}>
          <span style={styles.tableStat}>
            📊 {formatNumber(table.recordCount)} records
          </span>
          <span style={styles.tableStat}>
            📝 {table.fields.length} fields
          </span>
        </div>

        <div style={styles.fieldsList}>
          {table.fields.slice(0, 5).map((field) => {
            const typeConfig = DATA_TYPE_CONFIG[field.type];
            return (
              <span key={field.id} style={styles.fieldTag}>
                <span
                  style={{
                    ...styles.fieldTypeIcon,
                    color: typeConfig.color,
                  }}
                >
                  {typeConfig.icon}
                </span>
                {field.name}
              </span>
            );
          })}
          {table.fields.length > 5 && (
            <span style={styles.fieldTag}>
              +{table.fields.length - 5} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DATA TABLE COMPONENT
// ============================================================

export function DataTable({
  schema,
  records,
  onRecordClick,
  onRecordEdit,
  onRecordDelete,
  onAddRecord,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  pageSize = 10,
  className,
}: DataTableProps): JSX.Element {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [addHovered, setAddHovered] = useState(false);

  const totalPages = Math.ceil(records.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const displayedRecords = records.slice(startIndex, startIndex + pageSize);

  const handleSort = (fieldId: string) => {
    if (sortField === fieldId) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(fieldId);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === displayedRecords.length) {
      onSelectionChange?.([]);
    } else {
      onSelectionChange?.(displayedRecords.map((r) => r.id));
    }
  };

  const handleSelectRecord = (recordId: string) => {
    if (selectedIds.includes(recordId)) {
      onSelectionChange?.(selectedIds.filter((id) => id !== recordId));
    } else {
      onSelectionChange?.([...selectedIds, recordId]);
    }
  };

  return (
    <div style={styles.dataTable} className={className}>
      <div style={styles.tableHeader}>
        <span style={styles.tableTitle}>{schema.displayName}</span>
        <div style={styles.tableActions}>
          {onAddRecord && (
            <button
              style={{
                ...styles.actionButton,
                ...(addHovered && styles.actionButtonHover),
              }}
              onClick={onAddRecord}
              onMouseEnter={() => setAddHovered(true)}
              onMouseLeave={() => setAddHovered(false)}
            >
              ➕ Add Record
            </button>
          )}
        </div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              {selectable && (
                <th style={{ ...styles.th, ...styles.tdCheckbox }}>
                  <input
                    type="checkbox"
                    style={styles.checkbox}
                    checked={selectedIds.length === displayedRecords.length}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {schema.fields.slice(0, 6).map((field) => (
                <th
                  key={field.id}
                  style={{
                    ...styles.th,
                    ...styles.thSortable,
                  }}
                  onClick={() => handleSort(field.id)}
                >
                  {field.name}
                  {sortField === field.id && (
                    <span style={styles.thSortIcon}>
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              ))}
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedRecords.map((record) => {
              const isSelected = selectedIds.includes(record.id);
              const isHovered = hoveredRow === record.id;

              return (
                <tr
                  key={record.id}
                  style={{
                    ...styles.tr,
                    ...(isHovered && styles.trHover),
                    ...(isSelected && styles.trSelected),
                  }}
                  onMouseEnter={() => setHoveredRow(record.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => onRecordClick?.(record)}
                >
                  {selectable && (
                    <td style={{ ...styles.td, ...styles.tdCheckbox }}>
                      <input
                        type="checkbox"
                        style={styles.checkbox}
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectRecord(record.id);
                        }}
                      />
                    </td>
                  )}
                  {schema.fields.slice(0, 6).map((field) => (
                    <td key={field.id} style={styles.td}>
                      {formatValue(record[field.name], field.type)}
                    </td>
                  ))}
                  <td style={styles.td}>
                    {onRecordEdit && (
                      <button
                        style={styles.actionButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRecordEdit(record);
                        }}
                      >
                        ✏️
                      </button>
                    )}
                    {onRecordDelete && (
                      <button
                        style={styles.actionButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRecordDelete(record.id);
                        }}
                      >
                        🗑️
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={styles.pagination}>
        <span style={styles.paginationInfo}>
          Showing {startIndex + 1}-{Math.min(startIndex + pageSize, records.length)} of {records.length}
        </span>
        <div style={styles.paginationButtons}>
          <button
            style={styles.pageButton}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            ←
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              style={{
                ...styles.pageButton,
                ...(currentPage === page && styles.pageButtonActive),
              }}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            style={styles.pageButton}
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SCHEMA VIEWER COMPONENT
// ============================================================

export function SchemaViewer({
  schema,
  onFieldClick,
  onEditSchema,
  showRelations = true,
  className,
}: SchemaViewerProps): JSX.Element {
  const [hoveredField, setHoveredField] = useState<string | null>(null);

  return (
    <div style={styles.schemaViewer} className={className}>
      <div style={styles.schemaHeader}>
        <div style={styles.schemaTitle}>{schema.displayName}</div>
        <div style={styles.schemaMeta}>
          <span>📊 {formatNumber(schema.recordCount)} records</span>
          <span>📝 {schema.fields.length} fields</span>
          <span>🔗 {schema.relations.length} relations</span>
        </div>
      </div>

      <div style={styles.schemaContent}>
        <table style={styles.fieldsTable}>
          <thead>
            <tr>
              <th style={styles.th}>Field Name</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Constraints</th>
              <th style={styles.th}>Description</th>
            </tr>
          </thead>
          <tbody>
            {schema.fields.map((field) => {
              const typeConfig = DATA_TYPE_CONFIG[field.type];
              const isHovered = hoveredField === field.id;

              return (
                <tr
                  key={field.id}
                  style={{
                    ...styles.fieldRow,
                    ...(isHovered && styles.fieldRowHover),
                  }}
                  onMouseEnter={() => setHoveredField(field.id)}
                  onMouseLeave={() => setHoveredField(null)}
                  onClick={() => onFieldClick?.(field)}
                >
                  <td style={styles.fieldCell}>
                    <span style={styles.fieldName}>
                      {field.constraints.includes('primary') && '🔑 '}
                      {field.name}
                    </span>
                  </td>
                  <td style={styles.fieldCell}>
                    <span
                      style={{
                        ...styles.fieldType,
                        backgroundColor: `${typeConfig.color}15`,
                        color: typeConfig.color,
                      }}
                    >
                      {typeConfig.icon} {typeConfig.label}
                    </span>
                  </td>
                  <td style={styles.fieldCell}>
                    <div style={styles.fieldConstraints}>
                      {field.constraints.map((constraint) => {
                        const config = CONSTRAINT_CONFIG[constraint];
                        return (
                          <span
                            key={constraint}
                            style={{
                              ...styles.constraintBadge,
                              backgroundColor: `${config.color}15`,
                              color: config.color,
                            }}
                          >
                            {config.icon} {config.label}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td style={styles.fieldCell}>
                    {field.description || '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {showRelations && schema.relations.length > 0 && (
          <div style={styles.relationsSection}>
            <div style={styles.relationsTitle}>Relations</div>
            <div style={styles.relationsList}>
              {schema.relations.map((relation) => (
                <div key={relation.name} style={styles.relationItem}>
                  <span style={styles.relationIcon}>🔗</span>
                  <span style={styles.relationName}>{relation.name}</span>
                  <span style={styles.relationArrow}>→</span>
                  <span style={styles.relationTarget}>
                    {relation.targetTable} ({relation.type})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// DATA DASHBOARD COMPONENT
// ============================================================

export function DataDashboard({
  tables,
  onTableClick,
  onCreateTable,
  showStats = true,
  className,
}: DataDashboardProps): JSX.Element {
  const [createHovered, setCreateHovered] = useState(false);

  const totalRecords = tables.reduce((sum, t) => sum + t.recordCount, 0);
  const totalFields = tables.reduce((sum, t) => sum + t.fields.length, 0);
  const totalRelations = tables.reduce((sum, t) => sum + t.relations.length, 0);

  if (tables.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>🗄️</div>
        <div style={styles.emptyText}>No data tables yet</div>
        {onCreateTable && (
          <button
            style={{
              ...styles.createButton,
              ...(createHovered && styles.createButtonHover),
            }}
            onClick={onCreateTable}
            onMouseEnter={() => setCreateHovered(true)}
            onMouseLeave={() => setCreateHovered(false)}
          >
            ➕ Create Table
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={styles.dataDashboard} className={className}>
      <div style={styles.dashboardHeader}>
        <span style={styles.dashboardTitle}>Data / Database</span>
        {onCreateTable && (
          <button
            style={{
              ...styles.createButton,
              ...(createHovered && styles.createButtonHover),
            }}
            onClick={onCreateTable}
            onMouseEnter={() => setCreateHovered(true)}
            onMouseLeave={() => setCreateHovered(false)}
          >
            ➕ New Table
          </button>
        )}
      </div>

      {showStats && (
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{tables.length}</div>
            <div style={styles.statLabel}>Tables</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{formatNumber(totalRecords)}</div>
            <div style={styles.statLabel}>Records</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{totalFields}</div>
            <div style={styles.statLabel}>Fields</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{totalRelations}</div>
            <div style={styles.statLabel}>Relations</div>
          </div>
        </div>
      )}

      <div style={styles.tablesGrid}>
        {tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            onClick={() => onTableClick?.(table)}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  DataType,
  FieldConstraint,
  QueryOperator,
  SortDirection,
  ViewMode,
  FieldDefinition,
  TableSchema,
  DataRecord,
  QueryFilter,
  QuerySort,
  DataQuery,
  QueryResult,
  DataTableProps,
  SchemaViewerProps,
  QueryBuilderProps,
  RecordFormProps,
  DataDashboardProps,
  TableCardProps,
};

export {
  DATA_TYPE_CONFIG,
  CONSTRAINT_CONFIG,
  OPERATOR_CONFIG,
  formatValue,
  formatDate,
  formatNumber,
};

export default {
  DataDashboard,
  DataTable,
  SchemaViewer,
  TableCard,
};
