'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { QRCodeCanvas } from 'qrcode.react'
import { createClient } from '@/lib/supabase/client'
import { formatWhatsApp, getInitials } from '@/lib/utils'
import type { Profile, Link as LinkType, Service } from '@/lib/types'

interface Props {
  profile: Profile
  links: LinkType[]
  services: Service[]
  profileUrl: string
}

const LINK_ICONS: Record<string, string> = {
  whatsapp: '💬', twitter: '🐦', instagram: '📸', linkedin: '💼',
  github: '💻', youtube: '▶️', tiktok: '🎵', snapchat: '👻',
  website: '🌐', email: '✉️', phone: '📞', default: '🔗',
}

function getLinkIcon(url: string, icon: string | null): string {
  if (icon) return icon
  const lower = url.toLowerCase()
  for (const [key, val] of Object.entries(LINK_ICONS)) {
    if (lower.includes(key)) return val
  }
  return LINK_ICONS.default
}

export default function PublicProfileClient({ profile, links, services, profileUrl }: Props) {
  const supabase = createClient()
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    supabase.from('profile_views').insert({ profile_id: profile.id }).then(() => {})
  }, [profile.id])

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 max-w-md mx-auto">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #4B9EFF, #8B5CF6)' }}>
            <span className="text-white text-xs font-black">Cm</span>
          </div>
          <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>contactme.cc</span>
        </div>
        <a href="/" className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
          أنشئ بروفايلك
        </a>
      </div>

      <div className="max-w-md mx-auto px-4 pb-16 space-y-3">

        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-3xl p-6 text-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>

          {/* Gradient orb background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full opacity-20 blur-3xl"
              style={{ background: 'linear-gradient(135deg, #4B9EFF, #8B5CF6)' }} />
          </div>

          {/* Avatar */}
          <div className="relative flex justify-center mb-4">
            <div className="relative">
              {profile.avatar_url ? (
                <Image src={profile.avatar_url} alt={profile.full_name}
                  width={88} height={88}
                  className="w-22 h-22 rounded-2xl object-cover"
                  style={{ border: '3px solid', borderColor: '#4B9EFF40' }} />
              ) : (
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-black"
                  style={{ background: 'linear-gradient(135deg, #4B9EFF, #8B5CF6)' }}>
                  {getInitials(profile.full_name)}
                </div>
              )}
              {profile.is_pro && (
                <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #4B9EFF, #8B5CF6)', border: '2px solid var(--surface)' }}>
                  <span className="text-white text-[9px] font-black">✦</span>
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <h1 className="text-xl font-black mb-1 tracking-tight">{profile.full_name}</h1>

          {profile.account_type === 'company' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2"
              style={{ background: '#8B5CF615', color: '#8B5CF6', border: '1px solid #8B5CF630' }}>
              🏢 شركة
            </span>
          )}

          {profile.bio && (
            <p className="text-sm leading-relaxed mb-4 max-w-xs mx-auto" style={{ color: 'var(--text-muted)' }}>
              {profile.bio}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 justify-center flex-wrap">
            {profile.whatsapp && (
              <a href={formatWhatsApp(profile.whatsapp)} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-transform active:scale-95"
                style={{ background: '#25D366', boxShadow: '0 4px 15px #25D36640' }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                واتساب
              </a>
            )}

            <button onClick={handleCopy}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
              style={{ background: copied ? '#4B9EFF20' : 'var(--bg)', border: '1.5px solid', borderColor: copied ? '#4B9EFF' : 'var(--border)', color: copied ? '#4B9EFF' : 'var(--text)' }}>
              {copied ? (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> تم النسخ</>
              ) : (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> نسخ الرابط</>
              )}
            </button>

            {profile.account_type === 'company' && profile.is_pro && (
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold w-full justify-center transition-transform active:scale-95"
                style={{ background: 'linear-gradient(135deg, #4B9EFF, #8B5CF6)', boxShadow: '0 4px 15px #4B9EFF40' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                احجز موعداً
              </button>
            )}
          </div>
        </div>

        {/* Links */}
        {links.length > 0 && (
          <div className="space-y-2">
            {links.map((link, i) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] no-underline"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  textDecoration: 'none',
                  animationDelay: `${i * 50}ms`
                }}>
                <span className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: 'var(--bg)' }}>
                  {getLinkIcon(link.url, link.icon)}
                </span>
                <span className="font-semibold text-sm flex-1" style={{ color: 'var(--text)' }}>{link.title}</span>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  style={{ color: 'var(--text-muted)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        )}

        {/* Services */}
        {services.length > 0 && (
          <div>
            <h2 className="text-sm font-bold px-1 mb-2" style={{ color: 'var(--text-muted)' }}>الخدمات</h2>
            <div className="space-y-2">
              {services.map((service) => (
                <div key={service.id} className="px-4 py-4 rounded-2xl"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-sm mb-1">{service.title}</h3>
                      {service.description && (
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{service.description}</p>
                      )}
                    </div>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #4B9EFF20, #8B5CF620)' }}>
                      <span className="text-sm">💼</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QR Code */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <button onClick={() => setShowQR(!showQR)}
            className="w-full flex items-center justify-between px-4 py-3.5 transition-colors"
            style={{ color: 'var(--text)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #4B9EFF20, #8B5CF620)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  style={{ color: '#4B9EFF' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <span className="text-sm font-semibold">QR Code</span>
            </div>
            <svg className={`w-4 h-4 transition-transform ${showQR ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showQR && (
            <div className="flex flex-col items-center pb-6 px-4">
              <div className="p-3 rounded-2xl bg-white shadow-sm">
                <QRCodeCanvas value={profileUrl} size={160}
                  fgColor={profile.is_pro ? '#4B9EFF' : '#1A1A3E'}
                  bgColor="#FFFFFF" level="H" includeMargin={false} />
              </div>
              <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>{profileUrl}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center pt-2">
          <a href="/" className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <div className="w-4 h-4 rounded-md flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4B9EFF, #8B5CF6)' }}>
              <span className="text-white text-[8px] font-black">Cm</span>
            </div>
            أنشئ بروفايلك على contactme.cc
          </a>
        </div>
      </div>
    </div>
  )
}
