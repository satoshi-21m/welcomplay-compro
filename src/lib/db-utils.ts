import { getPool } from '@/lib/db'

export function getDatabaseName(): string {
  return process.env.DB_NAME as string
}

export async function tableExists(table: string): Promise<boolean> {
  const dbName = getDatabaseName()
  const pool = getPool()
  const [rows] = await pool.execute(
    `SELECT COUNT(*) AS cnt FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
    [dbName, table]
  )
  return Number((rows as any[])?.[0]?.cnt || 0) > 0
}

export async function columnExists(table: string, column: string): Promise<boolean> {
  const dbName = getDatabaseName()
  const pool = getPool()
  const [rows] = await pool.execute(
    `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [dbName, table, column]
  )
  return Number((rows as any[])?.[0]?.cnt || 0) > 0
}

export async function detectColumns(table: string, names: string[]): Promise<Record<string, boolean>> {
  const exists: Record<string, boolean> = {}
  for (const name of names) {
    exists[name] = await columnExists(table, name)
  }
  return exists
}


