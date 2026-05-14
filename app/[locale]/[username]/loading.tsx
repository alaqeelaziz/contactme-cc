export default function ProfileLoading() {
  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-md mx-auto space-y-4 animate-pulse">
        <div className="card">
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-24 h-24 rounded-full bg-[var(--border)]" />
            <div className="h-6 w-40 rounded-lg bg-[var(--border)]" />
            <div className="h-4 w-56 rounded-lg bg-[var(--border)]" />
            <div className="h-10 w-44 rounded-xl bg-[var(--border)] mt-2" />
          </div>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="card h-14 bg-[var(--border)]" />
        ))}
      </div>
    </div>
  )
}
