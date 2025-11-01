"use client"

import { Search, Settings, LogOut, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useSmoothLogout } from "@/hooks/useSmoothLogout"

interface HeaderProps {
  title?: string
  showSearch?: boolean
  searchTerm?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
}

export function Header({ 
  title = "Dashboard", 
  showSearch = false, 
  searchTerm = "", 
  onSearchChange,
  searchPlaceholder = "Cari..."
}: HeaderProps) {
  const { handleLogout, isLoggingOut } = useSmoothLogout()

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-xs border-0 h-16 flex-shrink-0">
      <div className="flex items-center h-full px-3 sm:px-4 lg:px-6">
        {/* Logo + Text - Mobile Only - Hanya untuk Dashboard */}
        {title === "Dashboard" && (
          <div className="lg:hidden flex-shrink-0 ml-4 flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
              <Image 
                src="/images/logo.png" 
                alt="WelcomPlay Logo" 
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-black font-bold text-md tracking-wide">WELCOMPLAY</span>
          </div>
        )}

        {/* Page Title - Hidden on Mobile for Dashboard */}
        <div className="flex-1 min-w-0 ml-4 sm:ml-6">
          <h1 className={`font-bold tracking-tight bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent text-left ${
            title === "Dashboard" ? "hidden lg:block text-sm sm:text-lg lg:text-xl" : "text-sm sm:text-lg lg:text-xl"
          }`}>
            {title}
          </h1>
        </div>

        {/* Search Bar - Conditional Rendering dengan fixed height */}
        {showSearch && (
          <div className="ml-8 mr-2 flex items-center">
            <div className="relative h-10">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="h-10 pl-8 pr-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              />
            </div>
          </div>
        )}

        {/* Profile Popover - Mobile Only for Dashboard */}
        {title === "Dashboard" && (
          <div className="lg:hidden flex-shrink-0 ml-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 p-2 h-10 hover:bg-gray-100 transition-all duration-300 ease-in-out"
                >
                  {/* Avatar menggunakan shadcn/ui */}
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-red-500 text-white text-xs font-bold">
                      A
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Basic Info - Always Visible */}
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">Admin</p>
                  </div>
                </Button>
              </PopoverTrigger>
              
              <PopoverContent 
                className="w-64 p-0 border-gray-200/50 shadow-lg bg-white/80 backdrop-blur-md" 
                align="end"
                sideOffset={8}
              >
                {/* Profile Header */}
                <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-red-500 text-white text-sm font-bold">
                        A
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Admin User</p>
                      <p className="text-xs text-gray-500">admin@welcomplay.com</p>
                    </div>
                  </div>
                </div>
                
                {/* Profile Info */}
                <div className="px-4 py-3 border-b border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Role:</span>
                    <span className="text-xs font-medium text-gray-900">Administrator</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Status:</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Last Login:</span>
                    <span className="text-xs font-medium text-gray-900">Today</span>
                  </div>
                </div>
                
                {/* Menu Items */}
                <div className="py-2">
                  <Link 
                    href="/admin-g30spki/settings" 
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <User className="w-4 h-4" />
                    Profile Settings
                  </Link>
                  <Link 
                    href="/admin-g30spki/settings" 
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <Settings className="w-4 h-4" />
                    Account Settings
                  </Link>
                  <div className="border-t border-gray-100 my-2"></div>
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full justify-start text-sm text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    {isLoggingOut ? (
                      <span className="flex items-center gap-2">
                        <div className="h-3 w-3 animate-spin rounded-full border border-gray-400 border-t-red-600" />
                        Logging out...
                      </span>
                    ) : (
                      'Logout'
                    )}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </header>
  )
}
