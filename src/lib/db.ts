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
    connectionLimit: 10,        // ⚡ Increased from 5 for better concurrency
    queueLimit: 50,             // ⚡ Added limit to prevent memory exhaustion under high load
    maxIdle: 5,                 // ⚡ Increased from 3 to keep more connections ready
    idleTimeout: 60000,         // 60s - keep idle connections for reuse
    enableKeepAlive: true,      // Prevents connection drops
    keepAliveInitialDelay: 0,
    connectTimeout: 10000,      // 10s - connection timeout
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
