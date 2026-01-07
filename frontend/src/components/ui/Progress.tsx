import { clsx } from 'clsx'

interface ProgressProps {
  value: number
  max?: number
  label?: string
  showValue?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'error'
}

export function Progress({ 
  value, 
  max = 100, 
  label,
  showValue = true,
  size = 'md',
  variant = 'default'
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  return (
    <div className="space-y-2">
      {(label || showValue) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-gray-400">{label}</span>}
          {showValue && <span className="text-gray-300 font-medium">{percentage.toFixed(0)}%</span>}
        </div>
      )}
      <div className={clsx(
        'w-full bg-gray-800 rounded-full overflow-hidden',
        {
          'h-1': size === 'sm',
          'h-2': size === 'md',
          'h-3': size === 'lg',
        }
      )}>
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-500',
            {
              'bg-gradient-to-r from-chenu-500 to-chenu-400': variant === 'default',
              'bg-gradient-to-r from-green-500 to-green-400': variant === 'success',
              'bg-gradient-to-r from-yellow-500 to-yellow-400': variant === 'warning',
              'bg-gradient-to-r from-red-500 to-red-400': variant === 'error',
            }
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
