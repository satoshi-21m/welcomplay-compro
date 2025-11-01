"use client"

import { AdminLayout } from "@/components/admin/AdminLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MousePointer, TrendingUp, Activity, Calendar, Target, Zap } from "lucide-react"

export function DashboardContent() {
  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-4 sm:space-y-6 lg:space-y-8 p-3 sm:p-4 lg:p-6 animate-fade-in">
        {/* Stats Cards */}
        <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 animate-slide-up">
          <div className="animate-card-1">
            <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border-0 rounded-2xl sm:rounded-3xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 px-4 sm:px-6">
                <CardTitle className="text-xs sm:text-sm font-semibold text-red-800">Total Pengunjung</CardTitle>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-200 rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-red-700" />
                </div>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="text-2xl sm:text-3xl font-bold text-red-900">12,345</div>
                <p className="text-xs sm:text-sm text-red-700 font-medium">
                  +20.1% dari bulan lalu
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="animate-card-2">
            <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border-0 rounded-2xl sm:rounded-3xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 px-4 sm:px-6">
                <CardTitle className="text-xs sm:text-sm font-semibold text-purple-800">Click Rate</CardTitle>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-200 rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <MousePointer className="h-4 w-4 sm:h-5 sm:w-5 text-purple-700" />
                </div>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="text-2xl sm:text-3xl font-bold text-purple-900">3.2%</div>
                <p className="text-xs sm:text-sm text-purple-700 font-medium">
                  +2.1% dari bulan lalu
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="animate-card-3">
            <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border-0 rounded-2xl sm:rounded-3xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 px-4 sm:px-6">
                <CardTitle className="text-xs sm:text-sm font-semibold text-emerald-800">Conversion</CardTitle>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-200 rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-red-700" />
                </div>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-900">2.4%</div>
                <p className="text-xs sm:text-sm text-emerald-700 font-medium">
                  +1.8% dari bulan lalu
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts & Activity Section */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-7 animate-slide-up-delay-1">
          {/* Overview Chart */}
          <div className="lg:col-span-4 animate-slide-left">
            <Card className="bg-white shadow-md border-0 rounded-2xl sm:rounded-3xl">
              <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                  Overview Analytics
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-slate-600">
                  Performa landing page dalam 30 hari terakhir
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="h-[200px] sm:h-[250px] lg:h-[300px] flex items-center justify-center">
                  <div className="text-center space-y-2 sm:space-y-3 px-2">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto">
                      <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
                    </div>
                    <p className="text-sm sm:text-base text-slate-600 font-medium">Chart akan ditampilkan di sini</p>
                    <p className="text-xs sm:text-sm text-slate-500">Analytics dashboard sedang dalam pengembangan</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-3 animate-slide-right">
            <Card className="bg-white shadow-md border-0 rounded-2xl sm:rounded-3xl">
              <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-slate-600">
                  Aktivitas terbaru di landing page
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs sm:text-sm font-semibold text-slate-800">Hero section diperbarui</p>
                      <p className="text-xs text-slate-600">Gambar dan teks hero section telah diperbarui dengan desain baru</p>
                      <p className="text-xs text-red-600 font-medium">2 jam yang lalu</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs sm:text-sm font-semibold text-slate-800">Feature baru ditambahkan</p>
                      <p className="text-xs text-slate-600">&quot;Advanced Analytics&quot; telah ditambahkan ke daftar fitur</p>
                      <p className="text-xs text-orange-600 font-medium">1 hari yang lalu</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs sm:text-sm font-semibold text-slate-800">Testimonial diperbarui</p>
                      <p className="text-xs text-slate-600">3 testimonial baru telah ditambahkan dari pelanggan</p>
                      <p className="text-xs text-purple-600 font-medium">3 hari yang lalu</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs sm:text-sm font-semibold text-slate-800">SEO optimization</p>
                      <p className="text-xs text-slate-600">Meta tags dan keywords telah dioptimalkan</p>
                      <p className="text-xs text-emerald-600 font-medium">1 minggu yang lalu</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 animate-slide-up-delay-2">
          <div className="animate-quick-action-1">
            <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border-0 rounded-2xl sm:rounded-3xl group cursor-pointer">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-200 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:bg-red-300 transition-colors">
                    <Target className="h-5 w-5 sm:h-6 sm:w-6 text-red-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-800 text-base sm:text-lg">Tulis Blog</h3>
                    <p className="text-xs sm:text-sm text-red-600">Buat artikel baru</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="animate-quick-action-2">
            <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border-0 rounded-2xl sm:rounded-3xl group cursor-pointer">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-200 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:bg-orange-300 transition-colors">
                    <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-orange-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-orange-800 text-base sm:text-lg">Tambah Portfolio</h3>
                    <p className="text-xs sm:text-sm text-orange-600">Upload proyek baru</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="animate-quick-action-3 sm:col-span-2 lg:col-span-1">
            <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border-0 rounded-2xl sm:rounded-3xl group cursor-pointer">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-200 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:bg-purple-300 transition-colors">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-red-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-800 text-base sm:text-lg">Pengaturan</h3>
                    <p className="text-xs sm:text-sm text-purple-600">Kelola konfigurasi</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

