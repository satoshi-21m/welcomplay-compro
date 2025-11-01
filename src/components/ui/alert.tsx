import React from "react"

interface AlertProps {
  variant?: 'default' | 'destructive' | 'warning' | 'success' | 'info'
  children: React.ReactNode
  className?: string
}

export function Alert({ variant = 'default', children, className = '' }: AlertProps) {
  const baseClasses = "relative w-full rounded-lg border p-4"
  
  const variantClasses = {
    default: "bg-white text-gray-900 border-gray-200",
    destructive: "border-red-500/50 text-red-700 bg-red-50",
    warning: "border-yellow-500/50 text-yellow-700 bg-yellow-50",
    success: "border-green-500/50 text-green-700 bg-green-50",
    info: "border-blue-500/50 text-blue-700 bg-blue-50",
  }
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`
  
  return (
    <div role="alert" className={classes}>
      {children}
    </div>
  )
}

export function AlertTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`}>
      {children}
    </h5>
  )
}

export function AlertDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`text-sm [&_p]:leading-relaxed ${className}`}>
      {children}
    </div>
  )
}
