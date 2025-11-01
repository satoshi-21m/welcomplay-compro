"use client"

import Link from "next/link"
import { useState } from "react"

interface CategoryListProps {
  categories: Array<{ id: number; name: string; post_count?: number }>
  initialVisible?: number
  selectedCategory?: string
  onCategoryChange?: (category: string) => void
}

export function CategoryList({ 
  categories, 
  initialVisible = 5, 
  selectedCategory = 'Semua',
  onCategoryChange 
}: CategoryListProps) {
  const [showAll, setShowAll] = useState(false)

  const collapsedMaxHeight = Math.min(categories.length, initialVisible) * 52

  const handleCategoryClick = (categoryName: string) => {
    if (onCategoryChange) {
      onCategoryChange(categoryName)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xs p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Kategori</h3>
      
      {/* All Categories Button */}
      <button
        onClick={() => handleCategoryClick('Semua')}
        className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors duration-200 mb-3 ${
          selectedCategory === 'Semua'
            ? 'bg-custom-red text-white'
            : 'hover:bg-gray-50 text-gray-700 hover:text-custom-red'
        }`}
      >
        <span>Semua</span>
      </button>

      <div
        className="space-y-3 overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: showAll ? 9999 : collapsedMaxHeight }}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.name)}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors duration-200 group ${
              selectedCategory === cat.name
                ? 'bg-custom-red text-white'
                : 'hover:bg-gray-50 text-gray-700 hover:text-custom-red'
            }`}
          >
            <span>{cat.name}</span>
            {typeof cat.post_count === 'number' ? (
              <span className={`text-sm ${
                selectedCategory === cat.name ? 'opacity-70' : 'text-gray-400 group-hover:text-custom-red'
              }`}>
                {cat.post_count}
              </span>
            ) : null}
          </button>
        ))}
      </div>
      
      {categories.length > initialVisible ? (
        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className="mt-4 w-full px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:border-custom-red hover:text-custom-red transition-colors"
        >
          {showAll ? "Lebih sedikit" : "Selengkapnya"}
        </button>
      ) : null}
    </div>
  )
}


