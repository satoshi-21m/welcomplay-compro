'use client'

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getPortfolioCategories } from "@/lib/actions/admin-portfolio-actions"

interface CategorySelectProps {
  value: string | number | null | undefined
  onValueChange: (value: string) => void
  placeholder?: string
  className?: string
}

interface PortfolioCategory {
  id: number
  name: string
  slug: string
  description: string
  color: string
  is_active: boolean
  sort_order: number
}

export function CategorySelect({ value, onValueChange, placeholder = "Pilih kategori", className }: CategorySelectProps) {
  const [categories, setCategories] = useState<PortfolioCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        console.log('🔄 [CategorySelect] Fetching categories...')
        const response = await getPortfolioCategories()
        console.log('🔍 [CategorySelect] Response:', response)
        
        if (response && response.success && response.data) {
          console.log('✅ [CategorySelect] Categories fetched:', response.data.length)
          setCategories(response.data)
        } else {
          console.log('⚠️ [CategorySelect] No categories data:', response)
          setCategories([])
        }
      } catch (error) {
        console.error('❌ [CategorySelect] Error fetching categories:', error)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Map database colors to Tailwind classes
  const getColorClasses = (hexColor: string) => {
    // Default color mapping based on common hex values
    const colorMap: { [key: string]: string } = {
      '#3B82F6': 'bg-blue-50/30 hover:bg-blue-50 focus:bg-blue-50 focus:text-blue-700',
      '#10B981': 'bg-green-50/30 hover:bg-green-50 focus:bg-green-50 focus:text-green-700',
      '#F59E0B': 'bg-yellow-50/30 hover:bg-yellow-50 focus:bg-yellow-50 focus:text-yellow-700',
      '#EF4444': 'bg-red-50/30 hover:bg-red-50 focus:bg-red-50 focus:text-red-700',
      '#8B5CF6': 'bg-purple-50/30 hover:bg-purple-50 focus:bg-purple-50 focus:text-purple-700',
      '#06B6D4': 'bg-cyan-50/30 hover:bg-cyan-50 focus:bg-cyan-50 focus:text-cyan-700',
      '#84CC16': 'bg-lime-50/30 hover:bg-lime-50 focus:bg-lime-50 focus:text-lime-700',
      '#F97316': 'bg-orange-50/30 hover:bg-orange-50 focus:bg-orange-50 focus:text-orange-700',
      '#E91E63': 'bg-pink-50/30 hover:bg-pink-50 focus:bg-pink-50 focus:text-pink-700'
    }
    
    return colorMap[hexColor] || 'bg-gray-50/30 hover:bg-gray-50 focus:bg-gray-50 focus:text-gray-700'
  }

  return (
    <Select value={value?.toString() || ''} onValueChange={onValueChange}>
      <SelectTrigger className={`rounded-3xl border-0 bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white/90 focus:bg-white focus:ring-0 focus:outline-none transition-all duration-200 ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="rounded-2xl border-0 bg-white/90 backdrop-blur-md shadow-lg">
        {loading ? (
          <SelectItem value="loading" disabled className="rounded-lg">
            <span className="text-gray-400">Loading...</span>
          </SelectItem>
        ) : (
          categories.map((category) => (
            <SelectItem
              key={category.id}
              value={category.id.toString()}
              className={`rounded-xl ${getColorClasses(category.color)}`}
            >
              {category.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}
