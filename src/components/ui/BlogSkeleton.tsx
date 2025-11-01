import { Skeleton } from "./skeleton"

export function BlogSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Featured Post Skeleton */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image Skeleton */}
            <div className="relative aspect-video lg:aspect-video">
              <Skeleton className="w-full h-full" />
            </div>
            {/* Content Skeleton */}
            <div className="p-6 lg:p-8 flex flex-col justify-center">
              <div className="flex flex-wrap gap-2 mb-3">
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-8 w-full mb-3" />
              <div className="mb-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-4 w-24 mb-4" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-3" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Title Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-8 w-48" />
      </div>

      {/* Regular Posts Grid Skeleton */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Post 1 */}
        <div className="bg-white rounded-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="relative aspect-video">
            <Skeleton className="w-full h-full" />
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-6 w-full mb-3" />
            <div className="mb-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>

        {/* Post 2 */}
        <div className="bg-white rounded-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="relative aspect-video">
            <Skeleton className="w-full h-full" />
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-6 w-full mb-3" />
            <div className="mb-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-18" />
              <Skeleton className="h-3 w-22" />
            </div>
          </div>
        </div>

        {/* Post 3 */}
        <div className="bg-white rounded-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="relative aspect-video">
            <Skeleton className="w-full h-full" />
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <Skeleton className="h-5 w-18 rounded-full" />
            </div>
            <Skeleton className="h-6 w-full mb-3" />
            <div className="mb-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>

        {/* Post 4 */}
        <div className="bg-white rounded-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="relative aspect-video">
            <Skeleton className="w-full h-full" />
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-6 w-full mb-3" />
            <div className="mb-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-18" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BlogSidebarSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search Component Skeleton */}
      <div className="relative">
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>

      {/* Category List Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-24" />
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-8 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function BlogMobileSkeleton() {
  return (
    <div className="animate-pulse lg:hidden">
      {/* Mobile Search Bar Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>

      {/* Mobile Category Buttons Skeleton */}
      <div className="mb-6">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* Mobile Posts Skeleton */}
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="relative aspect-video">
              <Skeleton className="w-full h-full" />
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2 mb-3">
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-6 w-full mb-3" />
              <div className="mb-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
