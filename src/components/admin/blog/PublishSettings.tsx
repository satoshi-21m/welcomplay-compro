import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

interface PublishSettingsProps {
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  isFeatured: boolean
  onStatusChange: (value: string) => void
  onFeaturedChange: (value: boolean) => void
}

export const PublishSettings = ({
  status,
  isFeatured,
  onStatusChange,
  onFeaturedChange
}: PublishSettingsProps) => {
  return (
    <div className="space-y-3 pt-6">
      {/* Status */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Status</label>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            status === 'DRAFT' ? 'bg-yellow-500' :
            status === 'PUBLISHED' ? 'bg-green-500' :
            'bg-gray-500'
          }`}></div>
          <Select
            value={status}
            onValueChange={onStatusChange}
          >
            <SelectTrigger className="w-32 rounded-3xl border-0 bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white/90 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:outline-none transition-all duration-200">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-0 bg-white/90 backdrop-blur-md shadow-lg">
              <SelectItem value="DRAFT" className="rounded-xl hover:bg-yellow-50 focus:bg-yellow-50 focus:text-yellow-700">Draft</SelectItem>
              <SelectItem value="PUBLISHED" className="rounded-xl hover:bg-green-50 focus:bg-green-50 focus:text-red-700">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Featured Post */}
      <div className="flex items-center justify-between p-3 bg-red-50 rounded-2xl">
        <div>
          <label className="text-sm font-medium text-gray-900">Featured Post</label>
          <p className="text-xs text-gray-500">Tampilkan di halaman utama</p>
        </div>
        <Switch
          checked={isFeatured}
          onCheckedChange={onFeaturedChange}
          variant="red"
        />
      </div>
    </div>
  )
}
