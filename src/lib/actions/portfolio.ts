'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPool } from '@/lib/db'
// Lightweight schema cache (process-level) to avoid probing per request
let portfolioAdminSchemaCache: null | {
  cols: Record<string, boolean>
  hasCategoryTable: boolean
  hasProjectTypesTable: boolean
} = null

async function getPortfolioAdminSchema() {
  if (portfolioAdminSchemaCache) return portfolioAdminSchemaCache
  const pool = getPool()
  const dbName = process.env.DB_NAME as string
  const names = ['slug','featured_image','featured_image_alt','is_active','is_featured','category','portfolio_category_id','category_id','project_type','project_type_id','technologies','project_url','github_url','meta_title','meta_description','meta_keywords','sort_order'] as const
  const cols: Record<string, boolean> = {}
  for (const n of names) {
    const [rows] = await pool.execute(
      `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'portfolio' AND COLUMN_NAME = ?`,
      [dbName, n]
    ) as any
    cols[n] = Number(rows?.[0]?.cnt || 0) > 0
  }
  const [cat] = await pool.execute(
    `SELECT COUNT(*) AS cnt FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'portfolio_categories'`,
    [dbName]
  ) as any
  const [pt] = await pool.execute(
    `SELECT COUNT(*) AS cnt FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'project_types'`,
    [dbName]
  ) as any
  portfolioAdminSchemaCache = {
    cols,
    hasCategoryTable: Number(cat?.[0]?.cnt || 0) > 0,
    hasProjectTypesTable: Number(pt?.[0]?.cnt || 0) > 0
  }
  return portfolioAdminSchemaCache
}
import { revalidateTag } from 'next/cache'

function boolFrom(value: any, fallback: boolean = true): boolean {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  if (typeof value === 'string') return value === '1' || value.toLowerCase() === 'true' || value.toLowerCase() === 'yes'
  return fallback
}

async function detectColumns(table: string, names: string[]) {
  const pool = getPool()
  const dbName = process.env.DB_NAME as string
  const exists: Record<string, boolean> = {}
  for (const name of names) {
    const [rows] = await pool.execute(
      `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
      [dbName, table, name]
    ) as any
    exists[name] = Number(rows?.[0]?.cnt || 0) > 0
  }
  return exists
}

async function tableExists(table: string) {
  const pool = getPool()
  const dbName = process.env.DB_NAME as string
  const [rows] = await pool.execute(
    `SELECT COUNT(*) AS cnt FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
    [dbName, table]
  ) as any
  return Number(rows?.[0]?.cnt || 0) > 0
}

export async function getPortfolios(limit?: number, offset?: number) {
  try {
    const cookieStore = await cookies()
    if (!cookieStore.get('jwt_token')) {
      return { success: false, message: 'Unauthorized' }
    }

    const pool = getPool()
    const { cols, hasCategoryTable, hasProjectTypesTable } = await getPortfolioAdminSchema()

    const hasCategoryTableCached = hasCategoryTable
    const hasProjectTypesTableCached = hasProjectTypesTable
    const categoryIdCol = cols['portfolio_category_id'] ? 'portfolio_category_id' : (cols['category_id'] ? 'category_id' : null)

    const selectParts = [
      'p.id',
      'p.title',
      'p.description',
      cols['slug'] ? 'p.slug' : `NULL as slug`,
      cols['featured_image'] ? 'p.featured_image AS featuredImage' : 'NULL as featuredImage',
      cols['featured_image_alt'] ? 'p.featured_image_alt AS featuredImageAlt' : 'NULL as featuredImageAlt',
      // Category mapping: prefer join by id, fallback ke p.category
      categoryIdCol && hasCategoryTable ? 'pc.name AS categoryName' : (cols['category'] ? 'p.category AS categoryName' : 'NULL AS categoryName'),
      categoryIdCol && hasCategoryTable ? 'pc.slug AS categorySlug' : (cols['category'] ? "LOWER(REPLACE(p.category,' ','-')) AS categorySlug" : "'' AS categorySlug"),
      categoryIdCol && hasCategoryTable ? 'pc.color AS categoryColor' : "'#9CA3AF' AS categoryColor",
      // Project type mapping: prefer join by id, fallback ke p.project_type
      cols['project_type_id'] && hasProjectTypesTable ? 'pt.name AS projectTypeName' : (cols['project_type'] ? 'p.project_type AS projectTypeName' : 'NULL AS projectTypeName'),
      cols['project_type_id'] && hasProjectTypesTable ? 'pt.slug AS projectTypeSlug' : (cols['project_type'] ? "LOWER(REPLACE(p.project_type,' ','-')) AS projectTypeSlug" : "'' AS projectTypeSlug"),
      cols['project_type_id'] && hasProjectTypesTable ? 'pt.icon AS projectTypeIcon' : "'' AS projectTypeIcon",
      cols['project_type_id'] && hasProjectTypesTable ? 'pt.color AS projectTypeColor' : "'#3B82F6' AS projectTypeColor",
      cols['project_type_id'] ? 'p.project_type_id' : 'NULL AS project_type_id',
      cols['project_url'] ? 'p.project_url AS projectUrl' : 'NULL as projectUrl',
      cols['is_active'] ? 'p.is_active' : 'NULL as is_active',
      cols['is_featured'] ? 'p.is_featured' : 'NULL as is_featured',
      // ⚠️ Technologies: Tidak ada kolom, fetch dari pivot table portfolio_technologies
      cols['meta_title'] ? 'p.meta_title' : "'' AS meta_title",
      cols['meta_description'] ? 'p.meta_description' : "'' AS meta_description",
      cols['meta_keywords'] ? 'p.meta_keywords' : "'' AS meta_keywords",
      'p.created_at AS createdAt',
      'p.updated_at AS updatedAt'
    ]

    const joins: string[] = []
    if (categoryIdCol && hasCategoryTableCached) {
      joins.push(`LEFT JOIN portfolio_categories pc ON pc.id = p.${categoryIdCol}`)
    }
    if (cols['project_type_id'] && hasProjectTypesTableCached) {
      joins.push(`LEFT JOIN project_types pt ON pt.id = p.project_type_id`)
    }

    const orderBy = cols['sort_order'] ? 'ORDER BY p.sort_order ASC, p.created_at DESC' : 'ORDER BY p.created_at DESC'
    const pagination = (typeof limit === 'number' && typeof offset === 'number') ? ` LIMIT ${Number(limit)} OFFSET ${Number(offset)}` : ''
    const sql = `SELECT ${selectParts.join(', ')} FROM portfolio p ${joins.join(' ')} ${orderBy}${pagination}`
    const [rows] = await pool.execute(sql) as any

    const items = await Promise.all((rows as any[]).map(async (r) => {
      let techList: number[] = []
      let techNames: string[] = []
      let techSlugs: string[] = []

      if (r.technologies) {
        if (typeof r.technologies === 'string') {
          try {
            const parsed = JSON.parse(r.technologies)
            if (Array.isArray(parsed)) techList = parsed
          } catch {
            // fallback CSV
            techList = r.technologies
              .split(',')
              .map((s: string) => Number(String(s).trim()))
              .filter((n: number) => !Number.isNaN(n))
          }
        } else if (Array.isArray(r.technologies)) {
          techList = r.technologies
        }
      }

      // Fetch technology names and slugs from pivot table
      const hasPivotTable = await tableExists('portfolio_technologies')
      if (hasPivotTable) {
        const [pivotRows] = await pool.execute(
          `SELECT t.id, t.name, t.slug 
           FROM technologies t
           INNER JOIN portfolio_technologies pt ON pt.technology_id = t.id
           WHERE pt.portfolio_id = ?`,
          [r.id]
        ) as any
        
        techList = (pivotRows as any[]).map((t: any) => Number(t.id)).filter(id => !Number.isNaN(id))
        techNames = (pivotRows as any[]).map((t: any) => t.name).filter(Boolean)
        techSlugs = (pivotRows as any[]).map((t: any) => t.slug).filter(Boolean)
      } else if (techList.length > 0) {
        // Fallback: fetch from technologies table if we have tech IDs
        const hasTechTable = await tableExists('technologies')
        if (hasTechTable) {
          const techIds = techList.map(id => Number(id)).filter(id => !Number.isNaN(id))
          if (techIds.length > 0) {
            const [techRows] = await pool.execute(
              `SELECT id, name, slug FROM technologies WHERE id IN (${techIds.map(() => '?').join(',')})`,
              techIds
            ) as any
            
            techNames = (techRows as any[]).map((t: any) => t.name).filter(Boolean)
            techSlugs = (techRows as any[]).map((t: any) => t.slug).filter(Boolean)
          }
        }
      }

      return {
        id: r.id,
        title: r.title,
        slug: r.slug || String(r.id),
        description: r.description || '',
        featuredImage: r.featuredImage || '',
        featuredImageAlt: r.featuredImageAlt || '',
        projectUrl: r.projectUrl || '',
        githubUrl: r.githubUrl || '',
        categoryName: r.categoryName || '',
        categorySlug: r.categorySlug || (r.categoryName ? String(r.categoryName).toLowerCase().replace(/\s+/g, '-') : ''),
        projectTypeName: r.projectTypeName || '',
        projectTypeSlug: r.projectTypeSlug || (r.projectTypeName ? String(r.projectTypeName).toLowerCase().replace(/\s+/g, '-') : ''),
        projectTypeId: cols['project_type_id'] ? Number(r.project_type_id) : undefined,
        isActive: cols['is_active'] ? boolFrom(r.is_active, true) : true,
        isFeatured: cols['is_featured'] ? boolFrom(r.is_featured, false) : false,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        metaTitle: r.meta_title || '',
        metaDescription: r.meta_description || '',
        metaKeywords: r.meta_keywords || '',
        technologies: techList,
        technologyNames: techNames,
        technologySlugs: techSlugs
      }
    }))

    return { success: true, portfolios: items }
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to fetch portfolios' }
  }
}

export async function getPortfolio(id: string) {
  try {
    const cookieStore = await cookies()
    if (!cookieStore.get('jwt_token')) {
      return { success: false, message: 'Unauthorized' }
    }

    const pool = getPool()
    const cols = await detectColumns('portfolio', ['slug','featured_image','featured_image_alt','is_active','is_featured','category','project_type','technologies','project_url','github_url'])

    const selectParts = [
      'id',
      'title',
      'description',
      cols['slug'] ? 'slug' : `NULL as slug`,
      cols['featured_image'] ? 'featured_image AS featuredImage' : 'NULL as featuredImage',
      cols['featured_image_alt'] ? 'featured_image_alt AS featuredImageAlt' : 'NULL as featuredImageAlt',
      cols['category'] ? 'category AS categoryName' : 'NULL as categoryName',
      cols['project_type'] ? 'project_type AS projectTypeName' : 'NULL as projectTypeName',
      cols['project_url'] ? 'project_url AS projectUrl' : 'NULL as projectUrl',
      cols['github_url'] ? 'github_url AS githubUrl' : 'NULL as githubUrl',
      cols['is_active'] ? 'is_active' : 'NULL as is_active',
      cols['is_featured'] ? 'is_featured' : 'NULL as is_featured',
      // ⚠️ Technologies: Tidak ada kolom, fetch dari pivot table
      cols['meta_title'] ? 'meta_title' : "'' AS meta_title",
      cols['meta_description'] ? 'meta_description' : "'' AS meta_description",
      cols['meta_keywords'] ? 'meta_keywords' : "'' AS meta_keywords",
      'created_at AS createdAt',
      'updated_at AS updatedAt'
    ]

    const [rows] = await pool.execute(
      `SELECT ${selectParts.join(', ')} FROM portfolio WHERE id = ? LIMIT 1`,
      [id]
    ) as any

    const r = rows?.[0]
    if (!r) return { success: false, message: 'Portfolio not found' }

    let techList: number[] = []
    if (r.technologies) {
      if (typeof r.technologies === 'string') {
        try {
          const parsed = JSON.parse(r.technologies)
          if (Array.isArray(parsed)) techList = parsed
        } catch {
          techList = r.technologies
            .split(',')
            .map((s: string) => Number(String(s).trim()))
            .filter((n: number) => !Number.isNaN(n))
        }
      } else if (Array.isArray(r.technologies)) {
        techList = r.technologies
      }
    }

    const item = {
      id: r.id,
      title: r.title,
      slug: r.slug || String(r.id),
      description: r.description || '',
      featuredImage: r.featuredImage || '',
      featuredImageAlt: r.featuredImageAlt || '',
      projectUrl: r.projectUrl || '',
      githubUrl: r.githubUrl || '',
      categoryName: r.categoryName || '',
      projectTypeName: r.projectTypeName || '',
      projectTypeSlug: r.projectTypeName ? String(r.projectTypeName).toLowerCase().replace(/\s+/g, '-') : '',
      isActive: cols['is_active'] ? boolFrom(r.is_active, true) : true,
      isFeatured: cols['is_featured'] ? boolFrom(r.is_featured, false) : false,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      metaTitle: r.meta_title || '',
      metaDescription: r.meta_description || '',
      metaKeywords: r.meta_keywords || '',
      technologies: techList,
      technologyNames: [],
      technologySlugs: []
    }

    return { success: true, portfolio: item }
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to fetch portfolio' }
  }
}

export async function getPortfolioCategories() {
  try {
    const cookieStore = await cookies()
    if (!cookieStore.get('jwt_token')) {
      return { success: false, message: 'Unauthorized' }
    }

    const pool = getPool()
    const dbName = process.env.DB_NAME as string

    // Cek apakah tabel portfolio_categories ada
    const [tbl] = await pool.execute(
      `SELECT COUNT(*) AS cnt FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'portfolio_categories'`,
      [dbName]
    ) as any

    const hasCategoryTable = Number(tbl?.[0]?.cnt || 0) > 0
    if (!hasCategoryTable) {
      // Fallback lama: derive dari kolom category pada tabel portfolio jika ada
      const exists = await detectColumns('portfolio', ['category'])
      if (!exists['category']) return { success: true, data: [] }

      const [rows] = await pool.execute(
        `SELECT category AS name, LOWER(REPLACE(category,' ','-')) AS slug, COUNT(*) AS count
         FROM portfolio WHERE category IS NOT NULL AND category <> ''
         GROUP BY category ORDER BY count DESC`
      ) as any

      const fallback = (rows as any[]).map(r => ({
        id: 0,
        name: r.name,
        slug: r.slug,
        description: '',
        color: '#9CA3AF',
        is_active: true,
        sort_order: 0
      }))
      return { success: true, data: fallback }
    }

    // Deteksi kolom pada tabel portfolio_categories
    const colExists = await (async () => {
      const cols = ['id','name','slug','description','color','is_active','sort_order']
      const exists: Record<string, boolean> = {}
      for (const c of cols) {
        const [r] = await pool.execute(
          `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
           WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'portfolio_categories' AND COLUMN_NAME = ?`,
          [dbName, c]
        ) as any
        exists[c] = Number(r?.[0]?.cnt || 0) > 0
      }
      return exists
    })()

    const selectParts = [
      colExists['id'] ? 'id' : '0 AS id',
      colExists['name'] ? 'name' : "'' AS name",
      colExists['slug'] ? 'slug' : (colExists['name'] ? "LOWER(REPLACE(name,' ','-')) AS slug" : "'' AS slug"),
      colExists['description'] ? 'description' : "'' AS description",
      colExists['color'] ? 'color' : "'#9CA3AF' AS color",
      colExists['is_active'] ? 'is_active' : '1 AS is_active',
      colExists['sort_order'] ? 'sort_order' : '0 AS sort_order'
    ]

    const [rows] = await pool.execute(
      `SELECT ${selectParts.join(', ')} FROM portfolio_categories ORDER BY sort_order ASC, name ASC`
    ) as any

    return { success: true, data: rows }
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to fetch portfolio categories' }
  }
}

export async function getProjectTypes() {
  try {
    const cookieStore = await cookies()
    if (!cookieStore.get('jwt_token')) {
      return { success: false, message: 'Unauthorized' }
    }

    const pool = getPool()

    // Gunakan tabel project_types jika ada
    const hasProjectTypes = await (async () => {
      const [r] = await pool.execute(
        `SELECT COUNT(*) AS cnt FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'project_types'`,
        [process.env.DB_NAME as string]
      ) as any
      return Number(r?.[0]?.cnt || 0) > 0
    })()

    const hasPortfolio = await (async () => {
      const [r] = await pool.execute(
        `SELECT COUNT(*) AS cnt FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'portfolio'`,
        [process.env.DB_NAME as string]
      ) as any
      return Number(r?.[0]?.cnt || 0) > 0
    })()

    if (hasProjectTypes) {
      // Deteksi kolom di project_types
      const cols = await (async () => {
        const names = ['id','name','slug','icon','color','is_active','sort_order']
        const exists: Record<string, boolean> = {}
        for (const n of names) {
          const [r] = await pool.execute(
            `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'project_types' AND COLUMN_NAME = ?`,
            [process.env.DB_NAME as string, n]
          ) as any
          exists[n] = Number(r?.[0]?.cnt || 0) > 0
        }
        return exists
      })()

      const selectParts = [
        cols.id ? 'id' : '0 AS id',
        cols.name ? 'name' : "'' AS name",
        cols.slug ? 'slug' : (cols.name ? "LOWER(REPLACE(name,' ','-')) AS slug" : "'' AS slug"),
        cols.icon ? 'icon' : "'' AS icon",
        cols.color ? 'color' : "'#3B82F6' AS color",
        cols.is_active ? 'is_active' : '1 AS is_active',
        cols.sort_order ? 'sort_order' : '0 AS sort_order'
      ]

      const [types] = await pool.execute(
        `SELECT ${selectParts.join(', ')} FROM project_types ORDER BY sort_order ASC, name ASC`
      ) as any

      // Tambahkan portfolio_count jika tabel portfolio ada
      const data = [] as any[]
      if (hasPortfolio) {
        // Cek apakah portfolio punya kolom project_type_id atau project_type
        const portCols = await detectColumns('portfolio', ['project_type_id','project_type'])
        for (const pt of types as any[]) {
          let count = 0
          if (portCols['project_type_id']) {
            const [c] = await pool.execute(`SELECT COUNT(*) AS cnt FROM portfolio WHERE project_type_id = ?`, [pt.id]) as any
            count = Number(c?.[0]?.cnt || 0)
          } else if (portCols['project_type']) {
            const [c] = await pool.execute(`SELECT COUNT(*) AS cnt FROM portfolio WHERE project_type = ?`, [pt.name]) as any
            count = Number(c?.[0]?.cnt || 0)
          }
          data.push({ ...pt, portfolio_count: count })
        }
      } else {
        types.forEach((pt: any) => data.push({ ...pt, portfolio_count: 0 }))
      }
      return { success: true, data }
    }

    // Fallback: derive dari kolom project_type pada portfolio
    const portCols = await detectColumns('portfolio', ['project_type'])
    if (!portCols['project_type']) return { success: true, data: [] }

    const [rows] = await pool.execute(
      `SELECT project_type AS name, LOWER(REPLACE(project_type,' ','-')) AS slug, COUNT(*) AS portfolio_count
       FROM portfolio WHERE project_type IS NOT NULL AND project_type <> ''
       GROUP BY project_type ORDER BY portfolio_count DESC`
    ) as any

    const data = (rows as any[]).map(r => ({
      id: 0,
      name: r.name,
      slug: r.slug,
      description: '',
      icon: '🌐',
      color: '#3B82F6',
      is_active: true,
      sort_order: 0,
      portfolio_count: Number(r.portfolio_count || 0)
    }))

    return { success: true, data }
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to fetch project types' }
  }
}

// create/update/delete tetap via API internal yang sudah ada
export async function createPortfolio(formData: FormData) {
  try {
    const cookieStore = await cookies()
    if (!cookieStore.get('jwt_token')) {
      return { success: false, message: 'Unauthorized' }
    }

    const pool = getPool()
    const { cols, hasCategoryTable, hasProjectTypesTable } = await getPortfolioAdminSchema()

    // Parse form data
    const raw = {
      title: (formData.get('title') as string || '').trim(),
      description: (formData.get('description') as string || '').trim(),
      projectUrl: (formData.get('projectUrl') as string || '').trim(),
      categoryId: formData.get('categoryId') ? Number(formData.get('categoryId')) : undefined,
      projectTypeId: formData.get('projectTypeId') ? Number(formData.get('projectTypeId')) : undefined,
      technologies: (() => {
        const v = formData.get('technologies') as string | null
        try { return v ? JSON.parse(v) : [] } catch { return [] }
      })() as number[],
      featuredImage: (formData.get('featuredImage') as string || '').trim(),
      featuredImageAlt: (formData.get('featuredImageAlt') as string || '').trim(),
      isActive: String(formData.get('isActive') || 'true').toLowerCase() !== 'false',
      metaTitle: (formData.get('metaTitle') as string || '').trim(),
      metaDescription: (formData.get('metaDescription') as string || '').trim(),
      metaKeywords: (formData.get('metaKeywords') as string || '').trim(),
    }

    if (!raw.title) return { success: false, message: 'Title is required' }

    const insertCols: string[] = ['title', 'description', 'created_at', 'updated_at']
    const insertVals: any[] = [raw.title, raw.description, new Date(), new Date()]

    // Optional columns
    let slugValue: string | undefined = undefined
    if (cols['slug']) {
      slugValue = String(raw.title)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()
      // Duplicate slug check
      const [dupRows] = await pool.execute(
        `SELECT COUNT(*) AS cnt FROM portfolio WHERE slug = ?`,
        [slugValue]
      ) as any
      if (Number(dupRows?.[0]?.cnt || 0) > 0) {
        return { success: false, message: 'Slug sudah digunakan, ubah judul atau slug.' }
      }
      insertCols.push('slug'); insertVals.push(slugValue)
    }
    if (cols['project_url']) { insertCols.push('project_url'); insertVals.push(raw.projectUrl) }
    if (cols['featured_image']) { insertCols.push('featured_image'); insertVals.push(raw.featuredImage) }
    if (cols['featured_image_alt']) { insertCols.push('featured_image_alt'); insertVals.push(raw.featuredImageAlt) }
    if (cols['is_active']) { insertCols.push('is_active'); insertVals.push(raw.isActive ? 1 : 0) }
    if (cols['meta_title']) { insertCols.push('meta_title'); insertVals.push(raw.metaTitle) }
    if (cols['meta_description']) { insertCols.push('meta_description'); insertVals.push(raw.metaDescription) }
    if (cols['meta_keywords']) { insertCols.push('meta_keywords'); insertVals.push(raw.metaKeywords) }

    // Category mapping
    if (hasCategoryTable && (cols['portfolio_category_id'] || cols['category_id']) && raw.categoryId) {
      const catCol = cols['portfolio_category_id'] ? 'portfolio_category_id' : 'category_id'
      insertCols.push(catCol); insertVals.push(raw.categoryId)
    }

    // Project type mapping
    if (hasProjectTypesTable && cols['project_type_id'] && raw.projectTypeId) {
      insertCols.push('project_type_id'); insertVals.push(raw.projectTypeId)
    }

    // Technologies: if column exists, store JSON; pivot handled after insert if table exists
    const hasTechnologiesColumn = cols['technologies']
    if (hasTechnologiesColumn) {
      insertCols.push('technologies'); insertVals.push(JSON.stringify(raw.technologies || []))
    }

    const placeholders = insertCols.map(() => '?').join(', ')
    const sql = `INSERT INTO portfolio (${insertCols.join(', ')}) VALUES (${placeholders})`
    const [result] = await pool.execute(sql, insertVals) as any
    const newId = Number(result?.insertId)

    // Pivot insert if table exists
    const hasPivot = await tableExists('portfolio_technologies')
    if (hasPivot && Array.isArray(raw.technologies) && raw.technologies.length > 0) {
      const values = raw.technologies.map((tid) => [newId, Number(tid)]).filter((row) => !Number.isNaN(row[1]))
      if (values.length > 0) {
        await pool.query(
          `INSERT INTO portfolio_technologies (portfolio_id, technology_id) VALUES ${values.map(() => '(?, ?)').join(',')}`,
          values.flat()
        )
      }
    }

    // ✅ On-Demand Revalidation: Invalidate caches saat create
    revalidateTag('portfolio:landing:list', "")
    revalidateTag('portfolio:posts', "")
    revalidateTag('portfolio:detail', "")
    return { success: true, message: 'Portfolio created successfully', data: { id: newId } }
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to create portfolio' }
  }
}

export async function updatePortfolio(id: string, formData: FormData) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('jwt_token')?.value

    if (!token) {
      return { success: false, message: 'Unauthorized' }
    }

    const response = await fetch(`/api/portfolio/update?id=${id}`, {
      method: 'PUT',
      headers: {
        'Cookie': `jwt_token=${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      if (response.status === 401) {
        redirect('/admin-g30spki/login')
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    // ✅ On-Demand Revalidation: Invalidate caches saat update
    revalidateTag('portfolio:landing:list', "")
    revalidateTag('portfolio:posts', "")
    revalidateTag('portfolio:detail', "")
    return { success: true, message: data.message }
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to update portfolio' }
  }
}

export async function deletePortfolio(id: string) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('jwt_token')?.value

    if (!token) {
      return { success: false, message: 'Unauthorized' }
    }

    const response = await fetch(`/api/portfolio/delete?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Cookie': `jwt_token=${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        redirect('/admin-g30spki/login')
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    // ✅ On-Demand Revalidation: Invalidate caches saat delete
    revalidateTag('portfolio:landing:list', "")
    revalidateTag('portfolio:posts', "")
    revalidateTag('portfolio:detail', "")
    return { success: true, message: data.message }
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to delete portfolio' }
  }
}

export async function getPortfolioBySlug(slug: string) {
  try {
    const cookieStore = await cookies()
    if (!cookieStore.get('jwt_token')) {
      return { success: false, message: 'Unauthorized' }
    }

    const pool = getPool()
    const cols = await detectColumns('portfolio', ['slug'])
    if (!cols['slug']) return { success: false, message: 'Slug not supported' }

    const [rows] = await pool.execute(
      `SELECT id, title, description, slug, featured_image AS featuredImage,
              featured_image_alt AS featuredImageAlt, created_at AS createdAt, updated_at AS updatedAt
       FROM portfolio WHERE slug = ? LIMIT 1`,
      [slug]
    ) as any

    const r = rows?.[0]
    if (!r) return { success: false, message: 'Portfolio not found' }

    return { success: true, data: r }
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to fetch portfolio by slug' }
  }
}
