declare module 'framer-motion' {
  import { ComponentProps, ReactNode } from 'react'

  // Proper types for animation properties
  type AnimationValue = string | number | boolean | object | undefined
  type AnimationProps = {
    initial?: AnimationValue | (() => AnimationValue)
    animate?: AnimationValue | (() => AnimationValue)
    exit?: AnimationValue | (() => AnimationValue)
    variants?: Record<string, AnimationValue>
    whileHover?: AnimationValue | (() => AnimationValue)
    whileTap?: AnimationValue | (() => AnimationValue)
    transition?: {
      duration?: number
      ease?: string | number[]
      delay?: number
      [key: string]: any
    }
  }

  export interface MotionProps extends AnimationProps {
    className?: string
    children?: ReactNode
  }

  export const motion: {
    div: (props: MotionProps & ComponentProps<'div'>) => JSX.Element
    button: (props: MotionProps & ComponentProps<'button'>) => JSX.Element
    h2: (props: MotionProps & ComponentProps<'h2'>) => JSX.Element
    h3: (props: MotionProps & ComponentProps<'h3'>) => JSX.Element
    p: (props: MotionProps & ComponentProps<'p'>) => JSX.Element
  }

  export const AnimatePresence: (props: { children: ReactNode }) => JSX.Element
} 