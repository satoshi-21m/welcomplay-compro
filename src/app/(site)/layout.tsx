export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#f7f6f9] text-gray-900 antialiased">
      {children}
    </div>
  )
}


