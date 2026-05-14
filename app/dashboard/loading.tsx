export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#4B9EFF] border-t-transparent animate-spin" />
        <p className="text-[var(--text-muted)] text-sm">جاري تحميل لوحة التحكم...</p>
      </div>
    </div>
  )
}
