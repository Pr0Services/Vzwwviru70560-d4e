// CHE·NU™ Chart Components
// Comprehensive charting library for analytics

import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';

// ============================================================
// TYPES
// ============================================================

type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'scatter' | 'radar' | 'gauge';

interface DataPoint {
  x: number | string | Date;
  y: number;
  label?: string;
  color?: string;
}

interface DataSeries {
  name: string;
  data: DataPoint[];
  color?: string;
  type?: ChartType;
  fill?: boolean;
  strokeWidth?: number;
  dashArray?: number[];
  hidden?: boolean;
}

interface ChartMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface AxisConfig {
  show?: boolean;
  label?: string;
  min?: number;
  max?: number;
  tickCount?: number;
  tickFormat?: (value: number | string) => string;
  gridLines?: boolean;
  position?: 'left' | 'right' | 'top' | 'bottom';
}

interface LegendConfig {
  show?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  clickable?: boolean;
}

interface TooltipConfig {
  show?: boolean;
  formatter?: (point: DataPoint, series: DataSeries) => string;
}

interface AnimationConfig {
  enabled?: boolean;
  duration?: number;
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'bounce';
}

interface ChartProps {
  type: ChartType;
  series: DataSeries[];
  width?: number | string;
  height?: number | string;
  margin?: ChartMargin;
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  legend?: LegendConfig;
  tooltip?: TooltipConfig;
  animation?: AnimationConfig;
  title?: string;
  subtitle?: string;
  colors?: string[];
  backgroundColor?: string;
  className?: string;
  responsive?: boolean;
  onPointClick?: (point: DataPoint, series: DataSeries) => void;
  onLegendClick?: (series: DataSeries) => void;
}

interface PieChartProps extends Omit<ChartProps, 'type' | 'xAxis' | 'yAxis'> {
  innerRadius?: number;
  padAngle?: number;
  cornerRadius?: number;
  showLabels?: boolean;
  labelFormat?: (value: number, percentage: number) => string;
}

interface GaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  width?: number | string;
  height?: number | string;
  title?: string;
  subtitle?: string;
  colors?: { threshold: number; color: string }[];
  showValue?: boolean;
  valueFormat?: (value: number) => string;
  arcWidth?: number;
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

const DEFAULT_COLORS = [
  BRAND.sacredGold,
  BRAND.jungleEmerald,
  BRAND.cenoteTurquoise,
  BRAND.earthEmber,
  BRAND.shadowMoss,
  BRAND.ancientStone,
  '#E74C3C',
  '#9B59B6',
  '#3498DB',
  '#1ABC9C',
];

const DEFAULT_MARGIN: ChartMargin = { top: 20, right: 20, bottom: 40, left: 50 };

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function getScale(
  values: number[],
  range: [number, number],
  padding: number = 0
): (value: number) => number {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const domain = max - min || 1;
  const rangeSize = range[1] - range[0] - padding * 2;

  return (value: number) => {
    const normalized = (value - min) / domain;
    return range[0] + padding + normalized * rangeSize;
  };
}

function getInverseScale(
  values: number[],
  range: [number, number],
  padding: number = 0
): (value: number) => number {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const domain = max - min || 1;
  const rangeSize = range[1] - range[0] - padding * 2;

  return (pixel: number) => {
    const normalized = (pixel - range[0] - padding) / rangeSize;
    return min + normalized * domain;
  };
}

function getTicks(min: number, max: number, count: number = 5): number[] {
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, i) => min + i * step);
}

function formatNumber(value: number): string {
  if (Math.abs(value) >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (Math.abs(value) >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (Math.abs(value) >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toFixed(value % 1 === 0 ? 0 : 2);
}

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angle: number
): { x: number; y: number } {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
  ].join(' ');
}

function getEasing(name: AnimationConfig['easing']): (t: number) => number {
  switch (name) {
    case 'easeIn':
      return (t) => t * t;
    case 'easeOut':
      return (t) => t * (2 - t);
    case 'easeInOut':
      return (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
    case 'bounce':
      return (t) => {
        const n1 = 7.5625;
        const d1 = 2.75;
        if (t < 1 / d1) return n1 * t * t;
        if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
        if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
      };
    default:
      return (t) => t;
  }
}

// ============================================================
// HOOKS
// ============================================================

function useChartDimensions(
  containerRef: React.RefObject<HTMLDivElement>,
  width?: number | string,
  height?: number | string,
  responsive: boolean = true
): { width: number; height: number } {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const computedWidth = typeof width === 'number' ? width : rect.width;
      const computedHeight = typeof height === 'number' ? height : 300;

      setDimensions({
        width: computedWidth || 400,
        height: computedHeight || 300,
      });
    };

    updateDimensions();

    if (responsive) {
      const observer = new ResizeObserver(updateDimensions);
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [width, height, responsive]);

  return dimensions;
}

function useAnimation(
  enabled: boolean = true,
  duration: number = 750,
  easing: AnimationConfig['easing'] = 'easeOut'
): number {
  const [progress, setProgress] = useState(0);
  const easingFn = useMemo(() => getEasing(easing), [easing]);

  useEffect(() => {
    if (!enabled) {
      setProgress(1);
      return;
    }

    setProgress(0);
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      setProgress(easingFn(t));

      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [enabled, duration, easingFn]);

  return progress;
}

// ============================================================
// COMPONENTS
// ============================================================

// Line/Area Chart
function LineChart({
  series,
  width: propWidth,
  height: propHeight,
  margin = DEFAULT_MARGIN,
  xAxis = {},
  yAxis = {},
  legend = { show: true },
  tooltip = { show: true },
  animation = { enabled: true },
  title,
  subtitle,
  colors = DEFAULT_COLORS,
  backgroundColor = '#ffffff',
  className,
  responsive = true,
  onPointClick,
  onLegendClick,
}: Omit<ChartProps, 'type'>): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useChartDimensions(containerRef, propWidth, propHeight, responsive);
  const animationProgress = useAnimation(animation.enabled, animation.duration, animation.easing);

  const [hoveredPoint, setHoveredPoint] = useState<{ seriesIndex: number; pointIndex: number } | null>(null);
  const [hiddenSeries, setHiddenSeries] = useState<Set<number>>(new Set());

  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Calculate scales
  const { xScale, yScale, xValues, yMin, yMax } = useMemo(() => {
    const visibleSeries = series.filter((_, i) => !hiddenSeries.has(i));
    const allPoints = visibleSeries.flatMap((s) => s.data);
    const xValues = [...new Set(allPoints.map((p) => String(p.x)))];
    const yValues = allPoints.map((p) => p.y);

    const yMin = yAxis.min ?? Math.min(0, ...yValues);
    const yMax = yAxis.max ?? Math.max(...yValues) * 1.1;

    const xScale = (index: number) => margin.left + (index / (xValues.length - 1 || 1)) * chartWidth;
    const yScale = (value: number) => {
      const normalized = (value - yMin) / (yMax - yMin || 1);
      return margin.top + chartHeight - normalized * chartHeight;
    };

    return { xScale, yScale, xValues, yMin, yMax };
  }, [series, hiddenSeries, chartWidth, chartHeight, margin, yAxis]);

  const handleLegendClick = useCallback((index: number, s: DataSeries) => {
    setHiddenSeries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
    onLegendClick?.(s);
  }, [onLegendClick]);

  const renderLine = (s: DataSeries, seriesIndex: number) => {
    if (hiddenSeries.has(seriesIndex)) return null;

    const color = s.color || colors[seriesIndex % colors.length];
    const points = s.data.map((point, i) => {
      const xIndex = xValues.indexOf(String(point.x));
      return { x: xScale(xIndex), y: yScale(point.y * animationProgress), point, index: i };
    });

    const pathD = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');

    const areaD = s.fill
      ? `${pathD} L ${points[points.length - 1].x} ${margin.top + chartHeight} L ${points[0].x} ${margin.top + chartHeight} Z`
      : '';

    return (
      <g key={seriesIndex}>
        {s.fill && (
          <path d={areaD} fill={`${color}30`} />
        )}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={s.strokeWidth || 2}
          strokeDasharray={s.dashArray?.join(' ')}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={hoveredPoint?.seriesIndex === seriesIndex && hoveredPoint?.pointIndex === i ? 6 : 4}
            fill={color}
            stroke="#fff"
            strokeWidth={2}
            style={{ cursor: 'pointer', transition: 'r 0.2s' }}
            onMouseEnter={() => setHoveredPoint({ seriesIndex, pointIndex: i })}
            onMouseLeave={() => setHoveredPoint(null)}
            onClick={() => onPointClick?.(p.point, s)}
          />
        ))}
      </g>
    );
  };

  const renderYAxis = () => {
    if (yAxis.show === false) return null;

    const ticks = getTicks(yMin, yMax, yAxis.tickCount || 5);
    const format = yAxis.tickFormat || formatNumber;

    return (
      <g>
        {yAxis.gridLines !== false && ticks.map((tick) => (
          <line
            key={tick}
            x1={margin.left}
            y1={yScale(tick)}
            x2={margin.left + chartWidth}
            y2={yScale(tick)}
            stroke={BRAND.ancientStone}
            strokeOpacity={0.2}
            strokeDasharray="4,4"
          />
        ))}
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={margin.top + chartHeight}
          stroke={BRAND.ancientStone}
        />
        {ticks.map((tick) => (
          <text
            key={tick}
            x={margin.left - 10}
            y={yScale(tick)}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize={12}
            fill={BRAND.ancientStone}
          >
            {format(tick)}
          </text>
        ))}
        {yAxis.label && (
          <text
            x={-height / 2}
            y={15}
            transform="rotate(-90)"
            textAnchor="middle"
            fontSize={12}
            fill={BRAND.uiSlate}
          >
            {yAxis.label}
          </text>
        )}
      </g>
    );
  };

  const renderXAxis = () => {
    if (xAxis.show === false) return null;

    const format = xAxis.tickFormat || String;

    return (
      <g>
        <line
          x1={margin.left}
          y1={margin.top + chartHeight}
          x2={margin.left + chartWidth}
          y2={margin.top + chartHeight}
          stroke={BRAND.ancientStone}
        />
        {xValues.map((value, i) => {
          const x = xScale(i);
          return (
            <g key={i}>
              {xAxis.gridLines && (
                <line
                  x1={x}
                  y1={margin.top}
                  x2={x}
                  y2={margin.top + chartHeight}
                  stroke={BRAND.ancientStone}
                  strokeOpacity={0.2}
                  strokeDasharray="4,4"
                />
              )}
              <text
                x={x}
                y={margin.top + chartHeight + 20}
                textAnchor="middle"
                fontSize={12}
                fill={BRAND.ancientStone}
              >
                {format(value)}
              </text>
            </g>
          );
        })}
        {xAxis.label && (
          <text
            x={margin.left + chartWidth / 2}
            y={height - 5}
            textAnchor="middle"
            fontSize={12}
            fill={BRAND.uiSlate}
          >
            {xAxis.label}
          </text>
        )}
      </g>
    );
  };

  const renderLegend = () => {
    if (!legend.show) return null;

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: legend.align === 'start' ? 'flex-start' : legend.align === 'end' ? 'flex-end' : 'center',
          gap: '16px',
          padding: '8px 16px',
          flexWrap: 'wrap',
        }}
      >
        {series.map((s, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: legend.clickable ? 'pointer' : 'default',
              opacity: hiddenSeries.has(i) ? 0.4 : 1,
            }}
            onClick={() => legend.clickable && handleLegendClick(i, s)}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                backgroundColor: s.color || colors[i % colors.length],
              }}
            />
            <span style={{ fontSize: '13px', color: BRAND.uiSlate }}>{s.name}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderTooltip = () => {
    if (!tooltip.show || !hoveredPoint) return null;

    const s = series[hoveredPoint.seriesIndex];
    const point = s.data[hoveredPoint.pointIndex];
    const xIndex = xValues.indexOf(String(point.x));
    const x = xScale(xIndex);
    const y = yScale(point.y);

    const content = tooltip.formatter
      ? tooltip.formatter(point, s)
      : `${s.name}: ${formatNumber(point.y)}`;

    return (
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y - 40,
          transform: 'translateX(-50%)',
          backgroundColor: BRAND.uiSlate,
          color: '#fff',
          padding: '6px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        {content}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: propWidth || '100%',
        height: propHeight || 'auto',
        backgroundColor,
        borderRadius: '8px',
      }}
    >
      {title && (
        <div style={{ padding: '16px 16px 0', fontSize: '18px', fontWeight: 600, color: BRAND.uiSlate }}>
          {title}
          {subtitle && (
            <div style={{ fontSize: '13px', fontWeight: 400, color: BRAND.ancientStone, marginTop: '4px' }}>
              {subtitle}
            </div>
          )}
        </div>
      )}
      {legend.position === 'top' && renderLegend()}
      <svg width={width} height={height} style={{ display: 'block' }}>
        {renderYAxis()}
        {renderXAxis()}
        {series.map(renderLine)}
      </svg>
      {renderTooltip()}
      {legend.position !== 'top' && renderLegend()}
    </div>
  );
}

// Bar Chart
function BarChart({
  series,
  width: propWidth,
  height: propHeight,
  margin = DEFAULT_MARGIN,
  xAxis = {},
  yAxis = {},
  legend = { show: true },
  tooltip = { show: true },
  animation = { enabled: true },
  title,
  subtitle,
  colors = DEFAULT_COLORS,
  backgroundColor = '#ffffff',
  className,
  responsive = true,
  onPointClick,
  onLegendClick,
}: Omit<ChartProps, 'type'>): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useChartDimensions(containerRef, propWidth, propHeight, responsive);
  const animationProgress = useAnimation(animation.enabled, animation.duration, animation.easing);

  const [hoveredBar, setHoveredBar] = useState<{ seriesIndex: number; barIndex: number } | null>(null);
  const [hiddenSeries, setHiddenSeries] = useState<Set<number>>(new Set());

  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const { xValues, yMin, yMax, yScale } = useMemo(() => {
    const visibleSeries = series.filter((_, i) => !hiddenSeries.has(i));
    const allPoints = visibleSeries.flatMap((s) => s.data);
    const xValues = [...new Set(allPoints.map((p) => String(p.x)))];
    const yValues = allPoints.map((p) => p.y);

    const yMin = yAxis.min ?? Math.min(0, ...yValues);
    const yMax = yAxis.max ?? Math.max(...yValues) * 1.1;

    const yScale = (value: number) => {
      const normalized = (value - yMin) / (yMax - yMin || 1);
      return chartHeight - normalized * chartHeight;
    };

    return { xValues, yMin, yMax, yScale };
  }, [series, hiddenSeries, chartHeight, yAxis]);

  const visibleSeriesCount = series.filter((_, i) => !hiddenSeries.has(i)).length;
  const barGroupWidth = chartWidth / xValues.length;
  const barWidth = (barGroupWidth * 0.8) / visibleSeriesCount;
  const barPadding = barGroupWidth * 0.1;

  const handleLegendClick = useCallback((index: number, s: DataSeries) => {
    setHiddenSeries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
    onLegendClick?.(s);
  }, [onLegendClick]);

  const renderBars = () => {
    let visibleIndex = 0;
    return series.map((s, seriesIndex) => {
      if (hiddenSeries.has(seriesIndex)) return null;

      const color = s.color || colors[seriesIndex % colors.length];
      const currentVisibleIndex = visibleIndex++;

      return s.data.map((point, barIndex) => {
        const xIndex = xValues.indexOf(String(point.x));
        const x = margin.left + barPadding + xIndex * barGroupWidth + currentVisibleIndex * barWidth;
        const barHeight = yScale(0) - yScale(point.y);
        const y = margin.top + yScale(point.y);

        const isHovered = hoveredBar?.seriesIndex === seriesIndex && hoveredBar?.barIndex === barIndex;

        return (
          <rect
            key={`${seriesIndex}-${barIndex}`}
            x={x}
            y={y + (1 - animationProgress) * barHeight}
            width={barWidth - 2}
            height={barHeight * animationProgress}
            fill={color}
            opacity={isHovered ? 1 : 0.85}
            rx={2}
            style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
            onMouseEnter={() => setHoveredBar({ seriesIndex, barIndex })}
            onMouseLeave={() => setHoveredBar(null)}
            onClick={() => onPointClick?.(point, s)}
          />
        );
      });
    });
  };

  const renderYAxis = () => {
    if (yAxis.show === false) return null;

    const ticks = getTicks(yMin, yMax, yAxis.tickCount || 5);
    const format = yAxis.tickFormat || formatNumber;

    return (
      <g>
        {yAxis.gridLines !== false && ticks.map((tick) => (
          <line
            key={tick}
            x1={margin.left}
            y1={margin.top + yScale(tick)}
            x2={margin.left + chartWidth}
            y2={margin.top + yScale(tick)}
            stroke={BRAND.ancientStone}
            strokeOpacity={0.2}
            strokeDasharray="4,4"
          />
        ))}
        {ticks.map((tick) => (
          <text
            key={tick}
            x={margin.left - 10}
            y={margin.top + yScale(tick)}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize={12}
            fill={BRAND.ancientStone}
          >
            {format(tick)}
          </text>
        ))}
      </g>
    );
  };

  const renderXAxis = () => {
    if (xAxis.show === false) return null;

    const format = xAxis.tickFormat || String;

    return (
      <g>
        <line
          x1={margin.left}
          y1={margin.top + chartHeight}
          x2={margin.left + chartWidth}
          y2={margin.top + chartHeight}
          stroke={BRAND.ancientStone}
        />
        {xValues.map((value, i) => (
          <text
            key={i}
            x={margin.left + barPadding + i * barGroupWidth + barGroupWidth * 0.4}
            y={margin.top + chartHeight + 20}
            textAnchor="middle"
            fontSize={12}
            fill={BRAND.ancientStone}
          >
            {format(value)}
          </text>
        ))}
      </g>
    );
  };

  const renderLegend = () => {
    if (!legend.show) return null;

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          padding: '8px 16px',
        }}
      >
        {series.map((s, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: legend.clickable ? 'pointer' : 'default',
              opacity: hiddenSeries.has(i) ? 0.4 : 1,
            }}
            onClick={() => legend.clickable && handleLegendClick(i, s)}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                backgroundColor: s.color || colors[i % colors.length],
              }}
            />
            <span style={{ fontSize: '13px', color: BRAND.uiSlate }}>{s.name}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: propWidth || '100%',
        height: propHeight || 'auto',
        backgroundColor,
        borderRadius: '8px',
      }}
    >
      {title && (
        <div style={{ padding: '16px 16px 0', fontSize: '18px', fontWeight: 600, color: BRAND.uiSlate }}>
          {title}
          {subtitle && (
            <div style={{ fontSize: '13px', fontWeight: 400, color: BRAND.ancientStone, marginTop: '4px' }}>
              {subtitle}
            </div>
          )}
        </div>
      )}
      {legend.position === 'top' && renderLegend()}
      <svg width={width} height={height} style={{ display: 'block' }}>
        {renderYAxis()}
        {renderXAxis()}
        {renderBars()}
      </svg>
      {legend.position !== 'top' && renderLegend()}
    </div>
  );
}

// Pie/Doughnut Chart
function PieChart({
  series,
  width: propWidth,
  height: propHeight,
  innerRadius = 0,
  padAngle = 0,
  cornerRadius = 0,
  showLabels = true,
  labelFormat,
  legend = { show: true, position: 'right' },
  tooltip = { show: true },
  animation = { enabled: true },
  title,
  subtitle,
  colors = DEFAULT_COLORS,
  backgroundColor = '#ffffff',
  className,
  responsive = true,
  onPointClick,
  onLegendClick,
}: PieChartProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useChartDimensions(containerRef, propWidth, propHeight, responsive);
  const animationProgress = useAnimation(animation.enabled, animation.duration, animation.easing);

  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const [hiddenSlices, setHiddenSlices] = useState<Set<number>>(new Set());

  const data = series[0]?.data || [];
  const total = data
    .filter((_, i) => !hiddenSlices.has(i))
    .reduce((sum, d) => sum + d.y, 0);

  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(cx, cy) - 40;
  const actualInnerRadius = innerRadius * radius;

  const slices = useMemo(() => {
    let startAngle = 0;
    return data.map((d, i) => {
      if (hiddenSlices.has(i)) {
        return { startAngle: 0, endAngle: 0, percentage: 0, hidden: true };
      }
      const percentage = d.y / total;
      const angle = percentage * 360 * animationProgress;
      const slice = {
        startAngle,
        endAngle: startAngle + angle,
        percentage,
        hidden: false,
      };
      startAngle += angle;
      return slice;
    });
  }, [data, hiddenSlices, total, animationProgress]);

  const handleSliceClick = (index: number) => {
    if (!onPointClick || hiddenSlices.has(index)) return;
    onPointClick(data[index], series[0]);
  };

  const handleLegendClick = (index: number) => {
    setHiddenSlices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
    if (onLegendClick && series[0]) {
      onLegendClick(series[0]);
    }
  };

  const renderSlice = (d: DataPoint, index: number) => {
    const slice = slices[index];
    if (slice.hidden || slice.endAngle <= slice.startAngle) return null;

    const color = d.color || colors[index % colors.length];
    const isHovered = hoveredSlice === index;
    const midAngle = (slice.startAngle + slice.endAngle) / 2;
    const offset = isHovered ? 5 : 0;
    const offsetX = offset * Math.cos(((midAngle - 90) * Math.PI) / 180);
    const offsetY = offset * Math.sin(((midAngle - 90) * Math.PI) / 180);

    // Create arc path
    const outerStart = polarToCartesian(cx + offsetX, cy + offsetY, radius, slice.endAngle);
    const outerEnd = polarToCartesian(cx + offsetX, cy + offsetY, radius, slice.startAngle);
    const innerStart = polarToCartesian(cx + offsetX, cy + offsetY, actualInnerRadius, slice.endAngle);
    const innerEnd = polarToCartesian(cx + offsetX, cy + offsetY, actualInnerRadius, slice.startAngle);
    const largeArc = slice.endAngle - slice.startAngle > 180 ? 1 : 0;

    const pathD = actualInnerRadius > 0
      ? `M ${outerStart.x} ${outerStart.y}
         A ${radius} ${radius} 0 ${largeArc} 0 ${outerEnd.x} ${outerEnd.y}
         L ${innerEnd.x} ${innerEnd.y}
         A ${actualInnerRadius} ${actualInnerRadius} 0 ${largeArc} 1 ${innerStart.x} ${innerStart.y}
         Z`
      : `M ${cx + offsetX} ${cy + offsetY}
         L ${outerStart.x} ${outerStart.y}
         A ${radius} ${radius} 0 ${largeArc} 0 ${outerEnd.x} ${outerEnd.y}
         Z`;

    return (
      <g key={index}>
        <path
          d={pathD}
          fill={color}
          stroke="#fff"
          strokeWidth={2}
          style={{ cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={() => setHoveredSlice(index)}
          onMouseLeave={() => setHoveredSlice(null)}
          onClick={() => handleSliceClick(index)}
        />
        {showLabels && slice.percentage > 0.05 && (
          <text
            x={cx + offsetX + (radius * 0.7) * Math.cos(((midAngle - 90) * Math.PI) / 180)}
            y={cy + offsetY + (radius * 0.7) * Math.sin(((midAngle - 90) * Math.PI) / 180)}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={12}
            fill="#fff"
            fontWeight={600}
          >
            {labelFormat
              ? labelFormat(d.y, slice.percentage)
              : `${(slice.percentage * 100).toFixed(1)}%`}
          </text>
        )}
      </g>
    );
  };

  const renderLegend = () => {
    if (!legend.show) return null;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: legend.position === 'right' || legend.position === 'left' ? 'column' : 'row',
          gap: '8px',
          padding: '8px',
        }}
      >
        {data.map((d, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              opacity: hiddenSlices.has(i) ? 0.4 : 1,
            }}
            onClick={() => handleLegendClick(i)}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                backgroundColor: d.color || colors[i % colors.length],
              }}
            />
            <span style={{ fontSize: '13px', color: BRAND.uiSlate }}>
              {d.label || String(d.x)} ({formatNumber(d.y)})
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: 'flex',
        flexDirection: legend.position === 'right' || legend.position === 'left' ? 'row' : 'column',
        alignItems: 'center',
        width: propWidth || '100%',
        backgroundColor,
        borderRadius: '8px',
        padding: '16px',
      }}
    >
      {title && (
        <div style={{ width: '100%', marginBottom: '16px' }}>
          <div style={{ fontSize: '18px', fontWeight: 600, color: BRAND.uiSlate }}>{title}</div>
          {subtitle && (
            <div style={{ fontSize: '13px', color: BRAND.ancientStone, marginTop: '4px' }}>{subtitle}</div>
          )}
        </div>
      )}
      {legend.position === 'left' && renderLegend()}
      {legend.position === 'top' && renderLegend()}
      <svg width={width} height={height} style={{ display: 'block' }}>
        {data.map(renderSlice)}
      </svg>
      {legend.position === 'right' && renderLegend()}
      {legend.position === 'bottom' && renderLegend()}
    </div>
  );
}

// Gauge Chart
function GaugeChart({
  value,
  min = 0,
  max = 100,
  width: propWidth = 200,
  height: propHeight = 150,
  title,
  subtitle,
  colors = [
    { threshold: 30, color: BRAND.jungleEmerald },
    { threshold: 70, color: BRAND.sacredGold },
    { threshold: 100, color: BRAND.earthEmber },
  ],
  showValue = true,
  valueFormat,
  arcWidth = 20,
  className,
}: GaugeChartProps): JSX.Element {
  const animationProgress = useAnimation(true, 1000, 'easeOut');

  const width = typeof propWidth === 'number' ? propWidth : 200;
  const height = typeof propHeight === 'number' ? propHeight : 150;

  const cx = width / 2;
  const cy = height - 20;
  const radius = Math.min(cx, cy) - 10;
  const innerRadius = radius - arcWidth;

  const normalizedValue = Math.max(min, Math.min(max, value));
  const percentage = (normalizedValue - min) / (max - min);
  const animatedPercentage = percentage * animationProgress;
  const angle = animatedPercentage * 180;

  const getColor = (pct: number): string => {
    const value = pct * 100;
    for (let i = 0; i < colors.length; i++) {
      if (value <= colors[i].threshold) {
        return colors[i].color;
      }
    }
    return colors[colors.length - 1].color;
  };

  const backgroundArc = describeArc(cx, cy, radius, 0, 180);
  const valueArc = angle > 0 ? describeArc(cx, cy, radius, 0, angle) : '';
  const backgroundInnerArc = describeArc(cx, cy, innerRadius, 0, 180);
  const valueInnerArc = angle > 0 ? describeArc(cx, cy, innerRadius, 0, angle) : '';

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width,
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '16px',
      }}
    >
      {title && (
        <div style={{ fontSize: '14px', fontWeight: 600, color: BRAND.uiSlate, marginBottom: '8px' }}>
          {title}
        </div>
      )}
      <svg width={width} height={height} style={{ display: 'block' }}>
        {/* Background arc */}
        <path
          d={`${backgroundArc} L ${polarToCartesian(cx, cy, innerRadius, 0).x} ${polarToCartesian(cx, cy, innerRadius, 0).y} ${backgroundInnerArc.replace('M', 'L')} Z`}
          fill={BRAND.softSand}
        />
        {/* Value arc */}
        {angle > 0 && (
          <path
            d={`${valueArc} L ${polarToCartesian(cx, cy, innerRadius, angle).x} ${polarToCartesian(cx, cy, innerRadius, angle).y} ${valueInnerArc.replace('M', 'L')} Z`}
            fill={getColor(animatedPercentage)}
          />
        )}
        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={cx + (radius - 5) * Math.cos(((angle - 180) * Math.PI) / 180)}
          y2={cy + (radius - 5) * Math.sin(((angle - 180) * Math.PI) / 180)}
          stroke={BRAND.uiSlate}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={6} fill={BRAND.uiSlate} />
        {/* Labels */}
        <text x={10} y={cy + 15} fontSize={11} fill={BRAND.ancientStone}>
          {min}
        </text>
        <text x={width - 10} y={cy + 15} fontSize={11} fill={BRAND.ancientStone} textAnchor="end">
          {max}
        </text>
      </svg>
      {showValue && (
        <div style={{ fontSize: '24px', fontWeight: 700, color: getColor(percentage), marginTop: '-10px' }}>
          {valueFormat ? valueFormat(normalizedValue) : formatNumber(normalizedValue)}
        </div>
      )}
      {subtitle && (
        <div style={{ fontSize: '12px', color: BRAND.ancientStone, marginTop: '4px' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export {
  LineChart,
  BarChart,
  PieChart,
  GaugeChart,
  formatNumber,
  DEFAULT_COLORS,
};

export type {
  ChartType,
  DataPoint,
  DataSeries,
  ChartMargin,
  AxisConfig,
  LegendConfig,
  TooltipConfig,
  AnimationConfig,
  ChartProps,
  PieChartProps,
  GaugeChartProps,
};

export default {
  LineChart,
  BarChart,
  PieChart,
  GaugeChart,
};
