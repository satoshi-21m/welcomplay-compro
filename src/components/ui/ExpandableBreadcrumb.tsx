"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"

interface ExpandableBreadcrumbProps {
  title: string
  type: "blog" | "portfolio"
}

export function ExpandableBreadcrumb({ title, type }: ExpandableBreadcrumbProps) {
  const [isBreadcrumbExpanded, setIsBreadcrumbExpanded] = useState(false)
  const [isTitleTruncated, setIsTitleTruncated] = useState(false)
  const titleRef = useRef<HTMLSpanElement>(null)
  
  const getTypeLabel = () => {
    return type === "blog" ? "Blog" : "Portfolio"
  }
  
  const getTypeHref = () => {
    return type === "blog" ? "/blog" : "/portfolio"
  }

  // Check if title is truncated
  useEffect(() => {
    if (titleRef.current) {
      const element = titleRef.current
      setIsTitleTruncated(element.scrollWidth > element.clientWidth)
    }
  }, [title])
  
  return (
    <div className="py-4 bg-gradient-to-b from-[#f5f6f7] to-white border-none">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Breadcrumb */}
        <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="text-custom-red hover:text-red-600 transition-colors duration-300">
            Home
          </Link>
          <span>/</span>
          <Link href={getTypeHref()} className="text-custom-red hover:text-red-600 transition-colors duration-300">
            {getTypeLabel()}
          </Link>
          <span>/</span>
          <span className="text-gray-700 font-medium line-clamp-1">{title}</span>
        </div>

        {/* Mobile Breadcrumb - Expandable */}
        <div className="lg:hidden">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="text-custom-red hover:text-red-600 transition-colors duration-300 flex-shrink-0">
              Home
            </Link>
            <span className="flex-shrink-0">/</span>
            <Link href={getTypeHref()} className="text-custom-red hover:text-red-600 transition-colors duration-300 flex-shrink-0">
              {getTypeLabel()}
            </Link>
            <span className="flex-shrink-0">/</span>
            <div className="flex-1 min-w-0">
              <button
                onClick={() => setIsBreadcrumbExpanded(!isBreadcrumbExpanded)}
                className="text-left w-full flex items-center gap-1"
                disabled={!isTitleTruncated}
              >
                <span 
                  ref={titleRef}
                  className={`text-gray-700 font-medium ${isBreadcrumbExpanded ? '' : 'line-clamp-1'}`}
                >
                  {title}
                </span>
                {isTitleTruncated && (
                  <span className="text-custom-red text-xs flex-shrink-0">
                    {isBreadcrumbExpanded ? '−' : '+'}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
