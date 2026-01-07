/**
 * ============================================================
 * CHE·NU — WORKSURFACE TABLE VIEW
 * SAFE · REPRESENTATIONAL · NON-AUTONOMOUS
 * ============================================================
 * 
 * Table display view for WorkSurface
 */

import React, { useState, useMemo } from 'react';
import { CHENU_COLORS } from './worksurfaceStyles';

// ============================================================
// TYPES
// ============================================================

export interface TablePreview {
  columns: string[];
  rows: string[][];
}

export interface WorkSurfaceTableViewProps {
  tablePreview?: TablePreview;
  onCellClick?: (rowIndex: number, colIndex: number, value: string) => void;
  sortable?: boolean;
  filterable?: boolean;
  striped?: boolean;
}

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: CHENU_COLORS.cardBg,
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.borderColor}`,
    overflow: 'hidden',
  },
  header: {
    padding: '12px 16px',
    borderBottom: `1px solid ${CHENU_COLORS.borderColor}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  title: {
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.textPrimary,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  stats: {
    fontSize: '11px',
    color: CHENU_COLORS.textMuted,
    display: 'flex',
    gap: '12px',
  },
  filterBar: {
    padding: '12px 16px',
    borderBottom: `1px solid ${CHENU_COLORS.borderColor}`,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  filterInput: {
    width: '100%',
    padding: '8px 12px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    border: `1px solid ${CHENU_COLORS.borderColor}`,
    borderRadius: '6px',
    color: CHENU_COLORS.textPrimary,
    fontSize: '12px',
    outline: 'none',
  },
  tableContainer: {
    overflowX: 'auto',
    maxHeight: '500px',
    overflowY: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
  },
  th: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: 600,
    borderBottom: `2px solid ${CHENU_COLORS.borderColor}`,
    color: CHENU_COLORS.textPrimary,
    position: 'sticky',
    top: 0,
    cursor: 'default',
    whiteSpace: 'nowrap',
  },
  thSortable: {
    cursor: 'pointer',
    userSelect: 'none',
  },
  sortIcon: {
    marginLeft: '6px',
    opacity: 0.5,
  },
  sortIconActive: {
    opacity: 1,
    color: CHENU_COLORS.cenoteTurquoise,
  },
  td: {
    padding: '10px 16px',
    borderBottom: `1px solid ${CHENU_COLORS.borderColor}`,
    color: CHENU_COLORS.textSecondary,
  },
  tdClickable: {
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
  trStriped: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  trHover: {
    backgroundColor: 'rgba(62,180,162,0.1)',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: CHENU_COLORS.textMuted,
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyText: {
    fontSize: '14px',
    marginBottom: '8px',
  },
  emptyHint: {
    fontSize: '12px',
    opacity: 0.7,
  },
  cellNumber: {
    fontFamily: "'JetBrains Mono', monospace",
    color: CHENU_COLORS.cenoteTurquoise,
  },
  footer: {
    padding: '10px 16px',
    borderTop: `1px solid ${CHENU_COLORS.borderColor}`,
    backgroundColor: 'rgba(0,0,0,0.1)',
    fontSize: '11px',
    color: CHENU_COLORS.textMuted,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};

// ============================================================
// COMPONENT
// ============================================================

export const WorkSurfaceTableView: React.FC<WorkSurfaceTableViewProps> = ({
  tablePreview,
  onCellClick,
  sortable = true,
  filterable = true,
  striped = true,
}) => {
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterText, setFilterText] = useState('');
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  // Check if value looks like a number
  const isNumeric = (value: string): boolean => {
    return !isNaN(parseFloat(value)) && isFinite(Number(value.replace(/,/g, '')));
  };

  // Filtered and sorted rows
  const processedRows = useMemo(() => {
    if (!tablePreview) return [];
    
    let rows = [...tablePreview.rows];
    
    // Filter
    if (filterText.trim()) {
      const searchLower = filterText.toLowerCase();
      rows = rows.filter(row => 
        row.some(cell => cell.toLowerCase().includes(searchLower))
      );
    }
    
    // Sort
    if (sortColumn !== null && sortable) {
      rows.sort((a, b) => {
        const aVal = a[sortColumn] || '';
        const bVal = b[sortColumn] || '';
        
        // Numeric sort
        if (isNumeric(aVal) && isNumeric(bVal)) {
          const aNum = parseFloat(aVal.replace(/,/g, ''));
          const bNum = parseFloat(bVal.replace(/,/g, ''));
          return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
        }
        
        // String sort
        const comparison = aVal.localeCompare(bVal);
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }
    
    return rows;
  }, [tablePreview, filterText, sortColumn, sortDirection, sortable]);

  // Handle column header click for sorting
  const handleHeaderClick = (colIndex: number) => {
    if (!sortable) return;
    
    if (sortColumn === colIndex) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(colIndex);
      setSortDirection('asc');
    }
  };

  // Handle cell click
  const handleCellClick = (rowIndex: number, colIndex: number, value: string) => {
    if (onCellClick) {
      onCellClick(rowIndex, colIndex, value);
    }
  };

  // Render sort icon
  const renderSortIcon = (colIndex: number) => {
    if (!sortable) return null;
    
    const isActive = sortColumn === colIndex;
    const icon = isActive 
      ? (sortDirection === 'asc' ? '▲' : '▼')
      : '⇅';
    
    return (
      <span style={{
        ...styles.sortIcon,
        ...(isActive ? styles.sortIconActive : {}),
      }}>
        {icon}
      </span>
    );
  };

  // Empty state
  if (!tablePreview || tablePreview.rows.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.title}>
            <span>📊</span>
            <span>Table View</span>
          </div>
        </div>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📊</div>
          <div style={styles.emptyText}>No table data available</div>
          <div style={styles.emptyHint}>Add structured data (CSV, tab-separated) to see table view</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>📊</span>
          <span>Table View</span>
        </div>
        <div style={styles.stats}>
          <span>{tablePreview.columns.length} columns</span>
          <span>•</span>
          <span>{processedRows.length} row{processedRows.length !== 1 ? 's' : ''}</span>
          {filterText && <span>• filtered</span>}
        </div>
      </div>

      {/* Filter Bar */}
      {filterable && (
        <div style={styles.filterBar}>
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="🔍 Filter table..."
            style={styles.filterInput}
          />
        </div>
      )}

      {/* Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              {tablePreview.columns.map((col, i) => (
                <th
                  key={i}
                  style={{
                    ...styles.th,
                    ...(sortable ? styles.thSortable : {}),
                  }}
                  onClick={() => handleHeaderClick(i)}
                >
                  {col}
                  {renderSortIcon(i)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processedRows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                style={{
                  ...(striped && rowIndex % 2 === 1 ? styles.trStriped : {}),
                  ...(hoveredRow === rowIndex ? styles.trHover : {}),
                }}
                onMouseEnter={() => setHoveredRow(rowIndex)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    style={{
                      ...styles.td,
                      ...(onCellClick ? styles.tdClickable : {}),
                      ...(isNumeric(cell) ? styles.cellNumber : {}),
                    }}
                    onClick={() => handleCellClick(rowIndex, colIndex, cell)}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span>
          {processedRows.length === tablePreview.rows.length
            ? `Showing all ${tablePreview.rows.length} rows`
            : `Showing ${processedRows.length} of ${tablePreview.rows.length} rows`
          }
        </span>
        <span style={{ color: CHENU_COLORS.jungleEmerald }}>
          SAFE · REPRESENTATIONAL
        </span>
      </div>
    </div>
  );
};

export default WorkSurfaceTableView;
