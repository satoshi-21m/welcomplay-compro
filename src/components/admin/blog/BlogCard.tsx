"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  User,
  BookOpen,
  Clock,
  Tag
} from 'lucide-react'
import { formatDate, getImageUrl } from '@/lib/utils'

interface BlogCardProps {
  post: {
    id: string
    title: string
    excerpt: string
    slug: string
    category?: string
    status: 'DRAFT' | 'PUBLISHED'
    featuredImage?: string
    featuredImageAlt?: string
    isFeatured: boolean
    createdAt: string
    updatedAt: string
    author?: string
  }
  onDelete: (id: string, title: string) => void
}

export const BlogCard = ({ post, onDelete }: BlogCardProps) => {
  const router = useRouter()
  const [isImageLoading, setIsImageLoading] = useState(true)

  const getStatusBadge = (status: string) => {
    if (status === 'PUBLISHED') {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 px-2 py-1 text-xs font-medium">
          Published
        </Badge>
      )
    }
    return (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 px-2 py-1 text-xs font-medium">
        Draft
      </Badge>
    )
  }

  const getFeaturedBadge = () => {
    if (post.isFeatured) {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200 px-2 py-1 text-xs font-medium">
          Featured
        </Badge>
      )
    }
    return null
  }

  return (
    <Card className="group bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          {/* Featured Image Section */}
          <div className="lg:w-64 lg:h-48 w-full h-48 flex-shrink-0 relative overflow-hidden">
            {post.featuredImage ? (
              <>
                {isImageLoading && (
                  <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                  </div>
                )}
                <img
                  src={getImageUrl(post.featuredImage)}
                  alt={post.featuredImageAlt || post.title}
                  className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                    isImageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={() => setIsImageLoading(false)}
                  onError={() => setIsImageLoading(false)}
                />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center border-r border-slate-200">
                <div className="text-center p-4">
                  <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm text-slate-600 font-medium">No Image</p>
                  <p className="text-xs text-slate-500 mt-1">Click to add</p>
                </div>
              </div>
            )}
            
            {/* Status & Featured Badges Overlay */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {getFeaturedBadge()}
              {getStatusBadge(post.status)}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            {/* Header & Content */}
            <div className="space-y-4">
              {/* Title & Category */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-red-600 transition-colors duration-200">
                  {post.title}
                </h3>
                {post.category && (
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-slate-500" />
                    <Badge variant="outline" className="text-xs border-slate-200 text-slate-600">
                      {post.category}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                {post.excerpt || 'Tidak ada deskripsi artikel...'}
              </p>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                {post.author && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Updated {formatDate(post.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/blog/edit/${post.slug}`)}
                className="rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                className="rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(post.id, post.title)}
                className="rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
