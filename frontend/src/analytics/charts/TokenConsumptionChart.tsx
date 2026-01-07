/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — TOKEN CONSUMPTION CHART
 * Phase 6: Analytics & Reporting
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useState } from 'react';

interface DataPoint {
  date: string;
  tokens: number;
}

interface Props {
  userId: string;
  days?: number;
}

export const TokenConsumptionChart: React.FC<Props> = ({ userId, days = 30 }) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [userId, days]);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/v1/analytics/tokens/trend?user_id=${userId}&days=${days}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      logger.error('Error fetching token trend:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="chart-loading">Chargement...</div>;
  }

  const maxTokens = Math.max(...data.map(d => d.tokens), 1);

  return (
    <div className="token-chart">
      <h3>Consommation de Tokens (30 derniers jours)</h3>

      <div className="chart-container">
        <div className="y-axis">
          <span>{maxTokens.toLocaleString()}</span>
          <span>{Math.floor(maxTokens / 2).toLocaleString()}</span>
          <span>0</span>
        </div>

        <div className="chart-bars">
          {data.map((point, idx) => {
            const height = (point.tokens / maxTokens) * 100;
            const isToday = idx === data.length - 1;

            return (
              <div key={point.date} className="bar-container">
                <div
                  className={`bar ${isToday ? 'today' : ''}`}
                  style={{ height: `${height}%` }}
                  title={`${point.date}: ${point.tokens.toLocaleString()} tokens`}
                />
                {idx % 5 === 0 && (
                  <span className="date-label">
                    {new Date(point.date).getDate()}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="chart-summary">
        <div className="summary-stat">
          <span className="label">Total</span>
          <span className="value">
            {data.reduce((sum, d) => sum + d.tokens, 0).toLocaleString()}
          </span>
        </div>
        <div className="summary-stat">
          <span className="label">Moyenne/jour</span>
          <span className="value">
            {Math.floor(
              data.reduce((sum, d) => sum + d.tokens, 0) / data.length
            ).toLocaleString()}
          </span>
        </div>
      </div>

      <style jsx>{`
        .token-chart {
          background: white;
          border: 2px solid #e9e4d6;
          border-radius: 12px;
          padding: 24px;
        }

        .token-chart h3 {
          font-size: 18px;
          color: #1e1f22;
          margin: 0 0 24px;
        }

        .chart-container {
          display: flex;
          gap: 16px;
          height: 200px;
        }

        .y-axis {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-size: 12px;
          color: #8d8371;
          padding: 8px 0;
        }

        .chart-bars {
          flex: 1;
          display: flex;
          align-items: flex-end;
          gap: 2px;
          border-left: 2px solid #e9e4d6;
          border-bottom: 2px solid #e9e4d6;
          padding: 8px 0 24px 8px;
        }

        .bar-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .bar {
          width: 100%;
          background: linear-gradient(180deg, #d8b26a 0%, #c9a159 100%);
          border-radius: 2px 2px 0 0;
          transition: all 0.3s;
          cursor: pointer;
        }

        .bar:hover {
          opacity: 0.8;
          transform: scaleY(1.05);
        }

        .bar.today {
          background: linear-gradient(180deg, #3f7249 0%, #3eb4a2 100%);
        }

        .date-label {
          font-size: 10px;
          color: #8d8371;
        }

        .chart-summary {
          display: flex;
          gap: 32px;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 2px solid #e9e4d6;
        }

        .summary-stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .summary-stat .label {
          font-size: 12px;
          color: #8d8371;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .summary-stat .value {
          font-size: 20px;
          font-weight: 700;
          color: #1e1f22;
        }

        .chart-loading {
          padding: 60px;
          text-align: center;
          color: #8d8371;
        }
      `}</style>
    </div>
  );
};
