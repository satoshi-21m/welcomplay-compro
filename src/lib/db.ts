import mysql from 'mysql2/promise'

type GlobalWithMysql = typeof globalThis & { mysqlPool?: mysql.Pool }
const globalForMysql = globalThis as GlobalWithMysql

// MySQL credentials from environment variables
const pool: mysql.Pool =
  globalForMysql.mysqlPool ||
  mysql.createPool({
    host: process.env.DB_HOST || 'welcomplay.com',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'welcompl_user_nextjs',
    password: process.env.DB_PASSWORD || ',xJanED}~vw{N1Lx',
    database: process.env.DB_NAME || 'welcompl_compro_nextjs',
    waitForConnections: true,
    connectionLimit: 15,        // ⚡ Increased from 10 for better build concurrency
    queueLimit: 100,            // ⚡ Increased queue limit for build processes
    maxIdle: 8,                 // ⚡ More idle connections during build
    idleTimeout: 120000,        // 120s - longer idle timeout for build stability
    enableKeepAlive: true,      // Prevents connection drops
    keepAliveInitialDelay: 0,
    connectTimeout: 30000,      // 30s - much longer connection timeout for slow builds
  })

if (!globalForMysql.mysqlPool) {
  globalForMysql.mysqlPool = pool
}

export function getPool() {
  return pool
}

export async function testConnection() {
  const conn = await getPool().getConnection()
  await conn.ping()
  conn.release()
  return true
}
