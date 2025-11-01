// Production-ready logging system
interface LogLevel {
  ERROR: 'error'
  WARN: 'warn'
  INFO: 'info'
  DEBUG: 'debug'
}

const LOG_LEVELS: LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
}

type LogLevelType = LogLevel[keyof LogLevel]

interface LogEntry {
  timestamp: string
  level: LogLevelType
  message: string
  service: string
  requestId?: string
  userId?: string
  metadata?: Record<string, any>
  error?: {
    name: string
    message: string
    stack?: string
  }
}

class Logger {
  private serviceName: string
  private logLevel: LogLevelType

  constructor(serviceName: string = 'backend') {
    this.serviceName = serviceName
    this.logLevel = (process.env.LOG_LEVEL as LogLevelType) || 'info'
  }

  private shouldLog(level: LogLevelType): boolean {
    const levels = ['error', 'warn', 'info', 'debug']
    const currentLevelIndex = levels.indexOf(this.logLevel)
    const messageLevelIndex = levels.indexOf(level)
    
    return messageLevelIndex <= currentLevelIndex
  }

  private formatLog(level: LogLevelType, message: string, metadata?: Record<string, any>, error?: Error): LogEntry {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: this.serviceName,
      metadata
    }

    if (error) {
      logEntry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    }

    return logEntry
  }

  private writeLog(logEntry: LogEntry): void {
    if (!this.shouldLog(logEntry.level)) return

    const logString = JSON.stringify(logEntry)
    
    // In production, use structured logging
    if (process.env.NODE_ENV === 'production') {
      console.log(logString)
    } else {
      // In development, use colored console output
      const colors = {
        error: '\x1b[31m', // Red
        warn: '\x1b[33m',  // Yellow
        info: '\x1b[36m',  // Cyan
        debug: '\x1b[90m'  // Gray
      }
      
      const reset = '\x1b[0m'
      const color = colors[logEntry.level] || reset
      
      console.log(`${color}[${logEntry.level.toUpperCase()}]${reset} ${logEntry.message}`)
      if (logEntry.metadata) {
        console.log(`${color}Metadata:${reset}`, logEntry.metadata)
      }
      if (logEntry.error) {
        console.error(`${color}Error:${reset}`, logEntry.error)
      }
    }
  }

  error(message: string, error?: Error, metadata?: Record<string, any>): void {
    this.writeLog(this.formatLog('error', message, metadata, error))
  }

  warn(message: string, metadata?: Record<string, any>): void {
    this.writeLog(this.formatLog('warn', message, metadata))
  }

  info(message: string, metadata?: Record<string, any>): void {
    this.writeLog(this.formatLog('info', message, metadata))
  }

  debug(message: string, metadata?: Record<string, any>): void {
    this.writeLog(this.formatLog('debug', message, metadata))
  }

  // Database operation logging
  logDatabaseOperation(operation: string, duration: number, success: boolean, error?: Error): void {
    const metadata = {
      operation,
      duration: `${duration}ms`,
      success,
      type: 'database'
    }

    if (success) {
      this.info(`Database ${operation} completed`, metadata)
    } else {
      this.error(`Database ${operation} failed`, error, metadata)
    }
  }

  // API request logging
  logApiRequest(method: string, path: string, statusCode: number, duration: number, userAgent?: string): void {
    const metadata = {
      method,
      path,
      statusCode,
      duration: `${duration}ms`,
      userAgent,
      type: 'api'
    }

    if (statusCode >= 400) {
      this.warn(`API ${method} ${path} returned ${statusCode}`, metadata)
    } else {
      this.info(`API ${method} ${path} completed`, metadata)
    }
  }

  // Performance logging
  logPerformance(operation: string, duration: number, threshold: number = 1000): void {
    const metadata = {
      operation,
      duration: `${duration}ms`,
      threshold: `${threshold}ms`,
      type: 'performance'
    }

    if (duration > threshold) {
      this.warn(`Slow operation detected: ${operation}`, metadata)
    } else {
      this.debug(`Operation completed: ${operation}`, metadata)
    }
  }
}

// Export singleton instances
export const logger = new Logger('backend')
export const dbLogger = new Logger('database')
export const apiLogger = new Logger('api')

export default Logger
