// Environment validation and configuration
import { logger } from './logger'

interface EnvConfig {
  // Database
  DB_HOST: string
  DB_USER: string
  DB_PASSWORD: string
  DB_NAME: string
  DB_PORT: number
  
  // Application
  NODE_ENV: 'development' | 'production' | 'test'
  PORT: number
  
  // Security
  JWT_SECRET?: string
  ENCRYPTION_KEY?: string
  
  // External APIs
  PAYLOAD_CMS_URL?: string
  PAYLOAD_CMS_API_KEY?: string
  
  // Logging
  LOG_LEVEL: 'error' | 'warn' | 'info' | 'debug'
  DEBUG: boolean
  
  // Performance
  CACHE_TTL: number
  CACHE_MAX_SIZE: number
  MAX_CONCURRENT_QUERIES: number
}

function validateEnv(): EnvConfig {
  const requiredEnvVars = [
    'DB_HOST',
    'DB_USER', 
    'DB_PASSWORD',
    'DB_NAME'
  ]

  const missingVars: string[] = []

  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      missingVars.push(varName)
    }
  }

  if (missingVars.length > 0) {
    const error = `Missing required environment variables: ${missingVars.join(', ')}`
    logger.error('Environment validation failed', new Error(error))
    throw new Error(error)
  }

  // Validate and parse environment variables
  const config: EnvConfig = {
    // Database
    DB_HOST: process.env.DB_HOST!,
    DB_USER: process.env.DB_USER!,
    DB_PASSWORD: process.env.DB_PASSWORD!,
    DB_NAME: process.env.DB_NAME!,
    DB_PORT: parseInt(process.env.DB_PORT || '3306', 10),
    
    // Application
    NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),
    
    // Security
    JWT_SECRET: process.env.JWT_SECRET,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    
    // External APIs
    PAYLOAD_CMS_URL: process.env.PAYLOAD_CMS_URL,
    PAYLOAD_CMS_API_KEY: process.env.PAYLOAD_CMS_API_KEY,
    
    // Logging
    LOG_LEVEL: (process.env.LOG_LEVEL as EnvConfig['LOG_LEVEL']) || 'info',
    DEBUG: process.env.DEBUG === 'true',
    
    // Performance
    CACHE_TTL: parseInt(process.env.CACHE_TTL || '300000', 10), // 5 minutes
    CACHE_MAX_SIZE: parseInt(process.env.CACHE_MAX_SIZE || '1000', 10),
    MAX_CONCURRENT_QUERIES: parseInt(process.env.MAX_CONCURRENT_QUERIES || '50', 10)
  }

  // Validate numeric values
  if (isNaN(config.DB_PORT) || config.DB_PORT <= 0 || config.DB_PORT > 65535) {
    throw new Error('DB_PORT must be a valid port number (1-65535)')
  }

  if (isNaN(config.PORT) || config.PORT <= 0 || config.PORT > 65535) {
    throw new Error('PORT must be a valid port number (1-65535)')
  }

  if (isNaN(config.CACHE_TTL) || config.CACHE_TTL <= 0) {
    throw new Error('CACHE_TTL must be a positive number')
  }

  if (isNaN(config.CACHE_MAX_SIZE) || config.CACHE_MAX_SIZE <= 0) {
    throw new Error('CACHE_MAX_SIZE must be a positive number')
  }

  if (isNaN(config.MAX_CONCURRENT_QUERIES) || config.MAX_CONCURRENT_QUERIES <= 0) {
    throw new Error('MAX_CONCURRENT_QUERIES must be a positive number')
  }

  // Security warnings
  if (config.NODE_ENV === 'production') {
    if (!config.JWT_SECRET) {
      logger.warn('JWT_SECRET not set in production environment')
    }
    
    if (!config.ENCRYPTION_KEY) {
      logger.warn('ENCRYPTION_KEY not set in production environment')
    }
    
    if (config.DEBUG) {
      logger.warn('DEBUG mode is enabled in production environment')
    }
  }

  logger.info('Environment configuration validated successfully', {
    NODE_ENV: config.NODE_ENV,
    PORT: config.PORT,
    DB_HOST: config.DB_HOST,
    DB_NAME: config.DB_NAME,
    LOG_LEVEL: config.LOG_LEVEL
  })

  return config
}

// Export validated configuration
export const env = validateEnv()

// Helper functions
export function isProduction(): boolean {
  return env.NODE_ENV === 'production'
}

export function isDevelopment(): boolean {
  return env.NODE_ENV === 'development'
}

export function isTest(): boolean {
  return env.NODE_ENV === 'test'
}
