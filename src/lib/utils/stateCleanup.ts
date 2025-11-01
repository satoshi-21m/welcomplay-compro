/**
 * Utility functions untuk cleanup dan reset state
 * Mencegah state menumpuk saat login/logout
 */

// Reset form state ke default
export const resetFormState = <T extends Record<string, any>>(
  initialState: T,
  setState: React.Dispatch<React.SetStateAction<T>>
) => {
  console.log('🧹 [StateCleanup] Resetting form state...')
  setState(initialState)
}

// Reset multiple states sekaligus
export const resetMultipleStates = (
  stateSetters: Array<{ setter: React.Dispatch<any>; initialValue: any }>
) => {
  console.log('🧹 [StateCleanup] Resetting multiple states...')
  
  stateSetters.forEach(({ setter, initialValue }) => {
    setter(initialValue)
  })
  
  console.log('✅ [StateCleanup] Multiple states reset complete')
}

// Reset array state ke empty
export const resetArrayState = <T>(
  setState: React.Dispatch<React.SetStateAction<T[]>>
) => {
  console.log('🧹 [StateCleanup] Resetting array state...')
  setState([] as T[])
}

// Reset boolean state ke false
export const resetBooleanState = (
  setState: React.Dispatch<React.SetStateAction<boolean>>
) => {
  console.log('🧹 [StateCleanup] Resetting boolean state...')
  setState(false)
}

// Reset string state ke empty
export const resetStringState = (
  setState: React.Dispatch<React.SetStateAction<string>>
) => {
  console.log('🧹 [StateCleanup] Resetting string state...')
  setState('')
}

// Reset number state ke 0
export const resetNumberState = (
  setState: React.Dispatch<React.SetStateAction<number>>
) => {
  console.log('🧹 [StateCleanup] Resetting number state...')
  setState(0)
}

// Reset object state ke null
export const resetObjectState = <T>(
  setState: React.Dispatch<React.SetStateAction<T | null>>
) => {
  console.log('🧹 [StateCleanup] Resetting object state...')
  setState(null)
}

// Reset ref state
export const resetRefState = <T>(
  ref: React.MutableRefObject<T | null>
) => {
  console.log('🧹 [StateCleanup] Resetting ref state...')
  ref.current = null
}

// Cleanup function untuk useEffect
export const createCleanupFunction = (
  cleanupActions: Array<() => void>
) => {
  return () => {
    console.log('🧹 [StateCleanup] Running cleanup functions...')
    cleanupActions.forEach(action => action())
    console.log('✅ [StateCleanup] Cleanup complete')
  }
}

// Reset all component states (comprehensive cleanup)
export const resetAllComponentStates = (
  stateResetters: Array<() => void>
) => {
  console.log('🧹 [StateCleanup] Resetting all component states...')
  
  stateResetters.forEach(reset => {
    try {
      reset()
    } catch (error) {
      console.warn('⚠️ [StateCleanup] Error during state reset:', error)
    }
  })
  
  console.log('✅ [StateCleanup] All component states reset complete')
}
