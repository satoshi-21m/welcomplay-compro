'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Plus, Edit2, Trash2, Folder, Loader2, X } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { showSuccess, showError, showLoading, dismissToast } from '@/lib/toast'
import { IconPicker } from './IconPicker'
import { 
  getPortfolioCategoriesForModal, 
  createPortfolioCategory, 
  updatePortfolioCategory, 
  deletePortfolioCategory 
} from '@/lib/actions/portfolio-category-actions'

interface Category {
  id: number
  name: string
  slug: string
  description: string
  icon: string
  is_active: boolean
  sort_order: number
}

interface PortfolioCategoryManagerProps {
  onUpdate?: () => void
}

export function PortfolioCategoryManager({ onUpdate }: PortfolioCategoryManagerProps) {
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    id: 0,
    name: '',
    slug: '',
    description: '',
    icon: 'Globe',
    is_active: true,
    sort_order: 0
  })
  
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // Fetch data saat modal dibuka
  useEffect(() => {
    if (open) {
      fetchData()
    }
  }, [open])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // ⚡ Use server action (non-cached untuk modal - always fresh)
      const result = await getPortfolioCategoriesForModal()
      
      if (result.success) {
        setCategories(result.data || [])
        console.log('✅ Categories loaded:', result.data?.length)
      } else {
        console.error('Failed to fetch categories:', result.message)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-generate slug dari name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  // Category handlers
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const loadingToast = showLoading(editingCategory ? 'Menyimpan kategori...' : 'Menambah kategori...')
    
    try {
      // ⚡ Use server actions (direct DB access)
      const formData = {
        name: categoryForm.name,
        slug: categoryForm.slug || generateSlug(categoryForm.name),
        description: '',
        icon: categoryForm.icon,
        is_active: true,
        sort_order: 0
      }
      
      const result = editingCategory
        ? await updatePortfolioCategory(editingCategory.id, formData)
        : await createPortfolioCategory(formData)
      
      dismissToast(loadingToast)
      
      if (result.success) {
        showSuccess(result.message || (editingCategory ? 'Kategori berhasil diupdate!' : 'Kategori berhasil ditambahkan!'))
        await fetchData() // Refresh list
        resetCategoryForm()
        if (onUpdate) onUpdate() // Trigger parent refresh
      } else {
        showError(result.message || 'Gagal menyimpan kategori')
      }
    } catch (error: any) {
      dismissToast(loadingToast)
      console.error('Submit error:', error)
      showError('Terjadi kesalahan saat menyimpan kategori')
    }
  }

  const handleCategoryDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) return
    
    const loadingToast = showLoading('Menghapus kategori...')
    
    try {
      // ⚡ Use server action (direct DB access)
      const result = await deletePortfolioCategory(id)
      
      dismissToast(loadingToast)
      
      if (result.success) {
        showSuccess(result.message || 'Kategori berhasil dihapus!')
        await fetchData() // Refresh list
        if (onUpdate) onUpdate() // Trigger parent refresh
      } else {
        showError(result.message || 'Gagal menghapus kategori')
      }
    } catch (error: any) {
      dismissToast(loadingToast)
      console.error('Delete error:', error)
      showError('Terjadi kesalahan saat menghapus kategori')
    }
  }

  const resetCategoryForm = () => {
    setCategoryForm({
      id: 0,
      name: '',
      slug: '',
      description: '',
      icon: 'Globe',
      is_active: true,
      sort_order: 0
    })
    setEditingCategory(null)
  }

  const startEditCategory = (category: Category) => {
    setCategoryForm({
      ...category,
      icon: category.icon || 'Globe'
    })
    setEditingCategory(category)
  }
  
  // Get icon component dari Lucide
  const getIconComponent = (iconName: string) => {
    return (LucideIcons as any)[iconName] || LucideIcons.Folder
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-xl px-3 py-2 text-xs sm:text-sm whitespace-nowrap transition-all"
        >
          <Folder className="h-4 w-4 sm:mr-2 text-blue-600" />
          <span className="hidden sm:inline">Kelola Kategori</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl w-[95vw] max-h-[85vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="flex-shrink-0 px-6 pt-4 pb-2">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
              <Folder className="h-4 w-4 text-blue-600" />
            </div>
            Kelola Kategori
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 pt-3 pb-6 space-y-4">
          {/* Add/Edit Category Form */}
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50/30 to-white shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-base flex items-center gap-2">
                {editingCategory ? (
                  <>
                    <Edit2 className="h-4 w-4 text-blue-600" />
                    Edit Kategori
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 text-blue-600" />
                    Tambah Kategori
                  </>
                )}
                {editingCategory && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {editingCategory.name}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <form onSubmit={handleCategorySubmit} className="space-y-3">
                {/* Name & Slug */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-medium">
                      Nama Kategori <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value, slug: generateSlug(e.target.value)})}
                      placeholder="Web Development"
                      required
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="slug" className="text-xs font-medium text-gray-600">
                      Slug <span className="text-[10px]">(auto-generated)</span>
                    </Label>
                    <Input
                      id="slug"
                      value={categoryForm.slug}
                      onChange={(e) => setCategoryForm({...categoryForm, slug: e.target.value})}
                      placeholder="web-development"
                      className="h-9 font-mono text-xs"
                    />
                  </div>
                </div>
                
                {/* Icon Picker - Full Width */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    Icon <span className="text-red-500">*</span>
                  </Label>
                  <IconPicker
                    value={categoryForm.icon}
                    onChange={(icon) => setCategoryForm({...categoryForm, icon})}
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 h-9 text-white">
                    {editingCategory ? (
                      <>
                        <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                        Update
                      </>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        Tambah
                      </>
                    )}
                  </Button>
                  {editingCategory && (
                    <Button type="button" size="sm" variant="outline" onClick={resetCategoryForm} className="h-9">
                      <X className="h-3.5 w-3.5 mr-1.5" />
                      Batal
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Categories List */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Daftar Kategori</span>
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  {categories.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-6">
                  <Folder className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Belum ada kategori</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {categories.map((category) => {
                    const IconComponent = getIconComponent(category.icon || 'Folder')
                    return (
                      <div 
                        key={category.id} 
                        className="group flex items-center justify-between p-2.5 bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-150"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-100 transition-all">
                            <IconComponent className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-sm text-gray-900">{category.name}</p>
                              {!category.is_active && (
                                <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 bg-gray-100 text-gray-600">
                                  Inactive
                                </Badge>
                              )}
                            </div>
                            <p className="text-[10px] text-gray-500 font-mono">{category.slug}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => startEditCategory(category)}
                            className="h-7 w-7 p-0 hover:bg-blue-100 hover:text-blue-700"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleCategoryDelete(category.id)}
                            className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

