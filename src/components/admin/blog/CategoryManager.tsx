'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, BookOpen } from 'lucide-react'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { showError, showSuccess } from '@/lib/toast'
import { addCategoryActionSafe, deleteCategoryActionSafe, type ActionResult } from '@/app/(admin)/admin/blog/actions'

type Category = { name: string; post_count: number }

interface CategoryManagerProps {
  buttonClassName?: string
  buttonVariant?: 'default' | 'outline'
  buttonSize?: 'sm' | 'default'
  buttonLabel?: string
}

export function CategoryManager({
  buttonClassName,
  buttonVariant = 'outline',
  buttonSize = 'default',
  buttonLabel = 'Kelola Kategori',
}: CategoryManagerProps) {
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [confirming, setConfirming] = useState<string | null>(null)
  const [addState, setAddState] = useState<ActionResult | null>(null)
  const [deleteState, setDeleteState] = useState<ActionResult | null>(null)

  useEffect(() => {
    if (!open) return
    fetchCategories()
  }, [open])

  async function fetchCategories() {
    try {
      setIsLoadingCategories(true)
      const res = await fetch('/api/posts/categories', { credentials: 'include' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const unique = (data?.data || [])
        .filter((c: Category) => c && c.name && c.name.trim() !== '')
        .filter((c: Category, i: number, arr: Category[]) => i === arr.findIndex((x) => x.name === c.name))
      setCategories(unique)
    } catch (e) {
      console.error('fetchCategories error', e)
      showError('Gagal memuat kategori')
    } finally {
      setIsLoadingCategories(false)
    }
  }

  // Note: Submit melalui Server Actions akan memicu refresh halaman (tanpa fetch manual)
  // Kita tetap sediakan fetchCategories saat modal dibuka untuk menampilkan daftar terbaru

  return (
    <>
      <Button 
        variant={buttonVariant}
        size={buttonSize}
        onClick={() => setOpen(true)}
        className={buttonClassName}
      >
        {buttonLabel}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kelola Kategori</DialogTitle>
            <DialogDescription>
              Tambahkan atau hapus kategori untuk artikel Anda.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Create */}
            <div className="flex flex-col gap-2">
              <label htmlFor="newCategory" className="text-sm font-medium">
                Nama Kategori Baru
              </label>
              <form action={async (formData: FormData) => {
                setAddState(null)
                const res = await addCategoryActionSafe(undefined, formData)
                setAddState(res)
                if (res.success) {
                  setNewCategory('')
                  fetchCategories()
                  showSuccess(res.message || 'Kategori berhasil ditambahkan')
                } else {
                  showError(res.message || 'Gagal menambah kategori')
                }
              }} className="flex gap-2">
                <Input
                  id="newCategory"
                  name="name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Contoh: Teknologi, Bisnis, Hiburan"
                />
                <Button type="submit" className="bg-custom-red hover:bg-red-600 text-white rounded-xl">
                  Tambah
                </Button>
              </form>
              {addState && (
                <p className={`text-xs mt-1 ${addState.success ? 'text-green-600' : 'text-red-600'}`}>
                  {addState.message}
                </p>
              )}
            </div>

            {/* List */}
            <div className="mt-2">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Daftar Kategori</p>
                <span className="text-xs text-gray-500">{isLoadingCategories ? 'Memuat…' : `${categories?.length || 0} item`}</span>
              </div>
              <div className="max-h-72 overflow-auto rounded-xl border border-gray-200 bg-white">
                {isLoadingCategories ? (
                  <div className="p-4 text-sm text-gray-500">Memuat kategori…</div>
                ) : (!categories || categories.length === 0) ? (
                  <div className="p-4 text-sm text-gray-500 flex items-center gap-2"><BookOpen className="h-4 w-4" /> Belum ada kategori.</div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {categories.map((cat) => (
                      <li key={cat.name} className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs">
                            {cat.post_count ?? 0}
                          </span>
                          <span className="text-sm font-medium text-gray-800">{cat.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {confirming === cat.name ? (
                            <div className="flex items-center gap-2">
                              <form
                                action={async (formData: FormData) => {
                                  setDeleteState(null)
                                  const res = await deleteCategoryActionSafe(undefined, formData)
                                  setDeleteState(res)
                                  if (res.success) {
                                    setConfirming(null)
                                    fetchCategories()
                                    showSuccess(res.message || 'Kategori berhasil dihapus')
                                  } else {
                                    showError(res.message || 'Gagal menghapus kategori')
                                  }
                                }}
                              >
                                <input type="hidden" name="name" value={cat.name} />
                                <Button type="submit" size="sm" className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-2 py-2">Ya</Button>
                              </form>
                              <Button size="sm" variant="outline" onClick={() => setConfirming(null)} className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-2 py-2">Batal</Button>
                            </div>
                          ) : (
                            <Button size="sm" aria-label={`Hapus kategori ${cat.name}`} className="bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 rounded-lg px-2 py-2" onClick={() => setConfirming(cat.name)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {deleteState && (
                <p className={`text-xs mt-2 ${deleteState.success ? 'text-green-600' : 'text-red-600'}`}>
                  {deleteState.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl">
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}


