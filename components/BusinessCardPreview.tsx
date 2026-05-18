interface BusinessCardPreviewProps {
  name?: string
  jobTitle?: string
  phone?: string
  email?: string
  theme?: 'dark' | 'light' | 'gradient' | 'minimal'
  primaryColor?: string
  secondaryColor?: string
}

export default function BusinessCardPreview({
  name = 'أحمد محمد',
  jobTitle = 'مطور برمجيات',
  phone = '+966 5X XXX XXXX',
  email = 'ahmed@example.com',
  theme = 'dark',
  primaryColor = '#4B9EFF',
  secondaryColor = '#8B5CF6',
}: BusinessCardPreviewProps) {

  const themes = {
    dark: {
      bg: 'linear-gradient(135deg, #1A1A3E, #2d2d5e)',
      text: '#FFFFFF',
      subtext: '#93C5FD',
      iconBg: 'rgba(255,255,255,0.12)',
      metaText: 'rgba(255,255,255,0.65)',
      border: 'none',
    },
    light: {
      bg: '#FFFFFF',
      text: '#111827',
      subtext: primaryColor,
      iconBg: `${primaryColor}18`,
      metaText: '#6B7280',
      border: '1px solid #E5E7EB',
    },
    gradient: {
      bg: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
      text: '#FFFFFF',
      subtext: 'rgba(255,255,255,0.85)',
      iconBg: 'rgba(255,255,255,0.22)',
      metaText: 'rgba(255,255,255,0.75)',
      border: 'none',
    },
    minimal: {
      bg: '#F8FAFC',
      text: '#0F172A',
      subtext: '#64748B',
      iconBg: `${primaryColor}18`,
      metaText: '#94A3B8',
      border: '1px solid #E2E8F0',
    },
  }

  const t = themes[theme]
  const initial = name ? name.charAt(0) : 'أ'

  return (
    <div className="relative w-full max-w-sm mx-auto select-none">
      <div
        className="rounded-2xl overflow-hidden shadow-xl w-full"
        style={{ background: t.bg, aspectRatio: '1.75 / 1', border: t.border }}
      >
        <div className="p-5 h-full flex flex-col justify-between">

          {/* Top */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-base flex-shrink-0"
                style={{
                  background: theme === 'gradient'
                    ? 'rgba(255,255,255,0.25)'
                    : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                }}
              >
                {initial}
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight" style={{ color: t.text }}>{name}</h3>
                <p className="text-xs mt-0.5 font-medium" style={{ color: t.subtext }}>{jobTitle}</p>
              </div>
            </div>

            {/* Logo mark */}
            <div className="rounded-xl p-2.5" style={{ background: t.iconBg }}>
              <div className="w-8 h-8 grid grid-cols-3 gap-0.5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-[2px]"
                    style={{
                      background: [0, 1, 3, 4, 7, 8].includes(i)
                        ? (theme === 'gradient' ? 'rgba(255,255,255,0.9)' : theme === 'dark' ? '#FFFFFF' : primaryColor)
                        : 'transparent'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Divider line */}
          <div className="w-full h-px opacity-20" style={{ background: t.text }} />

          {/* Bottom */}
          <div className="flex items-center gap-5">
            {phone && (
              <div className="flex items-center gap-1.5">
                <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: t.metaText }}>
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-[11px]" style={{ color: t.metaText }}>{phone}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center gap-1.5">
                <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: t.metaText }}>
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-[11px]" style={{ color: t.metaText }}>{email}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Glow */}
      <div
        className="absolute -bottom-4 -right-4 w-28 h-28 rounded-full pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, opacity: 0.15, filter: 'blur(24px)' }}
      />
    </div>
  )
}
