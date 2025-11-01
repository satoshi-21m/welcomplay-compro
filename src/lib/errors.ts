// Error handling utilities

export class ApiError extends Error {
  public status: number
  public code?: string
  public details?: any

  constructor(message: string, status: number = 500, code?: string, details?: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export class ValidationError extends Error {
  public fieldErrors: Record<string, string[]>
  public formErrors: string[]

  constructor(message: string, fieldErrors: Record<string, string[]> = {}, formErrors: string[] = []) {
    super(message)
    this.name = 'ValidationError'
    this.fieldErrors = fieldErrors
    this.formErrors = formErrors
  }
}

export class AuthenticationError extends Error {
  public code: string

  constructor(message: string = 'Authentication required', code: string = 'AUTH_REQUIRED') {
    super(message)
    this.name = 'AuthenticationError'
    this.code = code
  }
}

export class AuthorizationError extends Error {
  public code: string

  constructor(message: string = 'Insufficient permissions', code: string = 'INSUFFICIENT_PERMISSIONS') {
    super(message)
    this.name = 'AuthorizationError'
    this.code = code
  }
}

// Error handler for API responses
export function handleApiError(response: Response, errorData?: any): never {
  if (response.status === 401) {
    throw new AuthenticationError('Session expired, please login again', 'SESSION_EXPIRED')
  }
  
  if (response.status === 403) {
    throw new AuthorizationError('Access denied', 'ACCESS_DENIED')
  }
  
  if (response.status === 422) {
    throw new ValidationError('Validation failed', errorData?.fieldErrors || {}, errorData?.formErrors || [])
  }
  
  throw new ApiError(
    errorData?.message || `Request failed with status ${response.status}`,
    response.status,
    errorData?.code
  )
}

// Error handler for server actions
export function handleServerActionError(error: unknown): never {
  if (error instanceof ApiError || 
      error instanceof ValidationError || 
      error instanceof AuthenticationError || 
      error instanceof AuthorizationError) {
    throw error
  }
  
  if (error instanceof Error) {
    throw new ApiError(error.message)
  }
  
  throw new ApiError('An unexpected error occurred')
}



// Database error
export class DatabaseError extends Error {
  constructor(message: string = 'Database operation failed') {
    super(message)
    this.name = 'DatabaseError'
  }
}

// Next.js API route error handler
export function withErrorHandler(handler: Function) {
  return async (req: any, res: any) => {
    try {
      await handler(req, res)
    } catch (error) {
      console.error('API Error:', error)
      
      if (error instanceof ApiError) {
        return res.status(error.status).json({
          error: error.message,
          code: error.code,
          details: error.details
        })
      }
      
      if (error instanceof ValidationError) {
        return res.status(422).json({
          error: error.message,
          fieldErrors: error.fieldErrors,
          formErrors: error.formErrors
        })
      }
      
      if (error instanceof AuthenticationError) {
        return res.status(401).json({
          error: error.message,
          code: error.code
        })
      }
      
      if (error instanceof AuthorizationError) {
        return res.status(403).json({
          error: error.message,
          code: error.code
        })
      }
      
      if (error instanceof DatabaseError) {
        return res.status(500).json({
          error: 'Database error occurred',
          message: process.env.NODE_ENV === 'development' ? error.message : 'Database operation failed'
        })
      }
      
      // Generic error
      return res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Something went wrong'
      })
    }
  }
}
