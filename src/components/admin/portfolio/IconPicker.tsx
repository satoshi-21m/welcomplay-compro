'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search } from 'lucide-react'
import * as LucideIcons from 'lucide-react'

interface IconPickerProps {
  value: string
  onChange: (iconName: string) => void
}

// Popular Lucide icons (curated list untuk better UX)
const POPULAR_ICONS = [
  'Globe', 'Smartphone', 'Camera', 'Video', 'Image', 'Film',
  'TrendingUp', 'TrendingDown', 'BarChart', 'PieChart', 'Activity',
  'Search', 'SearchCheck', 'SearchX',
  'Users', 'User', 'UserPlus', 'UserCheck', 'UsersRound',
  'Mail', 'MailOpen', 'Send', 'MessageCircle', 'MessageSquare',
  'Phone', 'PhoneCall', 'PhoneIncoming', 'PhoneOutgoing',
  'ShoppingCart', 'ShoppingBag', 'Store', 'Package', 'Box',
  'Heart', 'Star', 'ThumbsUp', 'Award', 'Trophy',
  'Home', 'Building', 'Building2', 'Factory', 'Warehouse',
  'Code', 'Code2', 'Terminal', 'Laptop', 'Monitor',
  'Palette', 'Brush', 'Pencil', 'PenTool', 'Eraser',
  'Layout', 'LayoutGrid', 'LayoutList', 'Grid', 'List',
  'Settings', 'Tool', 'Wrench', 'Hammer', 'Cog',
  'Zap', 'Sparkles', 'Flame', 'Sun', 'Moon',
  'Map', 'MapPin', 'Navigation', 'Compass', 'Locate',
  'Calendar', 'Clock', 'Timer', 'Watch', 'Hourglass',
  'Folder', 'FolderOpen', 'File', 'FileText', 'Files',
  'Book', 'BookOpen', 'Newspaper', 'Bookmark', 'Library',
  'Tag', 'Tags', 'Hash', 'AtSign', 'Percent',
  'Lock', 'Unlock', 'Key', 'Shield', 'ShieldCheck',
  'Bell', 'BellRing', 'Volume2', 'Mic', 'Headphones',
  'Wifi', 'Bluetooth', 'Signal', 'Rss', 'Radio',
  'Play', 'Pause', 'Square', 'Circle', 'Triangle'
]

// Get all icon names from curated list
const getAllIconNames = () => {
  return POPULAR_ICONS.sort()
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const allIconNames = useMemo(() => getAllIconNames(), [])
  
  // Filter icons berdasarkan search
  const filteredIcons = useMemo(() => {
    if (!searchTerm) return allIconNames // Show all popular icons
    
    return allIconNames
      .filter(name => name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [searchTerm, allIconNames])
  
  // Get icon component
  const getIconComponent = (iconName: string) => {
    return (LucideIcons as any)[iconName] || LucideIcons.HelpCircle
  }
  
  const SelectedIcon = getIconComponent(value)

  return (
    <div className="space-y-2">
      {/* Selected Icon Preview & Search - Combined Row */}
      <div className="grid grid-cols-5 gap-2">
        {/* Selected Icon Preview - Compact */}
        <div className="col-span-2 flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center shadow-sm flex-shrink-0">
            <SelectedIcon className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-500">Selected</p>
            <p className="text-xs font-medium text-gray-900 truncate">{value}</p>
          </div>
        </div>
        
        {/* Search - Compact */}
        <div className="col-span-3 relative">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search... (globe, phone, camera)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-full text-xs"
          />
        </div>
      </div>
      
      {/* Icons Grid - Compact */}
      <ScrollArea className="h-[150px] w-full border rounded-lg bg-gray-50/50">
        <div className="grid grid-cols-8 gap-0.5 p-1.5">
          {filteredIcons.map((iconName) => {
            const IconComponent = getIconComponent(iconName)
            const isSelected = value === iconName
            
            return (
              <button
                key={iconName}
                type="button"
                onClick={() => onChange(iconName)}
                className={`p-1.5 rounded hover:bg-white transition-all duration-100 flex items-center justify-center group relative ${
                  isSelected
                    ? 'bg-blue-100 ring-2 ring-blue-500 shadow-sm'
                    : 'hover:ring-1 hover:ring-gray-300'
                }`}
                title={iconName}
              >
                <IconComponent className={`h-4 w-4 ${
                  isSelected ? 'text-blue-600' : 'text-gray-600 group-hover:text-gray-900'
                }`} />
              </button>
            )
          })}
        </div>
      </ScrollArea>
      
      <p className="text-[10px] text-gray-500">
        {filteredIcons.length} of {allIconNames.length} icons
        {searchTerm && ` for "${searchTerm}"`}
      </p>
    </div>
  )
}

