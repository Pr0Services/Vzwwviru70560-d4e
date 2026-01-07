import { ReactNode } from 'react'
import { Card } from '../ui/Card'
import { clsx } from 'clsx'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  color?: 'blue' | 'green' | 'orange' | 'purple'
}

export function StatCard({ title, value, change, icon, trend = 'neutral', color = 'blue' }: StatCardProps) {
  return (
    <Card variant="glass" className="hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-3xl font-bold mt-2 text-white">{value}</p>
          {change !== undefined && (
            <p className={clsx(
              'text-sm mt-2 flex items-center gap-1',
              trend === 'up' && 'text-green-400',
              trend === 'down' && 'text-red-400',
              trend === 'neutral' && 'text-gray-400'
            )}>
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {change > 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        <div className={clsx(
          'p-3 rounded-xl',
          color === 'blue' && 'bg-chenu-500/20 text-chenu-400',
          color === 'green' && 'bg-green-500/20 text-green-400',
          color === 'orange' && 'bg-orange-500/20 text-orange-400',
          color === 'purple' && 'bg-purple-500/20 text-purple-400'
        )}>
          {icon}
        </div>
      </div>
    </Card>
  )
}
