import { ReactNode } from "react"

interface FormAnimationProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
}

// Simple form components - no animations
export const AnimatedInput = ({ 
  children, 
  className = "",
  delay = 0,
  duration = 0.3
}: FormAnimationProps) => {
  return <div className={className}>{children}</div>
}

export const AnimatedButton = ({ 
  children, 
  className = "",
  delay = 0,
  duration = 0.3
}: FormAnimationProps) => {
  return <div className={className}>{children}</div>
}

export const AnimatedLabel = ({ 
  children, 
  className = "",
  delay = 0,
  duration = 0.3
}: FormAnimationProps) => {
  return <div className={className}>{children}</div>
}

export const AnimatedError = ({ 
  children, 
  className = "",
  delay = 0,
  duration = 0.3
}: FormAnimationProps) => {
  return <div className={className}>{children}</div>
}

export const AnimatedSuccess = ({ 
  children, 
  className = "",
  delay = 0,
  duration = 0.3
}: FormAnimationProps) => {
  return <div className={className}>{children}</div>
}

export const FormSection = ({ 
  children, 
  className = "",
  delay = 0,
  duration = 0.3
}: FormAnimationProps) => {
  return <div className={className}>{children}</div>
}

export const FormFieldGroup = ({ 
  children, 
  className = "",
  delay = 0,
  duration = 0.3
}: FormAnimationProps) => {
  return <div className={className}>{children}</div>
}

export const LoadingSpinner = ({ 
  children, 
  className = "",
  delay = 0,
  duration = 0.3
}: FormAnimationProps) => {
  return <div className={className}>{children}</div>
}

export const ProgressBar = ({ 
  children, 
  className = "",
  delay = 0,
  duration = 0.3
}: FormAnimationProps) => {
  return <div className={className}>{children}</div>
}