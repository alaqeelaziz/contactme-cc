import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-extrabold gradient-text mb-4">404</div>
      <h1 className="text-2xl font-bold mb-3">الصفحة غير موجودة</h1>
      <p className="text-[var(--text-muted)] mb-8 max-w-sm">
        عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
      </p>
      <Link href="/" className="btn-primary">
        العودة للرئيسية
      </Link>
    </div>
  )
}
