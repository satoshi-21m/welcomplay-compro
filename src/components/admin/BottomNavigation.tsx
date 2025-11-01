"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  BookOpen,
  Briefcase,
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Home",
      href: "/admin-g30spki",
      icon: Home,
      current: pathname === "/admin-g30spki" || pathname === "/admin-g30spki/"
    },
    {
      name: "Blog",
      href: "/admin-g30spki/blog",
      icon: BookOpen,
      current: pathname === "/admin-g30spki/blog" || pathname.startsWith("/admin-g30spki/blog/")
    },
    {
      name: "Portfolio",
      href: "/admin-g30spki/portfolio",
      icon: Briefcase,
      current: pathname === "/admin-g30spki/portfolio" || pathname.startsWith("/admin-g30spki/portfolio/")
    },
    {
      name: "Settings",
      href: "/admin-g30spki/settings",
      icon: Settings,
      current: pathname === "/admin-g30spki/settings"
    }
  ]

  return (
    <>
      {/* Bottom Navigation - Mobile & Tablet Only - Absolute positioning untuk menghindari double scrollbar */}
      <div className="lg:hidden absolute bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-2xl">
        {/* Swipe Indicator */}
        <div className="flex justify-center py-1">
          <div className="w-8 h-1 bg-gray-300 rounded-full opacity-60"></div>
        </div>
        
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.current
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-300 ease-out",
                  "hover:bg-gray-50/80 active:scale-95 touch-manipulation select-none",
                  isActive 
                    ? "text-white" 
                    : "text-gray-600 hover:text-red-600"
                )}
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none'
                }}
              >
                {/* Active Background */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg" />
                )}
                
                {/* Icon */}
                <Icon className={cn(
                  "h-5 w-5 mb-0.5 transition-all duration-300 relative z-10",
                  isActive 
                    ? "transform scale-110 text-white" 
                    : "group-hover:scale-110 group-hover:text-red-600"
                )} />
                
                {/* Label */}
                <span className={cn(
                  "text-[10px] font-medium transition-all duration-300 relative z-10 leading-tight",
                  isActive 
                    ? "font-semibold text-white" 
                    : "font-medium group-hover:font-semibold"
                )}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </div>
        
        {/* Safe Area for iPhone */}
        <div className="h-1 bg-gradient-to-r from-red-500 to-red-600" />
      </div>
    </>
  )
}
