// CHE·NU™ Charts Components
// Comprehensive charting library for data visualization

import React, { useMemo, useRef, useEffect, useState } from 'react';

// ============================================================
// TYPES
// ============================================================

type ChartType = 'line' | 'bar' | 'pie' | 'donut' | 'area' | 'scatter' | 'radar';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}

interface DataSeries {
  name: string;
  data: number[];
  color?: string;
  type?: 'line' | 'bar' | 'area';
}

interface ChartDimensions {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

interface AxisConfig {
  show?: boolean;
  label?: string;
  min?: number;
  max?: number;
  tickCount?: number;
  tickFormat?: (value: number) => string;
  gridLines?: boolean;
}

interface LegendConfig {
  show?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TooltipConfig {
  show?: boolean;
  format?: (point: DataPoint | { series: string; value: number; label: string }) => string;
}

interface AnimationConfig {
  enabled?: boolean;
  duration?: number;
  easing?: string;
}

interface BaseChartProps {
  width?: number | string;
  height?: number | string;
  title?: string;
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  legend?: LegendConfig;
  tooltip?: TooltipConfig;
  animation?: AnimationConfig;
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface LineChartProps extends BaseChartProps {
  data: DataSeries[];
  labels: string[];
  smooth?: boolean;
  showDots?: boolean;
  dotSize?: number;
  lineWidth?: number;
  fill?: boolean;
  stacked?: boolean;
}

interface BarChartProps extends BaseChartProps {
  data: DataSeries[];
  labels: string[];
  horizontal?: boolean;
  stacked?: boolean;
  grouped?: boolean;
  barWidth?: number;
  barGap?: number;
  borderRadius?: number;
}

interface PieChartProps extends BaseChartProps {
  data: DataPoint[];
  innerRadius?: number; // For donut chart
  startAngle?: number;
  endAngle?: number;
  padAngle?: number;
  showLabels?: boolean;
  labelType?: 'name' | 'value' | 'percent';
}

interface AreaChartProps extends LineChartProps {
  gradient?: boolean;
  gradientOpacity?: [number, number];
}

interface ScatterChartProps extends BaseChartProps {
  data: Array<{
    x: number;
    y: number;
    size?: number;
    color?: string;
    label?: string;
  }>;
  xAxisLabel?: string;
  yAxisLabel?: string;
  sizeRange?: [number, number];
}

interface RadarChartProps extends BaseChartProps {
  data: DataSeries[];
  labels: string[];
  maxValue?: number;
  levels?: number;
  fill?: boolean;
  fillOpacity?: number;
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

const DEFAULT_COLORS = [
  BRAND.jungleEmerald,
  BRAND.cenoteTurquoise,
  BRAND.sacredGold,
  BRAND.earthEmber,
  BRAND.shadowMoss,
  BRAND.ancientStone,
  '#E57373',
  '#64B5F6',
  '#FFB74D',
  '#81C784',
];

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function getColor(index: number, customColor?: string): string {
  return customColor || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
}

function formatNumber(value: number): string {
  if (Math.abs(value) >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  if (Math.abs(value) >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toFixed(value % 1 === 0 ? 0 : 1);
}

function calculateScale(
  data: number[],
  config?: { min?: number; max?: number }
): { min: number; max: number; ticks: number[] } {
  const dataMin = Math.min(...data.filter((d) => !isNaN(d)));
  const dataMax = Math.max(...data.filter((d) => !isNaN(d)));
  
  const min = config?.min ?? Math.floor(dataMin * 0.9);
  const max = config?.max ?? Math.ceil(dataMax * 1.1);
  
  const range = max - min;
  const tickCount = 5;
  const tickStep = range / (tickCount - 1);
  
  const ticks: number[] = [];
  for (let i = 0; i < tickCount; i++) {
    ticks.push(min + tickStep * i);
  }
  
  return { min, max, ticks };
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  
  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
  ].join(' ');
}

// ============================================================
// CHART CONTAINER
// ============================================================

interface ChartContainerProps {
  width?: number | string;
  height?: number | string;
  title?: string;
  children: React.ReactNode;
  legend?: LegendConfig;
  legendItems?: Array<{ name: string; color: string }>;
  className?: string;
  style?: React.CSSProperties;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  width = '100%',
  height = 400,
  title,
  children,
  legend,
  legendItems,
  className,
  style,
}) => {
  return (
    <div
      className={className}
      style={{
        width,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        ...style,
      }}
    >
      {title && (
        <h3
          style={{
            margin: '0 0 16px 0',
            fontSize: '16px',
            fontWeight: 600,
            color: BRAND.uiSlate,
            textAlign: 'center',
          }}
        >
          {title}
        </h3>
      )}
      
      <div style={{ position: 'relative', height }}>
        {children}
      </div>
      
      {legend?.show !== false && legendItems && legendItems.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '16px',
            padding: '8px',
          }}
        >
          {legendItems.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                color: BRAND.ancientStone,
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '2px',
                  backgroundColor: item.color,
                }}
              />
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================
// TOOLTIP
// ============================================================

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  content: string;
}

const ChartTooltip: React.FC<TooltipState> = ({ visible, x, y, content }) => {
  if (!visible) return null;
  
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -100%)',
        padding: '8px 12px',
        backgroundColor: BRAND.uiSlate,
        color: '#fff',
        borderRadius: '4px',
        fontSize: '13px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        zIndex: 100,
      }}
    >
      {content}
      <div
        style={{
          position: 'absolute',
          bottom: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: `6px solid ${BRAND.uiSlate}`,
        }}
      />
    </div>
  );
};

// ============================================================
// LINE CHART
// ============================================================

export const LineChart: React.FC<LineChartProps> = ({
  data,
  labels,
  width = '100%',
  height = 300,
  title,
  xAxis,
  yAxis,
  legend,
  tooltip,
  animation,
  smooth = true,
  showDots = true,
  dotSize = 4,
  lineWidth = 2,
  fill = false,
  stacked = false,
}) => {
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    content: '',
  });
  
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = typeof width === 'number' ? width : 600;
  const chartHeight = typeof height === 'number' ? height : 300;
  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;
  
  // Calculate scales
  const allValues = data.flatMap((s) => s.data);
  const scale = calculateScale(allValues, yAxis);
  
  const xStep = innerWidth / (labels.length - 1);
  const yScale = (value: number) =>
    innerHeight - ((value - scale.min) / (scale.max - scale.min)) * innerHeight;
  
  // Generate path
  const generatePath = (values: number[]): string => {
    if (values.length === 0) return '';
    
    const points = values.map((v, i) => ({
      x: margin.left + i * xStep,
      y: margin.top + yScale(v),
    }));
    
    if (smooth && points.length > 2) {
      // Catmull-Rom spline interpolation
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
  
  // Generate fill path
  const generateFillPath = (values: number[]): string => {
    const linePath = generatePath(values);
    const lastX = margin.left + (values.length - 1) * xStep;
    const baseY = margin.top + innerHeight;
    return `${linePath} L ${lastX} ${baseY} L ${margin.left} ${baseY} Z`;
  };
  
  const legendItems = data.map((series, index) => ({
    name: series.name,
    color: getColor(index, series.color),
  }));
  
  return (
    <ChartContainer
      width={width}
      height={height}
      title={title}
      legend={legend}
      legendItems={legendItems}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
        {/* Grid lines */}
        {yAxis?.gridLines !== false && (
          <g>
            {scale.ticks.map((tick, i) => (
              <line
                key={i}
                x1={margin.left}
                y1={margin.top + yScale(tick)}
                x2={chartWidth - margin.right}
                y2={margin.top + yScale(tick)}
                stroke={BRAND.ancientStone}
                strokeOpacity={0.2}
                strokeDasharray="4,4"
              />
            ))}
          </g>
        )}
        
        {/* Y-Axis */}
        {yAxis?.show !== false && (
          <g>
            <line
              x1={margin.left}
              y1={margin.top}
              x2={margin.left}
              y2={margin.top + innerHeight}
              stroke={BRAND.ancientStone}
            />
            {scale.ticks.map((tick, i) => (
              <text
                key={i}
                x={margin.left - 10}
                y={margin.top + yScale(tick)}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="11"
                fill={BRAND.ancientStone}
              >
                {yAxis?.tickFormat ? yAxis.tickFormat(tick) : formatNumber(tick)}
              </text>
            ))}
          </g>
        )}
        
        {/* X-Axis */}
        {xAxis?.show !== false && (
          <g>
            <line
              x1={margin.left}
              y1={margin.top + innerHeight}
              x2={chartWidth - margin.right}
              y2={margin.top + innerHeight}
              stroke={BRAND.ancientStone}
            />
            {labels.map((label, i) => (
              <text
                key={i}
                x={margin.left + i * xStep}
                y={margin.top + innerHeight + 20}
                textAnchor="middle"
                fontSize="11"
                fill={BRAND.ancientStone}
              >
                {label}
              </text>
            ))}
          </g>
        )}
        
        {/* Data series */}
        {data.map((series, seriesIndex) => {
          const color = getColor(seriesIndex, series.color);
          
          return (
            <g key={seriesIndex}>
              {/* Fill area */}
              {fill && (
                <path
                  d={generateFillPath(series.data)}
                  fill={color}
                  fillOpacity={0.2}
                />
              )}
              
              {/* Line */}
              <path
                d={generatePath(series.data)}
                fill="none"
                stroke={color}
                strokeWidth={lineWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Dots */}
              {showDots &&
                series.data.map((value, i) => (
                  <circle
                    key={i}
                    cx={margin.left + i * xStep}
                    cy={margin.top + yScale(value)}
                    r={dotSize}
                    fill={color}
                    stroke="#fff"
                    strokeWidth={2}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                      const rect = (e.target as SVGElement).getBoundingClientRect();
                      setTooltipState({
                        visible: true,
                        x: rect.left + rect.width / 2,
                        y: rect.top,
                        content: tooltip?.format
                          ? tooltip.format({ series: series.name, value, label: labels[i] })
                          : `${series.name}: ${formatNumber(value)}`,
                      });
                    }}
                    onMouseLeave={() =>
                      setTooltipState((s) => ({ ...s, visible: false }))
                    }
                  />
                ))}
            </g>
          );
        })}
      </svg>
      
      <ChartTooltip {...tooltipState} />
    </ChartContainer>
  );
};

// ============================================================
// BAR CHART
// ============================================================

export const BarChart: React.FC<BarChartProps> = ({
  data,
  labels,
  width = '100%',
  height = 300,
  title,
  xAxis,
  yAxis,
  legend,
  tooltip,
  horizontal = false,
  stacked = false,
  grouped = true,
  barWidth: customBarWidth,
  barGap = 4,
  borderRadius = 4,
}) => {
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    content: '',
  });
  
  const margin = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = typeof width === 'number' ? width : 600;
  const chartHeight = typeof height === 'number' ? height : 300;
  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;
  
  // Calculate scales
  let allValues: number[];
  if (stacked) {
    allValues = labels.map((_, i) =>
      data.reduce((sum, series) => sum + (series.data[i] || 0), 0)
    );
  } else {
    allValues = data.flatMap((s) => s.data);
  }
  
  const scale = calculateScale([0, ...allValues], yAxis);
  
  const groupWidth = innerWidth / labels.length;
  const barCount = grouped && !stacked ? data.length : 1;
  const barWidth = customBarWidth || Math.max(10, (groupWidth - barGap * (barCount + 1)) / barCount);
  
  const yScale = (value: number) =>
    ((value - scale.min) / (scale.max - scale.min)) * innerHeight;
  
  const legendItems = data.map((series, index) => ({
    name: series.name,
    color: getColor(index, series.color),
  }));
  
  return (
    <ChartContainer
      width={width}
      height={height}
      title={title}
      legend={legend}
      legendItems={legendItems}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
        {/* Grid lines */}
        {yAxis?.gridLines !== false && (
          <g>
            {scale.ticks.map((tick, i) => (
              <line
                key={i}
                x1={margin.left}
                y1={margin.top + innerHeight - yScale(tick)}
                x2={chartWidth - margin.right}
                y2={margin.top + innerHeight - yScale(tick)}
                stroke={BRAND.ancientStone}
                strokeOpacity={0.2}
                strokeDasharray="4,4"
              />
            ))}
          </g>
        )}
        
        {/* Y-Axis */}
        {yAxis?.show !== false && (
          <g>
            <line
              x1={margin.left}
              y1={margin.top}
              x2={margin.left}
              y2={margin.top + innerHeight}
              stroke={BRAND.ancientStone}
            />
            {scale.ticks.map((tick, i) => (
              <text
                key={i}
                x={margin.left - 10}
                y={margin.top + innerHeight - yScale(tick)}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="11"
                fill={BRAND.ancientStone}
              >
                {yAxis?.tickFormat ? yAxis.tickFormat(tick) : formatNumber(tick)}
              </text>
            ))}
          </g>
        )}
        
        {/* X-Axis */}
        {xAxis?.show !== false && (
          <g>
            <line
              x1={margin.left}
              y1={margin.top + innerHeight}
              x2={chartWidth - margin.right}
              y2={margin.top + innerHeight}
              stroke={BRAND.ancientStone}
            />
            {labels.map((label, i) => (
              <text
                key={i}
                x={margin.left + groupWidth * i + groupWidth / 2}
                y={margin.top + innerHeight + 20}
                textAnchor="middle"
                fontSize="11"
                fill={BRAND.ancientStone}
              >
                {label}
              </text>
            ))}
          </g>
        )}
        
        {/* Bars */}
        {labels.map((label, labelIndex) => {
          const groupX = margin.left + groupWidth * labelIndex;
          
          if (stacked) {
            let cumulativeHeight = 0;
            
            return (
              <g key={labelIndex}>
                {data.map((series, seriesIndex) => {
                  const value = series.data[labelIndex] || 0;
                  const barHeight = yScale(value);
                  const color = getColor(seriesIndex, series.color);
                  const y = margin.top + innerHeight - cumulativeHeight - barHeight;
                  
                  cumulativeHeight += barHeight;
                  
                  return (
                    <rect
                      key={seriesIndex}
                      x={groupX + (groupWidth - barWidth) / 2}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      fill={color}
                      rx={seriesIndex === data.length - 1 ? borderRadius : 0}
                      ry={seriesIndex === data.length - 1 ? borderRadius : 0}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={(e) => {
                        const rect = (e.target as SVGElement).getBoundingClientRect();
                        setTooltipState({
                          visible: true,
                          x: rect.left + rect.width / 2,
                          y: rect.top,
                          content: `${series.name}: ${formatNumber(value)}`,
                        });
                      }}
                      onMouseLeave={() =>
                        setTooltipState((s) => ({ ...s, visible: false }))
                      }
                    />
                  );
                })}
              </g>
            );
          }
          
          return (
            <g key={labelIndex}>
              {data.map((series, seriesIndex) => {
                const value = series.data[labelIndex] || 0;
                const barHeight = yScale(value);
                const color = getColor(seriesIndex, series.color);
                const x =
                  groupX +
                  barGap +
                  seriesIndex * (barWidth + barGap) +
                  (groupWidth - barCount * barWidth - (barCount + 1) * barGap) / 2;
                
                return (
                  <rect
                    key={seriesIndex}
                    x={x}
                    y={margin.top + innerHeight - barHeight}
                    width={barWidth}
                    height={barHeight}
                    fill={color}
                    rx={borderRadius}
                    ry={borderRadius}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                      const rect = (e.target as SVGElement).getBoundingClientRect();
                      setTooltipState({
                        visible: true,
                        x: rect.left + rect.width / 2,
                        y: rect.top,
                        content: `${series.name}: ${formatNumber(value)}`,
                      });
                    }}
                    onMouseLeave={() =>
                      setTooltipState((s) => ({ ...s, visible: false }))
                    }
                  />
                );
              })}
            </g>
          );
        })}
      </svg>
      
      <ChartTooltip {...tooltipState} />
    </ChartContainer>
  );
};

// ============================================================
// PIE / DONUT CHART
// ============================================================

export const PieChart: React.FC<PieChartProps> = ({
  data,
  width = '100%',
  height = 300,
  title,
  legend,
  tooltip,
  innerRadius = 0,
  startAngle = 0,
  endAngle = 360,
  padAngle = 0,
  showLabels = true,
  labelType = 'percent',
}) => {
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    content: '',
  });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const chartWidth = typeof width === 'number' ? width : 400;
  const chartHeight = typeof height === 'number' ? height : 300;
  const centerX = chartWidth / 2;
  const centerY = chartHeight / 2;
  const outerRadius = Math.min(centerX, centerY) - 40;
  const actualInnerRadius = innerRadius > 0 ? innerRadius : 0;
  
  const total = data.reduce((sum, d) => sum + d.value, 0);
  
  // Calculate slices
  const slices = useMemo(() => {
    let currentAngle = startAngle;
    const angleRange = endAngle - startAngle;
    
    return data.map((item, index) => {
      const sliceAngle = (item.value / total) * angleRange;
      const start = currentAngle;
      const end = currentAngle + sliceAngle - padAngle;
      currentAngle += sliceAngle;
      
      const midAngle = (start + end) / 2;
      const labelRadius = outerRadius * 0.7;
      const labelPos = polarToCartesian(centerX, centerY, labelRadius, midAngle);
      
      return {
        ...item,
        startAngle: start,
        endAngle: end,
        percentage: (item.value / total) * 100,
        color: getColor(index, item.color),
        labelX: labelPos.x,
        labelY: labelPos.y,
      };
    });
  }, [data, total, startAngle, endAngle, padAngle, centerX, centerY, outerRadius]);
  
  const legendItems = data.map((item, index) => ({
    name: item.label,
    color: getColor(index, item.color),
  }));
  
  // Generate arc path
  const generateArcPath = (
    start: number,
    end: number,
    outer: number,
    inner: number
  ): string => {
    const outerStart = polarToCartesian(centerX, centerY, outer, end);
    const outerEnd = polarToCartesian(centerX, centerY, outer, start);
    const innerStart = polarToCartesian(centerX, centerY, inner, end);
    const innerEnd = polarToCartesian(centerX, centerY, inner, start);
    
    const largeArc = end - start <= 180 ? 0 : 1;
    
    if (inner === 0) {
      return [
        'M', centerX, centerY,
        'L', outerStart.x, outerStart.y,
        'A', outer, outer, 0, largeArc, 0, outerEnd.x, outerEnd.y,
        'Z',
      ].join(' ');
    }
    
    return [
      'M', outerStart.x, outerStart.y,
      'A', outer, outer, 0, largeArc, 0, outerEnd.x, outerEnd.y,
      'L', innerEnd.x, innerEnd.y,
      'A', inner, inner, 0, largeArc, 1, innerStart.x, innerStart.y,
      'Z',
    ].join(' ');
  };
  
  return (
    <ChartContainer
      width={width}
      height={height}
      title={title}
      legend={legend}
      legendItems={legendItems}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
        {slices.map((slice, index) => {
          const isHovered = hoveredIndex === index;
          const scale = isHovered ? 1.05 : 1;
          
          return (
            <g key={index}>
              <path
                d={generateArcPath(
                  slice.startAngle,
                  slice.endAngle,
                  outerRadius * scale,
                  actualInnerRadius * (isHovered ? 0.95 : 1)
                )}
                fill={slice.color}
                stroke="#fff"
                strokeWidth={2}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  setHoveredIndex(index);
                  const rect = (e.target as SVGElement).getBoundingClientRect();
                  setTooltipState({
                    visible: true,
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                    content: tooltip?.format
                      ? tooltip.format(slice)
                      : `${slice.label}: ${formatNumber(slice.value)} (${slice.percentage.toFixed(1)}%)`,
                  });
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  setTooltipState((s) => ({ ...s, visible: false }));
                }}
              />
              
              {showLabels && slice.percentage > 5 && (
                <text
                  x={slice.labelX}
                  y={slice.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fontWeight="600"
                  fill="#fff"
                  style={{ pointerEvents: 'none' }}
                >
                  {labelType === 'percent'
                    ? `${slice.percentage.toFixed(0)}%`
                    : labelType === 'value'
                    ? formatNumber(slice.value)
                    : slice.label}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Center label for donut */}
        {actualInnerRadius > 0 && (
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="20"
            fontWeight="700"
            fill={BRAND.uiSlate}
          >
            {formatNumber(total)}
          </text>
        )}
      </svg>
      
      <ChartTooltip {...tooltipState} />
    </ChartContainer>
  );
};

// ============================================================
// DONUT CHART (Convenience wrapper)
// ============================================================

export const DonutChart: React.FC<PieChartProps> = (props) => {
  return <PieChart {...props} innerRadius={props.innerRadius || 60} />;
};

// ============================================================
// AREA CHART
// ============================================================

export const AreaChart: React.FC<AreaChartProps> = (props) => {
  return <LineChart {...props} fill smooth showDots={props.showDots ?? false} />;
};

// ============================================================
// STAT CARD
// ============================================================

interface StatCardProps {
  title: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  color?: string;
  format?: (value: number) => string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  color = BRAND.jungleEmerald,
  format = formatNumber,
}) => {
  const isPositive = change !== undefined && change >= 0;
  const displayValue = typeof value === 'number' ? format(value) : value;
  
  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        border: `1px solid ${BRAND.ancientStone}22`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '12px',
        }}
      >
        <span
          style={{
            fontSize: '13px',
            color: BRAND.ancientStone,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {title}
        </span>
        {icon && (
          <span style={{ color, opacity: 0.8 }}>{icon}</span>
        )}
      </div>
      
      <div
        style={{
          fontSize: '28px',
          fontWeight: 700,
          color: BRAND.uiSlate,
          marginBottom: change !== undefined ? '8px' : 0,
        }}
      >
        {displayValue}
      </div>
      
      {change !== undefined && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '13px',
          }}
        >
          <span
            style={{
              color: isPositive ? BRAND.jungleEmerald : '#E57373',
              fontWeight: 600,
            }}
          >
            {isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
          </span>
          {changeLabel && (
            <span style={{ color: BRAND.ancientStone }}>{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================
// PROGRESS RING
// ============================================================

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  showValue?: boolean;
  valueFormat?: (value: number, max: number) => string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 10,
  color = BRAND.jungleEmerald,
  backgroundColor = BRAND.ancientStone + '33',
  label,
  showValue = true,
  valueFormat,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(value / max, 1);
  const strokeDashoffset = circumference * (1 - progress);
  
  const displayValue = valueFormat
    ? valueFormat(value, max)
    : `${Math.round(progress * 100)}%`;
  
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <svg width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            transition: 'stroke-dashoffset 0.5s ease',
          }}
        />
        
        {/* Value text */}
        {showValue && (
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={size / 4}
            fontWeight="700"
            fill={BRAND.uiSlate}
          >
            {displayValue}
          </text>
        )}
      </svg>
      
      {label && (
        <span
          style={{
            fontSize: '13px',
            color: BRAND.ancientStone,
            textAlign: 'center',
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
};

// ============================================================
// SPARKLINE
// ============================================================

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fillColor?: string;
  lineWidth?: number;
  showArea?: boolean;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 100,
  height = 30,
  color = BRAND.jungleEmerald,
  fillColor,
  lineWidth = 2,
  showArea = false,
}) => {
  if (data.length === 0) return null;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => ({
    x: (index / (data.length - 1)) * width,
    y: height - ((value - min) / range) * height,
  }));
  
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;
  
  return (
    <svg width={width} height={height}>
      {showArea && (
        <path
          d={areaPath}
          fill={fillColor || color}
          fillOpacity={0.2}
        />
      )}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={lineWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ============================================================
// EXPORTS
// ============================================================

export type {
  DataPoint,
  DataSeries,
  ChartDimensions,
  AxisConfig,
  LegendConfig,
  TooltipConfig,
  AnimationConfig,
  BaseChartProps,
  LineChartProps,
  BarChartProps,
  PieChartProps,
  AreaChartProps,
  ScatterChartProps,
  RadarChartProps,
  StatCardProps,
  ProgressRingProps,
  SparklineProps,
};

export { ChartContainer, ChartTooltip, formatNumber, calculateScale, DEFAULT_COLORS };

export default {
  LineChart,
  BarChart,
  PieChart,
  DonutChart,
  AreaChart,
  StatCard,
  ProgressRing,
  Sparkline,
};
