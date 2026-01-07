// CHE·NU™ Dashboard Analytics Components
// Comprehensive analytics dashboard with metrics, charts, and insights

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

type MetricTrend = 'up' | 'down' | 'stable';
type ChartType = 'line' | 'bar' | 'area' | 'pie' | 'donut' | 'sparkline';
type TimeRange = '1h' | '24h' | '7d' | '30d' | '90d' | '1y' | 'all';
type WidgetSize = 'small' | 'medium' | 'large' | 'full';

interface MetricValue {
  current: number;
  previous?: number;
  change?: number;
  changePercent?: number;
  trend?: MetricTrend;
}

interface MetricCardData {
  id: string;
  title: string;
  value: MetricValue;
  format?: 'number' | 'currency' | 'percent' | 'duration' | 'bytes';
  icon?: ReactNode;
  color?: string;
  description?: string;
  sparklineData?: number[];
  target?: number;
  onClick?: () => void;
}

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  meta?: Record<string, any>;
}

interface ChartSeries {
  id: string;
  name: string;
  data: ChartDataPoint[];
  color?: string;
  type?: ChartType;
}

interface WidgetConfig {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'table' | 'list' | 'progress' | 'custom';
  size: WidgetSize;
  data: unknown;
  refreshInterval?: number;
  actions?: Array<{
    label: string;
    icon?: ReactNode;
    onClick: () => void;
  }>;
  settings?: Record<string, any>;
}

interface InsightData {
  id: string;
  type: 'positive' | 'negative' | 'neutral' | 'warning';
  title: string;
  description: string;
  metric?: string;
  value?: number;
  recommendation?: string;
  timestamp?: Date;
}

interface DashboardConfig {
  id: string;
  name: string;
  description?: string;
  widgets: WidgetConfig[];
  layout?: 'grid' | 'masonry' | 'columns';
  columns?: number;
  refreshInterval?: number;
  filters?: DashboardFilter[];
}

interface DashboardFilter {
  id: string;
  type: 'select' | 'date' | 'search' | 'toggle';
  label: string;
  options?: Array<{ value: string; label: string }>;
  value: unknown;
  onChange: (value: unknown) => void;
}

interface AnalyticsDashboardProps {
  config: DashboardConfig;
  onWidgetClick?: (widget: WidgetConfig) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

interface MetricCardProps {
  metric: MetricCardData;
  size?: WidgetSize;
  onClick?: () => void;
  className?: string;
}

interface ChartWidgetProps {
  title: string;
  series: ChartSeries[];
  type?: ChartType;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  animate?: boolean;
  className?: string;
}

interface InsightsPanelProps {
  insights: InsightData[];
  maxItems?: number;
  onInsightClick?: (insight: InsightData) => void;
  className?: string;
}

interface ProgressWidgetProps {
  title: string;
  items: Array<{
    label: string;
    value: number;
    max: number;
    color?: string;
  }>;
  showPercentage?: boolean;
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

const CHART_COLORS = [
  BRAND.cenoteTurquoise,
  BRAND.sacredGold,
  BRAND.jungleEmerald,
  BRAND.earthEmber,
  '#805AD5',
  '#DD6B20',
  '#3182CE',
  '#D53F8C',
];

// ============================================================
// CONTEXT
// ============================================================

interface DashboardContextValue {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  isRefreshing: boolean;
  refresh: () => void;
  filters: Record<string, any>;
  setFilter: (key: string, value: unknown) => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboard(): DashboardContextValue {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}

// ============================================================
// UTILITIES
// ============================================================

function formatMetricValue(value: number, format?: string): string {
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(value);
    case 'percent':
      return `${value.toFixed(1)}%`;
    case 'duration':
      if (value < 60) return `${value}s`;
      if (value < 3600) return `${Math.floor(value / 60)}m`;
      return `${Math.floor(value / 3600)}h`;
    case 'bytes':
      if (value < 1024) return `${value} B`;
      if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
      if (value < 1024 * 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(1)} MB`;
      return `${(value / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    default:
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
      return value.toLocaleString();
  }
}

function getTrendIcon(trend?: MetricTrend): string {
  switch (trend) {
    case 'up': return '↑';
    case 'down': return '↓';
    default: return '→';
  }
}

function getTrendColor(trend?: MetricTrend, isPositive = true): string {
  if (trend === 'stable') return BRAND.ancientStone;
  if (trend === 'up') return isPositive ? '#38A169' : '#E53E3E';
  if (trend === 'down') return isPositive ? '#E53E3E' : '#38A169';
  return BRAND.ancientStone;
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  // Dashboard layout
  dashboard: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
    padding: '24px',
    backgroundColor: BRAND.softSand,
    minHeight: '100vh',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap' as const,
    gap: '16px',
  },

  headerTitle: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },

  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: BRAND.uiSlate,
    margin: 0,
  },

  description: {
    fontSize: '14px',
    color: BRAND.ancientStone,
    margin: 0,
  },

  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  timeRangeSelector: {
    display: 'flex',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '4px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },

  timeRangeButton: {
    padding: '6px 12px',
    fontSize: '13px',
    fontWeight: 500,
    color: BRAND.ancientStone,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  timeRangeButtonActive: {
    backgroundColor: BRAND.sacredGold,
    color: '#ffffff',
  },

  refreshButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 500,
    color: BRAND.uiSlate,
    backgroundColor: '#ffffff',
    border: `1px solid ${BRAND.ancientStone}20`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  refreshButtonHover: {
    borderColor: BRAND.sacredGold,
    color: BRAND.sacredGold,
  },

  filters: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap' as const,
  },

  filterItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  filterLabel: {
    fontSize: '13px',
    fontWeight: 500,
    color: BRAND.ancientStone,
  },

  filterSelect: {
    padding: '6px 12px',
    fontSize: '13px',
    color: BRAND.uiSlate,
    backgroundColor: '#ffffff',
    border: `1px solid ${BRAND.ancientStone}20`,
    borderRadius: '6px',
    outline: 'none',
    cursor: 'pointer',
  },

  // Widget grid
  widgetGrid: {
    display: 'grid',
    gap: '20px',
  },

  widgetGridColumns2: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },

  widgetGridColumns3: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },

  widgetGridColumns4: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },

  // Widget base
  widget: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    overflow: 'hidden',
    transition: 'box-shadow 0.2s',
  },

  widgetHover: {
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },

  widgetSmall: {
    gridColumn: 'span 1',
  },

  widgetMedium: {
    gridColumn: 'span 2',
  },

  widgetLarge: {
    gridColumn: 'span 3',
  },

  widgetFull: {
    gridColumn: '1 / -1',
  },

  widgetHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px 12px',
    borderBottom: `1px solid ${BRAND.ancientStone}08`,
  },

  widgetTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  widgetActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  widgetActionButton: {
    padding: '4px 8px',
    fontSize: '12px',
    color: BRAND.ancientStone,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  widgetContent: {
    padding: '16px 20px 20px',
  },

  // Metric card
  metricCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  metricCardClickable: {
    cursor: 'pointer',
  },

  metricHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },

  metricIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },

  metricTitle: {
    fontSize: '13px',
    fontWeight: 500,
    color: BRAND.ancientStone,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },

  metricValue: {
    fontSize: '32px',
    fontWeight: 700,
    color: BRAND.uiSlate,
    lineHeight: 1.2,
    marginBottom: '8px',
  },

  metricValueSmall: {
    fontSize: '24px',
  },

  metricChange: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: 500,
  },

  metricChangeIcon: {
    fontSize: '14px',
  },

  metricDescription: {
    fontSize: '12px',
    color: BRAND.ancientStone,
    marginTop: '8px',
  },

  metricSparkline: {
    marginTop: '12px',
    height: '40px',
  },

  metricTarget: {
    marginTop: '12px',
  },

  metricTargetLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: BRAND.ancientStone,
    marginBottom: '4px',
  },

  metricTargetBar: {
    height: '4px',
    backgroundColor: `${BRAND.ancientStone}20`,
    borderRadius: '2px',
    overflow: 'hidden',
  },

  metricTargetFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.3s',
  },

  // Chart widget
  chartContainer: {
    position: 'relative' as const,
    width: '100%',
  },

  chartLegend: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '16px',
    marginTop: '16px',
    justifyContent: 'center',
  },

  chartLegendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: BRAND.ancientStone,
  },

  chartLegendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },

  // Bar chart
  barChart: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    height: '200px',
    padding: '20px 0',
  },

  barItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
  },

  bar: {
    width: '100%',
    maxWidth: '40px',
    borderRadius: '4px 4px 0 0',
    transition: 'height 0.3s',
  },

  barLabel: {
    fontSize: '11px',
    color: BRAND.ancientStone,
    textAlign: 'center' as const,
    whiteSpace: 'nowrap' as const,
  },

  barValue: {
    fontSize: '12px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  // Line chart (SVG-based)
  lineChart: {
    width: '100%',
    height: '200px',
  },

  // Pie chart
  pieChart: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '32px',
  },

  pieSvg: {
    width: '160px',
    height: '160px',
  },

  pieLabels: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },

  pieLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
  },

  pieLabelDot: {
    width: '12px',
    height: '12px',
    borderRadius: '3px',
  },

  pieLabelText: {
    color: BRAND.uiSlate,
  },

  pieLabelValue: {
    color: BRAND.ancientStone,
    marginLeft: 'auto',
  },

  // Sparkline
  sparkline: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '2px',
    height: '40px',
  },

  sparklineBar: {
    flex: 1,
    backgroundColor: BRAND.cenoteTurquoise,
    borderRadius: '1px',
    minHeight: '2px',
    opacity: 0.6,
    transition: 'opacity 0.15s',
  },

  sparklineBarHover: {
    opacity: 1,
  },

  // Insights panel
  insightsPanel: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },

  insightsHeader: {
    padding: '16px 20px',
    borderBottom: `1px solid ${BRAND.ancientStone}08`,
  },

  insightsTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    margin: 0,
  },

  insightsList: {
    padding: '8px 0',
  },

  insightItem: {
    display: 'flex',
    gap: '12px',
    padding: '12px 20px',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },

  insightItemHover: {
    backgroundColor: BRAND.softSand,
  },

  insightIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    flexShrink: 0,
  },

  insightIconPositive: {
    backgroundColor: '#C6F6D5',
    color: '#22543D',
  },

  insightIconNegative: {
    backgroundColor: '#FED7D7',
    color: '#822727',
  },

  insightIconNeutral: {
    backgroundColor: BRAND.softSand,
    color: BRAND.ancientStone,
  },

  insightIconWarning: {
    backgroundColor: '#FEFCBF',
    color: '#744210',
  },

  insightContent: {
    flex: 1,
    minWidth: 0,
  },

  insightTitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: BRAND.uiSlate,
    marginBottom: '2px',
  },

  insightDescription: {
    fontSize: '13px',
    color: BRAND.ancientStone,
    lineHeight: 1.4,
  },

  insightMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '6px',
    fontSize: '12px',
    color: BRAND.ancientStone,
  },

  // Progress widget
  progressWidget: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },

  progressItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },

  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  progressLabel: {
    fontSize: '13px',
    fontWeight: 500,
    color: BRAND.uiSlate,
  },

  progressValue: {
    fontSize: '13px',
    fontWeight: 600,
    color: BRAND.ancientStone,
  },

  progressBar: {
    height: '8px',
    backgroundColor: `${BRAND.ancientStone}15`,
    borderRadius: '4px',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s',
  },

  // Loading state
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    color: BRAND.ancientStone,
  },

  loadingSpinner: {
    width: '24px',
    height: '24px',
    border: `2px solid ${BRAND.ancientStone}20`,
    borderTopColor: BRAND.sacredGold,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },

  // Error state
  error: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    textAlign: 'center' as const,
  },

  errorIcon: {
    fontSize: '32px',
    marginBottom: '12px',
  },

  errorText: {
    fontSize: '14px',
    color: '#E53E3E',
  },

  // Empty state
  empty: {
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
  },
};

// ============================================================
// METRIC CARD COMPONENT
// ============================================================

export function MetricCard({
  metric,
  size = 'small',
  onClick,
  className,
}: MetricCardProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);

  const trendColor = getTrendColor(metric.value.trend);
  const iconBgColor = metric.color || BRAND.cenoteTurquoise;

  return (
    <div
      style={{
        ...styles.widget,
        ...(isHovered && styles.widgetHover),
      }}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div
        style={{
          ...styles.metricCard,
          ...(onClick && styles.metricCardClickable),
        }}
      >
        <div style={styles.metricHeader}>
          <span style={styles.metricTitle}>{metric.title}</span>
          {metric.icon && (
            <div
              style={{
                ...styles.metricIcon,
                backgroundColor: `${iconBgColor}15`,
                color: iconBgColor,
              }}
            >
              {metric.icon}
            </div>
          )}
        </div>

        <div
          style={{
            ...styles.metricValue,
            ...(size === 'small' && styles.metricValueSmall),
          }}
        >
          {formatMetricValue(metric.value.current, metric.format)}
        </div>

        {metric.value.changePercent !== undefined && (
          <div style={{ ...styles.metricChange, color: trendColor }}>
            <span style={styles.metricChangeIcon}>
              {getTrendIcon(metric.value.trend)}
            </span>
            <span>
              {metric.value.changePercent > 0 ? '+' : ''}
              {metric.value.changePercent.toFixed(1)}%
            </span>
            <span style={{ color: BRAND.ancientStone }}>vs previous</span>
          </div>
        )}

        {metric.description && (
          <div style={styles.metricDescription}>{metric.description}</div>
        )}

        {metric.sparklineData && metric.sparklineData.length > 0 && (
          <div style={styles.metricSparkline}>
            <Sparkline data={metric.sparklineData} color={iconBgColor} />
          </div>
        )}

        {metric.target && (
          <div style={styles.metricTarget}>
            <div style={styles.metricTargetLabel}>
              <span>Progress</span>
              <span>{Math.min((metric.value.current / metric.target) * 100, 100).toFixed(0)}%</span>
            </div>
            <div style={styles.metricTargetBar}>
              <div
                style={{
                  ...styles.metricTargetFill,
                  width: `${Math.min((metric.value.current / metric.target) * 100, 100)}%`,
                  backgroundColor: iconBgColor,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// SPARKLINE COMPONENT
// ============================================================

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

function Sparkline({ data, color = BRAND.cenoteTurquoise, height = 40 }: SparklineProps): JSX.Element {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div style={{ ...styles.sparkline, height }}>
      {data.map((value, index) => {
        const barHeight = ((value - min) / range) * 100;
        return (
          <div
            key={index}
            style={{
              ...styles.sparklineBar,
              height: `${Math.max(barHeight, 5)}%`,
              backgroundColor: color,
            }}
          />
        );
      })}
    </div>
  );
}

// ============================================================
// BAR CHART COMPONENT
// ============================================================

interface BarChartProps {
  data: ChartDataPoint[];
  height?: number;
  showValues?: boolean;
  animate?: boolean;
}

export function BarChart({
  data,
  height = 200,
  showValues = true,
  animate = true,
}: BarChartProps): JSX.Element {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div style={{ ...styles.barChart, height }}>
      {data.map((point, index) => {
        const barHeight = (point.value / max) * 100;
        const color = point.color || CHART_COLORS[index % CHART_COLORS.length];

        return (
          <div key={point.label} style={styles.barItem}>
            {showValues && (
              <span style={styles.barValue}>{formatMetricValue(point.value)}</span>
            )}
            <div
              style={{
                ...styles.bar,
                height: `${barHeight}%`,
                backgroundColor: color,
              }}
            />
            <span style={styles.barLabel}>{point.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// PIE CHART COMPONENT
// ============================================================

interface PieChartProps {
  data: ChartDataPoint[];
  size?: number;
  donut?: boolean;
  showLabels?: boolean;
}

export function PieChart({
  data,
  size = 160,
  donut = false,
  showLabels = true,
}: PieChartProps): JSX.Element {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = -90;

  const segments = data.map((point, index) => {
    const angle = (point.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    const color = point.color || CHART_COLORS[index % CHART_COLORS.length];

    // Calculate SVG arc path
    const radius = size / 2 - 10;
    const innerRadius = donut ? radius * 0.6 : 0;
    const cx = size / 2;
    const cy = size / 2;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = ((startAngle + angle) * Math.PI) / 180;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    let path: string;
    if (donut) {
      const ix1 = cx + innerRadius * Math.cos(startRad);
      const iy1 = cy + innerRadius * Math.sin(startRad);
      const ix2 = cx + innerRadius * Math.cos(endRad);
      const iy2 = cy + innerRadius * Math.sin(endRad);
      path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;
    } else {
      path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    }

    return { path, color, point };
  });

  return (
    <div style={styles.pieChart}>
      <svg style={styles.pieSvg} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segments.map((segment, index) => (
          <path
            key={index}
            d={segment.path}
            fill={segment.color}
            stroke="#ffffff"
            strokeWidth={2}
          />
        ))}
      </svg>

      {showLabels && (
        <div style={styles.pieLabels}>
          {data.map((point, index) => {
            const color = point.color || CHART_COLORS[index % CHART_COLORS.length];
            const percent = ((point.value / total) * 100).toFixed(1);

            return (
              <div key={point.label} style={styles.pieLabel}>
                <div style={{ ...styles.pieLabelDot, backgroundColor: color }} />
                <span style={styles.pieLabelText}>{point.label}</span>
                <span style={styles.pieLabelValue}>{percent}%</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
// CHART WIDGET COMPONENT
// ============================================================

export function ChartWidget({
  title,
  series,
  type = 'bar',
  height = 200,
  showLegend = true,
  showGrid = true,
  animate = true,
  className,
}: ChartWidgetProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);

  const renderChart = () => {
    if (series.length === 0) return null;

    switch (type) {
      case 'bar':
        return <BarChart data={series[0].data} height={height} animate={animate} />;
      case 'pie':
        return <PieChart data={series[0].data} showLabels={showLegend} />;
      case 'donut':
        return <PieChart data={series[0].data} donut showLabels={showLegend} />;
      default:
        return <BarChart data={series[0].data} height={height} animate={animate} />;
    }
  };

  return (
    <div
      style={{
        ...styles.widget,
        ...(isHovered && styles.widgetHover),
      }}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.widgetHeader}>
        <span style={styles.widgetTitle}>{title}</span>
      </div>
      <div style={styles.widgetContent}>
        <div style={styles.chartContainer}>{renderChart()}</div>
        {showLegend && type === 'bar' && series.length > 1 && (
          <div style={styles.chartLegend}>
            {series.map((s, index) => (
              <div key={s.id} style={styles.chartLegendItem}>
                <div
                  style={{
                    ...styles.chartLegendDot,
                    backgroundColor: s.color || CHART_COLORS[index % CHART_COLORS.length],
                  }}
                />
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// INSIGHTS PANEL COMPONENT
// ============================================================

export function InsightsPanel({
  insights,
  maxItems = 5,
  onInsightClick,
  className,
}: InsightsPanelProps): JSX.Element {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const displayedInsights = insights.slice(0, maxItems);

  const getIconStyle = (type: InsightData['type']) => {
    switch (type) {
      case 'positive': return styles.insightIconPositive;
      case 'negative': return styles.insightIconNegative;
      case 'warning': return styles.insightIconWarning;
      default: return styles.insightIconNeutral;
    }
  };

  const getIcon = (type: InsightData['type']) => {
    switch (type) {
      case 'positive': return '📈';
      case 'negative': return '📉';
      case 'warning': return '⚠️';
      default: return '💡';
    }
  };

  return (
    <div style={styles.insightsPanel} className={className}>
      <div style={styles.insightsHeader}>
        <h3 style={styles.insightsTitle}>AI Insights</h3>
      </div>
      <div style={styles.insightsList}>
        {displayedInsights.map((insight) => (
          <div
            key={insight.id}
            style={{
              ...styles.insightItem,
              ...(hoveredId === insight.id && styles.insightItemHover),
            }}
            onMouseEnter={() => setHoveredId(insight.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onInsightClick?.(insight)}
          >
            <div style={{ ...styles.insightIcon, ...getIconStyle(insight.type) }}>
              {getIcon(insight.type)}
            </div>
            <div style={styles.insightContent}>
              <div style={styles.insightTitle}>{insight.title}</div>
              <div style={styles.insightDescription}>{insight.description}</div>
              {(insight.metric || insight.recommendation) && (
                <div style={styles.insightMeta}>
                  {insight.metric && <span>📊 {insight.metric}</span>}
                  {insight.recommendation && <span>💡 {insight.recommendation}</span>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// PROGRESS WIDGET COMPONENT
// ============================================================

export function ProgressWidget({
  title,
  items,
  showPercentage = true,
  className,
}: ProgressWidgetProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.widget,
        ...(isHovered && styles.widgetHover),
      }}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.widgetHeader}>
        <span style={styles.widgetTitle}>{title}</span>
      </div>
      <div style={styles.widgetContent}>
        <div style={styles.progressWidget}>
          {items.map((item, index) => {
            const percent = (item.value / item.max) * 100;
            const color = item.color || CHART_COLORS[index % CHART_COLORS.length];

            return (
              <div key={item.label} style={styles.progressItem}>
                <div style={styles.progressHeader}>
                  <span style={styles.progressLabel}>{item.label}</span>
                  <span style={styles.progressValue}>
                    {showPercentage ? `${percent.toFixed(0)}%` : `${item.value}/${item.max}`}
                  </span>
                </div>
                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${Math.min(percent, 100)}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN ANALYTICS DASHBOARD COMPONENT
// ============================================================

export function AnalyticsDashboard({
  config,
  onWidgetClick,
  onRefresh,
  isLoading = false,
  error,
  className,
}: AnalyticsDashboardProps): JSX.Element {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [refreshHovered, setRefreshHovered] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 1000);
  }, [onRefresh]);

  const contextValue: DashboardContextValue = {
    timeRange,
    setTimeRange,
    isRefreshing,
    refresh: handleRefresh,
    filters,
    setFilter: (key, value) => setFilters((prev) => ({ ...prev, [key]: value })),
  };

  const timeRanges: TimeRange[] = ['24h', '7d', '30d', '90d'];

  const getWidgetSizeStyle = (size: WidgetSize) => {
    switch (size) {
      case 'small': return styles.widgetSmall;
      case 'medium': return styles.widgetMedium;
      case 'large': return styles.widgetLarge;
      case 'full': return styles.widgetFull;
      default: return styles.widgetSmall;
    }
  };

  const gridColumns = config.columns || 4;
  const gridStyle = {
    ...styles.widgetGrid,
    gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
  };

  if (error) {
    return (
      <div style={styles.error}>
        <span style={styles.errorIcon}>❌</span>
        <span style={styles.errorText}>{error}</span>
      </div>
    );
  }

  return (
    <DashboardContext.Provider value={contextValue}>
      <div style={styles.dashboard} className={className}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <h1 style={styles.title}>{config.name}</h1>
            {config.description && (
              <p style={styles.description}>{config.description}</p>
            )}
          </div>

          <div style={styles.headerActions}>
            {/* Time range selector */}
            <div style={styles.timeRangeSelector}>
              {timeRanges.map((range) => (
                <button
                  key={range}
                  style={{
                    ...styles.timeRangeButton,
                    ...(timeRange === range && styles.timeRangeButtonActive),
                  }}
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* Refresh button */}
            <button
              style={{
                ...styles.refreshButton,
                ...(refreshHovered && styles.refreshButtonHover),
              }}
              onClick={handleRefresh}
              onMouseEnter={() => setRefreshHovered(true)}
              onMouseLeave={() => setRefreshHovered(false)}
              disabled={isRefreshing}
            >
              {isRefreshing ? '⟳' : '🔄'} Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        {config.filters && config.filters.length > 0 && (
          <div style={styles.filters}>
            {config.filters.map((filter) => (
              <div key={filter.id} style={styles.filterItem}>
                <span style={styles.filterLabel}>{filter.label}:</span>
                {filter.type === 'select' && (
                  <select
                    style={styles.filterSelect}
                    value={filter.value}
                    onChange={(e) => filter.onChange(e.target.value)}
                  >
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Loading state */}
        {isLoading ? (
          <div style={styles.loading}>
            <div style={styles.loadingSpinner} />
          </div>
        ) : (
          /* Widget grid */
          <div style={gridStyle}>
            {config.widgets.map((widget) => (
              <div key={widget.id} style={getWidgetSizeStyle(widget.size)}>
                {widget.type === 'metric' && (
                  <MetricCard
                    metric={widget.data}
                    size={widget.size}
                    onClick={() => onWidgetClick?.(widget)}
                  />
                )}
                {widget.type === 'chart' && (
                  <ChartWidget
                    title={widget.title}
                    series={widget.data.series}
                    type={widget.data.type}
                    height={widget.data.height}
                  />
                )}
                {widget.type === 'progress' && (
                  <ProgressWidget
                    title={widget.title}
                    items={widget.data.items}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardContext.Provider>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  MetricTrend,
  ChartType,
  TimeRange,
  WidgetSize,
  MetricValue,
  MetricCardData,
  ChartDataPoint,
  ChartSeries,
  WidgetConfig,
  InsightData,
  DashboardConfig,
  DashboardFilter,
  AnalyticsDashboardProps,
  MetricCardProps,
  ChartWidgetProps,
  InsightsPanelProps,
  ProgressWidgetProps,
};

export { formatMetricValue, getTrendIcon, getTrendColor, CHART_COLORS };

export default {
  AnalyticsDashboard,
  MetricCard,
  ChartWidget,
  BarChart,
  PieChart,
  InsightsPanel,
  ProgressWidget,
  useDashboard,
};
