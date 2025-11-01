import React from 'react'

type FrostedCardProps = React.HTMLAttributes<HTMLDivElement>

export function FrostedCard({ className = '', children, ...rest }: FrostedCardProps) {
  return (
    <div
      className={`bg-white/30 backdrop-blur-md border border-gray-200/50 rounded-2xl ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}


