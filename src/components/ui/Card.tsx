import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padded?: boolean
  hoverable?: boolean
}

export function Card({ children, padded = true, hoverable = false, className = '', ...rest }: CardProps) {
  return (
    <div
      className={`rounded-xl2 border border-gray-100 bg-white shadow-card ${hoverable ? 'transition-shadow hover:shadow-card-hover' : ''} ${padded ? 'p-5' : 'overflow-hidden'} ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h3 className={`text-lg font-bold text-ink ${className}`}>{children}</h3>
}
