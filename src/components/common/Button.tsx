// src/components/common/Button.tsx
import { motion } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import type { ReactNode, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children: ReactNode
}

const VARIANTS = {
  primary: {
    base: 'text-white font-semibold',
    style: {
      background: 'linear-gradient(135deg, #6d56fa, #f059da)',
      boxShadow: '0 0 24px rgba(109,86,250,0.35)',
    },
  },
  ghost: {
    base: 'font-medium',
    style: {
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      color: '#f0eeff',
    },
  },
  danger: {
    base: 'font-semibold',
    style: {
      background: 'rgba(220,38,38,0.1)',
      border: '1px solid rgba(220,38,38,0.2)',
      color: '#ef4444',
    },
  },
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-6 py-3 text-sm rounded-xl gap-2',
  lg: 'px-8 py-4 text-base rounded-xl gap-2',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const reduceMotion = useReducedMotion()
  const v = VARIANTS[variant]

  return (
    <motion.button
      whileHover={reduceMotion ? {} : { scale: 1.02, translateY: -1 }}
      whileTap={reduceMotion ? {} : { scale: 0.98 }}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`inline-flex items-center justify-center cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-shadow duration-200 relative overflow-hidden
        ${SIZES[size]} ${v.base} ${className}`}
      style={v.style}
      {...props}
    >
      {loading ? (
        <span
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
      ) : (
        <>
          {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  )
}
