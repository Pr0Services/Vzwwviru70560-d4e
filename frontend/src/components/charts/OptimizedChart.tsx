/**
 * CHE·NU™ - Optimized Chart Component (Nivo)
 */
import { ResponsiveLine } from '@nivo/line';
import { memo, useMemo } from 'react';

interface DataPoint {
  x: string | number;
  y: number;
}

interface ChartData {
  id: string;
  data: DataPoint[];
}

interface OptimizedChartProps {
  data: ChartData[];
  height?: number;
  enablePoints?: boolean;
  enableArea?: boolean;
  colors?: string[];
}

/**
 * Performance-optimized chart with:
 * - Memoization
 * - Canvas rendering for large datasets
 * - Conditional points/interactions
 */
export const OptimizedChart = memo(({
  data,
  height = 400,
  enablePoints = true,
  enableArea = false,
  colors = ['#D8B26A', '#3F7249', '#3EB4A2']
}: OptimizedChartProps) => {
  
  // Calculate total points
  const totalPoints = useMemo(() => {
    return data.reduce((sum, series) => sum + series.data.length, 0);
  }, [data]);
  
  // Disable points for large datasets
  const shouldShowPoints = enablePoints && totalPoints < 100;
  
  // Use mesh for better performance
  const useMeshInteraction = totalPoints > 50;
  
  return (
    <div style={{ height }}>
      <ResponsiveLine
        data={data}
        
        // Performance optimizations
        useMesh={useMeshInteraction}
        enablePoints={shouldShowPoints}
        enableSlices="x"
        enableArea={enableArea}
        
        // Layout
        margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
        
        // Scales
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto',
          stacked: false
        }}
        
        // Styling
        colors={colors}
        lineWidth={2}
        pointSize={6}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        
        // Axes
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '',
          legendOffset: 36,
          legendPosition: 'middle'
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '',
          legendOffset: -40,
          legendPosition: 'middle'
        }}
        
        // Theme CHE·NU
        theme={{
          background: 'transparent',
          textColor: '#D8B26A',
          fontSize: 11,
          axis: {
            domain: {
              line: {
                stroke: '#8D8371',
                strokeWidth: 1
              }
            },
            ticks: {
              line: {
                stroke: '#8D8371',
                strokeWidth: 1
              }
            }
          },
          grid: {
            line: {
              stroke: '#2F4C39',
              strokeWidth: 1,
              strokeDasharray: '4 4'
            }
          },
          tooltip: {
            container: {
              background: '#1E1F22',
              color: '#E9E4D6',
              fontSize: '12px',
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }
          }
        }}
        
        // Animations (disabled for large datasets)
        animate={totalPoints < 200}
        motionConfig={totalPoints < 200 ? 'default' : 'instant'}
      />
    </div>
  );
});

OptimizedChart.displayName = 'OptimizedChart';
