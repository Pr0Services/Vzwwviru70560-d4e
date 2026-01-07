import { HTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(
          'inline-flex items-center font-medium rounded-full',
          {
            'bg-gray-700 text-gray-300': variant === 'default',
            'bg-green-500/20 text-green-400': variant === 'success',
            'bg-yellow-500/20 text-yellow-400': variant === 'warning',
            'bg-red-500/20 text-red-400': variant === 'error',
            'bg-chenu-500/20 text-chenu-400': variant === 'info',
            'px-2 py-0.5 text-xs': size === 'sm',
            'px-3 py-1 text-sm': size === 'md',
          },
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'
