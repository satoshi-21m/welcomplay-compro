import { Skeleton } from "./skeleton"

export function BlogDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content - Full width on mobile, 3/4 on desktop */}
        <div className="lg:col-span-3">
          {/* Breadcrumb Skeleton */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-3" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          {/* Article Header Skeleton */}
          <div className="mb-8">
            {/* Category Badge */}
            <div className="mb-4">
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            
            {/* Title */}
            <Skeleton className="h-12 w-full mb-4" />
            
            {/* Meta Info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-3" />
              <Skeleton className="h-4 w-32" />
            </div>
            
            {/* Featured Image */}
            <div className="relative aspect-video mb-8">
              <Skeleton className="w-full h-full rounded-2xl" />
            </div>
          </div>

          {/* Article Content Skeleton */}
          <div className="prose prose-lg max-w-none mb-8">
            {/* Paragraphs */}
            {[...Array(8)].map((_, i) => (
              <div key={i} className="mb-6">
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
            
            {/* Subheadings */}
            <div className="my-8">
              <Skeleton className="h-8 w-2/3 mb-4" />
              <div className="mb-6">
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
            
            {/* Lists */}
            <div className="my-8">
              <Skeleton className="h-8 w-1/2 mb-4" />
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-2 w-2 rounded-full mt-2 flex-shrink-0" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Blockquote */}
            <div className="my-8 border-l-4 border-custom-red pl-6">
              <Skeleton className="h-6 w-full mb-3" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Tags Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-6 w-20 mb-4" />
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          </div>

          {/* Related Posts Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="relative aspect-video">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <div className="p-4">
                    <Skeleton className="h-5 w-16 rounded-full mb-3" />
                    <Skeleton className="h-6 w-full mb-3" />
                    <div className="space-y-2 mb-4">
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
        </div>

        {/* Sidebar - Right Side - Hidden on mobile */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-8 space-y-6">
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

            {/* Recent Posts Skeleton */}
            <div className="space-y-3">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-16 w-16 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BlogDetailMobileSkeleton() {
  return (
    <div className="animate-pulse lg:hidden">
      {/* Mobile Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-3" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* Mobile Article Header */}
      <div className="mb-6">
        <Skeleton className="h-5 w-20 rounded-full mb-4" />
        <Skeleton className="h-10 w-full mb-4" />
        
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        
        <div className="relative aspect-video mb-6">
          <Skeleton className="w-full h-full rounded-xl" />
        </div>
      </div>

      {/* Mobile Article Content */}
      <div className="mb-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="mb-4">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>

      {/* Mobile Tags */}
      <div className="mb-6">
        <Skeleton className="h-5 w-16 mb-3" />
        <div className="flex flex-wrap gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-7 w-16 rounded-full" />
          ))}
        </div>
      </div>

      {/* Mobile Related Posts */}
      <div className="mb-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative aspect-video">
                <Skeleton className="w-full h-full" />
              </div>
              <div className="p-4">
                <Skeleton className="h-4 w-16 rounded-full mb-2" />
                <Skeleton className="h-5 w-full mb-2" />
                <div className="space-y-1 mb-3">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-3 w-18" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
