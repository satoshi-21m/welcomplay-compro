'use client'

import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { X, Plus, Search, Code, Edit, Trash2, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "./alert"
import { getTechnologies, createTechnology, updateTechnology, deleteTechnology } from '@/lib/actions/admin-technology-actions'

interface Technology {
  id: number
  name: string
  slug: string
  color: string
}

interface TechnologySelectProps {
  selectedTechnologies: number[]
  onTechnologiesChange: (technologies: number[]) => void
  placeholder?: string
  className?: string
}

export function TechnologySelect({
  selectedTechnologies,
  onTechnologiesChange,
  placeholder = "Pilih teknologi...",
  className = ""
}: TechnologySelectProps) {
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // State untuk CRUD operations
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingTechnology, setEditingTechnology] = useState<Technology | null>(null)
  const [deletingTechnology, setDeletingTechnology] = useState<Technology | null>(null)
  
  const [newTechnology, setNewTechnology] = useState({
    name: '',
    slug: '',
    color: '#3B82F6' // Default blue color
  })
  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Alert states
  const [alertMessage, setAlertMessage] = useState('')
  const [alertVariant, setAlertVariant] = useState<'default' | 'destructive' | 'warning' | 'success' | 'info'>('default')
  const [showAlert, setShowAlert] = useState(false)

  // Fetch technologies on component mount
  useEffect(() => {
    fetchTechnologies()
  }, [])
  
  // Computed property untuk selected technologies dengan data lengkap
  const selectedTechObjects = technologies.filter(tech => selectedTechnologies.includes(tech.id))
  
  // Function untuk cek status teknologi (untuk debug)
  const getTechnologyStatus = (techId: number) => {
    const isSelected = selectedTechnologies.includes(techId)
    return {
      isSelected,
      status: isSelected ? '✅ Dipilih di portfolio ini' : '❌ Tidak dipilih di portfolio ini',
      canDelete: '⚠️ Status delete akan dicek oleh backend'
    }
  }

  const fetchTechnologies = async () => {
    try {
      setIsLoading(true)
      const response = await getTechnologies()
      if (response && response.success) {
        setTechnologies(response.data || [])
      } else {
        console.error('Error fetching technologies:', response?.message)
      }
    } catch (error) {
      console.error('Error fetching technologies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTechnologyToggle = (techId: number) => {
    console.log('🔍 [TechnologySelect] handleTechnologyToggle called with techId:', techId)
    console.log('🔍 [TechnologySelect] Current selectedTechnologies:', selectedTechnologies)
    
    const newSelection = selectedTechnologies.includes(techId)
      ? selectedTechnologies.filter(id => id !== techId)
      : [...selectedTechnologies, techId]
    
    console.log('🔍 [TechnologySelect] New selection:', newSelection)
    console.log('🔍 [TechnologySelect] Calling onTechnologiesChange with:', newSelection)
    onTechnologiesChange(newSelection)
  }

  const handleRemoveTechnology = (techId: number) => {
    console.log('🔍 [TechnologySelect] handleRemoveTechnology called with techId:', techId)
    console.log('🔍 [TechnologySelect] Current selectedTechnologies:', selectedTechnologies)
    
    const newSelection = selectedTechnologies.filter(id => id !== techId)
    console.log('🔍 [TechnologySelect] New selection after remove:', newSelection)
    onTechnologiesChange(newSelection)
  }

  // Function untuk generate slug dari nama
  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
  
  // Function untuk menampilkan alert
  const displayAlert = (message: string, variant: 'default' | 'destructive' | 'warning' | 'success' | 'info' = 'default') => {
    setAlertMessage(message)
    setAlertVariant(variant)
    setShowAlert(true)
    
    // Auto-hide alert after 5 seconds
    setTimeout(() => {
      setShowAlert(false)
    }, 5000)
  }

  // Function untuk handle input change pada add/edit technology
  const handleTechnologyChange = (field: string, value: string) => {
    if (showEditDialog && editingTechnology) {
      setEditingTechnology(prev => ({
        ...prev!,
        [field]: value,
        ...(field === 'name' ? { slug: generateSlug(value) } : {})
      }))
    } else {
      setNewTechnology(prev => ({
        ...prev,
        [field]: value,
        ...(field === 'name' ? { slug: generateSlug(value) } : {})
      }))
    }
  }

  // Function untuk add technology baru
  const handleAddTechnology = async () => {
    if (!newTechnology.name.trim() || !newTechnology.slug.trim()) {
      displayAlert('Nama teknologi harus diisi', 'warning')
      return
    }

    try {
      setIsAdding(true)
      
      const technologyData = {
        name: newTechnology.name.trim(),
        slug: newTechnology.slug.trim(),
        color: newTechnology.color
      }
      
      console.log('🔍 [TechnologySelect] Adding technology with data:', technologyData)
      
      const response = await createTechnology(technologyData)

      if (response && response.success) {
        // Reset form
        setNewTechnology({
          name: '',
          slug: '',
          color: '#3B82F6'
        })
        
        // Close dialog
        setShowAddDialog(false)
        
        // Refresh technologies list
        await fetchTechnologies()
        
        // Auto-select the new technology
        if (response.data?.id) {
          const newSelection = [...selectedTechnologies, response.data.id]
          onTechnologiesChange(newSelection)
        }
        
                  displayAlert('✅ Teknologi berhasil ditambahkan!', 'success')
      } else {
        displayAlert(`❌ Gagal menambahkan teknologi: ${response?.message || 'Unknown error'}`, 'destructive')
      }
    } catch (error) {
      console.error('Error adding technology:', error)
      displayAlert('Terjadi kesalahan saat menambahkan teknologi', 'destructive')
    } finally {
      setIsAdding(false)
    }
  }

  // Function untuk edit technology
  const handleEditTechnology = async () => {
    if (!editingTechnology || !editingTechnology.name.trim() || !editingTechnology.slug.trim()) {
      displayAlert('Data teknologi tidak valid', 'warning')
      return
    }

    try {
      setIsEditing(true)
      
      const response = await updateTechnology(editingTechnology.id, {
        name: editingTechnology.name.trim(),
        slug: editingTechnology.slug.trim(),
        color: editingTechnology.color
      })

      if (response && response.success) {
        // Close dialog
        setShowEditDialog(false)
        setEditingTechnology(null)
        
        // Refresh technologies list
        await fetchTechnologies()
        
                  displayAlert('✅ Teknologi berhasil diupdate!', 'success')
              } else {
          displayAlert(`❌ Gagal mengupdate teknologi: ${response?.message || 'Unknown error'}`, 'destructive')
        }
    } catch (error) {
      console.error('Error updating technology:', error)
      displayAlert('Terjadi kesalahan saat mengupdate teknologi', 'destructive')
    } finally {
      setIsEditing(false)
    }
  }

  // Function untuk delete technology
  const handleDeleteTechnology = async () => {
    if (!deletingTechnology) {
      displayAlert('Data teknologi tidak valid', 'warning')
      return
    }

    try {
      setIsDeleting(true)
      
      console.log('🔍 [TechnologySelect] Attempting to delete technology:', deletingTechnology.id)
      console.log('🔍 [TechnologySelect] Technology name:', deletingTechnology.name)
      console.log('🔍 [TechnologySelect] Current selected technologies:', selectedTechnologies)
      
      const response = await deleteTechnology(deletingTechnology.id)
      console.log('🔍 [TechnologySelect] Delete response:', response)

      if (response && response.success) {
        // Close dialog
        setShowDeleteDialog(false)
        setDeletingTechnology(null)
        
        // Remove from selected if it was selected
        if (deletingTechnology && selectedTechnologies.includes(deletingTechnology.id)) {
          const newSelection = selectedTechnologies.filter(id => id !== deletingTechnology.id)
          onTechnologiesChange(newSelection)
        }
        
        // Refresh technologies list
        await fetchTechnologies()
        
        displayAlert('✅ Teknologi berhasil dihapus!', 'success')
      } else {
        const errorMessage = response?.message || 'Unknown error'
        
        // Check if it's a constraint error (technology used in portfolio)
        if (errorMessage.includes('Cannot delete technology because it is used')) {
          // Extract the count from error message
          const match = errorMessage.match(/used in (\d+) portfolio\(s\)/)
          const count = match ? match[1] : 'beberapa'
          
          displayAlert(`⚠️ Tidak dapat menghapus teknologi "${deletingTechnology?.name}" karena sedang digunakan dalam ${count} portfolio. Silakan hapus teknologi dari portfolio tersebut terlebih dahulu.`, 'warning')
        } else {
          displayAlert(`❌ Gagal menghapus teknologi: ${errorMessage}`, 'destructive')
        }
      }
    } catch (error) {
      console.error('Error deleting technology:', error)
      displayAlert('Terjadi kesalahan saat menghapus teknologi', 'destructive')
    } finally {
      setIsDeleting(false)
    }
  }

  // Function untuk open edit dialog
  const openEditDialog = (tech: Technology) => {
    setEditingTechnology({
      ...tech,
      slug: generateSlug(tech.name) // Regenerate slug from current name
    })
    setShowEditDialog(true)
  }

  // Function untuk open delete dialog
  const openDeleteDialog = (tech: Technology) => {
    // Let backend handle the constraint check instead of frontend
    setDeletingTechnology(tech)
    setShowDeleteDialog(true)
  }

  const filteredTechnologies = technologies.filter(tech =>
    tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )



  // Function untuk styling yang lebih gelap dan enak dilihat
  const getTechnologyStyle = (color: string) => {
    return {
      backgroundColor: color, // Background menggunakan warna asli (gelap)
      color: '#FFFFFF', // Text putih untuk kontras yang baik
      border: `1px solid ${color}`, // Border dengan warna yang sama
      boxShadow: `0 2px 4px ${color}40`, // Shadow dengan opacity 40%
      transition: 'all 0.2s ease-in-out'
    }
  }

  // Function untuk hover effect yang lebih smooth
  const getTechnologyHoverStyle = (color: string) => {
    return {
      backgroundColor: color, // Tetap gelap saat hover
      color: '#FFFFFF', // Text tetap putih
      border: `1px solid ${color}`, // Border tetap sama
      boxShadow: `0 4px 8px ${color}60`, // Shadow lebih prominent saat hover
      transform: 'translateY(-2px)'
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
          margin: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
      `}</style>
      
      {/* Alert Messages */}
      {showAlert && (
        <Alert variant={alertVariant} className="mb-4">
          <AlertDescription>
            {alertMessage}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Selected Technologies Display */}
      {selectedTechObjects.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTechObjects.map((tech) => (
            <Badge
              key={tech.id}
              variant="secondary"
              className="flex items-center gap-1 px-3 py-2 rounded-lg cursor-pointer hover:scale-105 transition-all duration-200"
              style={getTechnologyStyle(tech.color)}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, getTechnologyHoverStyle(tech.color))
              }}
              onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, getTechnologyStyle(tech.color))
              }}
            >
              <span className="font-medium text-sm">{tech.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveTechnology(tech.id)}
                className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors duration-200"
                style={{ color: '#FFFFFF' }}
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Technology Selection Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start text-left font-normal border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            {placeholder}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-hidden pb-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Pilih Teknologi
            </DialogTitle>
          </DialogHeader>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari teknologi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Add Technology Button */}
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddDialog(true)}
              className="flex items-center gap-2 text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4" />
              Tambah Teknologi
            </Button>
          </div>

          {/* Technologies List */}
          <div className="flex-1 overflow-y-auto max-h-96 space-y-2 pr-2 mr-2 custom-scrollbar">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredTechnologies.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Tidak ada teknologi ditemukan
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 px-1">
                {filteredTechnologies.map((tech) => {
                  const isSelected = selectedTechnologies.includes(tech.id)
                  return (
                    <div
                      key={tech.id}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div 
                        className="flex items-center gap-3 flex-1"
                        onClick={() => handleTechnologyToggle(tech.id)}
                      >
                        <div 
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-medium"
                          style={{ backgroundColor: tech.color }}
                        >
                          {tech.name.charAt(0).toUpperCase()}
                        </div>
                        <span className={`font-medium ${
                          isSelected ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {tech.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        
                        {/* Actions Dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(tech)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => openDeleteDialog(tech)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Technology Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Tambah Teknologi Baru
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Technology Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Nama Teknologi *
              </label>
              <Input
                placeholder="Contoh: React, Node.js, Python"
                value={newTechnology.name}
                onChange={(e) => handleTechnologyChange('name', e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Technology Slug */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Slug *
              </label>
              <Input
                placeholder="Contoh: react, node-js, python"
                value={newTechnology.slug}
                onChange={(e) => handleTechnologyChange('slug', e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Slug akan otomatis dibuat dari nama teknologi
              </p>
            </div>

            {/* Technology Color */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Warna
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={newTechnology.color}
                  onChange={(e) => handleTechnologyChange('color', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <span className="text-sm text-gray-600">
                  {newTechnology.color}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              disabled={isAdding}
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleAddTechnology}
              disabled={isAdding || !newTechnology.name.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isAdding ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menambahkan...
                </>
              ) : (
                'Tambah Teknologi'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Technology Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Edit Teknologi
            </DialogTitle>
          </DialogHeader>
          
          {editingTechnology && (
            <div className="space-y-4">
              {/* Technology Name */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Nama Teknologi *
                </label>
                <Input
                  placeholder="Contoh: React, Node.js, Python"
                  value={editingTechnology.name}
                  onChange={(e) => handleTechnologyChange('name', e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Technology Slug */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Slug *
                </label>
                <Input
                  placeholder="Contoh: react, node-js, python"
                  value={editingTechnology.slug}
                  onChange={(e) => handleTechnologyChange('slug', e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Slug akan otomatis dibuat dari nama teknologi
                </p>
              </div>

              {/* Technology Color */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Warna
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={editingTechnology.color}
                    onChange={(e) => handleTechnologyChange('color', e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">
                    {editingTechnology.color}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowEditDialog(false)
                setEditingTechnology(null)
              }}
              disabled={isEditing}
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleEditTechnology}
              disabled={isEditing || !editingTechnology?.name.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isEditing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Mengupdate...
                </>
              ) : (
                'Update Teknologi'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Technology Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Konfirmasi Hapus
            </DialogTitle>
          </DialogHeader>
          
          {deletingTechnology && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: deletingTechnology.color }}
                >
                  {deletingTechnology.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Hapus teknologi "{deletingTechnology.name}"?
                  </p>
                  <p className="text-sm text-gray-600">
                    Tindakan ini tidak dapat dibatalkan
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600">
                Teknologi ini akan dihapus dari sistem. Jika teknologi ini digunakan dalam portfolio, 
                portfolio tersebut tidak akan terpengaruh tetapi teknologi tidak akan tersedia lagi.
              </p>
              
              {/* Info tentang teknologi yang akan dihapus */}
              {deletingTechnology && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">
                    ℹ️ Informasi Teknologi
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Nama: <strong>{deletingTechnology.name}</strong>
                  </p>
                  <p className="text-xs text-blue-700">
                    Slug: <code className="bg-blue-100 px-1 rounded">{deletingTechnology.slug}</code>
                  </p>
                  <p className="text-xs text-blue-700">
                    Status: {selectedTechnologies.includes(deletingTechnology.id) ? '✅ Dipilih di portfolio ini' : '❌ Tidak dipilih di portfolio ini'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false)
                setDeletingTechnology(null)
              }}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteTechnology}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menghapus...
                </>
              ) : (
                'Hapus Teknologi'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
