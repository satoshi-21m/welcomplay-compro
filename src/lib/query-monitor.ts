/**
 * Query Performance Monitor
 * Logs slow queries and tracks performance metrics
 */

interface QueryMetrics {
  query: string
  params?: any[]
  duration: number
  timestamp: Date
  caller?: string
}

// Threshold untuk slow query (1000ms = 1 second)
const SLOW_QUERY_THRESHOLD = 1000

// In-memory store untuk query metrics (optional, untuk analytics)
const queryMetrics: QueryMetrics[] = []
const MAX_METRICS_STORE = 100 // Keep last 100 queries

/**
 * Wrapper untuk execute query dengan performance monitoring
 * @param pool MySQL pool connection
 * @param query SQL query string
 * @param params Query parameters
 * @param caller Function name yang memanggil (untuk debugging)
 */
export async function executeWithMonitoring(
  pool: any,
  query: string,
  params: any[] = [],
  caller: string = 'unknown'
): Promise<any> {
  const startTime = performance.now()
  
  try {
    // Execute query
    const result = await pool.execute(query, params)
    
    // Calculate duration
    const duration = performance.now() - startTime
    
    // Log if slow query
    if (duration > SLOW_QUERY_THRESHOLD) {
      console.warn(`🐌 SLOW QUERY DETECTED [${caller}]`)
      console.warn(`Duration: ${duration.toFixed(2)}ms`)
      console.warn(`Query: ${query.substring(0, 200)}${query.length > 200 ? '...' : ''}`)
      if (params.length > 0) {
        console.warn(`Params: ${JSON.stringify(params)}`)
      }
      console.warn('---')
    }
    
    // Store metrics (optional)
    const metrics: QueryMetrics = {
      query: query.substring(0, 500), // Store first 500 chars
      params,
      duration,
      timestamp: new Date(),
      caller
    }
    
    queryMetrics.push(metrics)
    
    // Keep only last N metrics
    if (queryMetrics.length > MAX_METRICS_STORE) {
      queryMetrics.shift()
    }
    
    // Log all queries in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ Query [${caller}]: ${duration.toFixed(2)}ms`)
    }
    
    return result
  } catch (error) {
    const duration = performance.now() - startTime
    console.error(`❌ QUERY ERROR [${caller}]`)
    console.error(`Duration: ${duration.toFixed(2)}ms`)
    console.error(`Query: ${query.substring(0, 200)}`)
    console.error(`Error: ${error}`)
    throw error
  }
}

/**
 * Get query performance statistics
 */
export function getQueryStats() {
  if (queryMetrics.length === 0) {
    return {
      totalQueries: 0,
      avgDuration: 0,
      slowQueries: 0,
      fastestQuery: 0,
      slowestQuery: 0
    }
  }
  
  const durations = queryMetrics.map(m => m.duration)
  const slowQueries = queryMetrics.filter(m => m.duration > SLOW_QUERY_THRESHOLD)
  
  return {
    totalQueries: queryMetrics.length,
    avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
    slowQueries: slowQueries.length,
    fastestQuery: Math.min(...durations),
    slowestQuery: Math.max(...durations),
    recentQueries: queryMetrics.slice(-10).map(m => ({
      caller: m.caller,
      duration: m.duration,
      timestamp: m.timestamp
    }))
  }
}

/**
 * Clear query metrics (useful untuk testing)
 */
export function clearQueryMetrics() {
  queryMetrics.length = 0
}

/**
 * Get slow queries untuk analysis
 */
export function getSlowQueries(limit: number = 10) {
  return queryMetrics
    .filter(m => m.duration > SLOW_QUERY_THRESHOLD)
    .sort((a, b) => b.duration - a.duration)
    .slice(0, limit)
    .map(m => ({
      query: m.query,
      duration: m.duration,
      caller: m.caller,
      timestamp: m.timestamp
    }))
}

