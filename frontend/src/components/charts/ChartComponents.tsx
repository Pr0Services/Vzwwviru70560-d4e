// CHE·NU™ Chart Components
// Comprehensive chart system with multiple visualization types

import React, { useMemo, useRef, useEffect, useState } from 'react';

// ============================================================
// TYPES
// ============================================================

export interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface SeriesData {
  name: string;
  data: number[];
  color?: string;
}

export interface ChartConfig {
  title?: string;
  subtitle?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  animate?: boolean;
  height?: number;
  aspectRatio?: number;
}

// ============================================================
// BRAND COLORS
// ============================================================

const BRAND_COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
};

const CHART_COLORS = [
  BRAND_COLORS.sacredGold,
  BRAND_COLORS.cenoteTurquoise,
  BRAND_COLORS.jungleEmerald,
  BRAND_COLORS.earthEmber,
  BRAND_COLORS.ancientStone,
  BRAND_COLORS.shadowMoss,
  '#6366f1', // indigo
  '#ec4899', // pink
  '#f97316', // orange
  '#84cc16', // lime
];

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

const formatNumber = (value: number): string => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toFixed(0);
};

const getColor = (index: number, customColor?: string): string => {
  return customColor || CHART_COLORS[index % CHART_COLORS.length];
};

// ============================================================
// TOOLTIP COMPONENT
// ============================================================

interface TooltipProps {
  visible: boolean;
  x: number;
  y: number;
  content: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ visible, x, y, content }) => {
  if (!visible) return null;

  return (
    <div
      className="absolute z-50 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg pointer-events-none transition-opacity"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -100%)',
        marginTop: -8,
      }}
    >
      {content}
      <div
        className="absolute left-1/2 -bottom-1 w-2 h-2 bg-gray-900 transform -translate-x-1/2 rotate-45"
      />
    </div>
  );
};

// ============================================================
// LEGEND COMPONENT
// ============================================================

interface LegendItem {
  label: string;
  color: string;
  value?: number;
}

interface LegendProps {
  items: LegendItem[];
  position?: 'top' | 'bottom' | 'left' | 'right';
  onClick?: (index: number) => void;
  disabledIndices?: number[];
}

const Legend: React.FC<LegendProps> = ({
  items,
  position = 'bottom',
  onClick,
  disabledIndices = [],
}) => {
  const isVertical = position === 'left' || position === 'right';

  return (
    <div
      className={`flex ${isVertical ? 'flex-col' : 'flex-row flex-wrap'} gap-3 ${
        position === 'top' ? 'mb-4' : position === 'bottom' ? 'mt-4' : ''
      }`}
    >
      {items.map((item, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onClick?.(index)}
          className={`flex items-center gap-2 text-sm ${
            onClick ? 'cursor-pointer hover:opacity-80' : ''
          } ${disabledIndices.includes(index) ? 'opacity-40' : ''}`}
        >
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-gray-700">{item.label}</span>
          {item.value !== undefined && (
            <span className="text-gray-500">({formatNumber(item.value)})</span>
          )}
        </button>
      ))}
    </div>
  );
};

// ============================================================
// BAR CHART COMPONENT
// ============================================================

interface BarChartProps extends ChartConfig {
  data: DataPoint[];
  horizontal?: boolean;
  stacked?: boolean;
  grouped?: boolean;
  series?: SeriesData[];
  categories?: string[];
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  subtitle,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  animate = true,
  height = 300,
  horizontal = false,
  stacked = false,
  grouped = false,
  series,
  categories,
}) => {
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: React.ReactNode;
  }>({ visible: false, x: 0, y: 0, content: null });
  const containerRef = useRef<HTMLDivElement>(null);

  const maxValue = useMemo(() => {
    if (series) {
      if (stacked) {
        return Math.max(
          ...categories!.map((_, catIndex) =>
            series.reduce((sum, s) => sum + s.data[catIndex], 0)
          )
        );
      }
      return Math.max(...series.flatMap((s) => s.data));
    }
    return Math.max(...data.map((d) => d.value));
  }, [data, series, categories, stacked]);

  const handleMouseEnter = (
    e: React.MouseEvent,
    label: string,
    value: number,
    color: string
  ) => {
    if (!showTooltip || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTooltip({
      visible: true,
      x,
      y,
      content: (
        <div>
          <div className="font-medium">{label}</div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span>{formatNumber(value)}</span>
          </div>
        </div>
      ),
    });
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  // Simple data (no series)
  if (!series) {
    return (
      <div className="bg-white rounded-lg p-4" ref={containerRef}>
        {(title || subtitle) && (
          <div className="mb-4">
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        )}

        <div className="relative" style={{ height }}>
          {/* Grid Lines */}
          {showGrid && (
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[0, 25, 50, 75, 100].map((percent) => (
                <div key={percent} className="border-b border-gray-100" />
              ))}
            </div>
          )}

          {/* Bars */}
          <div className={`relative h-full flex ${horizontal ? 'flex-col' : 'items-end'} justify-around`}>
            {data.map((item, index) => {
              const percentage = (item.value / maxValue) * 100;
              const color = getColor(index, item.color);

              return (
                <div
                  key={index}
                  className={`relative ${horizontal ? 'w-full h-8' : 'flex-1 mx-1'}`}
                >
                  {horizontal ? (
                    <div
                      className={`h-full rounded-r transition-all duration-500 ${
                        animate ? 'animate-grow-width' : ''
                      }`}
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                      }}
                      onMouseEnter={(e) => handleMouseEnter(e, item.label, item.value, color)}
                      onMouseLeave={handleMouseLeave}
                    />
                  ) : (
                    <div
                      className={`w-full rounded-t transition-all duration-500 ${
                        animate ? 'animate-grow-height' : ''
                      }`}
                      style={{
                        height: `${percentage}%`,
                        backgroundColor: color,
                      }}
                      onMouseEnter={(e) => handleMouseEnter(e, item.label, item.value, color)}
                      onMouseLeave={handleMouseLeave}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Labels */}
          <div className={`flex ${horizontal ? 'flex-col' : ''} justify-around mt-2`}>
            {data.map((item, index) => (
              <span key={index} className="text-xs text-gray-500 text-center">
                {item.label}
              </span>
            ))}
          </div>

          {/* Tooltip */}
          <Tooltip {...tooltip} />
        </div>

        {showLegend && (
          <Legend
            items={data.map((d, i) => ({
              label: d.label,
              color: getColor(i, d.color),
              value: d.value,
            }))}
          />
        )}
      </div>
    );
  }

  // Series data (grouped/stacked)
  return (
    <div className="bg-white rounded-lg p-4" ref={containerRef}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}

      <div className="relative" style={{ height }}>
        {/* Grid Lines */}
        {showGrid && (
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 25, 50, 75, 100].map((percent) => (
              <div key={percent} className="border-b border-gray-100" />
            ))}
          </div>
        )}

        {/* Grouped/Stacked Bars */}
        <div className="relative h-full flex items-end justify-around">
          {categories!.map((category, catIndex) => (
            <div
              key={catIndex}
              className={`flex-1 mx-1 flex ${stacked ? 'flex-col' : ''} items-end justify-center`}
              style={{ height: '100%' }}
            >
              {stacked ? (
                // Stacked bars
                <div className="w-full relative" style={{ height: '100%' }}>
                  {series.map((s, seriesIndex) => {
                    const prevTotal = series
                      .slice(0, seriesIndex)
                      .reduce((sum, prev) => sum + prev.data[catIndex], 0);
                    const stackHeight = ((prevTotal + s.data[catIndex]) / maxValue) * 100;
                    const barHeight = (s.data[catIndex] / maxValue) * 100;
                    const color = getColor(seriesIndex, s.color);

                    return (
                      <div
                        key={seriesIndex}
                        className="absolute bottom-0 left-0 right-0 rounded-t transition-all duration-500"
                        style={{
                          height: `${barHeight}%`,
                          bottom: `${(prevTotal / maxValue) * 100}%`,
                          backgroundColor: color,
                        }}
                        onMouseEnter={(e) => handleMouseEnter(e, `${category} - ${s.name}`, s.data[catIndex], color)}
                        onMouseLeave={handleMouseLeave}
                      />
                    );
                  })}
                </div>
              ) : (
                // Grouped bars
                series.map((s, seriesIndex) => {
                  const percentage = (s.data[catIndex] / maxValue) * 100;
                  const color = getColor(seriesIndex, s.color);

                  return (
                    <div
                      key={seriesIndex}
                      className="flex-1 mx-0.5 rounded-t transition-all duration-500"
                      style={{
                        height: `${percentage}%`,
                        backgroundColor: color,
                      }}
                      onMouseEnter={(e) => handleMouseEnter(e, `${category} - ${s.name}`, s.data[catIndex], color)}
                      onMouseLeave={handleMouseLeave}
                    />
                  );
                })
              )}
            </div>
          ))}
        </div>

        {/* Category Labels */}
        <div className="flex justify-around mt-2">
          {categories!.map((category, index) => (
            <span key={index} className="text-xs text-gray-500 text-center flex-1">
              {category}
            </span>
          ))}
        </div>

        {/* Tooltip */}
        <Tooltip {...tooltip} />
      </div>

      {showLegend && (
        <Legend
          items={series.map((s, i) => ({
            label: s.name,
            color: getColor(i, s.color),
          }))}
        />
      )}
    </div>
  );
};

// ============================================================
// LINE CHART COMPONENT
// ============================================================

interface LineChartProps extends ChartConfig {
  series: SeriesData[];
  categories: string[];
  smooth?: boolean;
  area?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  series,
  categories,
  title,
  subtitle,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  animate = true,
  height = 300,
  smooth = true,
  area = false,
}) => {
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: React.ReactNode;
  }>({ visible: false, x: 0, y: 0, content: null });
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { maxValue, minValue } = useMemo(() => {
    const allValues = series.flatMap((s) => s.data);
    return {
      maxValue: Math.max(...allValues),
      minValue: Math.min(0, ...allValues),
    };
  }, [series]);

  const padding = { top: 20, right: 20, bottom: 40, left: 50 };

  const getPath = (data: number[], width: number, chartHeight: number): string => {
    const points = data.map((value, index) => {
      const x = padding.left + (index / (data.length - 1)) * (width - padding.left - padding.right);
      const y = padding.top + ((maxValue - value) / (maxValue - minValue)) * chartHeight;
      return { x, y };
    });

    if (smooth && points.length > 2) {
      let path = `M ${points[0].x} ${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(points.length - 1, i + 2)];

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
      }
      return path;
    }

    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  };

  const getAreaPath = (data: number[], width: number, chartHeight: number): string => {
    const linePath = getPath(data, width, chartHeight);
    const lastX = padding.left + ((data.length - 1) / (data.length - 1)) * (width - padding.left - padding.right);
    const bottomY = padding.top + chartHeight;
    return `${linePath} L ${lastX} ${bottomY} L ${padding.left} ${bottomY} Z`;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!showTooltip || !containerRef.current || !svgRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const svgRect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - svgRect.left;
    const chartWidth = svgRect.width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const index = Math.round(((x - padding.left) / chartWidth) * (categories.length - 1));
    if (index < 0 || index >= categories.length) {
      setTooltip((prev) => ({ ...prev, visible: false }));
      return;
    }

    const tooltipX = e.clientX - containerRect.left;
    const tooltipY = e.clientY - containerRect.top;

    setTooltip({
      visible: true,
      x: tooltipX,
      y: tooltipY,
      content: (
        <div>
          <div className="font-medium mb-1">{categories[index]}</div>
          {series.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getColor(i, s.color) }} />
              <span>{s.name}: {formatNumber(s.data[index])}</span>
            </div>
          ))}
        </div>
      ),
    });
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div className="bg-white rounded-lg p-4" ref={containerRef}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}

      <div className="relative">
        <svg
          ref={svgRef}
          width="100%"
          height={height}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="overflow-visible"
        >
          {/* Grid Lines */}
          {showGrid && (
            <g>
              {[0, 25, 50, 75, 100].map((percent) => {
                const y = padding.top + (percent / 100) * (height - padding.top - padding.bottom);
                return (
                  <line
                    key={percent}
                    x1={padding.left}
                    y1={y}
                    x2="100%"
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth={1}
                  />
                );
              })}
            </g>
          )}

          {/* Y-Axis Labels */}
          <g>
            {[0, 25, 50, 75, 100].map((percent) => {
              const y = padding.top + (percent / 100) * (height - padding.top - padding.bottom);
              const value = maxValue - (percent / 100) * (maxValue - minValue);
              return (
                <text
                  key={percent}
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-500"
                >
                  {formatNumber(value)}
                </text>
              );
            })}
          </g>

          {/* X-Axis Labels */}
          <g>
            {categories.map((category, index) => {
              const x = padding.left + (index / (categories.length - 1)) * (700 - padding.left - padding.right);
              return (
                <text
                  key={index}
                  x={`${(index / (categories.length - 1)) * 100}%`}
                  y={height - 10}
                  textAnchor="middle"
                  className="text-xs fill-gray-500"
                  style={{ transform: `translateX(${padding.left}px)` }}
                >
                  {category}
                </text>
              );
            })}
          </g>

          {/* Area Fills */}
          {area && series.map((s, i) => (
            <path
              key={`area-${i}`}
              d={getAreaPath(s.data, 700, height - padding.top - padding.bottom)}
              fill={getColor(i, s.color)}
              fillOpacity={0.1}
              className={animate ? 'animate-fade-in' : ''}
            />
          ))}

          {/* Lines */}
          {series.map((s, i) => (
            <path
              key={`line-${i}`}
              d={getPath(s.data, 700, height - padding.top - padding.bottom)}
              fill="none"
              stroke={getColor(i, s.color)}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={animate ? 'animate-draw-line' : ''}
            />
          ))}

          {/* Data Points */}
          {series.map((s, seriesIndex) =>
            s.data.map((value, index) => {
              const x = padding.left + (index / (s.data.length - 1)) * (700 - padding.left - padding.right);
              const y = padding.top + ((maxValue - value) / (maxValue - minValue)) * (height - padding.top - padding.bottom);
              return (
                <circle
                  key={`point-${seriesIndex}-${index}`}
                  cx={`${(index / (s.data.length - 1)) * 100}%`}
                  cy={y}
                  r={4}
                  fill="white"
                  stroke={getColor(seriesIndex, s.color)}
                  strokeWidth={2}
                  className={`transition-transform hover:scale-150 ${animate ? 'animate-scale-in' : ''}`}
                  style={{ transform: `translateX(${padding.left}px)` }}
                />
              );
            })
          )}
        </svg>

        <Tooltip {...tooltip} />
      </div>

      {showLegend && (
        <Legend
          items={series.map((s, i) => ({
            label: s.name,
            color: getColor(i, s.color),
          }))}
        />
      )}
    </div>
  );
};

// ============================================================
// PIE/DONUT CHART COMPONENT
// ============================================================

interface PieChartProps extends ChartConfig {
  data: DataPoint[];
  donut?: boolean;
  donutWidth?: number;
  showLabels?: boolean;
  showPercentages?: boolean;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  subtitle,
  showLegend = true,
  showTooltip = true,
  animate = true,
  height = 300,
  donut = false,
  donutWidth = 60,
  showLabels = false,
  showPercentages = true,
}) => {
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: React.ReactNode;
  }>({ visible: false, x: 0, y: 0, content: null });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);

  const segments = useMemo(() => {
    let currentAngle = -90; // Start from top
    return data.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      currentAngle += angle;

      return {
        ...item,
        index,
        percentage,
        startAngle,
        endAngle: currentAngle,
        color: getColor(index, item.color),
      };
    });
  }, [data, total]);

  const radius = height / 2 - 20;
  const innerRadius = donut ? radius - donutWidth : 0;
  const centerX = 150;
  const centerY = height / 2;

  const describeArc = (
    x: number,
    y: number,
    innerR: number,
    outerR: number,
    startAngle: number,
    endAngle: number
  ): string => {
    const start = {
      x: x + outerR * Math.cos((startAngle * Math.PI) / 180),
      y: y + outerR * Math.sin((startAngle * Math.PI) / 180),
    };
    const end = {
      x: x + outerR * Math.cos((endAngle * Math.PI) / 180),
      y: y + outerR * Math.sin((endAngle * Math.PI) / 180),
    };
    const innerStart = {
      x: x + innerR * Math.cos((endAngle * Math.PI) / 180),
      y: y + innerR * Math.sin((endAngle * Math.PI) / 180),
    };
    const innerEnd = {
      x: x + innerR * Math.cos((startAngle * Math.PI) / 180),
      y: y + innerR * Math.sin((startAngle * Math.PI) / 180),
    };

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    if (innerR === 0) {
      return `M ${x} ${y} L ${start.x} ${start.y} A ${outerR} ${outerR} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
    }

    return `
      M ${start.x} ${start.y}
      A ${outerR} ${outerR} 0 ${largeArc} 1 ${end.x} ${end.y}
      L ${innerStart.x} ${innerStart.y}
      A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}
      Z
    `;
  };

  const handleMouseEnter = (e: React.MouseEvent, segment: typeof segments[0]) => {
    if (!showTooltip || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      content: (
        <div>
          <div className="font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: segment.color }} />
            {segment.label}
          </div>
          <div className="text-gray-300">
            {formatNumber(segment.value)} ({segment.percentage.toFixed(1)}%)
          </div>
        </div>
      ),
    });
    setHoveredIndex(segment.index);
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
    setHoveredIndex(null);
  };

  return (
    <div className="bg-white rounded-lg p-4" ref={containerRef}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}

      <div className="flex items-center justify-center">
        <div className="relative">
          <svg width={300} height={height}>
            {segments.map((segment) => (
              <path
                key={segment.index}
                d={describeArc(
                  centerX,
                  centerY,
                  innerRadius,
                  radius,
                  segment.startAngle,
                  segment.endAngle - 0.5 // Small gap between segments
                )}
                fill={segment.color}
                className={`
                  transition-all duration-200 cursor-pointer
                  ${animate ? 'animate-pie-slice' : ''}
                `}
                style={{
                  transform: hoveredIndex === segment.index ? 'scale(1.05)' : 'scale(1)',
                  transformOrigin: `${centerX}px ${centerY}px`,
                }}
                onMouseEnter={(e) => handleMouseEnter(e, segment)}
                onMouseLeave={handleMouseLeave}
              />
            ))}

            {/* Center Label (Donut) */}
            {donut && (
              <text
                x={centerX}
                y={centerY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-2xl font-bold fill-gray-800"
              >
                {formatNumber(total)}
              </text>
            )}

            {/* Segment Labels */}
            {showLabels && segments.map((segment) => {
              const midAngle = (segment.startAngle + segment.endAngle) / 2;
              const labelRadius = radius + 20;
              const x = centerX + labelRadius * Math.cos((midAngle * Math.PI) / 180);
              const y = centerY + labelRadius * Math.sin((midAngle * Math.PI) / 180);

              return (
                <text
                  key={`label-${segment.index}`}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs fill-gray-600"
                >
                  {showPercentages ? `${segment.percentage.toFixed(0)}%` : segment.label}
                </text>
              );
            })}
          </svg>

          <Tooltip {...tooltip} />
        </div>

        {showLegend && (
          <Legend
            items={segments.map((s) => ({
              label: s.label,
              color: s.color,
              value: s.value,
            }))}
            position="right"
          />
        )}
      </div>
    </div>
  );
};

// ============================================================
// GAUGE CHART COMPONENT
// ============================================================

interface GaugeChartProps extends ChartConfig {
  value: number;
  min?: number;
  max?: number;
  thresholds?: { value: number; color: string }[];
  label?: string;
  unit?: string;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  min = 0,
  max = 100,
  thresholds = [
    { value: 30, color: '#ef4444' },
    { value: 70, color: '#eab308' },
    { value: 100, color: '#22c55e' },
  ],
  label,
  unit = '',
  title,
  animate = true,
  height = 200,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const angle = -90 + (clampedPercentage / 100) * 180;

  const getCurrentColor = () => {
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (clampedPercentage <= (thresholds[i].value / max) * 100) {
        return thresholds[i].color;
      }
    }
    return thresholds[0].color;
  };

  return (
    <div className="bg-white rounded-lg p-4">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}

      <div className="relative flex justify-center" style={{ height }}>
        <svg width={250} height={height} viewBox="0 0 250 150">
          {/* Background Arc */}
          <path
            d="M 25 125 A 100 100 0 0 1 225 125"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={20}
            strokeLinecap="round"
          />

          {/* Value Arc */}
          <path
            d="M 25 125 A 100 100 0 0 1 225 125"
            fill="none"
            stroke={getCurrentColor()}
            strokeWidth={20}
            strokeLinecap="round"
            strokeDasharray={`${(clampedPercentage / 100) * 314} 314`}
            className={animate ? 'transition-all duration-1000' : ''}
          />

          {/* Needle */}
          <g
            transform={`rotate(${angle}, 125, 125)`}
            className={animate ? 'transition-transform duration-1000' : ''}
          >
            <line
              x1={125}
              y1={125}
              x2={125}
              y2={45}
              stroke="#374151"
              strokeWidth={3}
              strokeLinecap="round"
            />
            <circle cx={125} cy={125} r={8} fill="#374151" />
          </g>

          {/* Value Text */}
          <text
            x={125}
            y={100}
            textAnchor="middle"
            className="text-3xl font-bold"
            fill={getCurrentColor()}
          >
            {value.toFixed(0)}{unit}
          </text>

          {label && (
            <text x={125} y={130} textAnchor="middle" className="text-sm fill-gray-500">
              {label}
            </text>
          )}

          {/* Min/Max Labels */}
          <text x={35} y={145} textAnchor="middle" className="text-xs fill-gray-400">
            {min}
          </text>
          <text x={215} y={145} textAnchor="middle" className="text-xs fill-gray-400">
            {max}
          </text>
        </svg>
      </div>
    </div>
  );
};

// ============================================================
// SPARKLINE COMPONENT
// ============================================================

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showArea?: boolean;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 100,
  height = 30,
  color = BRAND_COLORS.sacredGold,
  showArea = false,
}) => {
  if (data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const areaPath = `M 0,${height} L ${points} L ${width},${height} Z`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      {showArea && (
        <path d={areaPath} fill={color} fillOpacity={0.1} />
      )}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ============================================================
// STATS CARD COMPONENT
// ============================================================

interface StatsCardProps {
  title: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  trend?: number[];
  icon?: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  trend,
  icon,
}) => {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {typeof value === 'number' ? formatNumber(value) : value}
          </p>
          {change !== undefined && (
            <p className={`text-sm mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '↑' : '↓'} {Math.abs(change)}%
              {changeLabel && <span className="text-gray-400 ml-1">{changeLabel}</span>}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          {icon && <div className="text-2xl text-gray-400">{icon}</div>}
          {trend && <Sparkline data={trend} color={isPositive ? '#22c55e' : '#ef4444'} />}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// EXPORTS
// ============================================================

export default {
  BarChart,
  LineChart,
  PieChart,
  GaugeChart,
  Sparkline,
  StatsCard,
  Legend,
};
