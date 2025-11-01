export function PortfolioSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Portfolio Grid Skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Portfolio Item 1 */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="aspect-video bg-gray-200 rounded-t-2xl"></div>
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              <div className="h-6 bg-gray-200 rounded-full w-24"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>

        {/* Portfolio Item 2 */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="aspect-video bg-gray-200 rounded-t-2xl"></div>
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded mb-3 w-4/5"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              <div className="h-6 bg-gray-200 rounded-full w-28"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>

        {/* Portfolio Item 3 */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="aspect-video bg-gray-200 rounded-t-2xl"></div>
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded mb-3 w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-4/5"></div>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="h-6 bg-gray-200 rounded-full w-22"></div>
              <div className="h-6 bg-gray-200 rounded-full w-18"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
