"use client"

import { cn } from "@/lib/utils"

interface SmoothLoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  text?: string
}

export function SmoothLoadingSpinner({ 
  size = "md", 
  className,
  text 
}: SmoothLoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-3", className)}>
      <div 
        className={cn(
          "animate-spin rounded-full border-2 border-gray-300 border-t-red-600",
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

// Variant untuk logout
export function LogoutSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-red-600" />
      <span className="text-sm text-gray-600">Logging out...</span>
    </div>
  )
}

// Variant untuk loading umum
export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
      <span className="text-sm text-gray-600">Loading...</span>
    </div>
  )
}
