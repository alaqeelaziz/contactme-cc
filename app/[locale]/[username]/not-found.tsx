import Link from 'next/link'

export default function ProfileNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="text-7xl mb-6">🔍</div>
      <h1 className="text-3xl font-bold mb-3">البروفايل غير موجود</h1>
      <p className="text-[var(--text-muted)] mb-8 max-w-sm">
        هذا اسم المستخدم غير مسجّل على contactme.cc. ربما تغيّر أو حُذف.
      </p>
      <Link href="/" className="btn-primary">
        العودة للرئيسية
      </Link>
    </div>
  )
}
