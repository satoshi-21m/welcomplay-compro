'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { X, ChevronDown, Globe, Monitor, ShoppingCart, Target, BarChart3, Smartphone, Plus, Edit, Trash2, Loader2 } from "lucide-react"

interface ProjectType {
  id: number
  name: string
  slug: string
  icon: string
  color: string
  is_active: boolean
  portfolio_count?: number
}

interface ProjectTypeSelectProps {
  value: number | null
  onValueChange: (value: number | null) => void
  placeholder?: string
  className?: string
}

export function ProjectTypeSelect({ 
  value, 
  onValueChange, 
  placeholder = "Pilih project type", 
  className
}: ProjectTypeSelectProps) {
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProjectType, setEditingProjectType] = useState<ProjectType | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '🌐',
    color: '#3B82F6'
  })
  
  // Alert Dialog states
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false)
  const [isErrorAlertOpen, setIsErrorAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [projectTypeToDelete, setProjectTypeToDelete] = useState<ProjectType | null>(null)
  
  // Portfolio count state
  const [portfolioCounts, setPortfolioCounts] = useState<{ [key: number]: number }>({})
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredProjectTypes, setFilteredProjectTypes] = useState<ProjectType[]>([])

  const toSlug = (name: string) =>
    name
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

  // Fetch project types dari API
  useEffect(() => {
    fetchProjectTypes()
  }, [])

  // Filter project types based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProjectTypes(projectTypes)
    } else {
      const filtered = projectTypes.filter(projectType =>
        projectType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        projectType.slug.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProjectTypes(filtered)
    }
  }, [searchTerm, projectTypes])

  const fetchProjectTypes = async () => {
    try {
      console.log('🔄 [ProjectTypeSelect] Fetching project types...')
      setLoading(true)
      const response = await fetch('/api/portfolio/project-types', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          console.log('✅ [ProjectTypeSelect] Project types fetched:', data.data.length)
          setProjectTypes(data.data)
          
          // Extract portfolio counts from the response data (already included!)
          const counts: { [key: number]: number } = {}
          data.data.forEach((pt: any) => {
            counts[pt.id] = pt.portfolio_count || 0
          })
          console.log('✅ [ProjectTypeSelect] Portfolio counts extracted:', counts)
          setPortfolioCounts(counts)
        }
      }
    } catch (error) {
      console.error('❌ [ProjectTypeSelect] Error fetching project types:', error)
    } finally {
      setLoading(false)
    }
  }


  const handleProjectTypeSelect = (projectTypeId: number) => {
    onValueChange(projectTypeId)
    setIsOpen(false)
  }

  const handleAddProjectType = async () => {
    try {
      const response = await fetch('/api/portfolio/project-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Show success message
        setAlertMessage(`✅ Project type "${formData.name}" berhasil ditambahkan!`)
        setIsSuccessAlertOpen(true)
        
        await fetchProjectTypes() // Refresh list
        setIsAddModalOpen(false)
        setFormData({ name: '', slug: '', icon: '🌐', color: '#3B82F6' })
      } else {
        // Show error message from backend
        if (response.status === 409) {
          // Conflict - project type already exists
          setAlertMessage(`❌ Project type "${formData.name}" sudah ada!\n\n📝 Nama atau slug project type tidak boleh sama dengan yang sudah ada.`)
        } else {
          setAlertMessage(`❌ Gagal menambahkan project type: ${data.message || 'Unknown error'}`)
        }
        setIsErrorAlertOpen(true)
      }
    } catch (error) {
      setAlertMessage('❌ Terjadi kesalahan saat menambahkan project type. Silakan coba lagi.')
      setIsErrorAlertOpen(true)
    }
  }

  const handleEditProjectType = async () => {
    if (!editingProjectType) return

    try {
      const response = await fetch(`/api/portfolio/project-types/${editingProjectType.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Show success message
        setAlertMessage(`✅ Project type "${formData.name}" berhasil diupdate!`)
        setIsSuccessAlertOpen(true)
        
        await fetchProjectTypes() // Refresh list
        setIsEditModalOpen(false)
        setEditingProjectType(null)
        setFormData({ name: '', slug: '', icon: '🌐', color: '#3B82F6' })
      } else {
        // Show error message from backend
        if (response.status === 409) {
          // Conflict - project type already exists
          setAlertMessage(`❌ Project type "${formData.name}" sudah ada!\n\n📝 Nama atau slug project type tidak boleh sama dengan yang sudah ada.`)
        } else {
          setAlertMessage(`❌ Gagal mengupdate project type: ${data.message || 'Unknown error'}`)
        }
        setIsErrorAlertOpen(true)
      }
    } catch (error) {
      setAlertMessage('❌ Terjadi kesalahan saat mengupdate project type. Silakan coba lagi.')
      setIsErrorAlertOpen(true)
    }
  }

  const handleDeleteProjectType = async (projectTypeId: number) => {
    // Get project type for confirmation
    const projectType = projectTypes.find(pt => pt.id === projectTypeId)
    if (!projectType) return

    // Set project type to delete and open alert dialog
    setProjectTypeToDelete(projectType)
    setIsDeleteAlertOpen(true)
  }

  const confirmDeleteProjectType = async () => {
    if (!projectTypeToDelete) return

    try {
      const response = await fetch(`/api/portfolio/project-types/${projectTypeToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Show success message
          setAlertMessage(`✅ Project type "${projectTypeToDelete.name}" berhasil dihapus!`)
          setIsSuccessAlertOpen(true)
          
          await fetchProjectTypes() // Refresh list
          // Reset selection if deleted project type was selected
          if (value === projectTypeToDelete.id) {
            onValueChange(null)
          }
        } else {
          // Show error message from backend
          setAlertMessage(`❌ Gagal menghapus project type: ${data.message}`)
          setIsErrorAlertOpen(true)
        }
      } else {
        // Show error message for non-OK responses
        const errorData = await response.json()
        setAlertMessage(`❌ Gagal menghapus project type: ${errorData.message || 'Unknown error'}`)
        setIsErrorAlertOpen(true)
      }
    } catch (error) {
      setAlertMessage('❌ Terjadi kesalahan saat menghapus project type. Silakan coba lagi.')
      setIsErrorAlertOpen(true)
    } finally {
      setIsDeleteAlertOpen(false)
      setProjectTypeToDelete(null)
    }
  }

  const openEditModal = (projectType: ProjectType) => {
    setEditingProjectType(projectType)
    setFormData({
      name: projectType.name,
      slug: projectType.slug,
      icon: projectType.icon,
      color: projectType.color
    })
    setIsEditModalOpen(true)
  }

  const openAddModal = () => {
    setFormData({ name: '', slug: '', icon: '🌐', color: '#3B82F6' })
    setIsAddModalOpen(true)
  }

  // Ikuti pola TechnologySelect: saat field name berubah, langsung generate slug
  const handleFormChange = (field: 'name' | 'slug' | 'icon' | 'color', value: string) => {
    if (field === 'name') {
      setFormData(prev => ({ ...prev, name: value, slug: toSlug(value) }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const getProjectTypeIcon = (icon: string) => {
    const iconMap: { [key: string]: any } = {
      '🌐': Globe,
      '🖥️': Monitor,
      '🛒': ShoppingCart,
      '🎯': Target,
      '📊': BarChart3,
      '📱': Smartphone
    }
    return iconMap[icon] || Globe
  }

  const iconOptions = ['🌐', '🖥️', '🛒', '🎯', '📊', '📱']
  const colorOptions = ['#3B82F6', '#10B981', '#06B6D4', '#84CC16', '#F97316', '#F59E0B', '#EF4444', '#8B5CF6']

  return (
    <div className="space-y-3">
      {/* Project Type Button Show */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={`w-full justify-between rounded-2xl border-0 bg-gray-50 hover:bg-gray-100 focus:bg-white focus:ring-0 focus:outline-none transition-all duration-200 ${className}`}
          >
            <span className={value ? 'text-gray-900' : 'text-gray-500'}>
              {loading
                ? 'Memuat...'
                : (value ? projectTypes.find(pt => pt.id === value)?.name || placeholder : placeholder)
              }
            </span>
            {loading ? (
              <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Pilih Project Type
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 max-h-96 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {/* Add New Project Type Button */}
            <Button
              variant="outline"
              className="w-full justify-start h-auto p-3 rounded-xl hover:bg-green-50 border-green-200 text-green-700"
              onClick={openAddModal}
            >
              <div className="flex items-center gap-3 w-full">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Plus className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Tambah Project Type Baru</div>
                  <div className="text-sm text-green-600">Buat project type baru</div>
                </div>
              </div>
            </Button>

            {/* Search Project Type */}
            <div className="relative">
              <div className="w-8 h-8 flex items-center justify-center absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Cari project type..."
                value={searchTerm}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-0 bg-gray-50 focus:bg-gray-50 focus:ring-0 focus:outline-none focus:border-0 focus:shadow-none focus:ring-offset-0 transition-all duration-200"
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
              />
            </div>
            
            {/* Semua project types yang tersedia */}
            {loading ? (
              <div className="space-y-2">
                {[0,1,2].map((i) => (
                  <div key={i} className="w-full h-12 rounded-xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : (
            filteredProjectTypes.map((projectType) => {
              const isSelected = value === projectType.id
              const IconComponent = getProjectTypeIcon(projectType.icon)
              
              return (
                <div key={projectType.id} className="relative group">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start h-auto p-3 rounded-xl hover:bg-gray-50 ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleProjectTypeSelect(projectType.id)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      {/* Icon dengan color */}
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: projectType.color + '20', color: projectType.color }}
                      >
                        <IconComponent className="h-4 w-4" />
                      </div>
                      
                                            {/* Info project type */}
                      <div className="text-left flex-1">
                        <div className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                          {projectType.name}
                          {/* Portfolio Count Badge */}
                          {portfolioCounts[projectType.id] > 0 && (
                            <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 ml-2">
                              {portfolioCounts[projectType.id]} portfolio
                            </Badge>
                          )}
                        </div>
                      </div>
                      

                    </div>
                  </Button>
                  
                  {/* Action Buttons (Edit & Delete) */}
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        openEditModal(projectType)
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteProjectType(projectType.id)
                      }}
                      title="Hapus project type"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )
            })
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Project Type Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Tambah Project Type Baru
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Nama Project Type</label>
              <Input
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder="Contoh: Mobile App"
                className="rounded-xl"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Slug</label>
              <Input
                value={formData.slug}
                onChange={(e) => handleFormChange('slug', e.target.value)}
                placeholder="Contoh: mobile-app"
                className="rounded-xl"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Icon</label>
              <div className="flex gap-2 flex-wrap">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg transition-all ${
                      formData.icon === icon 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, icon }))}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Color</label>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      formData.color === color 
                        ? 'border-gray-800 scale-110' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleAddProjectType}
                className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white border-0"
                disabled={!formData.name || !formData.slug}
              >
                Tambah Project Type
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-xl"
              >
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Project Type Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Edit Project Type
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Nama Project Type</label>
              <Input
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder="Contoh: Mobile App"
                className="rounded-xl"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Slug</label>
              <Input
                value={formData.slug}
                onChange={(e) => handleFormChange('slug', e.target.value)}
                placeholder="Contoh: mobile-app"
                className="rounded-xl"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Icon</label>
              <div className="flex gap-2 flex-wrap">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg transition-all ${
                      formData.icon === icon 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, icon }))}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Color</label>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      formData.color === color 
                        ? 'border-gray-800 scale-110' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleEditProjectType}
                className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
                disabled={!formData.name || !formData.slug}
              >
                Update Project Type
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-xl"
              >
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Loading State removed – indikator loading dipindah ke tombol dan dialog skeleton */}

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent className="max-w-md rounded-3xl border-0 bg-white/90 backdrop-blur-md shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-gray-900">
              Hapus Project Type
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Apakah Anda yakin ingin menghapus project type{" "}
              <span className="font-semibold text-red-600">
                "{projectTypeToDelete?.name}"
              </span>
              ?
              <br /><br />
              <span className="text-red-500 font-medium">
                ⚠️ Tindakan ini tidak dapat dibatalkan.
              </span>
              <br />
              <span className="text-gray-500">
                📝 Project type akan dihapus dari sistem.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-2xl border-0 bg-gray-100 hover:bg-gray-200 text-gray-700">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteProjectType}
              className="rounded-2xl bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Alert Dialog */}
      <AlertDialog open={isSuccessAlertOpen} onOpenChange={setIsSuccessAlertOpen}>
        <AlertDialogContent className="max-w-md rounded-3xl border-0 bg-white/90 backdrop-blur-md shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-green-700">
              Berhasil!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              {alertMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setIsSuccessAlertOpen(false)}
              className="rounded-2xl bg-green-600 hover:bg-green-700 text-white border-0"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Alert Dialog */}
      <AlertDialog open={isErrorAlertOpen} onOpenChange={setIsErrorAlertOpen}>
        <AlertDialogContent className="max-w-md rounded-3xl border-0 bg-white/90 backdrop-blur-md shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-red-700">
              Terjadi Kesalahan
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              {alertMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setIsErrorAlertOpen(false)}
              className="rounded-2xl bg-red-600 hover:bg-red-700 text-white border-0"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
