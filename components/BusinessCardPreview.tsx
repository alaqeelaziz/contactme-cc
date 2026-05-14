export default function BusinessCardPreview() {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #1A1A3E, #2d2d5e)', aspectRatio: '1.7/1' }}>
        <div className="p-6 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="w-12 h-12 rounded-full mb-3"
                style={{ background: 'linear-gradient(135deg, #4B9EFF, #8B5CF6)' }} />
              <h3 className="text-white text-lg font-bold">أحمد محمد</h3>
              <p className="text-blue-300 text-sm">مطور برمجيات</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2">
              <div className="w-12 h-12 grid grid-cols-3 gap-0.5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className={`rounded-sm ${[0,1,3,4,7,8].includes(i) ? 'bg-white' : 'bg-transparent'}`} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-white/70">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              +966 5X XXX XXXX
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/70">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              ahmed@example.com
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-3 -right-3 w-24 h-24 rounded-full opacity-20"
        style={{ background: 'linear-gradient(135deg, #4B9EFF, #8B5CF6)', filter: 'blur(20px)' }} />
    </div>
  )
}
