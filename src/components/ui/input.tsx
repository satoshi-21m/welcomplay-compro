import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, defaultValue, ...props }, ref) => {
    // Ensure controlled/uncontrolled consistency
    // If value is provided, use it (controlled). Otherwise, use defaultValue (uncontrolled)
    const isControlled = value !== undefined
    const inputValue = isControlled ? value : defaultValue
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        value={isControlled ? inputValue : undefined}
        defaultValue={!isControlled ? inputValue : undefined}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
