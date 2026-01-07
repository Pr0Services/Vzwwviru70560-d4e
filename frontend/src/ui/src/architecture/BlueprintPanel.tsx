/**
 * ============================================================
 * CHE·NU — ARCHITECTURE BLUEPRINT PANEL
 * SAFE · STRUCTURAL · NON-AUTONOMOUS
 * ============================================================
 * 
 * Blueprint visualization and editing panel component
 * Symbolic representation only - NOT for construction
 */

import React, { useState, useCallback } from 'react';
import { 
  CHENU_COLORS, 
  ARCHITECTURE_COLORS, 
  baseStyles, 
  architectureStyles,
  mergeStyles,
  getElementColor,
} from './architectureStyles';

// ============================================================
// TYPES
// ============================================================

export interface BlueprintElement {
  id: string;
  type: 'wall' | 'column' | 'opening' | 'stair' | 'partition' | 'room' | 'zone';
  label: string;
  gridX: number;
  gridY: number;
  width?: number;
  height?: number;
}

export interface BlueprintPanelProps {
  name?: string;
  gridColumns?: number;
  gridRows?: number;
  elements?: BlueprintElement[];
  onCellClick?: (x: number, y: number) => void;
  onElementClick?: (element: BlueprintElement) => void;
  editable?: boolean;
  showGrid?: boolean;
  showLabels?: boolean;
}

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    ...baseStyles.card,
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: `1px solid ${CHENU_COLORS.borderColor}`,
  },
  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.textPrimary,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  titleIcon: {
    fontSize: '24px',
  },
  controls: {
    display: 'flex',
    gap: '8px',
  },
  controlButton: {
    ...baseStyles.button,
    ...baseStyles.buttonSecondary,
    padding: '6px 12px',
    fontSize: '11px',
  },
  gridContainer: {
    ...architectureStyles.blueprintContainer,
    overflow: 'auto',
    maxHeight: '500px',
  },
  grid: {
    display: 'grid',
    gap: '1px',
    backgroundColor: 'rgba(216,178,106,0.15)',
    padding: '1px',
  },
  cell: {
    ...architectureStyles.blueprintCell,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative',
    fontSize: '10px',
    color: CHENU_COLORS.textMuted,
  },
  cellHover: {
    backgroundColor: 'rgba(216,178,106,0.2)',
    borderColor: ARCHITECTURE_COLORS.blueprintDesign,
  },
  cellOccupied: {
    backgroundColor: 'rgba(62,180,162,0.2)',
    borderColor: ARCHITECTURE_COLORS.room,
  },
  element: {
    position: 'absolute',
    inset: '2px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: 500,
  },
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '16px',
    padding: '12px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    color: CHENU_COLORS.textMuted,
  },
  legendColor: {
    width: '14px',
    height: '14px',
    borderRadius: '3px',
  },
  footer: {
    marginTop: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    fontSize: '12px',
    color: CHENU_COLORS.textMuted,
  },
  disclaimer: {
    ...architectureStyles.disclaimer,
    fontSize: '10px',
    padding: '8px 12px',
  },
};

// ============================================================
// ELEMENT ICONS
// ============================================================

const ELEMENT_ICONS: Record<string, string> = {
  wall: '▬',
  column: '◼',
  opening: '⬜',
  stair: '⚡',
  partition: '┃',
  room: '🏠',
  zone: '◻️',
};

// ============================================================
// COMPONENT
// ============================================================

export const BlueprintPanel: React.FC<BlueprintPanelProps> = ({
  name = 'Blueprint',
  gridColumns = 8,
  gridRows = 6,
  elements = [],
  onCellClick,
  onElementClick,
  editable = false,
  showGrid = true,
  showLabels = true,
}) => {
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  // Get element at position
  const getElementAt = useCallback((x: number, y: number): BlueprintElement | undefined => {
    return elements.find(el => el.gridX === x && el.gridY === y);
  }, [elements]);

  // Handle cell click
  const handleCellClick = useCallback((x: number, y: number) => {
    const element = getElementAt(x, y);
    if (element) {
      setSelectedElement(element.id);
      onElementClick?.(element);
    } else {
      onCellClick?.(x, y);
    }
  }, [getElementAt, onCellClick, onElementClick]);

  // Calculate stats
  const occupiedCells = elements.length;
  const totalCells = gridColumns * gridRows;
  const occupancyRate = Math.round((occupiedCells / totalCells) * 100);

  // Get unique element types for legend
  const elementTypes = [...new Set(elements.map(el => el.type))];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span style={styles.titleIcon}>📐</span>
          <span>{name}</span>
        </div>
        <div style={styles.controls}>
          <button style={styles.controlButton}>
            🔍 Zoom
          </button>
          {editable && (
            <button style={mergeStyles(styles.controlButton, baseStyles.buttonPrimary)}>
              ➕ Add Element
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div style={styles.gridContainer}>
        <div
          style={{
            ...styles.grid,
            gridTemplateColumns: `repeat(${gridColumns}, minmax(50px, 1fr))`,
            gridTemplateRows: `repeat(${gridRows}, minmax(50px, 1fr))`,
          }}
        >
          {Array.from({ length: gridRows }).map((_, y) =>
            Array.from({ length: gridColumns }).map((_, x) => {
              const element = getElementAt(x, y);
              const isHovered = hoveredCell?.x === x && hoveredCell?.y === y;
              const isSelected = element?.id === selectedElement;

              return (
                <div
                  key={`${x}-${y}`}
                  style={mergeStyles(
                    styles.cell,
                    isHovered ? styles.cellHover : undefined,
                    element ? styles.cellOccupied : undefined,
                    isSelected ? { borderColor: CHENU_COLORS.sacredGold, borderWidth: '2px' } : undefined
                  )}
                  onMouseEnter={() => setHoveredCell({ x, y })}
                  onMouseLeave={() => setHoveredCell(null)}
                  onClick={() => handleCellClick(x, y)}
                >
                  {showGrid && !element && (
                    <span style={{ opacity: 0.3 }}>{x},{y}</span>
                  )}
                  {element && (
                    <div
                      style={mergeStyles(
                        styles.element,
                        { backgroundColor: `${getElementColor(element.type)}30`, borderColor: getElementColor(element.type) }
                      )}
                    >
                      <span>{ELEMENT_ICONS[element.type] || '◻️'}</span>
                      {showLabels && <span style={{ marginLeft: '4px' }}>{element.label}</span>}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Legend */}
      {elementTypes.length > 0 && (
        <div style={styles.legend}>
          {elementTypes.map(type => (
            <div key={type} style={styles.legendItem}>
              <div
                style={{
                  ...styles.legendColor,
                  backgroundColor: getElementColor(type),
                }}
              />
              <span>{type}</span>
              <span>({elements.filter(el => el.type === type).length})</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.stats}>
          {gridColumns}×{gridRows} grid • {occupiedCells}/{totalCells} cells ({occupancyRate}%)
        </div>
        <div style={styles.disclaimer}>
          ⚠️ Symbolic representation only — Not for construction
        </div>
      </div>
    </div>
  );
};

export default BlueprintPanel;
