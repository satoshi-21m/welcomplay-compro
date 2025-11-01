"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  Home,
  BookOpen,
  Briefcase,
  Settings,
  LogOut,
  Globe,
  User
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useSmoothLogout } from "@/hooks/useSmoothLogout"

export function Sidebar() {
  const pathname = usePathname()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const { user } = useAuth()
  const { handleLogout, isLoggingOut } = useSmoothLogout()

  const sidebarItems = [
    {
      name: "Dashboard",
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

  // Handle logout button click - show confirmation dialog
  const handleLogoutClick = () => {
    setShowLogoutDialog(true)
  }

  // Handle logout confirmation
  const handleLogoutConfirm = async () => {
    try {
      setShowLogoutDialog(false)
      await handleLogout()
    } catch (error) {
      console.error('Logout error:', error)
      // Error handling sudah ada di useSmoothLogout hook
    }
  }

  // Handle logout cancellation
  const handleLogoutCancel = () => {
    setShowLogoutDialog(false)
  }

  // Mobile sidebar content component
  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-6 py-4 border-none flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
            <Image 
              src="/images/logo.png" 
              alt="WelcomPlay Logo" 
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-gray-900 font-bold text-lg">WELCOMPLAY</h1>
            <p className="text-gray-500 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-4 py-4 border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user.name || user.email}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user.role?.toLowerCase() || 'user'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2 transition-all duration-300">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = item.current
            
            return (
              <li key={item.name} className="transition-all duration-300 ease-in-out">
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium relative overflow-hidden group transition-all duration-500 ease-in-out transform ${
                    isActive
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-red-50 hover:text-red-600 hover:shadow-md"
                  }`}
                >
                  {/* Background animation overlay */}
                  <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ease-in-out ${
                    isActive 
                      ? "bg-gradient-to-r from-red-500 to-red-600 opacity-100" 
                      : "bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-10"
                  }`} />
                  
                  <Icon className={`h-5 w-5 flex-shrink-0 relative z-10 transition-all duration-300 ${
                    isActive ? "transform rotate-0" : "group-hover:transform group-hover:scale-110"
                  }`} />
                  <span className={`truncate relative z-10 transition-all duration-300 ${
                    isActive ? "font-semibold" : "group-hover:font-medium"
                  }`}>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 space-y-3 border-t border-gray-200 flex-shrink-0">
        {/* View Landing Page */}
        <Link
          href="/"
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 cursor-pointer group"
        >
          <Globe className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
          <span className="truncate">Lihat Landing Page</span>
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogoutClick}
          disabled={isLoggingOut}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all duration-300 cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
          <span className="truncate">
            {isLoggingOut ? (
              <span className="flex items-center gap-2">
                <div className="h-3 w-3 animate-spin rounded-full border border-gray-400 border-t-red-600" />
                Logging out...
              </span>
            ) : (
              'Logout'
            )}
          </span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col h-full w-64 bg-white shadow-sm border-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar - Removed in favor of Bottom Navigation */}

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-md p-6">
          <DialogHeader className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <LogOut className="h-10 w-10 text-white" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900 mb-2">
              Konfirmasi Logout
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-base leading-relaxed">
              Apakah Anda yakin ingin keluar dari admin panel? Anda perlu login ulang untuk mengakses kembali.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-center">
            <Button
              variant="outline"
              onClick={handleLogoutCancel}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogoutConfirm}
              disabled={isLoggingOut}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {isLoggingOut ? 'Logging out...' : 'Ya, Logout'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
