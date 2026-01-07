/**
 * CHE·NU™ - Virtualized Chart List
 * For dashboards with many charts
 */
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { OptimizedChart } from './OptimizedChart';

interface Chart {
  id: string;
  title: string;
  data: unknown[];
  height?: number;
}

interface VirtualizedChartListProps {
  charts: Chart[];
  containerHeight?: number;
}

export const VirtualizedChartList = ({
  charts,
  containerHeight = 600
}: VirtualizedChartListProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: charts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => charts[index].height || 400,
    overscan: 2, // Render 2 extra charts above/below
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? element => element?.getBoundingClientRect().height
        : undefined
  });
  
  return (
    <div
      ref={parentRef}
      style={{
        height: `${containerHeight}px`,
        overflow: 'auto'
      }}
      className="virtualized-chart-list"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const chart = charts[virtualRow.index];
          
          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
                padding: '1rem'
              }}
            >
              <div className="chart-container">
                <h3 className="chart-title">{chart.title}</h3>
                <OptimizedChart
                  data={chart.data}
                  height={chart.height}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
