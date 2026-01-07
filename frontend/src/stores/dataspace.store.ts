/**
 * CHE·NU™ - DATASPACE STORE
 * 
 * DataSpace manages data, databases, and information for each sphere
 * Nova supervises all database operations
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SphereId } from '../config/spheres.config';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface DataSpace {
  id: string;
  name: string;
  description: string;
  sphereId: SphereId;
  type: DataSpaceType;
  schema: DataSchema;
  records: DataRecord[];
  createdAt: string;
  updatedAt: string;
  permissions: DataPermissions;
  metadata: DataSpaceMetadata;
}

export type DataSpaceType = 
  | 'table'
  | 'document'
  | 'keyvalue'
  | 'graph'
  | 'timeseries';

export interface DataSchema {
  fields: SchemaField[];
  primaryKey?: string;
  indexes?: string[];
}

export interface SchemaField {
  name: string;
  type: FieldType;
  required: boolean;
  defaultValue?: unknown;
  description?: string;
  constraints?: FieldConstraint[];
}

export type FieldType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'json'
  | 'array'
  | 'reference';

export interface FieldConstraint {
  type: 'min' | 'max' | 'pattern' | 'unique' | 'enum';
  value: unknown;
}

export interface DataRecord {
  id: string;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface DataPermissions {
  read: PermissionLevel;
  write: PermissionLevel;
  delete: PermissionLevel;
  share: PermissionLevel;
}

export type PermissionLevel = 'owner' | 'my_team' | 'sphere' | 'all';

export interface DataSpaceMetadata {
  recordCount: number;
  sizeBytes: number;
  lastAccessedAt: string;
  tags: string[];
}

export interface DataQuery {
  select?: string[];
  where?: QueryCondition[];
  orderBy?: { field: string; direction: 'asc' | 'desc' }[];
  limit?: number;
  offset?: number;
}

export interface QueryCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
  value: unknown;
}

// ═══════════════════════════════════════════════════════════════
// STORE STATE & ACTIONS
// ═══════════════════════════════════════════════════════════════

interface DataSpaceState {
  // State
  dataspaces: Record<string, DataSpace>;
  activeDataspaceId: string | null;
  isLoading: boolean;
  
  // DataSpace CRUD
  createDataSpace: (data: CreateDataSpaceInput) => DataSpace;
  getDataSpace: (id: string) => DataSpace | undefined;
  updateDataSpace: (id: string, data: Partial<DataSpace>) => void;
  deleteDataSpace: (id: string) => void;
  
  // Navigation
  setActiveDataSpace: (id: string | null) => void;
  getActiveDataSpace: () => DataSpace | undefined;
  getDataSpacesBySphere: (sphereId: SphereId) => DataSpace[];
  
  // Record Operations
  insertRecord: (dataspaceId: string, data: Record<string, unknown>) => DataRecord;
  updateRecord: (dataspaceId: string, recordId: string, data: Partial<Record<string, unknown>>) => void;
  deleteRecord: (dataspaceId: string, recordId: string) => void;
  
  // Queries
  query: (dataspaceId: string, query: DataQuery) => DataRecord[];
  searchRecords: (dataspaceId: string, searchTerm: string) => DataRecord[];
  
  // Schema Operations
  addField: (dataspaceId: string, field: SchemaField) => void;
  removeField: (dataspaceId: string, fieldName: string) => void;
}

interface CreateDataSpaceInput {
  name: string;
  description?: string;
  sphereId: SphereId;
  type?: DataSpaceType;
  schema?: DataSchema;
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

const generateId = () => `ds_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const createDefaultSchema = (): DataSchema => ({
  fields: [
    { name: 'id', type: 'string', required: true },
    { name: 'name', type: 'string', required: true },
    { name: 'createdAt', type: 'datetime', required: true },
  ],
  primaryKey: 'id',
});

// ═══════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════

export const useDataSpaceStore = create<DataSpaceState>()(
  persist(
    (set, get) => ({
      // Initial State
      dataspaces: {},
      activeDataspaceId: null,
      isLoading: false,

      // ─────────────────────────────────────────────────────────
      // DataSpace CRUD
      // ─────────────────────────────────────────────────────────
      createDataSpace: (data: CreateDataSpaceInput): DataSpace => {
        const id = generateId();
        const now = new Date().toISOString();
        
        const dataspace: DataSpace = {
          id,
          name: data.name,
          description: data.description || '',
          sphereId: data.sphereId,
          type: data.type || 'table',
          schema: data.schema || createDefaultSchema(),
          records: [],
          createdAt: now,
          updatedAt: now,
          permissions: {
            read: 'owner',
            write: 'owner',
            delete: 'owner',
            share: 'owner',
          },
          metadata: {
            recordCount: 0,
            sizeBytes: 0,
            lastAccessedAt: now,
            tags: [],
          },
        };

        set((state) => ({
          dataspaces: { ...state.dataspaces, [id]: dataspace },
        }));

        return dataspace;
      },

      getDataSpace: (id: string): DataSpace | undefined => {
        return get().dataspaces[id];
      },

      updateDataSpace: (id: string, data: Partial<DataSpace>): void => {
        set((state) => {
          const ds = state.dataspaces[id];
          if (!ds) return state;
          
          return {
            dataspaces: {
              ...state.dataspaces,
              [id]: { ...ds, ...data, updatedAt: new Date().toISOString() },
            },
          };
        });
      },

      deleteDataSpace: (id: string): void => {
        set((state) => {
          const { [id]: deleted, ...remaining } = state.dataspaces;
          return {
            dataspaces: remaining,
            activeDataspaceId: state.activeDataspaceId === id ? null : state.activeDataspaceId,
          };
        });
      },

      // ─────────────────────────────────────────────────────────
      // Navigation
      // ─────────────────────────────────────────────────────────
      setActiveDataSpace: (id: string | null): void => {
        if (id) {
          get().updateDataSpace(id, { 
            metadata: { 
              ...get().dataspaces[id]?.metadata!, 
              lastAccessedAt: new Date().toISOString() 
            } 
          });
        }
        set({ activeDataspaceId: id });
      },

      getActiveDataSpace: (): DataSpace | undefined => {
        const { activeDataspaceId, dataspaces } = get();
        return activeDataspaceId ? dataspaces[activeDataspaceId] : undefined;
      },

      getDataSpacesBySphere: (sphereId: SphereId): DataSpace[] => {
        return Object.values(get().dataspaces).filter((ds) => ds.sphereId === sphereId);
      },

      // ─────────────────────────────────────────────────────────
      // Record Operations
      // ─────────────────────────────────────────────────────────
      insertRecord: (dataspaceId: string, data: Record<string, unknown>): DataRecord => {
        const now = new Date().toISOString();
        const record: DataRecord = {
          id: `rec_${Date.now()}`,
          data: { ...data, id: data.id || `rec_${Date.now()}` },
          createdAt: now,
          updatedAt: now,
        };

        set((state) => {
          const ds = state.dataspaces[dataspaceId];
          if (!ds) return state;

          return {
            dataspaces: {
              ...state.dataspaces,
              [dataspaceId]: {
                ...ds,
                records: [...ds.records, record],
                updatedAt: now,
                metadata: {
                  ...ds.metadata,
                  recordCount: ds.records.length + 1,
                },
              },
            },
          };
        });

        return record;
      },

      updateRecord: (dataspaceId: string, recordId: string, data: Partial<Record<string, unknown>>): void => {
        set((state) => {
          const ds = state.dataspaces[dataspaceId];
          if (!ds) return state;

          const records = ds.records.map((r) =>
            r.id === recordId
              ? { ...r, data: { ...r.data, ...data }, updatedAt: new Date().toISOString() }
              : r
          );

          return {
            dataspaces: {
              ...state.dataspaces,
              [dataspaceId]: { ...ds, records, updatedAt: new Date().toISOString() },
            },
          };
        });
      },

      deleteRecord: (dataspaceId: string, recordId: string): void => {
        set((state) => {
          const ds = state.dataspaces[dataspaceId];
          if (!ds) return state;

          return {
            dataspaces: {
              ...state.dataspaces,
              [dataspaceId]: {
                ...ds,
                records: ds.records.filter((r) => r.id !== recordId),
                metadata: { ...ds.metadata, recordCount: ds.records.length - 1 },
              },
            },
          };
        });
      },

      // ─────────────────────────────────────────────────────────
      // Queries
      // ─────────────────────────────────────────────────────────
      query: (dataspaceId: string, query: DataQuery): DataRecord[] => {
        const ds = get().dataspaces[dataspaceId];
        if (!ds) return [];

        let results = [...ds.records];

        // Apply where conditions
        if (query.where) {
          results = results.filter((record) =>
            query.where!.every((cond) => {
              const value = record.data[cond.field];
              switch (cond.operator) {
                case 'eq': return value === cond.value;
                case 'ne': return value !== cond.value;
                case 'gt': return (value as number) > (cond.value as number);
                case 'gte': return (value as number) >= (cond.value as number);
                case 'lt': return (value as number) < (cond.value as number);
                case 'lte': return (value as number) <= (cond.value as number);
                case 'contains': return String(value).includes(String(cond.value));
                case 'in': return (cond.value as unknown[]).includes(value);
                default: return true;
              }
            })
          );
        }

        // Apply ordering
        if (query.orderBy) {
          results.sort((a, b) => {
            for (const order of query.orderBy!) {
              const aVal = a.data[order.field];
              const bVal = b.data[order.field];
              if (aVal < bVal) return order.direction === 'asc' ? -1 : 1;
              if (aVal > bVal) return order.direction === 'asc' ? 1 : -1;
            }
            return 0;
          });
        }

        // Apply pagination
        if (query.offset) results = results.slice(query.offset);
        if (query.limit) results = results.slice(0, query.limit);

        // Apply field selection
        if (query.select) {
          results = results.map((r) => ({
            ...r,
            data: Object.fromEntries(
              Object.entries(r.data).filter(([key]) => query.select!.includes(key))
            ),
          }));
        }

        return results;
      },

      searchRecords: (dataspaceId: string, searchTerm: string): DataRecord[] => {
        const ds = get().dataspaces[dataspaceId];
        if (!ds) return [];

        const term = searchTerm.toLowerCase();
        return ds.records.filter((r) =>
          Object.values(r.data).some((val) =>
            String(val).toLowerCase().includes(term)
          )
        );
      },

      // ─────────────────────────────────────────────────────────
      // Schema Operations
      // ─────────────────────────────────────────────────────────
      addField: (dataspaceId: string, field: SchemaField): void => {
        set((state) => {
          const ds = state.dataspaces[dataspaceId];
          if (!ds) return state;

          return {
            dataspaces: {
              ...state.dataspaces,
              [dataspaceId]: {
                ...ds,
                schema: {
                  ...ds.schema,
                  fields: [...ds.schema.fields, field],
                },
              },
            },
          };
        });
      },

      removeField: (dataspaceId: string, fieldName: string): void => {
        set((state) => {
          const ds = state.dataspaces[dataspaceId];
          if (!ds) return state;

          return {
            dataspaces: {
              ...state.dataspaces,
              [dataspaceId]: {
                ...ds,
                schema: {
                  ...ds.schema,
                  fields: ds.schema.fields.filter((f) => f.name !== fieldName),
                },
              },
            },
          };
        });
      },
    }),
    {
      name: 'chenu-dataspace-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ═══════════════════════════════════════════════════════════════
// SELECTORS
// ═══════════════════════════════════════════════════════════════

export const useDataSpaces = () => useDataSpaceStore((state) => Object.values(state.dataspaces));
export const useActiveDataSpace = () => useDataSpaceStore((state) => state.getActiveDataSpace());

export default useDataSpaceStore;
