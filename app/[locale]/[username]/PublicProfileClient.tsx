'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
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
  whatsapp: '💬',
  twitter: '🐦',
  instagram: '📸',
  linkedin: '💼',
  github: '💻',
  youtube: '▶️',
  tiktok: '🎵',
  snapchat: '👻',
  website: '🌐',
  email: '✉️',
  phone: '📞',
  default: '🔗',
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

  useEffect(() => {
    // Record view
    supabase.from('profile_views').insert({ profile_id: profile.id }).then(() => {})
  }, [profile.id])

  const qrFg = profile.is_pro ? '#4B9EFF' : '#1A1A3E'

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: 'var(--bg)' }}>
      <div className="max-w-md mx-auto space-y-4">

        {/* Profile Card */}
        <div className="card text-center animate-slide-up">
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.full_name}
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover border-4"
                style={{ borderColor: '#4B9EFF40' }}
              />
            ) : (
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                style={{ background: 'linear-gradient(135deg, #4B9EFF, #8B5CF6)' }}>
                {getInitials(profile.full_name)}
              </div>
            )}
          </div>

          {/* Name & type badge */}
          <div className="flex items-center justify-center gap-2 mb-1">
            <h1 className="text-2xl font-bold">{profile.full_name}</h1>
            {profile.is_pro && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #4B9EFF, #8B5CF6)' }}>
                برو
              </span>
            )}
          </div>

          {profile.account_type === 'company' && (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2"
              style={{ background: 'var(--surface)', color: '#8B5CF6', border: '1px solid #8B5CF630' }}>
              🏢 شركة
            </span>
          )}

          {profile.bio && (
            <p className="text-[var(--text-muted)] text-sm leading-relaxed mt-2 max-w-xs mx-auto">
              {profile.bio}
            </p>
          )}

          {/* WhatsApp */}
          {profile.whatsapp && (
            <a
              href={formatWhatsApp(profile.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: '#25D366' }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              تواصل عبر واتساب
            </a>
          )}

          {/* Booking button for company pro */}
          {profile.account_type === 'company' && profile.is_pro && (
            <button className="mt-3 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold w-full justify-center"
              style={{ background: 'linear-gradient(135deg, #4B9EFF, #8B5CF6)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              احجز موعداً
            </button>
          )}
        </div>

        {/* Links */}
        {links.length > 0 && (
          <div className="space-y-3 animate-fade-in">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 card py-4 hover:shadow-md transition-all hover:-translate-y-0.5 no-underline"
                style={{ textDecoration: 'none' }}
              >
                <span className="text-xl w-8 text-center flex-shrink-0">
                  {getLinkIcon(link.url, link.icon)}
                </span>
                <span className="font-medium text-[var(--text)]">{link.title}</span>
                <svg className="w-4 h-4 text-[var(--text-muted)] mr-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        )}

        {/* Services */}
        {services.length > 0 && (
          <div className="space-y-3 animate-fade-in">
            <h2 className="text-lg font-bold px-2">الخدمات</h2>
            {services.map((service) => (
              <div key={service.id} className="card p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-[var(--text)]">{service.title}</h3>
                </div>
                {service.description && (
                  <p className="text-sm text-[var(--text-muted)]">{service.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* QR Code */}
        <div className="card flex flex-col items-center py-6 animate-fade-in">
          <p className="text-sm text-[var(--text-muted)] mb-3">احفظ البروفايل</p>
          <QRCodeCanvas
            value={profileUrl}
            size={160}
            fgColor={qrFg}
            bgColor="#FFFFFF"
            level="H"
            includeMargin={false}
          />
        </div>
      </div>
    </div>
  )
}
